import { userActions, walletActions } from "./actionTypes";
import { sendTransaction, setupTxClients } from "./env";
import { updateUserBalance } from "./wallet";
import { notify } from "reapop";

export const createUser = ({ username, name, bio, avatarUrl }) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
      const { env, wallet } = getState();
      const message = await env.txClient.msgCreateUser({
        creator: wallet.selectedAddress,
        username,
        name,
        bio,
        avatarUrl,
      });
      const result = await sendTransaction({ message })(dispatch, getState);
      updateUserBalance()(dispatch, getState);
      if (result && result.code === 0) {
        console.log("User created successfully.. renaming wallet");
        let oldWalletName = wallet.activeWallet.name;
        let newWallet = wallet.activeWallet;
        newWallet.name = username;
        const CryptoJS = (await import("crypto-js")).default;
        const encryptedWallet = CryptoJS.AES.encrypt(
          JSON.stringify(newWallet),
          newWallet.password
        ).toString();
        await dispatch({
          type: walletActions.REMOVE_WALLET,
          payload: {
            name: oldWalletName,
          },
        });
        await dispatch({
          type: walletActions.ADD_WALLET,
          payload: {
            wallet: newWallet,
            encryptedWallet,
          },
        });
        await dispatch({
          type: walletActions.STORE_WALLETS,
        });
        await dispatch({
          type: walletActions.SET_ACTIVE_WALLET,
          payload: { wallet: newWallet },
        });
        await dispatch({
          type: userActions.INIT_DASHBOARDS,
          payload: {
            name: newWallet.name,
            id: newWallet.accounts[0].address,
          },
        });
      }
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

export const updateUserName = (name) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
      const { env, wallet } = getState();
      const message = await env.txClient.msgUpdateUserName({
        creator: wallet.selectedAddress,
        name,
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

export const updateUserUsername = (username) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
      const { env, wallet } = getState();
      const message = await env.txClient.msgUpdateUserUsername({
        creator: wallet.selectedAddress,
        username,
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
