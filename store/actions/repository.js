import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { createUser, getUserDetailsForSelectedAddress } from "./user";
import { updateUserBalance } from "./wallet";
import forkRepositoryFiles from "../../helpers/forkRepositoryFiles";
import dayjs from "dayjs";

export const validatePostingEligibility = async (
  dispatch,
  getState,
  msgType,
  numberOfTransactions = 1
) => {
  const { wallet, env, user } = getState();

  try {
    await setupTxClients(dispatch, getState);
  } catch (e) {
    console.log(e.message);
    return false;
  }

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
      const res = await createUser(wallet.activeWallet.name)(
        dispatch,
        getState
      );
      if (res && res.code === 0) {
        await getUserDetailsForSelectedAddress()(dispatch, getState);
      } else {
        return false;
      }
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
      ownerType: ownerType || "USER",
      description: description,
    };
    console.log("repository", repository);
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

export const createIssue = ({
  title = "",
  description = "",
  repositoryId = null,
  labels = [],
  weight = 0,
  assignees = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;

    const { wallet, env } = getState();
    const issue = {
      creator: wallet.selectedAddress,
      title,
      description,
      repositoryId: repositoryId.toString(),
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
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      parentId,
      body,
      commentType,
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
    if (authorAssociation.trim() !== "") {
      comment.authorAssociation = authorAssociation;
    }
    if (system) {
      comment.system = true;
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

export const updateComment = ({ id = null, body = "", attachments = [] }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      id,
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

export const deleteComment = ({ id = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      id,
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

export const toggleIssueState = ({ id = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "comment")))
      return null;

    const { wallet, env } = getState();
    const comment = {
      creator: wallet.selectedAddress,
      id,
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

export const updateIssueTitle = ({ title = null, id = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;

    const { wallet, env } = getState();
    const issue = {
      creator: wallet.selectedAddress,
      id,
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

export const updatePullRequestTitle = ({ title = null, id = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;

    const { wallet, env } = getState();
    const pull = {
      creator: wallet.selectedAddress,
      id,
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

export const updateIssueDescription = ({ description = null, id = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue")))
      return null;

    const { wallet, env } = getState();
    const issue = {
      creator: wallet.selectedAddress,
      id,
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
  id = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;

    const { wallet, env } = getState();
    const pull = {
      creator: wallet.selectedAddress,
      id,
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
  issueId = null,
  addedAssignees = [],
  removedAssignees = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
      return null;

    const { wallet, env } = getState();
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
  issueId = null,
  addedLabels = [],
  removedLabels = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
      return null;

    const { wallet, env } = getState();
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
  repoId = null,
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
      id: repoId,
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
  repositoryId = null,
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
      repositoryId,
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

export const isCurrentUserEligibleToUpdate = (repository) => {
  return async (dispatch, getState) => {
    if (repository && repository.owner) {
      let permission = false,
        repoOwnerAddress = repository.owner.id;
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
      const result = await sendTransaction({ message })(dispatch, getState);
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
  reviewers = [],
  assignees = [],
  labelIds = [],
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
      headRepoId,
      baseBranch,
      baseRepoId,
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
    repositoryId = null,
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
      repositoryId,
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

    console.log("release", release, "edit", edit);
    try {
      const message = edit
        ? await env.txClient.msgUpdateRelease(release)
        : await env.txClient.msgCreateRelease(release);
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

export const deleteRelease = ({ releaseId }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "release")))
      return null;

    const { wallet, env } = getState();
    const release = {
      creator: wallet.selectedAddress,
      id: releaseId,
    };

    console.log("release", release);
    try {
      const message = await env.txClient.msgDeleteRelease(release);
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

export const createTag = ({ repositoryId = null, name = null, sha = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "tag")))
      return null;

    const { wallet, env } = getState();
    const tag = {
      creator: wallet.selectedAddress,
      id: repositoryId,
      name,
      sha,
    };

    try {
      const message = await env.txClient.msgSetRepositoryTag(tag);
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

export const updatePullRequestAssignees = ({
  pullId = null,
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
  pullId = null,
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
  pullId = null,
  addedLabels = [],
  removedLabels = [],
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "issue", 2)))
      return null;

    const { wallet, env } = getState();
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

export const updatePullRequestState = ({ id, state, mergeCommitSha }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "pull request")))
      return null;

    const { wallet, env } = getState();
    const pullState = {
      creator: wallet.selectedAddress,
      id,
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

export const toggleRepositoryForking = ({ id }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "repository")))
      return null;

    const { wallet, env } = getState();
    const repo = {
      creator: wallet.selectedAddress,
      id,
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

export const grantGitServerForkAccess = () => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "grant access")))
      return null;

    const { wallet, env } = getState();
    // const access = {
    //   granter: wallet.selectedAddress,
    //   grantee: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
    //   grant: {
    //     authorization: {
    //       "@type": "/cosmos.authz.v1beta1.GenericAuthorization",

    //       msg: "",
    //     },
    //     expiration: "4522-03-21T14:47:56Z",
    //   },
    // };

    try {
      const message = await env.txClient.msgGrant(
        wallet.selectedAddress,
        process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
        "/gitopia.gitopia.gitopia.MsgForkRepository",
        dayjs().add(1, "M").unix()
      );
      console.log("Grant", message);
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
