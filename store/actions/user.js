import { userActions } from "./actionTypes";
import { sendTransaction } from "./env";

export const createUser = (username) => {
  return async (dispatch, getState) => {
    const { env, wallet } = getState();
    try {
      const message = await env.txClient.msgCreateUser({
        username: username,
        creator: wallet.selectedAddress,
      });
      const result = await sendTransaction({ message }, env);
      return result;
    } catch (e) {
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
