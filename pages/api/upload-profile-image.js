import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import nextConnect from "next-connect";
import { makeSignDoc, makeSignBytes } from "@cosmjs/proto-signing";
import { AuthInfo, TxBody, TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Secp256k1, Secp256k1Signature, sha256 } from "@cosmjs/crypto";
import { fromBase64, toBech32 } from "@cosmjs/encoding";
import {
  rawSecp256k1PubkeyToRawAddress,
  makeSignDoc as makeSignDocAmino,
  serializeSignDoc,
} from "@cosmjs/amino";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import getNodeInfo from "../../helpers/getNodeInfo";
import { MsgSignData } from "@gitopia/gitopia-js/types/gitopia/offchain";

const handler = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

const getIP = (request) =>
  request.ip ||
  request.headers["x-forwarded-for"] ||
  request.headers["x-real-ip"] ||
  request.connection.remoteAddress;

handler.use(rateLimit({ keyGenerator: getIP, windowMs: 60 * 1000, max: 10 }));
handler.use(fileUpload());

const uploadImage = async (address, image) => {
  let fd = new FormData();
  fd.append(
    "data",
    new Blob([image.data], { type: image.mimetype }),
    image.name
  );
  fd.append("filename", image.name);
  let estuaryUrl =
    "https://upload.estuary.tech/content/add?coluuid=" +
    process.env.ESTUARY_COLLECTION_UUID +
    "&ignore_dupes=true" +
    (config.enableDirectories ? "&dir=/" + address : "");

  const res = await fetch(estuaryUrl, {
    method: "post",
    headers: {
      Authorization: "Bearer " + process.env.ESTUARY_API_KEY,
    },
    body: fd,
  }).then((response) => {
    return response.json();
  });
  console.log("Upload response", res);
  return res;
};

const findImage = async (address, image) => {
  // check earlier uploads
  let estuaryUrl =
    "https://api.estuary.tech/collections/" +
    process.env.ESTUARY_COLLECTION_UUID +
    (config.enableDirectories ? "&dir=/" + address : "");

  let existing = await fetch(estuaryUrl, {
    headers: {
      Authorization: "Bearer " + process.env.ESTUARY_API_KEY,
    },
  }).then((r) => r.json());
  let found;
  if (existing?.length) {
    existing.every((item) => {
      if (item.name === image.name && item.size === image.size) {
        found = item;
        return false;
      }
      return true;
    });
    if (found) {
      console.log("Found in " + existing.length + " uploads", found);
    } else {
      console.log("Not Found in " + existing.length + " uploads");
    }
  } else {
    console.log("List response", existing);
  }
  return found;
};

handler.post(async (request, response) => {
  try {
    const tx = request.body?.tx;
    if (!tx) {
      return response.status(400).send("No transaction provided");
    }

    const image = request.files?.image;
    if (!image) {
      return response.status(400).send("No image provided");
    }
    if (
      process.env.NEXT_PUBLIC_MAX_AVATAR_IMAGE_SIZE_BYTES &&
      image.size > process.env.NEXT_PUBLIC_MAX_AVATAR_IMAGE_SIZE_BYTES
    ) {
      return response
        .status(400)
        .send(
          "Image too big (>" +
            process.env.NEXT_PUBLIC_MAX_AVATAR_IMAGE_SIZE_BYTES +
            " Bytes)"
        );
    }
    const txRaw = TxRaw.decode(fromBase64(tx));
    const info = await getNodeInfo();
    const a = AuthInfo.decode(txRaw.authInfoBytes);
    const b = TxBody.decode(txRaw.bodyBytes);
    const memo = JSON.parse(b.memo);
    const pubkey = PubKey.decode(a.signerInfos[0].publicKey.value);
    const address = toBech32(
      "gitopia",
      rawSecp256k1PubkeyToRawAddress(pubkey.key)
    );
    if (memo.md5 !== image.md5) {
      return response
        .status(400)
        .send("Image hash does not match with transaction");
    }
    const decoded = MsgSignData.decode(b.messages[0].value);
    if (a.signerInfos[0].modeInfo.single.mode === SignMode.SIGN_MODE_DIRECT) {
      const signDoc = makeSignDoc(
        txRaw.bodyBytes,
        txRaw.authInfoBytes,
        info.default_node_info.network,
        0
      );
      const signDocBytes = makeSignBytes(signDoc);
      const valid = await Secp256k1.verifySignature(
        Secp256k1Signature.fromFixedLength(txRaw.signatures[0]),
        sha256(signDocBytes),
        pubkey.key
      );
      if (!valid) {
        return response.status(400).send("Transaction verification failed");
      }
    } else if (
      a.signerInfos[0].modeInfo.single.mode ===
      SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    ) {
      const signDoc = makeSignDocAmino(
        [
          {
            type: "/gitopia.gitopia.offchain.MsgSignData",
            value: {
              signer: decoded.signer,
              data: memo,
            },
          },
        ],
        {
          amount: [
            {
              amount: "0",
              denom: "utlore",
            },
          ],
          gas: "0",
        },
        info.default_node_info.network,
        b.memo,
        "0",
        "0"
      );
      const signDocBytes = serializeSignDoc(signDoc);
      const valid = await Secp256k1.verifySignature(
        Secp256k1Signature.fromFixedLength(txRaw.signatures[0]),
        sha256(signDocBytes),
        pubkey.key
      );
      if (!valid) {
        return response.status(400).send("Transaction verification failed");
      }
    }

    const res = await uploadImage(address, image);

    if (res?.cid) {
      return response
        .status(200)
        .json({ url: "https://api.estuary.tech/gw/ipfs/" + res.cid });
    } else if (
      res?.error?.details ===
      'failed to request createContent: {"error":{"code":500,"reason":"Internal Server Error","details":"ERROR: duplicate key value violates unique constraint \\"collection_refs_paths\\" (SQLSTATE 23505)"}}\n'
    ) {
      const found = await findImage(address, image);
      if (found) {
        return response
          .status(200)
          .json({ url: "https://dweb.link/ipfs/" + found.cid });
      }
      return response
        .status(400)
        .send("File already uploaded by other account");
    }
    return response.status(400).send("Unable to process request");
  } catch (e) {
    console.error(e.stack);
    return response.status(400).send("Unable to process request");
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
  enableDirectories: false,
};

export default handler;
