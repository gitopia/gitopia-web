/* gitopia token price not included for now */

import axios from "./axiosFetch";
import { coingeckoId } from "../ibc-assets-config";
import { Api } from "../store/cosmos.bank.v1beta1/module/rest";
import { Api as ibcApi } from "../store/ibc.applications.transfer.v1/module/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
const ibc = new ibcApi({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default async function getBalanceInDollars(address) {
  if (!address) return {};
  try {
    let totalPrice = 0,
      TokenBalances = {},
      USDBalances = {};
    const res = await api.queryAllBalances(address);
    if (res.status === 200) {
      let balance = res.data.balances;
      for (let i = 0; i < balance.length; i++) {
        TokenBalances[balance[i].denom] = balance[i].amount;
        if (balance[i].denom.includes("ibc")) {
          const denomHash = balance[i].denom.slice(4, balance[i].denom.length);
          const result = await ibc.queryDenomTrace(denomHash);
          if (result.ok) {
            let denom = result.data.denom_trace.base_denom;
            delete TokenBalances[balance[i].denom];
            TokenBalances[denom] = balance[i].amount;
            await axios
              .get(
                "https://api.coingecko.com/api/v3/simple/price?ids=" +
                  coingeckoId[denom].id +
                  "&vs_currencies=usd"
              )
              .then(({ data }) => {
                let price = data[coingeckoId[denom].id]["usd"];
                let perCoinPrice =
                  balance[i].amount /
                  Math.pow(10, coingeckoId[denom].coinDecimals);
                totalPrice = totalPrice + price * perCoinPrice;
                USDBalances[denom] = price * perCoinPrice;
              })
              .catch((err) => {
                console.error(err);
                notify("Unable to get price", "error");
              });
          }
        } else {
          if (coingeckoId[balance[i].denom].id !== "") {
            await axios
              .get(
                "https://api.coingecko.com/api/v3/simple/price?ids=" +
                  coingeckoId[balance[i].denom].id +
                  "&vs_currencies=usd"
              )
              .then(({ data }) => {
                let price = data[coingeckoId[balance[i].denom].id]["usd"];
                let perCoinPrice =
                  balance[i].amount /
                  Math.pow(10, coingeckoId[balance[i].denom].coinDecimals);
                totalPrice = totalPrice + price * perCoinPrice;
                USDBalances[balance[i].denom] = price * perCoinPrice;
              })
              .catch((err) => {
                console.error(err);
                notify("Unable to get price", "error");
              });
          }
        }
      }
    }

    return {
      totalPrice: totalPrice === 0 ? 0 : totalPrice.toFixed(2),
      TokenBalances,
      USDBalances,
    };
  } catch (e) {
    console.error(e);
  }
}
