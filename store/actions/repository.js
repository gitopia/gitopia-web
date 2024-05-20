import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { getUserDetailsForSelectedAddress } from "./user";
import { updateUserBalance } from "./wallet";
import { watchTask } from "./taskQueue";

export const validatePostingEligibility = async (
  apiClient,
  dispatch,
  getState,
  msgType,
  numberOfTransactions = 1
) => {
  try {
    await setupTxClients(apiClient, dispatch, getState);
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
    let res = await getAllowance(wallet.selectedAddress);
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
  { name = null, description = null, ownerId = null }
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress()(dispatch, getState);
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
  { name = null, ownerId = null }
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
      if (result && result.code === 0) {
        getUserDetailsForSelectedAddress()(dispatch, getState);
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
  { name = null, ownerId = null, description = null }
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
      updateUserBalance(env.apiNode)(dispatch, getState);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateComment = (
  apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const deleteComment = (
  apiClient,
  { repositoryId = null, parentIid = null, parent = null, commentIid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const toggleIssueState = (
  apiClient,
  { repositoryId = null, iid = null, commentBody = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { repoOwner = null, repoName = null, name = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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

export const changeDefaultBranch = (
  apiClient,
  { repoOwner = null, repoName = null, branchName = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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

export const toggleForcePush = (
  apiClient,
  { repoOwner = null, repoName = null, branchName = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { repoOwner = null, repoName = null, user = null, role = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { repoOwner = null, repoName = null, user = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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

export const changeRepositoryOwner = (
  apiClient,
  { repoOwner = null, repoName = null, owner = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { title = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { title = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { description = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { description = null, repositoryId = null, iid = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
      updateUserBalance(env.apiNode)(dispatch, getState); // TODO
      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateIssueLabels = (
  apiClient,
  { repositoryId = null, iid = null, addedLabels = [], removedLabels = [] }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const createRepositoryLabel = (
  apiClient,
  { repoOwner = null, repoName = null, name = "", color = "", description = "" }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
  { repoOwner = null, repoName = null, labelId = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      updateUserBalance(env.apiNode)(dispatch, getState);
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
    console.log("forking", repository);

    try {
      const message = await env.txClient.msgInvokeForkRepository(repository);
      dispatch({ type: "START_RECORDING_TASKS" });
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
        const log = JSON.parse(result.rawLog);
        const taskId =
          log[0].events[0].attributes[
            log[0].events[0].attributes.findIndex((a) => a.key === "TaskId")
          ].value;
        const res = await watchTask(taskId, "Forking repository " + repoName)(
          dispatch,
          getState
        );
        console.log("Watch task result", res);
        if (res.TaskState === "TASK_STATE_SUCCESS") {
          getUserDetailsForSelectedAddress()(dispatch, getState);
          let url = "/" + ownerId + "/" + res.RepositoryName;
          return { url };
        } else if (res.TaskState === "TASK_STATE_FAILURE") {
          dispatch(notify(res.Message, "error"));
          return null;
        }
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

export const deleteRelease = (apiClient, { releaseId }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
  { repoOwnerId = null, repositoryName = null, name = null, sha = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(apiClient, dispatch, getState, "tag"))
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
  { repoOwnerId = null, repositoryName = null, name = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(apiClient, dispatch, getState, "tag"))
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
  { repoOwnerId = null, repositoryName = null, name = null }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(apiClient, dispatch, getState, "tag"))
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
  { repositoryId = null, pullIid = null, addedLabels = [], removedLabels = [] }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
  { repositoryId = null, iid = null, state, mergeCommitSha, commentBody }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
  { repositoryId, iid, branchName }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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
      dispatch({ type: "START_RECORDING_TASKS" });
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
        // return result;
        const log = JSON.parse(result.rawLog);
        const taskId =
          log[0].events[0].attributes[
            log[0].events[0].attributes.findIndex((a) => a.key === "TaskId")
          ].value;
        const res = await watchTask(taskId, "Merging branch " + branchName)(
          dispatch,
          getState
        );
        console.log("Watch task result", res);
        getUserDetailsForSelectedAddress()(dispatch, getState);
        return res;
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

export const toggleRepositoryForking = (apiClient, { repoOwner, repoName }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
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

export const authorizeGitServer = (apiClient) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "grant access"
      ))
    )
      return null;

    const { wallet, env } = getState();
    try {
      const message = await env.txClient.msgAuthorizeProvider({
        creator: wallet.selectedAddress,
        granter: wallet.selectedAddress,
        provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
        permission: 0,
      });
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(env.apiNode)(dispatch, getState);
      console.log(result);
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
