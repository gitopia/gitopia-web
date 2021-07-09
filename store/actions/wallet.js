import { walletActions, envActions } from "./actionTypes";
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";

import { assertIsBroadcastTxSuccess } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import CryptoJS from "crypto-js";
import { Api } from "../cosmos.bank.v1beta1/module/rest";
import { txClient } from "gitopiajs";
import saveAs from "file-saver";
// import { keyFromWif, keyToWif } from '../../../helpers/keys'

// export const setActiveWallet = (dispatch, wallet) => {
//   return
// };

export const signOut = () => {
  return {
    type: walletActions.SIGN_OUT,
  };
};

export const unlockWallet = ({ name, password }) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const encryptedWallet =
      state.wallets[state.wallets.findIndex((x) => x.name === name)].wallet;
    let wallet;
    try {
      wallet = JSON.parse(
        CryptoJS.AES.decrypt(encryptedWallet, password).toString(
          CryptoJS.enc.Utf8
        )
      );
    } catch (e) {
      console.error(e);
      return false;
    }
    dispatch({ type: walletActions.SET_ACTIVE_WALLET, payload: { wallet } });
    if (wallet.accounts.length > 0) {
      const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
        wallet.mnemonic,
        stringToPath(wallet.HDpath + wallet.accounts[0].pathIncrement),
        wallet.prefix
      );
      try {
        await dispatch({
          type: envActions.SIGN_IN,
          payload: { accountSigner, root: true },
        });
        let client = getState().env.signingClient;
        dispatch({
          type: walletActions.SET_ACTIVE_CLIENT,
          payload: { client },
        });
        const [account] = await accountSigner.getAccounts();
        dispatch({
          type: walletActions.SET_SELECTED_ADDRESS,
          payload: { address: account.address },
        });
        await getBalance("token")(dispatch, getState);
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  };
};

export const switchAccount = (address) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const accountIndex = state.activeWallet.accounts.findIndex(
      (acc) => acc.address == address
    );
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(
        state.activeWallet.HDpath +
          state.activeWallet.accounts[accountIndex].pathIncrement
      ),
      state.activeWallet.prefix
    );

    try {
      await dispatch({
        type: envActions.SIGN_IN,
        payload: { accountSigner, root: true },
      });
      let client = getState().env.signingClient;
      dispatch({ type: walletActions.SET_ACTIVE_CLIENT, payload: { client } });
      const [account] = await accountSigner.getAccounts();
      dispatch({
        type: walletActions.SET_SELECTED_ADDRESS,
        payload: { address: account.address },
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const addAccount = (pathIncrement) => {
  return async (dispatch, getState) => {
    const { activeWallet } = getState();
    if (!pathIncrement) {
      pathIncrement = activeWallet.pathIncrement + 1;
      dispatch({ type: walletActions.PATH_INCREMENT });
    }
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      activeWallet.mnemonic,
      stringToPath(activeWallet.HDpath + pathIncrement),
      activeWallet.prefix
    );
    const [acc] = await accountSigner.getAccounts();
    const account = {
      address: acc.address,
      pathIncrement: parseInt(pathIncrement),
    };
    if (
      activeWallet.accounts.findIndex(
        (acc) => acc.address == account.address
      ) == -1
    ) {
      dipatch({ type: walletActions.ADD_ACCOUNT, payload: { account } });
      dispatch({ type: walletActions.STORE_WALLETS });
    } else {
      throw "Account already in store.";
    }
  };
};

export const createWalletWithMnemonic = ({
  name = null,
  mnemonic,
  HDpath = "m/44'/118'/0'/0",
  prefix = "gitopia",
  password = null,
}) => {
  return async (dispatch, getState) => {
    const wallet = {
      name,
      mnemonic,
      HDpath,
      password,
      prefix,
      pathIncrement: 0,
      accounts: [],
    };
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
      stringToPath(HDpath + "0"),
      prefix
    );
    const [firstAccount] = await accountSigner.getAccounts();
    const account = { address: firstAccount.address, pathIncrement: 0 };
    wallet.accounts.push(account);
    dispatch({ type: walletActions.ADD_WALLET, payload: { wallet } });

    try {
      await dispatch({
        type: envActions.SIGN_IN,
        payload: { accountSigner, root: true },
      });
      let client = getState().env.signingClient;
      dispatch({ type: walletActions.SET_ACTIVE_CLIENT, payload: { client } });
      const [account] = await accountSigner.getAccounts();
      dispatch({
        type: walletActions.SET_SELECTED_ADDRESS,
        payload: { address: firstAccount.address },
      });
    } catch (e) {
      console.log(e);
    }
    dispatch({ type: walletActions.STORE_WALLETS });
  };
};

export const restoreWallet = ({ encrypted, password }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const wallet = JSON.parse(
      CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8)
    );
    let newName = wallet.name;
    let incr = 1;
    while (state.wallets.findIndex((x) => x.name == newName) != -1) {
      newName = wallet.name + "_" + incr;
      incr++;
    }
    wallet.name = newName;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      wallet.mnemonic,
      stringToPath(wallet.HDpath + "0"),
      wallet.prefix
    );
    const [firstAccount] = await accountSigner.getAccounts();
    // commit('ADD_WALLET', wallet)
    dispatch({ type: walletActions.ADD_WALLET, payload: { wallet } });

    // TODO fix dispatches below
    try {
      await dispatch({
        type: envActions.SIGN_IN,
        payload: { accountSigner, root: true },
      });
      let client = getState().env.signingClient;
      dispatch({ type: walletActions.SET_ACTIVE_CLIENT, payload: { client } });
      const [account] = await accountSigner.getAccounts();
      dispatch({
        type: walletActions.SET_SELECTED_ADDRESS,
        payload: { address: firstAccount.address },
      });
    } catch (e) {
      console.log(e);
    }

    dispatch({ type: walletActions.STORE_WALLETS });
  };
};

