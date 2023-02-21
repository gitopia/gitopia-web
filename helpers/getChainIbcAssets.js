import axios from "./axiosFetch";
export default async function getChainIbcAsset(chainName) {
  let chains = ["gitopiatestnet", chainName];
  chains = chains.sort();
  let ibc = [];
  await axios
    .get(
      process.env.NEXT_PUBLIC_OBJECTS_URL +
        "raw/gitopia/ibc-assets/master/chain-registry/_IBC/" +
        chains[0] +
        "-" +
        chains[1] +
        ".json"
    )
    .then((response) => {
      ibc = response.data;
    })
    .catch((err) => console.error(err));
  return ibc;
}
