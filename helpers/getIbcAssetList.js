import axios from "./axiosFetch";
export async function getAssetList() {
  let assets = [];
  await axios
    .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/ibc/all-assets")
    .then((response) => {
      assets = response.data.assets.slice(1);
    })
    .catch((err) => console.error(err));

  return assets;
}
