import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { createUser, getUserDetailsForSelectedAddress } from "./user";
import { updateUserBalance } from "./wallet";
import dayjs from "dayjs";
import { watchTask } from "./taskQueue";

export const validatePostingEligibility = async (
  dispatch,
  getState,
  msgType,
  numberOfTransactions = 1
) => {
  try {
    await setupTxClients(dispatch, getState);
  } catch (e) {
    console.log(e.message);
    return false;
  }

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
          "You need to create a profile before performing any action, please go back to the dashboard and setup your profile first",
          "error"
        )
      );
      return false;
    }
  }

  if (wallet.loreBalance <= 0.0000025 * numberOfTransactions) {
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
      updateUserBalance()(dispatch, getState);
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
      dispatch(notify(e.message, "error"));
      return null;
    }
  };
};

export const deleteRepository = ({ name = null, ownerId = null }) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
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
      updateUserBalance()(dispatch, getState);
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

export const createIssue = ({
  title = "",
  description = "",
  repositoryName = "",
  repositoryOwner = "",
  labels = [],
  weight = 0,
  assignees = [],
  bountyAmount = [],
  bountyExpiry = 0,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
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
      issue.bountyExpiry = bountyExpiry;
    }
    try {
      const message = await env.txClient.msgCreateIssue(issue);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
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

export const createComment = ({
  repositoryId = null,
  parentIid = null,
  parent = "",
  body = "",
  attachments = [],
  diffHunk = "",
  path = "",
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      parentIid,
      parent: parent === "COMMENT_PARENT_ISSUE" ? 0 : 1,
      body,
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
    console.log("comment", comment);

    try {
      const message = await env.txClient.msgCreateComment(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateComment = ({
  repositoryId = null,
  parentIid = null,
  parent = null,
  commentIid = null,
  body = "",
  attachments = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      parentIid,
      parent: parent === "COMMENT_PARENT_ISSUE" ? 0 : 1,
      commentIid,
      body,
      attachments,
    };

    try {
      const message = await env.txClient.msgUpdateComment(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const deleteComment = ({
  repositoryId = null,
  parentIid = null,
  parent = null,
  commentIid = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      parentIid,
      parent: parent === "COMMENT_PARENT_ISSUE" ? 0 : 1,
      commentIid,
    };
    try {
      const message = await env.txClient.msgDeleteComment(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const toggleIssueState = ({ repositoryId = null, iid = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
    };
    try {
      const message = await env.txClient.msgToggleIssueState(comment);
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
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

export const renameRepository = ({
  repoOwner = null,
  repoName = null,
  name = "",
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
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
      updateUserBalance()(dispatch, getState);
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

export const changeDefaultBranch = ({
  repoOwner = null,
  repoName = null,
  branchName = "",
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
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
      updateUserBalance()(dispatch, getState);
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

export const updateCollaborator = ({
  repoOwner = null,
  repoName = null,
  user = null,
  role = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
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
      updateUserBalance()(dispatch, getState);
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

export const removeCollaborator = ({
  repoOwner = null,
  repoName = null,
  user = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
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
      updateUserBalance()(dispatch, getState);
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

export const changeRepositoryOwner = ({
  repoOwner = null,
  repoName = null,
  owner = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
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
      updateUserBalance()(dispatch, getState);
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

export const updateIssueTitle = ({
  title = null,
  repositoryId = null,
  iid = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
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
      updateUserBalance()(dispatch, getState);
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

export const updatePullRequestTitle = ({
  title = null,
  repositoryId = null,
  iid = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
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
      updateUserBalance()(dispatch, getState);
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

export const updateIssueDescription = ({
  description = null,
  repositoryId = null,
  iid = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
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
      updateUserBalance()(dispatch, getState);
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

export const updatePullRequestDescription = ({
  description = null,
  repositoryId = null,
  iid = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
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
      updateUserBalance()(dispatch, getState);
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

export const updateIssueAssignees = ({
  repositoryId = null,
  iid = null,
  addedAssignees = [],
  removedAssignees = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
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
      updateUserBalance()(dispatch, getState);
      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const updateIssueLabels = ({
  repositoryId = null,
  iid = null,
  addedLabels = [],
  removedLabels = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
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
      updateUserBalance()(dispatch, getState);
      return { result1, result2 };
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const createRepositoryLabel = ({
  repoOwner = null,
  repoName = null,
  name = "",
  color = "",
  description = "",
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "label")))
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
      updateUserBalance()(dispatch, getState);
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

export const updateRepositoryLabel = ({
  repoOwner = null,
  repoName = null,
  labelId = null,
  name = "",
  color = "",
  description = "",
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "label")))
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
      updateUserBalance()(dispatch, getState);
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

export const deleteRepositoryLabel = ({
  repoOwner = null,
  repoName = null,
  labelId = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "label")))
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
      updateUserBalance()(dispatch, getState);
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

export const forkRepository = ({
  ownerId = null,
  repoOwner = null,
  repoName = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;

    const { wallet, user } = getState();
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId: { id: repoOwner, name: repoName },
      owner: ownerId,
      provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
    };
    const { env } = getState();

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
        const res = await watchTask(taskId)(dispatch, getState);
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

export const createPullRequest = ({
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
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
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
      pull.issues = issues;
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
    if (!(await validatePostingEligibility(dispatch, getState, "release")))
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

export const deleteRelease = ({ releaseId }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "release")))
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

export const createTag = ({
  repoOwnerId = null,
  repositoryName = null,
  name = null,
  sha = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "tag")))
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

export const deleteTag = ({
  repoOwnerId = null,
  repositoryName = null,
  name = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "tag")))
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

export const deleteBranch = ({
  repoOwnerId = null,
  repositoryName = null,
  name = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "tag")))
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

export const updatePullRequestAssignees = ({
  repositoryId = null,
  pullIid = null,
  addedAssignees = [],
  removedAssignees = [],
}) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(dispatch, getState, "pull request", 2))
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

export const updatePullRequestReviewers = ({
  repositoryId = null,
  pullIid = null,
  addedReviewers = [],
  removedReviewers = [],
}) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(dispatch, getState, "pull request", 2))
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

export const updatePullRequestLabels = ({
  repositoryId = null,
  pullIid = null,
  addedLabels = [],
  removedLabels = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
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

export const updatePullRequestState = ({
  repositoryId = null,
  iid = null,
  state,
  mergeCommitSha,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;

    const { wallet, env } = getState();
    const pullState = {
      creator: wallet.selectedAddress,
      repositoryId,
      iid,
      state,
      mergeCommitSha,
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

export const mergePullRequest = ({ repositoryId, iid }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
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
        const res = await watchTask(taskId)(dispatch, getState);
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

export const toggleRepositoryForking = ({ repoOwner, repoName }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
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

export const authorizeGitServer = () => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "grant access")))
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
      updateUserBalance()(dispatch, getState);
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
