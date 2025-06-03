import { notify } from "reapop";
import {
  setupTxClients,
  sendTransaction,
  handlePostingTransaction,
} from "./env";
import { getUserDetailsForSelectedAddress, setCurrentDashboard } from "./user";
import { userActions, daoActions } from "./actionTypes";
import { validatePostingEligibility } from "./repository";
import { updateUserBalance } from "./wallet";
import { MemberRole } from "@gitopia/gitopia-js/dist/types/gitopia/member";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import getGroupMembers from "../../helpers/getGroupMembers";
import getGroupInfo from "../../helpers/getGroupInfo";
import { MsgUpdateGroupMembers, Exec } from "cosmjs-types/cosmos/group/v1/tx";
import {
  MsgRenameDao,
  MsgUpdateDaoAvatar,
} from "@gitopia/gitopia-js/dist/types/gitopia/tx";
import { cosmos, gitopia } from "@gitopia/gitopiajs";

const { submitProposal } = cosmos.group.v1.MessageComposer.withTypeUrl;
const { createDao: createDaoMsg } =
  gitopia.gitopia.gitopia.MessageComposer.withTypeUrl;

export const createDao = (
  apiClient,
  {
    name = null,
    description = null,
    avatarUrl = null,
    location = null,
    website = null,
    votingPeriod = "2",
    percentage = "50",
    members = [],
    config = {
      requirePullRequestProposal: false,
      requireRepositoryDeletionProposal: false,
      requireCollaboratorProposal: false,
      requireReleaseProposal: false,
    },
  }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(apiClient, dispatch, getState, "dao"))
    )
      return null;

    const { wallet, env } = getState();

    const dao = {
      creator: wallet.selectedAddress,
      name,
      description,
      avatarUrl,
      location,
      website,
      members,
      votingPeriod,
      percentage,
      config,
    };

    try {
      const message = await createDaoMsg(dao);
      const result = await sendTransaction({ txClient: env.txClient, message })(
        dispatch,
        getState
      );

      if (result && result.code === 0) {
        await getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
        const daos = await getUserDaoAll(apiClient, wallet.selectedAddress);

        // Update dashboards with new DAO information
        dispatch({
          type: userActions.INIT_DASHBOARDS,
          payload: {
            name: wallet.activeWallet.name,
            id: wallet.selectedAddress,
            daos: daos,
          },
        });

        // Update user's balance after DAO creation
        updateUserBalance(apiClient)(dispatch, getState);

        // Find the new DAO's address from the list of DAOs
        let newDaoAddress;
        daos.every((d) => {
          if (d.name === name) {
            newDaoAddress = d.address;
            return false;
          }
          return true;
        });

        // Set the current dashboard to the new DAO
        setCurrentDashboard(newDaoAddress)(dispatch, getState);

        // Return the URL for redirection
        return { url: "/daos/" + name + "/dashboard" };
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

export const getDaoDetailsForDashboard = (apiClient) => {
  return async (dispatch, getState) => {
    const { user } = getState();
    try {
      const daoRes = await apiClient.gitopia.gitopia.gitopia.dao({
        id: user.currentDashboard,
      });
      let dao = daoRes.dao;
      const members = await getGroupMembers(apiClient, dao.group_id);
      dispatch({
        type: daoActions.SET_DAO,
        payload: {
          dao: { ...dao, members: members },
        },
      });
      await dispatch({
        type: userActions.UPDATE_DASHBOARD_ENTRY,
        payload: { ...dao, id: dao.address },
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: daoActions.SET_EMPTY_DAO,
      });
    }
  };
};

export const updateDaoAvatar = (apiClient, { id, groupId, url }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "update avatar"
      ))
    )
      return null;
    const { env, wallet } = getState();

    const groupInfo = await dispatch(fetchGroupInfo(apiClient, groupId));

    const msg = MsgUpdateDaoAvatar.fromPartial({
      admin: groupInfo.admin,
      id,
      url,
    });

    const msgValue = MsgUpdateDaoAvatar.encode(msg).finish();
    const msgTypeUrl = "/gitopia.gitopia.gitopia.MsgUpdateDaoAvatar";

    const message = submitProposal({
      groupPolicyAddress: groupInfo.admin,
      proposers: [wallet.selectedAddress],
      metadata: "",
      messages: [{ typeUrl: msgTypeUrl, value: msgValue }],
      exec: Exec.EXEC_UNSPECIFIED,
      title: "Update DAO avatar proposal",
      summary: "Update DAO avatar",
    });

    return await handlePostingTransaction(
      apiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const updateDaoDescription = (apiClient, { id, description }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "update location"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      description,
    };
    const message = await env.txClient.msgUpdateDaoDescription(payload);
    return await handlePostingTransaction(
      apiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const updateDaoLocation = (apiClient, { id, location }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "update location"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      location,
    };
    const message = await env.txClient.msgUpdateDaoLocation(payload);
    return await handlePostingTransaction(
      apiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const updateDaoWebsite = (apiClient, { id, website }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "update website"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      url: website,
    };
    const message = await env.txClient.msgUpdateDaoWebsite(payload);
    return await handlePostingTransaction(
      apiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const renameDao = (apiClient, { id, groupId, name }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "update name"
      ))
    )
      return null;
    const { env, wallet } = getState();

    const groupInfo = await dispatch(fetchGroupInfo(apiClient, groupId));

    const msg = MsgRenameDao.fromPartial({
      admin: groupInfo.admin,
      id,
      name,
    });

    const msgValue = MsgRenameDao.encode(msg).finish();
    const msgTypeUrl = "/gitopia.gitopia.gitopia.MsgRenameDao";

    const message = env.txClient.msgSubmitGroupProposal({
      groupPolicyAddress: groupInfo.admin,
      proposers: [wallet.selectedAddress],
      metadata: "",
      messages: [{ typeUrl: msgTypeUrl, value: msgValue }],
      exec: Exec.EXEC_UNSPECIFIED,
      title: "Rename DAO proposal",
      summary: "Change the DAO name",
    });

    return await handlePostingTransaction(
      apiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const fetchGroupInfo = (apiClient, groupId) => {
  return async (dispatch) => {
    try {
      const groupInfo = await getGroupInfo(apiClient, groupId);
      return groupInfo;
    } catch (error) {
      console.error("Error fetching group info:", error);
      dispatch(notify("Failed to fetch group info", "error"));
      return null;
    }
  };
};

export const voteGroupProposal = (apiClient, proposalId, option) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    const VoteOption = (await import("cosmjs-types/cosmos/group/v1/types"))
      .VoteOption;
    let choice;
    if (option === "VOTE_OPTION_YES") {
      choice = VoteOption.VOTE_OPTION_YES;
    }
    if (option === "VOTE_OPTION_NO") {
      choice = VoteOption.VOTE_OPTION_NO;
    }
    if (option === "VOTE_OPTION_ABSTAIN") {
      choice = VoteOption.VOTE_OPTION_ABSTAIN;
    }
    if (option === "VOTE_OPTION_NO_WITH_VETO") {
      choice = VoteOption.VOTE_OPTION_NO_WITH_VETO;
    }
    if (wallet.activeWallet) {
      try {
        await setupTxClients(apiClient, dispatch, getState);
        const { env } = getState();

        const send = {
          proposalId: proposalId,
          voter: wallet.selectedAddress,
          option: choice,
        };
        const message = await env.txClient.msgVoteGroup(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(apiClient)(dispatch, getState);
        if (result && result.code === 0) {
          if (result.code === 0) {
            dispatch(notify("Proposal Vote Submitted", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const isCurrentUserEligibleToUpdate = (members) => {
  return async (dispatch, getState) => {
    let permission = false;
    const { wallet } = getState();
    members?.every((c) => {
      if (wallet.selectedAddress === c.member.address) {
        permission = true;
        return false;
      }
      return true;
    });
    return permission;
  };
};

export const createGroupProposal = (
  apiClient,
  client,
  { groupPolicyAddress, messages, title, summary, proposers, exec }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        client,
        dispatch,
        getState,
        "create proposal"
      ))
    )
      return null;

    const { env } = getState();

    try {
      const message = submitProposal({
        groupPolicyAddress,
        proposers,
        title,
        summary,
        messages,
        exec,
      });

      const result = await sendTransaction({
        txClient: env.txClientCosmos,
        message,
      })(dispatch, getState);

      if (result && result.code === 0) {
        dispatch(notify("Proposal submitted successfully", "info"));
        updateUserBalance(apiClient)(dispatch, getState);
      } else {
        dispatch(notify(result.rawLog, "error"));
      }

      return result;
    } catch (error) {
      console.error("Error submitting proposal:", error);
      dispatch(notify(error.message, "error"));
      return null;
    }
  };
};

export const executeGroupProposal = (apiClient, proposalId) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        dispatch,
        getState,
        "execute proposal"
      ))
    )
      return null;

    const { wallet, env } = getState();

    if (!wallet.activeWallet) {
      dispatch(notify("Wallet connection required", "error"));
      return null;
    }

    try {
      await setupTxClients(apiClient, dispatch, getState);
      console.log("txClient", env.txClient);
      const message = await env.txClient.msgExecGroup({
        proposalId: proposalId,
        executor: wallet.selectedAddress,
      });

      const result = await sendTransaction({ message })(dispatch, getState);

      if (result && result.code === 0) {
        dispatch(notify("Proposal executed successfully", "info"));
        updateUserBalance(apiClient)(dispatch, getState);
      } else {
        dispatch(notify(result.rawLog, "error"));
      }

      return result;
    } catch (error) {
      console.error("Error executing proposal:", error);
      dispatch(notify(error.message, "error"));
      return null;
    }
  };
};
