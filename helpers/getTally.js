import axios from "axios";

export default async function getTally(id) {
  let obj = {};
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL +
    "/cosmos/gov/v1beta1/proposals/" +
    id +
    "/tally";
  await axios
    .get(baseUrl)
    .then(({ data }) => {
      obj = data;
    })
    .catch((err) => {
      console.error(err);
    });
  return obj;
}
