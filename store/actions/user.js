import { userActions } from "./actionTypes";
import { sendTransaction, setupTxClients } from "./env";
import { updateUserBalance } from "./wallet";
import { notify } from "reapop";

export const createUser = (username) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
      const { env, wallet } = getState();
      const message = await env.txClient.msgCreateUser({
        creator: wallet.selectedAddress,
      });
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      return result;
    } catch (e) {
      dispatch(notify(e.message, "error"));
      console.error(e);
    }
  };
};

export const getUserDetailsForSelectedAddress = () => {
  return async (dispatch, getState) => {
    const { env, wallet } = getState();
    try {
      const result = await env.queryClient.queryUser(wallet.selectedAddress);
      dispatch({
        type: userActions.SET_USER,
        payload: { user: result.data.User },
      });
    } catch (e) {
      dispatch({
        type: userActions.SET_EMPTY_USER,
      });
    }
  };
};

export const setCurrentDashboard = (id) => {
  return async (dispatch, getState) => {
    dispatch({
      type: userActions.SET_CURRENT_DASHBOARD,
      payload: { id },
    });
  };
};

export const updateUserBio = (bio) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
      const { env, wallet } = getState();
      const message = await env.txClient.msgUpdateUserBio({
        creator: wallet.selectedAddress,
        bio: bio,
      });
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      return result;
    } catch (e) {
      dispatch(notify(e.message, "error"));
      console.error(e);
    }
  };
};

export const updateUserAvatar = (avatarUrl) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
      const { env, wallet } = getState();
      const message = await env.txClient.msgUpdateUserAvatar({
        creator: wallet.selectedAddress,
        url: avatarUrl,
      });
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      return result;
    } catch (e) {
      dispatch(notify(e.message, "error"));
      console.error(e);
    }
  };
};
