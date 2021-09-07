import { assertIsBroadcastTxSuccess } from "@cosmjs/stargate";
import { notify } from "reapop";
import { sendTransaction } from "./env";
import {
  createUser,
  getUserDetailsForSelectedAddress,
  setCurrentDashboard,
} from "./user";
import { reInitClients } from "./wallet";
import { userActions } from "./actionTypes";
import { async } from "regenerator-runtime";

export const validatePostingEligibility = async (
  dispatch,
  getState,
  msgType
) => {
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

export const createRepository = ({
  name = null,
  description = null,
  ownerId = null,
}) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;
    let owner;
    const { user } = getState();
    user.dashboards.every((d) => {
      if (d.id === ownerId) {
        owner = JSON.stringify({ Type: d.type, ID: d.id });
        return false;
      }
      return true;
    });
    const repository = {
      creator: wallet.selectedAddress,
      name: name,
      owner: owner,
      description: description,
    };
    const { env } = getState();

    try {
      const message = await env.txClient.msgCreateRepository(repository);
      const result = await sendTransaction({ message }, env);
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
  repositoryId = 0,
  labels = [],
  weight = 0,
  assignees = [],
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
      repositoryId,
      labels,
      weight,
      assignees,
    };

    console.log("issue", issue);

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
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateComment = ({ id = null, body = "", attachments = [] }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;
    const comment = {
      creator: wallet.selectedAddress,
      id,
      body,
      attachments,
    };

    try {
      const message = await env.txClient.msgUpdateComment(comment);
      const result = await sendTransaction({ message }, env);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const deleteComment = ({ id = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;
    const comment = {
      creator: wallet.selectedAddress,
      id,
    };
    console.log(comment);
    try {
      const message = await env.txClient.msgDeleteComment(comment);
      const result = await sendTransaction({ message }, env);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const toggleIssueState = ({ id = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;
    const comment = {
      creator: wallet.selectedAddress,
      id,
    };
    console.log(comment);
    try {
      const message = await env.txClient.msgToggleIssueState(comment);
      const result = await sendTransaction({ message }, env);
      if (result && result.code === 0) {
        return result;
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const renameRepository = ({ id = null, name = "" }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;
    const { env, wallet } = getState();
    const repository = {
      creator: wallet.selectedAddress,
      id,
      name,
    };

    try {
      const message = await env.txClient.msgRenameRepository(repository);
      const result = await sendTransaction({ message }, env);
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress()(dispatch, getState);
        return result;
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

export const updateCollaborator = ({ id = null, user = null, role = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
      return null;
    const { env, wallet } = getState();
    const collaborator = {
      creator: wallet.selectedAddress,
      id,
      user,
      role,
    };

    try {
      const message = await env.txClient.msgUpdateRepositoryCollaborator(
        collaborator
      );
      const result = await sendTransaction({ message }, env);
      if (result && result.code === 0) {
        return result;
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

export const updateIssue = ({
  title = null,
  description = null,
  issueId = null,
  labels = null,
  weight = null,
  assignees = null,
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;
    const issue = {
      creator: wallet.selectedAddress,
      issueId,
      ...{ title },
      ...{ description },
      ...{ labels },
      ...{ assignees },
      ...{ weight },
    };
    console.log("issue", issue);

    try {
      const message = await env.txClient.msgUpdateIssue(issue);
      const result = await sendTransaction({ message }, env);
      if (result && result.code === 0) {
        return result;
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};
