import axios from "../helpers/axiosFetch";

export async function getBalanceForChain(apiEndpoints, address, denom) {
  let balance = 0;
  for (let i = 0; i < apiEndpoints.length; i++) {
    const baseUrl =
      apiEndpoints[i].address +
      "/cosmos/bank/v1beta1/balances/" +
      address +
      "/by_denom?denom=" +
      denom;
    try {
      const res = await axios.get(baseUrl);
      balance = res.data.balance.amount;
      break;
    } catch (err) {
      console.error(err);
    }
  }
  return balance;
}
