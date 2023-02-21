import axios from "./axiosFetch";
export default async function getChainIbcAsset(chainName) {
  let chains = ["gitopiatestnet", chainName];
  chains = chains.sort();
  let ibc = [];
  await axios
    .get(
      process.env.NEXT_PUBLIC_SERVER_URL+"/api/ibc/" +
        chains[0] +
        "/bridge/" +
        chains[1]
    )
    .then((response) => {
      ibc = response.data;
    })
    .catch((err) => console.error(err));
  return ibc;
}
