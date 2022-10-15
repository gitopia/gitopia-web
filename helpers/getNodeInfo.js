import axios from "../helpers/axiosFetch";
export default async function getNodeInfo() {
  let networkName = "gitopia";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL + "/cosmos/base/tendermint/v1beta1/node_info"
  await axios
    .get(baseUrl)
    .then((response) => {
      networkName = response.data;
    })
    .catch((err) => console.log(err));
  return networkName;
}