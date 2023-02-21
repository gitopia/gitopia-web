import { notify } from "reapop";
import { sendTransaction, handlePostingTransaction } from "./env";
import { getUserDetailsForSelectedAddress, setCurrentDashboard } from "./user";
import { userActions, daoActions } from "./actionTypes";
import { validatePostingEligibility } from "./repository";
import { updateUserBalance } from "./wallet";
import { MemberRole } from "@gitopia/gitopia-js/dist/types/gitopia/member";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import getDaoMember from "../../helpers/getUserDaoMember";

export const createDao = ({
  name = null,
  description = null,
  avatarUrl = null,
  location = null,
  website = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "dao")))
      return null;

    const { wallet, env } = getState();
    const dao = {
      creator: wallet.selectedAddress,
      name,
      description,
      avatarUrl,
      location,
      website,
    };

    try {
      const message = await env.txClient.msgCreateDao(dao);
      const result = await sendTransaction({ message })(dispatch, getState);
      if (result && result.code === 0) {
        await getUserDetailsForSelectedAddress()(dispatch, getState);
        const daos = await getUserDaoAll(wallet.selectedAddress);
        dispatch({
          type: userActions.INIT_DASHBOARDS,
          payload: {
            name: wallet.activeWallet.name,
            id: wallet.selectedAddress,
            daos: daos,
          },
        });
        updateUserBalance()(dispatch, getState);
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

export const getDaoDetailsForDashboard = () => {
  return async (dispatch, getState) => {
    const { env, user } = getState();
    try {
      const [daoRes, members] = await Promise.all([
        env.queryClient.queryDao(user.currentDashboard),
        getDaoMember(user.currentDashboard),
      ]);
      let dao = daoRes.data.dao;
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

export const addMember = ({ daoId = null, userId = null, role = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
      return null;
    const { env, wallet } = getState();
    let choice;
    if (role === "MEMBER") {
      choice = MemberRole.MEMBER;
    }
    if (role === "OWNER") {
      choice = MemberRole.OWNER;
    }
    const collaborator = {
      creator: wallet.selectedAddress,
      daoId: daoId,
      userId: userId,
      role: choice,
    };

    try {
      const message = await env.txClient.msgAddMember(collaborator);
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

export const updateMemberRole = ({
  daoId = null,
  userId = null,
  role = null,
}) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
      return null;
    const { env, wallet } = getState();
    let choice;
    if (role === "MEMBER") {
      choice = MemberRole.MEMBER;
    }
    if (role === "OWNER") {
      choice = MemberRole.OWNER;
    }
    const collaborator = {
      creator: wallet.selectedAddress,
      daoId: daoId,
      userId: userId,
      role: choice,
    };

    try {
      const message = await env.txClient.msgUpdateMemberRole(collaborator);
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

export const removeMember = ({ daoId = null, userId = null }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "collaborator")))
      return null;
    const { env, wallet } = getState();
    const collaborator = {
      creator: wallet.selectedAddress,
      daoId: daoId,
      userId: userId,
    };

    try {
      const message = await env.txClient.msgRemoveMember(collaborator);
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

export const updateDaoAvatar = ({ id, url }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(dispatch, getState, "update avatar"))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      url,
    };
    const message = await env.txClient.msgUpdateDaoAvatar(payload);
    return await handlePostingTransaction(dispatch, getState, message);
  };
};

export const updateDaoDescription = ({ id, description }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(dispatch, getState, "update location"))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      description,
    };
    const message = await env.txClient.msgUpdateDaoDescription(payload);
    return await handlePostingTransaction(dispatch, getState, message);
  };
};

export const updateDaoLocation = ({ id, location }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(dispatch, getState, "update location"))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      location,
    };
    const message = await env.txClient.msgUpdateDaoLocation(payload);
    return await handlePostingTransaction(dispatch, getState, message);
  };
};

export const updateDaoWebsite = ({ id, website }) => {
  return async (dispatch, getState) => {
    if (
      !(await validatePostingEligibility(dispatch, getState, "update website"))
    )
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      url: website,
    };
    const message = await env.txClient.msgUpdateDaoWebsite(payload);
    return await handlePostingTransaction(dispatch, getState, message);
  };
};

export const renameDao = ({ id, name }) => {
  return async (dispatch, getState) => {
    if (!(await validatePostingEligibility(dispatch, getState, "update name")))
      return null;
    const { env, wallet } = getState();
    const payload = {
      creator: wallet.selectedAddress,
      id,
      name,
    };
    const message = await env.txClient.msgRenameDao(payload);
    return await handlePostingTransaction(dispatch, getState, message);
  };
};

export const isCurrentUserEligibleToUpdate = (members) => {
  return async (dispatch, getState) => {
    let permission = false;
    const { wallet } = getState();
    members.every((c) => {
      if (wallet.selectedAddress === c.address && c.role === "OWNER") {
        permission = true;
        return false;
      }
      return true;
    });
    return permission;
  };
};
