import { walletActions, envActions, userActions } from "./actionTypes";
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import CryptoJS from "crypto-js";
import { Api } from "../cosmos.bank.v1beta1/module/rest";
import saveAs from "file-saver";
import { queryClient, txClient } from "gitopiajs";
import { getUserDetailsForSelectedAddress } from "./user";

export const signOut = () => {
  return {
    type: walletActions.SIGN_OUT,
  };
};

const postWalletUnlocked = async (accountSigner, dispatch, getState) => {
  const [account] = await accountSigner.getAccounts();
  const { env } = getState();
  dispatch({
    type: walletActions.SET_SELECTED_ADDRESS,
    payload: { address: account.address },
  });
  dispatch({
    type: walletActions.SET_ACCOUNT_SIGNER,
    payload: { accountSigner },
  });

  const [tc, qc, amount] = await Promise.all([
    txClient(accountSigner, { addr: env.rpcNode }),
    queryClient({ addr: env.apiNode }),
    getBalance(process.env.NEXT_PUBLIC_CURRENCY_TOKEN)(dispatch, getState),
  ]);

  dispatch({
    type: envActions.SET_TX_CLIENT,
    payload: {
      client: tc,
    },
  });
  dispatch({
    type: envActions.SET_QUERY_CLIENT,
    payload: {
      client: qc,
    },
  });
  await getUserDetailsForSelectedAddress()(dispatch, getState);
  dispatch({
    type: userActions.INIT_DASHBOARDS,
    payload: {
      name: getState().wallet.activeWallet.name,
      id: account.address,
    },
  });
};

export const reInitClients = async (dispatch, getState) => {
  const { activeWallet } = getState().wallet;
  const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
    activeWallet.mnemonic,
    stringToPath(activeWallet.HDpath + activeWallet.accounts[0].pathIncrement),
    activeWallet.prefix
  );
  await postWalletUnlocked(accountSigner, dispatch, getState);
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
        await postWalletUnlocked(accountSigner, dispatch, getState);
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
      await postWalletUnlocked(accountSigner, dispatch, getState);
    } catch (e) {
      console.error(e);
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
    await dispatch({ type: walletActions.ADD_WALLET, payload: { wallet } });

    try {
      await postWalletUnlocked(accountSigner, dispatch, getState);
    } catch (e) {
      console.error(e);
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
    await dispatch({ type: walletActions.ADD_WALLET, payload: { wallet } });

    try {
      await postWalletUnlocked(accountSigner, dispatch, getState);
    } catch (e) {
      console.error(e);
    }

    dispatch({ type: walletActions.STORE_WALLETS });
  };
};

export const signInWithPrivateKey = ({ prefix = "gitopia", privKey }) => {
  return async (dispatch, getState) => {
    const pKey = keyFromWif(privKey.trim());
    const accountSigner = await DirectSecp256k1Wallet.fromKey(pKey, prefix);

    try {
      await postWalletUnlocked(accountSigner, dispatch);
    } catch (e) {
      console.error(e);
    }
  };
};

export const getBalance = (denom) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
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
