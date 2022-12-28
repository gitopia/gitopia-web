import axios from "./axiosFetch";
import { coingeckoId } from "../ibc-assets-config";
import { notify } from "reapop";
export default async function getTokenValueInDollars(denom, amount) {
  let totalPrice = 0;
  if (!denom || !amount) return null;
  await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=" +
        coingeckoId[denom].id +
        "&vs_currencies=usd"
    )
    .then(({ data }) => {
      let price = data[coingeckoId[denom].id]["usd"];
      let perCoinPrice = amount / Math.pow(10, coingeckoId[denom].coinDecimals);
      totalPrice = price * perCoinPrice;
    })
    .catch((err) => {
      console.error(err);
      notify("Unable to get price", "error");
    });
  return totalPrice < 1 ? totalPrice.toFixed(6) : totalPrice;
}