export const signInWithPrivateKey = ({ prefix = "gitopia", privKey }) => {
  return async (dispatch, getState) => {
    const state = getState();
    const pKey = keyFromWif(privKey.trim());
    const accountSigner = await DirectSecp256k1Wallet.fromKey(pKey, prefix);
    const [firstAccount] = await accountSigner.getAccounts();

    try {
      await dispatch({
        type: envActions.SIGN_IN,
        payload: { accountSigner, root: true },
      });
      let client = getState().env.signingClient;
      dispatch({ type: walletActions.SET_ACTIVE_CLIENT, payload: { client } });
      const [account] = await accountSigner.getAccounts();
      dispatch({
        type: walletActions.SET_SELECTED_ADDRESS,
        payload: { address: firstAccount.address },
      });
    } catch (e) {
      console.log(e);
    }
  };
};

export const sendTransaction = ({ message, memo, denom }) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const fee = {
      amount: [{ amount: "0", denom }],
      gas: "200000",
    };
    try {
      console.log({
        add: state.selectedAddress,
        msg: [message],
        fee,
        memo,
      });
      const result = await state.activeClient.signAndBroadcast(
        state.selectedAddress,
        [message],
        fee,
        memo
      );
      assertIsBroadcastTxSuccess(result);
    } catch (e) {
      console.log(e);
      throw "Failed to broadcast transaction." + e;
    }
  };
};

export const getBalance = (denom) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const api = new Api({ baseUrl: "http://localhost:1317" });
    try {
      const res = await api.queryBalance(state.selectedAddress, denom);
      dispatch({
        type: walletActions.UPDATE_BALANCE,
        payload: {
          balance: res.data.balance.amount,
        },
      });
    } catch (e) {
      dispatch({
        type: walletActions.UPDATE_BALANCE,
        payload: {
          balance: 0,
        },
      });
      console.error("Unable to update lore balance", e);
    }
  };
};

export const claimUsername = (username) => {
  return async (dispatch, getState) => {
    console.log("claimUsername", username);
    const state = getState().wallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(
        state.activeWallet.HDpath + state.activeWallet.accounts[0].pathIncrement
      ),
      state.activeWallet.prefix
    );
    let tc = await txClient(accountSigner, {
      addr: "http://localhost:26657",
    });
    try {
      const msg = await tc.msgCreateUser({
        username: username,
        creator: state.selectedAddress,
      });
      const result = await tc.signAndBroadcast([msg], {
        fee: { amount: [], gas: "200000" },
        memo: "",
      });
      console.log(result);
      if (result.code === 0) {
        dispatch({
          type: walletActions.SET_ACTIVE_WALLET_USERNAME,
          payload: { username },
        });
        dispatch({ type: walletActions.STORE_WALLETS });
      }
    } catch (e) {
      console.error(e);
    }
  };
};

export const downloadWalletForRemoteHelper = () => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    if (state.activeWallet) {
      const backup = JSON.stringify(state.activeWallet);
      const blob = new Blob([backup.toString()], {
        type: "application/json; charset=utf-8",
      });
      saveAs(blob, state.activeWallet.name + ".json");
    }
  };
};
