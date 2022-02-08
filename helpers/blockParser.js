import { fromBase64 } from "@cosmjs/encoding";
import { decodeTxRaw } from "@cosmjs/proto-signing";
import { registry } from "@gitopia/gitopia-js";

export function decodeTx(tx) {
  try {
    let decodedTx = decodeTxRaw(fromBase64(tx));
    for (let i = 0; i < decodedTx.body.messages.length; i++) {
      let msgType = registry.lookupType(decodedTx.body.messages[i].typeUrl);
      if (msgType) {
        let msg = msgType.decode(decodedTx.body.messages[i].value);

        let data = {
          message: msg,
          typeurl: decodedTx.body.messages[i].typeUrl,
        };
        console.log(data);
        return data;
      } else {
        console.error("typeUrl not found", decodedTx.body.messages[i].typeUrl);
      }
    }
  } catch (e) {
    console.error(e);
  }
}
