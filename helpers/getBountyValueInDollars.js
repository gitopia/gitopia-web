import axios from "./axiosFetch";
import { coingeckoId } from "../ibc-assets-config";
import { Api } from "../store/ibc.applications.transfer.v1/module/rest";

export default async function getBountyValueInDollars(apiNode, bounty) {
  if (!bounty) return null;
  let totalPrice = 0;
  try {
    const api = new Api({ baseUrl: apiNode });
    let amount = bounty.amount;
    for (let i = 0; i < amount.length; i++) {
      if (amount[i].denom.includes("ibc")) {
        const denomHash = amount[i].denom.slice(4, amount[i].denom.length);
        const result = await api.queryDenomTrace(denomHash);
        if (result.ok) {
          let denom = result.data.denom_trace.base_denom;
          await axios
            .get(
              "https://api.coingecko.com/api/v3/simple/price?ids=" +
                coingeckoId[denom].id +
                "&vs_currencies=usd"
            )
            .then(({ data }) => {
              let price = data[coingeckoId[denom].id]["usd"];
              let perCoinPrice =
                amount[i].amount /
                Math.pow(10, coingeckoId[denom].coinDecimals);
              totalPrice = totalPrice + price * perCoinPrice;
            })
            .catch((err) => {
              console.error(err);
              notify("Unable to get price", "error");
            });
        }
      } else {
        if (coingeckoId[amount[i].denom].id !== "") {
          await axios
            .get(
              "https://api.coingecko.com/api/v3/simple/price?ids=" +
                coingeckoId[amount[i].denom].id +
                "&vs_currencies=usd"
            )
            .then(({ data }) => {
              let price = data[coingeckoId[amount[i].denom].id]["usd"];
              let perCoinPrice =
                amount[i].amount /
                Math.pow(10, coingeckoId[amount[i].denom].coinDecimals);
              totalPrice = totalPrice + price * perCoinPrice;
            })
            .catch((err) => {
              console.error(err);
              notify("Unable to get price", "error");
            });
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return totalPrice.toFixed(2);
}
