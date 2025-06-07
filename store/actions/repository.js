import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { getUserDetailsForSelectedAddress } from "./user";
import { updateUserBalance } from "./wallet";
import getTask from "../../helpers/getTask";
import { fetchGroupInfo } from "./dao";
import {
  MsgInvokeDaoMergePullRequest,
  MsgDaoCreateRelease,
  MsgUpdateDaoRepositoryCollaborator,
  MsgRemoveDaoRepositoryCollaborator,
} from "@gitopia/gitopia-js/dist/types/gitopia/tx";

async function watchTask(apiClient, taskId) {
  const TIMEOUT = 15000; // 15 seconds
  const POLL_INTERVAL = 1000; // 1 second
  const MAX_RETRIES = 5; // Maximum number of retries on network failure

  const pollTask = async (resolve, reject, startTime, retries = 0) => {
    try {
      const res = await getTask(apiClient, taskId);
      if (
        res.state === "TASK_STATE_SUCCESS" ||
        res.state == "TASK_STATE_FAILURE"
      ) {
        resolve(res);
      } else if (Date.now() - startTime >= TIMEOUT) {
        reject(new Error("Timeout exceeded"));
      } else {
        setTimeout(() => pollTask(resolve, reject, startTime), POLL_INTERVAL);
      }
    } catch (error) {
      if (retries < MAX_RETRIES) {
        console.log(`Retrying... (${retries + 1}/${MAX_RETRIES})`);
        setTimeout(
          () => pollTask(resolve, reject, startTime, retries + 1),
          POLL_INTERVAL
        );
      } else {
        reject(error);
      }
    }
  };

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    pollTask(resolve, reject, startTime);
  });
}

export const validatePostingEligibility = async (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  dispatch,
  getState,
  msgType,
  numberOfTransactions = 1
) => {
  try {
    await setupTxClients(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState
    );
  } catch (e) {
    console.log(e.message);
    return false;
  }

  const { wallet, user } = getState();

  if (!wallet.selectedAddress) {
    dispatch(notify("Please sign in to create " + msgType, "error"));
    return false;
  }

  let balance = wallet.balance;
  if (balance <= 500 * numberOfTransactions) {
    const getAllowance = (await import("../../helpers/getAllowance")).default;
    let res = await getAllowance(
      cosmosFeegrantApiClient,
      wallet.selectedAddress
    );
    if (res?.allowance?.spend_limit) {
      let limit = res?.allowance?.spend_limit[0];
      if (limit?.denom === process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN) {
        dispatch({
          type: "UPDATE_ALLOWANCE",
          payload: { allowance: Number(limit.amount) },
        });
        if (limit?.amount <= 500 * numberOfTransactions) {
          dispatch(notify("Allowance low for creating " + msgType, "error"));
          return false;
        }
      }
    } else {
      dispatch(notify("Balance low for creating " + msgType, "error"));
      return false;
    }
  }

  if (!user.creator) {
    dispatch(
      notify(
        "You need to create a profile before performing any action, please go back to the dashboard and setup your profile first",
        "error"
      )
    );
    return false;
  }

  return true;
};

export const createRepository = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { name = null, description = null, ownerId = null }
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;
    const repository = {
      creator: wallet.selectedAddress,
      name: name,
      owner: ownerId,
      description: description,
    };
    const { env } = getState();
    try {
      const message = await env.txClient.msgCreateRepository(repository);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
        let url = "/" + ownerId + "/" + name;
        console.log(url);
        return { url };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e["message"], "error"));
      return null;
    }
  };
};

