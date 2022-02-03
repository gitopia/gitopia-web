import axios from "axios";
import { sha256 } from "@cosmjs/crypto";
import { fromBase64, toHex } from "@cosmjs/encoding";

function formatTx({
  txHash = "",
  messages = [],
  memo = "",
  signer_infos = [],
  fee = {},
  gas_used = null,
  gas_wanted = null,
  height = null,
  code = 0,
  log = null,
}) {
  return {
    txHash,
    body: {
      messages,
      memo,
    },
    auth_info: {
      signer_infos,
      fee,
    },
    meta: {
      gas_used,
      gas_wanted,
      height,
      code,
      log,
    },
  };
}

async function getTx(apiCosmos, apiTendermint, encodedTx) {
  const txHash = sha256(fromBase64(encodedTx));
  try {
    const rpcRes = await axios.get(
      apiTendermint + "/tx?hash=0x" + toHex(txHash)
    );
    const apiRes = await axios.get(
      apiCosmos + "/cosmos/tx/v1beta1/txs/" + toHex(txHash)
    );
    return { rpcRes, apiRes, txHash: toHex(txHash).toUpperCase() };
  } catch (e) {
    throw "Error fetching TX data";
  }
}

export async function decodeTx(apiCosmos, apiTendermint, encodedTx) {
  let fullTx;
  let retries = 0;
  while (!fullTx && retries < 5) {
    try {
      fullTx = await getTx(apiCosmos, apiTendermint, encodedTx);
    } catch (e) {
      retries++;
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    }
  }
  const { data } = fullTx.rpcRes;
  const { height, tx_result } = data.result;
  const { code, log, gas_used, gas_wanted } = tx_result;
  const { body, auth_info } = fullTx.apiRes.data.tx;
  const { messages, memo } = body;

  return formatTx({
    txHash: fullTx.txHash,
    messages,
    memo,
    signer_infos: auth_info.signer_infos,
    fee: auth_info.fee,
    gas_used,
    gas_wanted,
    height,
    code,
    log,
  });
}
