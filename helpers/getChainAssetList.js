import axios from "./axiosFetch";
export default async function getChainAssetList(chainName) {
  let info = [];
  await axios
    .get(
      process.env.NEXT_PUBLIC_OBJECTS_URL +
        "raw/gitopia/ibc-assets/master/chain-registry/testnets/" +
        chainName +
        "/assetlist.json"
    )
    .then((response) => {
      info = response.data;
    })
    .catch((err) => console.error(err));

  return info;
}
