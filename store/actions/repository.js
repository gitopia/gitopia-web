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
import forkRepositoryFiles from "../../helpers/forkRepositoryFiles";

export const validatePostingEligibility = async (
  dispatch,
  getState,
  msgType,
  numberOfTransactions = 1
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
      console.log("No associated user found for this adddress, creating... ");
      await createUser(wallet.activeWallet.name)(dispatch, getState);
      await reInitClients(dispatch, getState);
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
    let ownerType;
    const { user } = getState();
    user.dashboards.every((d) => {
      if (d.id === ownerId) {
        ownerType = d.type == "User" ? "USER" : "ORGANIZATION";
        return false;
      }
      return true;
    });
    const repository = {
      creator: wallet.selectedAddress,
      name: name,
      ownerId,
      ownerType,
      description: description,
    };
    console.log("repository", repository);
    const { env } = getState();

    try {
      const message = await env.txClient.msgCreateRepository(repository);
      const result = await sendTransaction({ message }, env);
      console.log(result);
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
      creator: wallet.selectedAddress,
      title,
      description,
      repositoryId,
      labelIds: labels,
      weight,
      assignees,
    };

    console.log("issue", issue);

    try {
      const message = await env.txClient.msgCreateIssue(issue);
      const result = await sendTransaction({ message }, env);
      console.log(result);
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

export const removeCollaborator = ({ id = null, user = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
      return null;
    const { env, wallet } = getState();
    const collaborator = {
      creator: wallet.selectedAddress,
      id,
      user,
    };

    try {
      const message = await env.txClient.msgRemoveRepositoryCollaborator(
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

export const changeRespositoryOwner = ({
  repositoryId = null,
  ownerId = null,
  ownerType = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
      return null;
    const { env, wallet } = getState();
    const req = {
      creator: wallet.selectedAddress,
      repositoryId,
      ownerId,
      ownerType,
    };

    try {
      const message = await env.txClient.msgChangeOwner(req);
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
      ...(title && { title }),
      ...(description && { description }),
      ...(labels && { labels }),
      ...(assignees && { assignees }),
      ...(weight && { weight }),
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

export const updateIssueTitle = ({ title = null, id = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;
    const issue = {
      creator: wallet.selectedAddress,
      id,
      title,
    };
    console.log("issue", issue);

    try {
      const message = await env.txClient.msgUpdateIssueTitle(issue);
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

export const updatePullRequestTitle = ({ title = null, id = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;
    const pull = {
      creator: wallet.selectedAddress,
      id,
      title,
    };
    console.log("pull", pull);

    try {
      const message = await env.txClient.msgUpdatePullRequestTitle(pull);
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

export const updateIssueDescription = ({ description = null, id = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;
    const issue = {
      creator: wallet.selectedAddress,
      id,
      description,
    };
    console.log("issue", issue);

    try {
      const message = await env.txClient.msgUpdateIssueDescription(issue);
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

export const updatePullRequestDescription = ({
  description = null,
  id = null,
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;
    const pull = {
      creator: wallet.selectedAddress,
      id,
      description,
    };
    console.log("pull", pull);

    try {
      const message = await env.txClient.msgUpdatePullRequestDescription(pull);
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

export const updateIssueAssignees = ({
  issueId = null,
  addedAssignees = [],
  removedAssignees = [],
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
      return null;
    const issueAddAssignees = {
      creator: wallet.selectedAddress,
      id: issueId,
      assignees: addedAssignees,
    };
    const issueRemoveAssignees = {
      creator: wallet.selectedAddress,
      id: issueId,
      assignees: removedAssignees,
    };
    // console.log("add assignees", issueAddAssignees);
    // console.log("remove assignees", issueRemoveAssignees);

    try {
      let message1, message2, result1, result2;
      if (addedAssignees.length) {
        message1 = await env.txClient.msgAddIssueAssignees(issueAddAssignees);
        result1 = await sendTransaction({ message: message1 }, env);
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedAssignees.length) {
        message2 = await env.txClient.msgRemoveIssueAssignees(
          issueRemoveAssignees
        );
        result2 = await sendTransaction({ message: message2 }, env);
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

export const updateIssueLabels = ({
  issueId = null,
  addedLabels = [],
  removedLabels = [],
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
      return null;
    const issueAddLabels = {
      creator: wallet.selectedAddress,
      issueId: issueId,
      labelIds: addedLabels,
    };
    const issueRemoveLabels = {
      creator: wallet.selectedAddress,
      issueId: issueId,
      labelIds: removedLabels,
    };
    console.log("add labels", issueAddLabels);
    console.log("remove labels", issueRemoveLabels);

    try {
      let message1, message2, result1, result2;
      if (addedLabels.length) {
        message1 = await env.txClient.msgAddIssueLabels(issueAddLabels);
        result1 = await sendTransaction({ message: message1 }, env);
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedLabels.length) {
        message2 = await env.txClient.msgRemoveIssueLabels(issueRemoveLabels);
        result2 = await sendTransaction({ message: message2 }, env);
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

export const createRepositoryLabel = ({
  repoId = null,
  name = "",
  color = "",
  description = "",
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "label")))
      return null;
    const label = {
      creator: wallet.selectedAddress,
      id: repoId,
      name,
      color,
      description,
    };
    console.log("create", label);

    try {
      const message = await env.txClient.msgCreateRepositoryLabel(label);
      const result = await sendTransaction({ message }, env);
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
  repositoryId = null,
  labelId = null,
  name = "",
  color = "",
  description = "",
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "label")))
      return null;
    const label = {
      creator: wallet.selectedAddress,
      repositoryId,
      labelId,
      name,
      color,
      description,
    };

    console.log("update", label);

    try {
      const message = await env.txClient.msgUpdateRepositoryLabel(label);
      const result = await sendTransaction({ message }, env);
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

export const isCurrentUserEligibleToUpdate = (repoOwnerAddress) => {
  return async (dispatch, getState) => {
    let permission = false;
    const { wallet, user } = getState();
    if (wallet.selectedAddress === repoOwnerAddress) {
      permission = true;
    } else if (user) {
      user.organizations.every((o) => {
        if (o.id === repoOwnerAddress) {
          permission = true;
          return false;
        }
        return true;
      });
    }
    return permission;
  };
};

export const forkRepository = ({
  repositoryId = null,
  ownerId = null,
  repositoryName = "",
}) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;
    let ownerType;
    const { user } = getState();
    user.dashboards.every((d) => {
      if (d.id === ownerId) {
        ownerType = d.type == "User" ? "USER" : "ORGANIZATION";
        return false;
      }
      return true;
    });
    const repository = {
      creator: wallet.selectedAddress,
      repositoryId,
      ownerId,
      ownerType,
    };
    console.log("fork", repository);
    const { env } = getState();

    try {
      const message = await env.txClient.msgForkRepository(repository);
      const result = await sendTransaction({ message }, env);
      console.log(result);
      if (result && result.code === 0) {
        const newRepoQuery = await env.queryClient.queryAddressRepository(
          ownerId,
          repositoryName
        );
        if (newRepoQuery.ok) {
          const forkFilesQuery = await forkRepositoryFiles(
            repositoryId,
            newRepoQuery.data.Repository.id
          );
          console.log("fork files", forkFilesQuery);
          if (!forkFilesQuery.data.forked) {
            dispatch(notify(forkFilesQuery.error, "error"));
          }
        }
        getUserDetailsForSelectedAddress()(dispatch, getState);
        let url = "/" + ownerId + "/" + repositoryName;
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

export const createPullRequest = ({
  title,
  description,
  headBranch,
  headRepoId,
  baseBranch,
  baseRepoId,
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;
    const pull = {
      creator: wallet.selectedAddress,
      title,
      description,
      headBranch,
      headRepoId,
      baseBranch,
      baseRepoId,
    };

    console.log("pull request", pull);
    try {
      const message = await env.txClient.msgCreatePullRequest(pull);
      const result = await sendTransaction({ message }, env);
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

export const createRelease = ({
  repositoryId = null,
  tagName = null,
  target = null,
  name = null,
  description = null,
  attachments = null,
  draft = null,
  preRelease = null,
  isTag = null,
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "release")))
      return null;
    const release = {
      creator: wallet.selectedAddress,
      tagName,
      target,
      name,
      description,
      attachments: JSON.stringify(attachments),
      draft,
      preRelease,
      isTag,
    };

    console.log("release", release);
    try {
      const message = await env.txClient.msgCreateRelease(release);
      const result = await sendTransaction({ message }, env);
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

export const createTag = ({ repositoryId = null, name = null, sha = null }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "tag")))
      return null;
    const tag = {
      creator: wallet.selectedAddress,
      id: repositoryId,
      name,
      sha,
    };

    console.log("tag", tag);
    try {
      const message = await env.txClient.msgSetRepositoryTag(tag);
      const result = await sendTransaction({ message }, env);
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

export const updatePullRequestAssignees = ({
  pullId = null,
  addedAssignees = [],
  removedAssignees = [],
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (
      !(await validatePostingEligibility(dispatch, getState, "pull request", 2))
    )
      return null;
    const pullAddAssignees = {
      creator: wallet.selectedAddress,
      id: pullId,
      assignees: addedAssignees,
    };
    const pullRemoveAssignees = {
      creator: wallet.selectedAddress,
      id: pullId,
      assignees: removedAssignees,
    };

    try {
      let message1, message2, result1, result2;
      if (addedAssignees.length) {
        message1 = await env.txClient.msgAddPullRequestAssignees(
          pullAddAssignees
        );
        result1 = await sendTransaction({ message: message1 }, env);
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedAssignees.length) {
        message2 = await env.txClient.msgRemovePullRequestAssignees(
          pullRemoveAssignees
        );
        result2 = await sendTransaction({ message: message2 }, env);
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
  pullId = null,
  addedReviewers = [],
  removedReviewers = [],
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (
      !(await validatePostingEligibility(dispatch, getState, "pull request", 2))
    )
      return null;
    const pullAddReviewers = {
      creator: wallet.selectedAddress,
      id: pullId,
      reviewers: addedReviewers,
    };
    const pullRemoveReviewers = {
      creator: wallet.selectedAddress,
      id: pullId,
      reviewers: removedReviewers,
    };

    try {
      let message1, message2, result1, result2;
      if (addedReviewers.length) {
        message1 = await env.txClient.msgAddPullRequestReviewers(
          pullAddReviewers
        );
        result1 = await sendTransaction({ message: message1 }, env);
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedReviewers.length) {
        message2 = await env.txClient.msgRemovePullRequestReviewers(
          pullRemoveReviewers
        );
        result2 = await sendTransaction({ message: message2 }, env);
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
  pullId = null,
  addedLabels = [],
  removedLabels = [],
}) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
      return null;
    const issueAddLabels = {
      creator: wallet.selectedAddress,
      pullRequestId: pullId,
      labelIds: addedLabels,
    };
    const issueRemoveLabels = {
      creator: wallet.selectedAddress,
      pullRequestId: pullId,
      labelIds: removedLabels,
    };

    try {
      let message1, message2, result1, result2;
      if (addedLabels.length) {
        message1 = await env.txClient.msgAddPullRequestLabels(issueAddLabels);
        result1 = await sendTransaction({ message: message1 }, env);
        if (result1 && result1.code !== 0) {
          dispatch(notify(result1.rawLog, "error"));
          return null;
        }
      }
      if (removedLabels.length) {
        message2 = await env.txClient.msgRemovePullRequestLabels(
          issueRemoveLabels
        );
        result2 = await sendTransaction({ message: message2 }, env);
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

export const updatePullRequestState = ({ id, state, mergeCommitSha }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;
    const pullState = {
      creator: wallet.selectedAddress,
      id,
      state,
      mergeCommitSha,
    };
    console.log(pullState);
    try {
      const message = await env.txClient.msgSetPullRequestState(pullState);
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

export const toggleRepositoryForking = ({ id }) => {
  return async (dispatch, getState) => {
    const { wallet, env } = getState();
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;
    const repo = {
      creator: wallet.selectedAddress,
      id,
    };
    console.log(repo);
    try {
      const message = await env.txClient.msgToggleRepositoryForking(repo);
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
