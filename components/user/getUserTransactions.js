import axios from "axios";
import { notify } from "reapop";

export const txTypes = {
  "gitopia/CreateUser": { color: "yellow-200", msg: "Created New User" },
  "gitopia/CreateRepository": {
    color: "green-200",
    msg: "Created New Repository",
  },
  "gitopia/SetRepositoryBranch": {
    color: "pink-200",
    msg: "Pushed To Repository",
  },
};

export async function getUserTransaction(address = "", limit = 10, page = 1) {
  let obj = {};
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL +
    "/txs?tx.acc_seq=" +
    address +
    "&limit=" +
    limit +
    "&page=" +
    page;
  let params = {
    pagination: {
      limit: 10,
    },
  };

  await axios
    .get(baseUrl)
    .then(({ data }) => {
      obj = data;
    })
    .catch((err) => {
      console.error(err);
      notify("Unable to get txs", "error");
    });

  return obj;
}
