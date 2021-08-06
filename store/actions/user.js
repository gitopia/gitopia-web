import { sendTransaction } from "./env";

export const createUser = (username) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    try {
      const message = await tc.msgCreateUser({
        username: username,
        creator: state.selectedAddress,
      });
      const result = await sendTransaction({ message });
      // if (result.code === 0) {
      // dispatch({
      //   type: walletActions.SET_ACTIVE_WALLET_USERNAME,
      //   payload: { username },
      // });
      // dispatch({ type: walletActions.STORE_WALLETS });
      // }
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  };
};
