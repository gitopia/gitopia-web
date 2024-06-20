import axios from "../helpers/axiosFetch";

export default async function getNodeInfo(apiNode) {
  let networkName = "gitopia";
  const baseUrl = apiNode + "/cosmos/base/tendermint/v1beta1/node_info";
  await axios
    .get(baseUrl)
    .then((response) => {
      networkName = response.data;
    })
    .catch((err) => console.log(err));
  return networkName;
}
