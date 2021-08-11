import { assertIsBroadcastTxSuccess } from "@cosmjs/stargate";
import { notify } from "reapop";
import { sendTransaction } from "./env";
import { createUser, getUserDetailsForSelectedAddress } from "./user";
import { reInitClients } from "./wallet";

const validatePostingEligibility = async (dispatch, getState, msgType) => {
  const { wallet, env, user } = getState();

  if (!wallet.selectedAddress) {
    dispatch(notify("Please sign in to create " + msgType, "error"));
    return false;
  }

  if (!user.creator) {
    if (wallet.loreBalance <= 0.000005) {
      dispatch(notify("Balance low for creating " + msgType, "error"));
      return false;
    } else {
      dispatch(
        notify(
          "No associated user found for this adddress, creating... ",
          "info"
        )
      );
      await createUser(wallet.activeWallet.name)(dispatch, getState);
      await reInitClients(dispatch, getState);
    }
  }

  if (wallet.loreBalance <= 0.0000025) {
    dispatch(notify("Balance low for creating " + msgType, "error"));
    return false;
  }

  return true;
};

export const createRepository = ({ name = null, description = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;
    const repository = {
      creator: wallet.selectedAddress,
      name: name,
      owner: JSON.stringify({
        Type: "User",
        ID: wallet.selectedAddress,
      }),
      description: description,
    };

    try {
      const message = await env.txClient.msgCreateRepository(repository);
      const result = await sendTransaction({ message }, env);
      console.log(result);
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress()(dispatch, getState);
        return { url: "/" + wallet.selectedAddress + "/" + name };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }
  };
};

export const createIssue = ({
  title = "",
  description = "",
  authorId = 0,
  repositoryId = 0,
  labels = [],
  weight = 0,
  assigneesId = [],
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;
    const issue = {
      // creator: JSON.stringify({
      //   Type: "User",
      //   ID: acc.address,
      // }),
      creator: wallet.selectedAddress,
      title,
      description,
      authorId,
      repositoryId,
      labels,
      weight,
      assigneesId,
    };

    try {
      const message = await env.txClient.msgCreateIssue(issue);
      const result = await sendTransaction({ message }, env);
      console.log(result);
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
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;
    const comment = {
      creator: wallet.selectedAddress,
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
      const message = await env.txClient.msgCreateComment(comment);
      const result = await sendTransaction({ message }, env);
      console.log(result);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const createOrganization = ({ name = null, description = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "organization")))
      return null;
    const organization = {
      creator: wallet.selectedAddress,
      name: name,
      description: description,
    };

    try {
      const message = await env.txClient.msgCreateOrganization(organization);
      const result = await sendTransaction({ message }, env);
      console.log(result);
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress()(dispatch, getState);
        return { url: "/home" };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }
  };
};
