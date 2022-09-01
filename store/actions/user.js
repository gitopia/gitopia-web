import { userActions, walletActions } from "./actionTypes";
import {
  sendTransaction,
  setupTxClients,
  handlePostingTransaction,
} from "./env";
import { updateUserBalance } from "./wallet";
import { notify } from "reapop";
import dayjs from "dayjs";

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

// export const updateStorageGrant = (allow) => {
//   return async (dispatch, getState) => {
//     await setupTxClients(dispatch, getState);
//     const { env, wallet } = getState();
//     let fn = allow ? env.txClient.msgGrant : env.txClient.msgRevoke;
//     console.log(fn);
//     const msg1 = await fn(
//       wallet.selectedAddress,
//       process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS,
//       "/gitopia.gitopia.gitopia.MsgAddRepositoryBackupRef",
//       dayjs().add(1, "year").unix()
//     );
//     // const msg2 = await fn({
//     //   granter: wallet.selectedAddress,
//     //   grantee: process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS,
//     //   msgTypeUrl: "/gitopia.gitopia.gitopia.MsgUpdateRepositoryBackupRef",
//     // });
//     return await handlePostingTransaction(dispatch, getState, [msg1]);
//   };
// };

export const updateStorageGrant = (allow) => {
  return async (dispatch, getState) => {
    await setupTxClients(dispatch, getState);
    const { wallet, env } = getState();
    let fn = allow ? env.txClient.msgAuthorizeStorageProvider : env.txClient.msgRevokeStorageProviderPermissions;
      const message = await fn({
        creator: wallet.selectedAddress,
        provider: process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS,
      });
    return await handlePostingTransaction(dispatch, getState, message);
  };
};


export const updateGitServerGrant = (allow) => {
  return async (dispatch, getState) => {
    await setupTxClients(dispatch, getState);
    const { wallet, env } = getState();
    let fn = allow ? env.txClient.msgAuthorizeGitServer : env.txClient.msgRevokeGitServerPermissions;
      const message = await fn({
        creator: wallet.selectedAddress,
        provider: process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS,
      });
    return await handlePostingTransaction(dispatch, getState, message);
  };
};