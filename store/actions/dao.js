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
import { MsgRenameDao } from "@gitopia/gitopia-js/dist/types/gitopia/tx";

export const createDao = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    name = null,
    description = null,
    avatarUrl = null,
    location = null,
    website = null,
    votingPeriod = "2",
    percentage = "50",
    members = [],
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
        "dao"
      ))
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
    };

    try {
      const message = await env.txClient.msgCreateDao(dao);
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
        await getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
        const daos = await getUserDaoAll(apiClient, wallet.selectedAddress);
        dispatch({
          type: userActions.INIT_DASHBOARDS,
          payload: {
            name: wallet.activeWallet.name,
            id: wallet.selectedAddress,
            daos: daos,
          },
        });
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        let newDaoAddress;
        daos.every((d) => {
          if (d.name === name) {
            newDaoAddress = d.address;
            return false;
          }
          return true;
        });
        setCurrentDashboard(newDaoAddress)(dispatch, getState);
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

export const getDaoDetailsForDashboard = (apiClient, cosmosGroupApiClient) => {
  return async (dispatch, getState) => {
    const { user } = getState();
    try {
      const daoRes = await apiClient.queryDao(user.currentDashboard);
      let dao = daoRes.data.dao;
      const members = await getGroupMembers(cosmosGroupApiClient, dao.group_id);
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

export const updateDaoAvatar = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { id, url }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "update avatar"
      ))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      url,
    };
    const message = await env.txClient.msgUpdateDaoAvatar(payload);
    return await handlePostingTransaction(
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const updateDaoDescription = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { id, description }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
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
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const updateDaoLocation = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { id, location }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
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
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const updateDaoWebsite = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { id, website }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
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
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const renameDao = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  cosmosGroupApiClient,
  { id, groupId, name }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "update name"
      ))
    )
      return null;
    const { env, wallet } = getState();

    const groupInfo = await dispatch(
      fetchGroupInfo(cosmosGroupApiClient, groupId)
    );

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
      exec: Exec.EXEC_TRY,
      title: "Rename DAO proposal", // TODO: Use actual title
      summary: "Change the DAO name", // TODO: Use actual summary
    });

    return await handlePostingTransaction(
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState,
      message
    );
  };
};

export const fetchGroupInfo = (cosmosGroupApiClient, groupId) => {
  return async (dispatch) => {
    try {
      const groupInfo = await getGroupInfo(cosmosGroupApiClient, groupId);
      return groupInfo;
    } catch (error) {
      console.error("Error fetching group info:", error);
      dispatch(notify("Failed to fetch group info", "error"));
      return null;
    }
  };
};

export const updateGroupMembers = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  cosmosGroupApiClient,
  { groupId, memberUpdates }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "update group members"
      ))
    )
      return null;

    const { env, wallet } = getState();

    try {
      const groupInfo = await dispatch(
        fetchGroupInfo(cosmosGroupApiClient, groupId)
      );
      if (!groupInfo) {
        throw new Error("Failed to fetch group info");
      }

      const msg = MsgUpdateGroupMembers.fromPartial({
        admin: groupInfo.admin,
        groupId: groupId,
        memberUpdates: memberUpdates.map((member) => ({
          address: member.address,
          weight: member.weight,
          metadata: "",
        })),
      });

      const msgValue = MsgUpdateGroupMembers.encode(msg).finish();
      const msgTypeUrl = "/cosmos.group.v1.MsgUpdateGroupMembers";

      const message = env.txClient.msgSubmitGroupProposal({
        groupPolicyAddress: groupInfo.admin,
        proposers: [wallet.selectedAddress],
        metadata: "",
        messages: [{ typeUrl: msgTypeUrl, value: msgValue }],
        exec: Exec.EXEC_TRY,
        title: "test proposal", // TODO: Use actual title
        summary: "summary", // TODO: Use actual summary
      });

      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
        dispatch,
        getState
      );

      if (result && result.code === 0) {
        dispatch(notify("Group members updated successfully", "success"));
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

export const voteGroupProposal = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  proposalId,
  option
) => {
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
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState
        );
        const { env } = getState();
        const longify = (
          await import("@cosmjs/stargate/build/queryclient/utils")
        ).longify;
        const send = {
          proposalId: longify(proposalId),
          voter: wallet.selectedAddress,
          option: choice,
        };
        const message = await env.txClient.msgVoteGroup(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { groupPolicyAddress, messages, title, summary, proposers, exec }
) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        dispatch,
        getState,
        "create proposal"
      ))
    )
      return null;

    const { env } = getState();

    try {
      const message = await env.txClient.msgSubmitGroupProposal({
        groupPolicyAddress,
        proposers,
        title,
        summary,
        messages,
        exec,
      });

      const result = await sendTransaction({ message })(dispatch, getState);

      if (result && result.code === 0) {
        dispatch(notify("Proposal submitted successfully", "success"));
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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
