import axios from "axios";
export default async function getNodeInfo() {
  let networkName = "gitopia";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL + "/node_info"
  await axios
    .get(baseUrl)
    .then((response) => {
      networkName = response.data;
    })
    .catch((err) => console.log(err));
  return networkName;
}