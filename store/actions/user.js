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
      // if (result.code === 0) {
      // dispatch({
      //   type: walletActions.SET_ACTIVE_WALLET_USERNAME,
      //   payload: { username },
      // });
      // dispatch({ type: walletActions.STORE_WALLETS });
      // }

      console.log(result);
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
      console.log("queryClient", result);
      dispatch({
        type: userActions.SET_USER,
        payload: { user: result.data.User },
      });
    } catch (e) {
      dispatch({
        type: userActions.SET_EMPTY_USER,
      });
      console.log(e);
    }
  };
};