export const deleteRepository = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { name = null, ownerId = null }
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: ownerId,
        name: name,
      },
    };
    const { env } = getState();
    try {
      const message = await env.txClient.msgDeleteRepository(repository);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
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

export const updateRepositoryDescription = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { name = null, ownerId = null, description = null }
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: ownerId,
        name: name,
      },
      description: description,
    };
    const { env } = getState();
    try {
      const message = await env.txClient.msgUpdateRepositoryDescription(
        repository
      );
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const createIssue = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    title = "",
    description = "",
    repositoryName = "",
    repositoryOwner = "",
    labels = [],
    weight = 0,
    assignees = [],
    bountyAmount = [],
    bountyExpiry = 0,
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "issue"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const issue = {
      creator: wallet.selectedAddress,
      title,
      description,
      repositoryId: {
        id: repositoryOwner,
        name: repositoryName,
      },
    };

    if (assignees.length) {
      issue.assignees = assignees;
    }
    if (labels.length) {
      issue.labelIds = labels;
    }
    if (weight) {
      issue.weight = weight;
    }
    if (bountyAmount.length) {
      issue.bountyAmount = bountyAmount;
    }
    if (bountyExpiry) {
      issue.bountyExpiry = bountyExpiry.toString();
    }
    try {
      const message = await env.txClient.msgCreateIssue(issue);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
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

export const createComment = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repositoryId = null,
    parentIid = null,
    parent = "",
    body = "",
    attachments = [],
    diffHunk = "",
    path = "",
    position = null,
    commentType = 1,
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "comment"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      parentIid,
      parent: parent === "COMMENT_PARENT_ISSUE" ? 1 : 2,
      body,
      commentType: commentType,
    };
    if (attachments.length) {
      comment.attachments = attachments;
    }
    if (diffHunk.trim() !== "") {
      comment.diffHunk = diffHunk;
    }
    if (path.trim() !== "") {
      comment.path = path;
    }
    if (position !== null) {
      comment.position = position;
    }
    console.log("comment", comment);

    try {
      const message = await env.txClient.msgCreateComment(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateComment = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repositoryId = null,
    parentIid = null,
    parent = null,
    commentIid = null,
    body = "",
    attachments = [],
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "comment"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      parentIid,
      parent: parent === "COMMENT_PARENT_ISSUE" ? 1 : 2,
      commentIid,
      body,
      attachments,
    };

    try {
      const message = await env.txClient.msgUpdateComment(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const deleteComment = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repositoryId = null, parentIid = null, parent = null, commentIid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "comment"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      parentIid,
      parent: parent === "COMMENT_PARENT_ISSUE" ? 1 : 2,
      commentIid,
    };
    try {
      const message = await env.txClient.msgDeleteComment(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const toggleIssueState = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repositoryId = null, iid = null, commentBody = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "comment"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      commentBody,
    };
    try {
      const message = await env.txClient.msgToggleIssueState(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const renameRepository = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, name = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      name,
    };

    try {
      const message = await env.txClient.msgRenameRepository(repository);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
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

export const changeDefaultBranch = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, branchName = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const data = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      branch: branchName,
    };

    try {
      const message = await env.txClient.msgSetDefaultBranch(data);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
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

export const toggleForcePush = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, branchName = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      branchName,
    };

    try {
      const message = await env.txClient.msgToggleForcePush(repository);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updateCollaborator = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, user = null, role = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "collaborator"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const collaborator = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      user,
      role,
    };

    try {
      const message = await env.txClient.msgUpdateRepositoryCollaborator(
        collaborator
      );
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const removeCollaborator = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, user = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "collaborator"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const collaborator = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: repoOwner,
        name: repoName,
      },
      user,
    };

    try {
      const message = await env.txClient.msgRemoveRepositoryCollaborator(
        collaborator
      );
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updateDaoRepositoryCollaborator = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  cosmosGroupApiClient,
  { repositoryId, user, role, groupId }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "collaborator"
      ))
    )
      return null;

    const { wallet, env } = getState();

    try {
      // Get the group info to get the admin address
      const groupInfo = await dispatch(
        fetchGroupInfo(cosmosGroupApiClient, groupId)
      );

      if (!groupInfo) {
        throw new Error("Failed to fetch group info");
      }

      // Create the collaborator update message
      const updateCollab = {
        admin: groupInfo.admin,
        repositoryId,
        user,
        role,
      };

      // Encode the message
      const msgValue = MsgUpdateDaoRepositoryCollaborator.encode(
        MsgUpdateDaoRepositoryCollaborator.fromPartial(updateCollab)
      ).finish();
      const msgTypeUrl =
        "/gitopia.gitopia.gitopia.MsgUpdateDaoRepositoryCollaborator";

      // Create the proposal message
      const proposalMsg = {
        groupPolicyAddress: groupInfo.admin,
        proposers: [wallet.selectedAddress],
        metadata: "",
        messages: [
          {
            typeUrl: msgTypeUrl,
            value: msgValue,
          },
        ],
        exec: 0,
        title: `Update Collaborator Role: ${user}`,
        summary: `Proposal to update collaborator ${user} role to ${role} for repository ${repositoryId.id}/${repositoryId.name}`,
      };

      // Submit the proposal
      const message = env.txClient.msgSubmitGroupProposal(proposalMsg);
      const result = await sendTransaction({ message })(dispatch, getState);

      if (result && result.code === 0) {
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );

        // Get proposal ID from the logs
        const log = JSON.parse(result.rawLog);
        const proposalId = log[0].events
          .find((e) => e.type === "cosmos.group.v1.EventSubmitProposal")
          .attributes.find((a) => a.key === "proposal_id").value;

        dispatch(
          notify(
            `Collaborator update proposal #${proposalId} created. Waiting for approval.`,
            "info"
          )
        );

        return {
          proposalId,
          status: "PROPOSAL_SUBMITTED",
        };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (error) {
      console.error("Error creating collaborator update proposal:", error);
      dispatch(notify(error.message, "error"));
      return null;
    }
  };
};

export const removeDaoRepositoryCollaborator = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  cosmosGroupApiClient,
  { repositoryId, user, groupId }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "collaborator"
      ))
    )
      return null;

    const { wallet, env } = getState();

    try {
      // Get the group info to get the admin address
      const groupInfo = await dispatch(
        fetchGroupInfo(cosmosGroupApiClient, groupId)
      );

      if (!groupInfo) {
        throw new Error("Failed to fetch group info");
      }

      // Create the collaborator removal message
      const removeCollab = {
        admin: groupInfo.admin,
        repositoryId,
        user,
      };

      // Encode the message
      const msgValue = MsgRemoveDaoRepositoryCollaborator.encode(
        MsgRemoveDaoRepositoryCollaborator.fromPartial(removeCollab)
      ).finish();
      const msgTypeUrl =
        "/gitopia.gitopia.gitopia.MsgRemoveDaoRepositoryCollaborator";

      // Create the proposal message
      const proposalMsg = {
        groupPolicyAddress: groupInfo.admin,
        proposers: [wallet.selectedAddress],
        metadata: "",
        messages: [
          {
            typeUrl: msgTypeUrl,
            value: msgValue,
          },
        ],
        exec: 0,
        title: `Remove Collaborator: ${user}`,
        summary: `Proposal to remove collaborator ${user} from repository ${repositoryId.id}/${repositoryId.name}`,
      };

      // Submit the proposal
      const message = env.txClient.msgSubmitGroupProposal(proposalMsg);
      const result = await sendTransaction({ message })(dispatch, getState);

      if (result && result.code === 0) {
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );

        // Get proposal ID from the logs
        const log = JSON.parse(result.rawLog);
        const proposalId = log[0].events
          .find((e) => e.type === "cosmos.group.v1.EventSubmitProposal")
          .attributes.find((a) => a.key === "proposal_id").value;

        dispatch(
          notify(
            `Collaborator removal proposal #${proposalId} created. Waiting for approval.`,
            "info"
          )
        );

        return {
          proposalId,
          status: "PROPOSAL_SUBMITTED",
        };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (error) {
      console.error("Error creating collaborator removal proposal:", error);
      dispatch(notify(error.message, "error"));
      return null;
    }
  };
};

