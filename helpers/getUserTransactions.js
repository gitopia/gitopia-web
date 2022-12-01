import axios from "./axiosFetch";
import { notify } from "reapop";

export const txTypes = {
  "/gitopia.gitopia.gitopia.MsgCreateUser": {
    bg_color: "bg-yellow",
    text_color: "text-yellow",
    msg: "Created New User",
  },
  "/gitopia.gitopia.gitopia.MsgCreateRepository": {
    bg_color: "bg-purple",
    text_color: "text-purple",
    msg: "Created New Repository",
  },
  "/gitopia.gitopia.gitopia.MsgMultiSetBranch": {
    bg_color: "bg-red-800",
    text_color: "text-red-800",
    msg: "Pushed To Repository",
  },
  "/gitopia.gitopia.gitopia.MsgCreateIssue": {
    bg_color: "bg-pink",
    text_color: "text-pink",
    msg: "Created Issue",
  },
  "/gitopia.gitopia.gitopia.MsgCreatePullRequest": {
    bg_color: "bg-pink",
    text_color: "text-pink",
    msg: "Created Pull Request",
  },
  "/gitopia.gitopia.gitopia.MsgCreateComment": {
    bg_color: "bg-green",
    text_color: "text-green",
    msg: "Added Comment",
  },
  "/cosmos.bank.v1beta1.MsgSend": {
    bg_color: "bg-teal",
    text_color: "text-teal",
    msg: "Fund Transfer",
  },
};

export async function getUserTransaction(address = "", limit = 10, page = 1) {
  let obj = {};
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL +
    "/cosmos/tx/v1beta1/txs?events=message.sender='" +
    address +
    "'&limit=" +
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
