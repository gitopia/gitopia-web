import axios from "axios";

export default async function getDepositor(id) {
  let obj = [];
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL +
    "/cosmos/tx/v1beta1/txs?events=proposal_deposit.proposal_id=" +
    id;
  await axios
    .get(baseUrl)
    .then(({ data }) => {
      obj = {
        data: data.txs,
      };
    })
    .catch((err) => {
      console.error(err);
    });
  return obj.data;
}