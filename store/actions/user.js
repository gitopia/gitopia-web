import { userActions, walletActions } from "./actionTypes";
import {
  sendTransaction,
  setupTxClients,
  handlePostingTransaction,
  signMessage,
} from "./env";
import { updateUserBalance, refreshCurrentDashboard } from "./wallet";
import { notify } from "reapop";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import getNodeInfo from "../../helpers/getNodeInfo";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { toBase64 } from "@cosmjs/encoding";

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
        let oldWalletName = wallet.activeWallet.name,
          oldWalletIndex = wallet.wallets.findIndex(
            (x) => x.name === wallet.activeWallet.name
          );
        let newWallet = { ...wallet.activeWallet };
        newWallet.name = username;

        if (newWallet.password || newWallet.isLedger) {
          const CryptoJS = (await import("crypto-js")).default;
          const encryptedWallet = CryptoJS.AES.encrypt(
            JSON.stringify(newWallet),
            newWallet.isLedger ? "STRONG_LEDGER" : newWallet.password
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
              index: oldWalletIndex,
              isLedger: newWallet.isLedger,
            },
          });
          await dispatch({
            type: walletActions.STORE_WALLETS,
          });
          await setCurrentDashboard(newWallet.accounts[0].address)(
            dispatch,
            getState
          );
          await refreshCurrentDashboard(dispatch, getState);
        } else if (newWallet.isKeplr) {
          await dispatch({
            type: walletActions.SET_ACTIVE_WALLET,
            payload: {
              wallet: {
                name: username,
                accounts: newWallet.accounts,
                isKeplr: true,
              },
            },
          });
          await setCurrentDashboard(newWallet.accounts[0].address)(
            dispatch,
            getState
          );
          await refreshCurrentDashboard(dispatch, getState);
        }
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
      if (result?.code === 0) {
        const CryptoJS = (await import("crypto-js")).default;
        let newWallet = { ...wallet.activeWallet };
        let oldWalletName = newWallet.name,
          oldWalletIndex = wallet.wallets.findIndex(
            (x) => x.name === newWallet.name
          );
        newWallet.name = username;

        if (newWallet.isKeplr) {
          const info = await getNodeInfo();
          const chainId = info.default_node_info.network;
          const offlineSigner = await window.getOfflineSignerAuto(chainId);
          const accounts = await offlineSigner.getAccounts();
          await dispatch({
            type: walletActions.SET_ACTIVE_WALLET,
            payload: {
              wallet: {
                name: newWallet.name,
                accounts,
                isKeplr: true,
              },
            },
          });
          await getUserDetailsForSelectedAddress()(dispatch, getState);
          const daos = await getUserDaoAll(newWallet.accounts[0].address);
          await dispatch({
            type: userActions.INIT_DASHBOARDS,
            payload: {
              name: newWallet.name,
              id: newWallet.accounts[0].address,
              daos: daos,
            },
          });
        } else {
          let encryptedWallet = CryptoJS.AES.encrypt(
            JSON.stringify(newWallet),
            newWallet.isLedger ? "STRONG_LEDGER" : newWallet.password
          ).toString();

          await dispatch({
            type: walletActions.REMOVE_WALLET,
            payload: { name: oldWalletName },
          });

          await dispatch({
            type: walletActions.ADD_WALLET,
            payload: {
              wallet: newWallet,
              encryptedWallet,
              isLedger: newWallet.isLedger,
              index: oldWalletIndex,
            },
          });
        }

        dispatch({
          type: walletActions.STORE_WALLETS,
        });
        await getUserDetailsForSelectedAddress()(dispatch, getState);
        const daos = await getUserDaoAll(newWallet.accounts[0].address);
        await dispatch({
          type: userActions.INIT_DASHBOARDS,
          payload: {
            name: newWallet.name,
            id: newWallet.accounts[0].address,
            daos: daos,
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

export const updateAddressGrant = (address, permission, allow) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
    } catch (e) {
      console.error(e);
      return null;
    }
    const { wallet, env } = getState();
    let fn = allow
      ? env.txClient.msgAuthorizeProvider
      : env.txClient.msgRevokeProviderPermission;
    let provider =
      permission === 1
        ? process.env.NEXT_PUBLIC_STORAGE_BRIDGE_WALLET_ADDRESS
        : process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS;
    const message = await fn({
      creator: wallet.selectedAddress,
      granter: address,
      provider,
      permission,
    });
    return await handlePostingTransaction(dispatch, getState, message);
  };
};

export const signUploadFileMessage = (name, size, md5) => {
  return async (dispatch, getState) => {
    const data = {
      // Any arbitrary object
      name,
      size,
      md5,
    };
    try {
      let s = await signMessage({ data })(dispatch, getState);
      let raw = TxRaw.encode(s).finish();
      let msg = toBase64(raw);
      return msg;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }
  };
};

if (typeof window !== "undefined") {
  window.toBase64 = toBase64;
}

export const calculateGithubRewards = (rewardToken) => {
  return async (dispatch, getState) => {
    const data = {
      // Any arbitrary object
      rewardToken,
    };
    try {
      let s = await signMessage({ data })(dispatch, getState);
      let raw = TxRaw.encode(s).finish();
      let msg = toBase64(raw);
      return msg;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }
  };
};
