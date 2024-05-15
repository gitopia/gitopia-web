import axios from "../helpers/axiosFetch";

export default async function getTally(apiNode, id) {
  let obj = {};
  const baseUrl = apiNode + "/cosmos/gov/v1beta1/proposals/" + id + "/tally";
  await axios
    .get(baseUrl)
    .then(({ data }) => {
      obj = data;
    })
    .catch((err) => {
      console.error(err);
    });
  return obj;
}
