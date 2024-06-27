import { coingeckoId } from "../ibc-assets-config";

export default async function getTokenValueInDollars(
  denom,
  amount,
  tokenPrices
) {
  let totalPrice = 0;
  if (!denom || !amount) return null;
  if (coingeckoId[denom].id === "") return 0;

  try {
    let price = tokenPrices[coingeckoId[denom].id]?.usd;
    if (price !== undefined) {
      let perCoinPrice = price / Math.pow(10, coingeckoId[denom].coinDecimals);
      totalPrice = amount * perCoinPrice;
    }
  } catch (err) {
    console.error(err);
  }

  return totalPrice;
}
