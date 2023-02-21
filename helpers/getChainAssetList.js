import axios from "./axiosFetch";
export default async function getChainAssetList(chainName) {
  let info = [];
  await axios
    .get(
      process.env.NEXT_PUBLIC_SERVER_URL+"/api/ibc/" +
        chainName + "/assets"
    )
    .then((response) => {
      info = response.data;
    })
    .catch((err) => console.error(err));

  return info;
}
