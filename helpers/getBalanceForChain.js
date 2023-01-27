import axios from "axios";

export async function getBalanceForChain(api, address, denom) {
  const baseUrl =
    api +
    "/cosmos/bank/v1beta1/balances/" +
    address +
    "/by_denom?denom=" +
    denom;
  let balance= 0;
  await axios
    .get(baseUrl)
    .then((res) => {
      balance=res.data.balance.amount
    })
    .catch((err) => {
      console.error(err);
    });
  return balance;
}