export const changeRepositoryOwner = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, owner = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "collaborator"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const req = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: repoOwner,
        name: repoName,
      },
      owner: owner,
    };
    try {
      const message = await env.txClient.msgChangeOwner(req);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updateIssueTitle = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { title = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "issue"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const issue = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      title,
    };

    try {
      const message = await env.txClient.msgUpdateIssueTitle(issue);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updatePullRequestTitle = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { title = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const pull = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      title,
    };

    try {
      const message = await env.txClient.msgUpdatePullRequestTitle(pull);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updateIssueDescription = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { description = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "issue"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const issue = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      description,
    };

    try {
      const message = await env.txClient.msgUpdateIssueDescription(issue);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updatePullRequestDescription = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { description = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const pull = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      description,
    };

    try {
      const message = await env.txClient.msgUpdatePullRequestDescription(pull);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
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

export const updateIssueAssignees = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repositoryId = null,
    iid = null,
    addedAssignees = [],
    removedAssignees = [],
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "issue",
        2
      ))
    )
      return null;

    const { wallet, env } = getState();
    const issueAddAssignees = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: iid,
      assignees: addedAssignees,
    };
    const issueRemoveAssignees = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: iid,
      assignees: removedAssignees,
    };

    try {
      let message1, message2, result1, result2;
      if (addedAssignees.length) {
        message1 = await env.txClient.msgAddIssueAssignees(issueAddAssignees);
        result1 = await sendTransaction({ message: message1 })(
          dispatch,
          getState
        );
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedAssignees.length) {
        message2 = await env.txClient.msgRemoveIssueAssignees(
          issueRemoveAssignees
        );
        result2 = await sendTransaction({ message: message2 })(
          dispatch,
          getState
        );
        if (result2 && result2.code !== 0) {
          dispatch(notify(result2.rawLog, "error"));
          return null;
        }
      }
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateIssueLabels = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repositoryId = null, iid = null, addedLabels = [], removedLabels = [] }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "issue",
        2
      ))
    )
      return null;

    const { wallet, env } = getState();
    const issueAddLabels = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: iid,
      labelIds: addedLabels,
    };
    const issueRemoveLabels = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: iid,
      labelIds: removedLabels,
    };

    try {
      let message1, message2, result1, result2;
      if (addedLabels.length) {
        message1 = await env.txClient.msgAddIssueLabels(issueAddLabels);
        result1 = await sendTransaction({ message: message1 })(
          dispatch,
          getState
        );
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedLabels.length) {
        message2 = await env.txClient.msgRemoveIssueLabels(issueRemoveLabels);
        result2 = await sendTransaction({ message: message2 })(
          dispatch,
          getState
        );
        if (result2 && result2.code !== 0) {
          dispatch(notify(result2.rawLog, "error"));
          return null;
        }
      }
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const createRepositoryLabel = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, name = "", color = "", description = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "label"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const label = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      name,
      color,
      description,
    };

    try {
      const message = await env.txClient.msgCreateRepositoryLabel(label);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
        return result;
      } else {
        dispatch(notify(result.rawLog, "error"));
        console.log(result);
        return null;
      }
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateRepositoryLabel = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repoOwner = null,
    repoName = null,
    labelId = null,
    name = "",
    color = "",
    description = "",
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "label"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const label = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      labelId,
      name,
      color,
      description,
    };

    try {
      const message = await env.txClient.msgUpdateRepositoryLabel(label);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      if (result && result.code === 0) {
        return result;
      } else {
        dispatch(notify(result.rawLog, "error"));
        console.log(result);
        return null;
      }
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const deleteRepositoryLabel = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner = null, repoName = null, labelId = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "label"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const label = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      labelId,
    };
    try {
      const message = await env.txClient.msgDeleteRepositoryLabel(label);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const isCurrentUserEligibleToUpdate = (repository) => {
  return async (dispatch, getState) => {
    if (repository && repository.owner) {
      let permission = false,
        repoOwnerAddress = repository.owner.address;
      const { wallet, user } = getState();
      if (user.dashboards?.length) {
        user.dashboards.every((d) => {
          if (d.id === repoOwnerAddress) {
            permission = true;
            return false;
          }
          return true;
        });
      }
      if (repository.collaborators.length) {
        repository.collaborators.every((c) => {
          if (wallet.selectedAddress === c.id && c.permission !== "READ") {
            permission = true;
            return false;
          }
          return true;
        });
      }
      return permission;
    }
    return false;
  };
};

export const forkRepository = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    ownerId = null,
    repoOwner = null,
    repoName = null,
    repoBranch = null,
    forkRepositoryName = null,
    forkRepositoryDescription = null,
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      owner: ownerId,
      provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      forkRepositoryName,
      forkRepositoryDescription,
    };
    if (repoBranch) {
      repository.branch = repoBranch;
    }

    try {
      const message = await env.txClient.msgForkRepository(repository);
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
            getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
            let url = "/" + ownerId + "/" + repository.forkRepositoryName;
            return { url };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e.Message || e.message, "error"));
      return null;
    }
  };
};

