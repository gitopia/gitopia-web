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

export async function getUserTransaction(address = null) {
  let obj = {};
  const baseUrl = "http://localhost:1317/txs?tx.acc_seq=" + address;
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
