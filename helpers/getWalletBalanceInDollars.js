import { coingeckoId } from "../ibc-assets-config";

export default async function getBalanceInDollars(
  apiClient,
  address,
  tokenPrices
) {
  if (!address) return {};
  try {
    let totalPrice = 0,
      TokenBalances = {},
      USDBalances = {};
    const res = await apiClient.cosmos.bank.v1beta1.allBalances({ address });
    if (res.status === 200) {
      let balance = res.balances;
      for (let i = 0; i < balance.length; i++) {
        TokenBalances[balance[i].denom] = balance[i].amount;
        let denom = balance[i].denom;
        if (balance[i].denom.includes("ibc")) {
          const denomHash = balance[i].denom.slice(4);
          const result =
            await apiClient.ibc.applications.transfer.v1.denomTrace({
              hash: denomHash,
            });
          if (result.ok) {
            denom = result.denom_trace.base_denom;
            delete TokenBalances[balance[i].denom];
            TokenBalances[denom] = balance[i].amount;
          }
        }

        if (tokenPrices[coingeckoId[denom]?.id]) {
          const price = tokenPrices[coingeckoId[denom].id].usd;
          const perCoinPrice =
            price / Math.pow(10, coingeckoId[denom].coinDecimals);
          totalPrice += balance[i].amount * perCoinPrice;
          USDBalances[denom] = balance[i].amount * perCoinPrice;
        }
      }
    }

    return {
      totalPrice,
      TokenBalances,
      USDBalances,
    };
  } catch (e) {
    console.error(e);
  }
}