export const createPullRequest = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    title,
    description,
    headBranch,
    headRepoOwner,
    headRepoName,
    baseBranch,
    baseRepoOwner,
    baseRepoName,
    reviewers = [],
    assignees = [],
    labelIds = [],
    issues = [],
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const pull = {
      creator: wallet.selectedAddress,
      title,
      description,
      headBranch,
      headRepositoryId: { id: headRepoOwner, name: headRepoName },
      baseBranch,
      baseRepositoryId: { id: baseRepoOwner, name: baseRepoName },
    };

    if (reviewers.length) {
      pull.reviewers = reviewers;
    }
    if (assignees.length) {
      pull.assignees = assignees;
    }
    if (labelIds.length) {
      pull.labelIds = labelIds;
    }
    if (issues.length) {
      pull.issueIids = issues;
    }

    try {
      const message = await env.txClient.msgCreatePullRequest(pull);
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
        return result;
      } else {
        dispatch(notify(result.rawLog, "error"));
        console.log(result);
        return null;
      }
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const createRelease = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repoOwner = null,
    repoName = null,
    tagName = null,
    target = null,
    name = null,
    description = null,
    attachments = null,
    draft = null,
    preRelease = null,
    isTag = null,
    releaseId = null,
  },
  edit = false
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "release"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const release = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      tagName,
      target,
      name,
      description,
      attachments: JSON.stringify(attachments),
      draft,
      preRelease,
      isTag,
      provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
    };

    if (edit) {
      release.id = releaseId;
    }

    try {
      const message = edit
        ? await env.txClient.msgUpdateRelease(release)
        : await env.txClient.msgCreateRelease(release);
      const result = await sendTransaction({ message })(dispatch, getState);
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

export const createReleaseForDao = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  cosmosGroupApiClient,
  {
    repoOwner = null,
    repoName = null,
    tagName = null,
    target = null,
    name = null,
    description = null,
    attachments = null,
    draft = false,
    preRelease = false,
    isTag = false,
    groupId = null,
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "release"
      ))
    )
      return null;

    const { wallet, env } = getState();

    try {
      // Get the group info to get the admin address
      const groupInfo = await dispatch(
        fetchGroupInfo(cosmosGroupApiClient, groupId)
      );

      if (!groupInfo) {
        throw new Error("Failed to fetch group info");
      }

      // Create the release message
      const release = {
        admin: groupInfo.admin,
        repositoryId: { id: repoOwner, name: repoName },
        tagName,
        target,
        name,
        description,
        attachments: JSON.stringify(attachments),
        draft,
        preRelease,
        isTag,
        provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      };

      // Encode the message
      const msgValue = MsgDaoCreateRelease.encode(
        MsgDaoCreateRelease.fromPartial(release)
      ).finish();
      const msgTypeUrl = "/gitopia.gitopia.gitopia.MsgDaoCreateRelease";

      // Create the proposal message
      const proposalMsg = {
        groupPolicyAddress: groupInfo.admin,
        proposers: [wallet.selectedAddress],
        metadata: "",
        messages: [
          {
            typeUrl: msgTypeUrl,
            value: msgValue,
          },
        ],
        exec: 0, // EXEC_UNSPECIFIED
        title: `Create Release: ${name || tagName}`,
        summary: `Proposal to create release ${
          name || tagName
        } for repository ${repoOwner}/${repoName}`,
      };

      // Submit the proposal
      const message = env.txClient.msgSubmitGroupProposal(proposalMsg);
      const result = await sendTransaction({ message })(dispatch, getState);

      if (result && result.code === 0) {
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );

        // Get proposal ID from the logs
        const log = JSON.parse(result.rawLog);
        const proposalId = log[0].events
          .find((e) => e.type === "cosmos.group.v1.EventSubmitProposal")
          .attributes.find((a) => a.key === "proposal_id").value;

        dispatch(
          notify(
            `Release proposal #${proposalId} created. Waiting for approval.`,
            "info"
          )
        );

        return {
          proposalId,
          status: "PROPOSAL_SUBMITTED",
        };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (error) {
      console.error("Error creating release proposal:", error);
      dispatch(notify(error.message, "error"));
      return null;
    }
  };
};

