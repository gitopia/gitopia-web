import axios from "../helpers/axiosFetch";
import { getEndpoint } from "./getEndpoints";

export async function getBalanceForChain(apiEndpoints, address, denom) {
  let balance = 0;
  const endpoint = getEndpoint("rest", apiEndpoints);
  const baseUrl =
    endpoint +
    "/cosmos/bank/v1beta1/balances/" +
    address +
    "/by_denom?denom=" +
    denom;
  try {
    const res = await axios.get(baseUrl);
    balance = res.data.balance.amount;
  } catch (err) {
    console.error(err);
  }
  return balance;
}
