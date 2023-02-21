import axios from "./axiosFetch";
export async function getAssetList() {
  let assets = [];
  await axios
    .get(
      process.env.NEXT_PUBLIC_OBJECTS_URL +
        "raw/gitopia/ibc-assets/master/gitopia-janus-devnet-4/gitopia.json"
    )
    .then((response) => {
      assets = response.data.assets.slice(1);
    })
    .catch((err) => console.error(err));

  return assets;
}