export const deleteRelease = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { releaseId }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "release"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const release = {
      creator: wallet.selectedAddress,
      id: releaseId,
      provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
    };

    try {
      const message = await env.txClient.msgDeleteRelease(release);
      const result = await sendTransaction({ message })(dispatch, getState);
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

export const createTag = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwnerId = null, repositoryName = null, name = null, sha = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "tag"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const tag = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: repoOwnerId,
        name: repositoryName,
      },
      tag: {
        name: name,
        sha: sha,
      },
    };

    try {
      const message = await env.txClient.msgSetTag(tag);
      const result = await sendTransaction({ message })(dispatch, getState);
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

export const deleteTag = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwnerId = null, repositoryName = null, name = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "tag"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const tag = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: repoOwnerId,
        name: repositoryName,
      },
      tag: name,
    };

    try {
      const message = await env.txClient.msgDeleteTag(tag);
      const result = await sendTransaction({ message })(dispatch, getState);
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

export const deleteBranch = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwnerId = null, repositoryName = null, name = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "tag"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const branch = {
      creator: wallet.selectedAddress,
      repositoryId: {
        id: repoOwnerId,
        name: repositoryName,
      },
      branch: name,
    };

    try {
      const message = await env.txClient.msgDeleteBranch(branch);
      const result = await sendTransaction({ message })(dispatch, getState);
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

export const updatePullRequestAssignees = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repositoryId = null,
    pullIid = null,
    addedAssignees = [],
    removedAssignees = [],
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request",
        2
      ))
    )
      return null;

    const { wallet, env } = getState();
    const pullAddAssignees = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: pullIid,
      assignees: addedAssignees,
    };
    const pullRemoveAssignees = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: pullIid,
      assignees: removedAssignees,
    };

    try {
      let message1, message2, result1, result2;
      if (addedAssignees.length) {
        message1 = await env.txClient.msgAddPullRequestAssignees(
          pullAddAssignees
        );
        result1 = await sendTransaction({ message: message1 })(
          dispatch,
          getState
        );
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedAssignees.length) {
        message2 = await env.txClient.msgRemovePullRequestAssignees(
          pullRemoveAssignees
        );
        result2 = await sendTransaction({ message: message2 })(
          dispatch,
          getState
        );
        if (result2 && result2.code !== 0) {
          dispatch(notify(result2.rawLog, "error"));
          return null;
        }
      }

      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updatePullRequestReviewers = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    repositoryId = null,
    pullIid = null,
    addedReviewers = [],
    removedReviewers = [],
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request",
        2
      ))
    )
      return null;

    const { wallet, env } = getState();
    const pullAddReviewers = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: pullIid,
      reviewers: addedReviewers,
    };
    const pullRemoveReviewers = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: pullIid,
      reviewers: removedReviewers,
    };

    try {
      let message1, message2, result1, result2;
      if (addedReviewers.length) {
        message1 = await env.txClient.msgAddPullRequestReviewers(
          pullAddReviewers
        );
        result1 = await sendTransaction({ message: message1 })(
          dispatch,
          getState
        );
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedReviewers.length) {
        message2 = await env.txClient.msgRemovePullRequestReviewers(
          pullRemoveReviewers
        );
        result2 = await sendTransaction({ message: message2 })(
          dispatch,
          getState
        );
        if (result2 && result2.code !== 0) {
          dispatch(notify(result2.rawLog, "error"));
          return null;
        }
      }

      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updatePullRequestLabels = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repositoryId = null, pullIid = null, addedLabels = [], removedLabels = [] }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "issue",
        2
      ))
    )
      return null;

    const { wallet, env } = getState();
    const issueAddLabels = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: pullIid,
      labelIds: addedLabels,
    };
    const issueRemoveLabels = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid: pullIid,
      labelIds: removedLabels,
    };

    try {
      let message1, message2, result1, result2;
      if (addedLabels.length) {
        message1 = await env.txClient.msgAddPullRequestLabels(issueAddLabels);
        result1 = await sendTransaction({ message: message1 })(
          dispatch,
          getState
        );
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedLabels.length) {
        message2 = await env.txClient.msgRemovePullRequestLabels(
          issueRemoveLabels
        );
        result2 = await sendTransaction({ message: message2 })(
          dispatch,
          getState
        );
        if (result2 && result2.code !== 0) {
          dispatch(notify(result2.rawLog, "error"));
          return null;
        }
      }

      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updatePullRequestState = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repositoryId = null, iid = null, state, mergeCommitSha, commentBody }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const pullState = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      state,
      mergeCommitSha,
      commentBody,
    };

    try {
      const message = await env.txClient.msgSetPullRequestState(pullState);
      const result = await sendTransaction({ message })(dispatch, getState);
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

export const mergePullRequest = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repositoryId, iid, branchName }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const mergePull = {
      creator: wallet.selectedAddress,
      repositoryId: repositoryId,
      iid,
      provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
    };

    try {
      const message = await env.txClient.msgInvokeMergePullRequest(mergePull);
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
        // return result;
        const log = JSON.parse(result.rawLog);
        const taskId =
          log[0].events[1].attributes[
            log[0].events[1].attributes.findIndex((a) => a.key === "TaskId")
          ].value;
        try {
          const res = await watchTask(apiClient, taskId);
          if (res.state === "TASK_STATE_SUCCESS") {
            getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
            return res;
          } else if (res.state === "TASK_STATE_FAILURE") {
            dispatch(notify(res.message, "error"));
            return null;
          }
        } catch (e) {
          dispatch(notify(e.message, "error"));
          return null;
        }
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

export const mergePullRequestForDao = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  cosmosGroupApiClient,
  { repositoryId, iid, groupId }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "pull request"
      ))
    )
      return null;

    const { wallet, env } = getState();

    try {
      // First, get the group info to get the admin address
      const groupInfo = await dispatch(
        fetchGroupInfo(cosmosGroupApiClient, groupId)
      );
      if (!groupInfo) {
        throw new Error("Failed to fetch group info");
      }

      // Create the merge pull request message
      const mergePull = {
        admin: groupInfo.admin,
        repositoryId: repositoryId,
        iid,
        provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      };

      // Encode the message
      const msgValue = MsgInvokeDaoMergePullRequest.encode(
        MsgInvokeDaoMergePullRequest.fromPartial(mergePull)
      ).finish();
      const msgTypeUrl =
        "/gitopia.gitopia.gitopia.MsgInvokeDaoMergePullRequest";

      // Create the proposal message
      const proposalMsg = {
        groupPolicyAddress: groupInfo.admin,
        proposers: [wallet.selectedAddress],
        metadata: "",
        messages: [
          {
            typeUrl: msgTypeUrl,
            value: msgValue,
          },
        ],
        exec: 0, // EXEC_UNSPECIFIED
        title: "Merge Pull Request #" + iid,
        summary: `Proposal to merge pull request #${iid} in repository ${repositoryId.id}/${repositoryId.name}`,
      };

      // Submit the proposal
      const message = env.txClient.msgSubmitGroupProposal(proposalMsg);
      const result = await sendTransaction({ message })(dispatch, getState);

      if (result && result.code === 0) {
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );

        // After proposal is created, watch the task for completion
        const log = JSON.parse(result.rawLog);
        const proposalId = log[0].events
          .find((e) => e.type === "cosmos.group.v1.EventSubmitProposal")
          .attributes.find((a) => a.key === "proposal_id").value;

        dispatch(
          notify(
            `Merge proposal #${proposalId} created. Waiting for approval.`,
            "info"
          )
        );

        return {
          proposalId,
          status: "PROPOSAL_SUBMITTED",
        };
      } else {
        dispatch(notify(result.rawLog, "error"));
        return null;
      }
    } catch (error) {
      console.error("Error creating merge proposal:", error);
      dispatch(notify(error.message, "error"));
      return null;
    }
  };
};

export const toggleRepositoryForking = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { repoOwner, repoName }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "repository"
      ))
    )
      return null;

    const { wallet, env } = getState();
    const repo = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
    };

    try {
      const message = await env.txClient.msgToggleRepositoryForking(repo);
      const result = await sendTransaction({ message })(dispatch, getState);
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
