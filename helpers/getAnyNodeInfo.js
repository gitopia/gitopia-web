import axios from "../helpers/axiosFetch";
export default async function getAnyNodeInfo(api) {
  let networkName = "gitopia";
  const baseUrl = api + "/cosmos/base/tendermint/v1beta1/node_info";
  await axios
    .get(baseUrl)
    .then((response) => {
      networkName = response.data;
    })
    .catch((err) => console.log(err));
  return networkName;
}
