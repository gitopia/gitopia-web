import axios from "../helpers/axiosFetch";

export default async function getVoter(apiNode, id) {
  let obj = {};
  const baseUrl =
    apiNode + "/cosmos/tx/v1beta1/txs?events=proposal_vote.proposal_id=" + id;
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
