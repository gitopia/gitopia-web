import { repositoryActions, envActions } from "./actionTypes";
import { txClient } from "gitopiajs";
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";

// import { assertIsBroadcastTxSuccess } from '@cosmjs/stargate'
import { stringToPath } from "@cosmjs/crypto";
import CryptoJS from "crypto-js";
import { notify } from "reapop";

async function initTxClient(accountSigner) {
  return await txClient(accountSigner, {
    addr: process.env.NEXT_PUBLIC_RPC_URL,
  });
}

export const createRepository = ({ name = null, description = null }) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    /*
    const accountIndex = state.activeWallet.accounts.findIndex(
      (acc) => acc.address == address
    );
    */
    if (!state.activeWallet) {
      dispatch(notify("Please sign in to create repository", "error"));
      return null;
    }
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(
        state.activeWallet.HDpath + state.activeWallet.accounts[0].pathIncrement
      ),
      state.activeWallet.prefix
    );
    const [acc] = await accountSigner.getAccounts();
    const repository = {
      creator: acc.address,
      name: name,
      owner: JSON.stringify({
        Type: "User",
        ID: acc.address,
      }),
      description: description,
    };

    //dispatch({ type: repositoryActions.ADD_REPOSITORY, payload: { repository } });
    try {
      const msg = await (
        await initTxClient(accountSigner)
      ).msgCreateRepository(repository);
      const result = await (
        await initTxClient(accountSigner)
      ).signAndBroadcast([msg], {
        fee: { amount: [], gas: "200000" },
        memo: "",
      });
      if (result && result.code === 0) {
        return { url: "/" + acc.address + "/" + name };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
      // return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }

    //dispatch({ type: repositoryActions.STORE_REPOSITORYS });
  };
};

export const createIssue = ({
  title = "",
  description = "",
  authorId = 0,
  repositoryId = 0,
  labels = ["simple"],
  weight = 0,
  assigneesId = [0],
}) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    if (!state.activeWallet) {
      dispatch(notify("Please sign in to create issue", "error"));
      return null;
    }
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(
        state.activeWallet.HDpath + state.activeWallet.accounts[0].pathIncrement
      ),
      state.activeWallet.prefix
    );
    const [acc] = await accountSigner.getAccounts();
    const issue = {
      // creator: JSON.stringify({
      //   Type: "User",
      //   ID: acc.address,
      // }),
      creator: acc.address,
      title,
      description,
      authorId,
      repositoryId,
      labels,
      weight,
      assigneesId,
    };

    try {
      const msg = await (
        await initTxClient(accountSigner)
      ).msgCreateIssue(issue);
      const result = await (
        await initTxClient(accountSigner)
      ).signAndBroadcast([msg], {
        fee: { amount: [], gas: "200000" },
        memo: "",
      });
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const createComment = ({
  parentId = null,
  body = "",
  attachments = [],
  diffHunk = "",
  path = "",
  system = false,
  authorAssociation = "",
  commentType = "",
}) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    if (!state.activeWallet) {
      dispatch(notify("Please sign in to comment", "error"));
      return null;
    }
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(
        state.activeWallet.HDpath + state.activeWallet.accounts[0].pathIncrement
      ),
      state.activeWallet.prefix
    );
    const [acc] = await accountSigner.getAccounts();
    const comment = {
      creator: acc.address,
      parentId,
      body,
      attachments,
      diffHunk,
      path,
      system,
      authorAssociation,
      commentType,
    };

    try {
      const msg = await (
        await initTxClient(accountSigner)
      ).msgCreateComment(comment);
      const result = await (
        await initTxClient(accountSigner)
      ).signAndBroadcast([msg], {
        fee: { amount: [], gas: "200000" },
        memo: "",
      });
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};
