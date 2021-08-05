import { walletActions } from "../actions/actionTypes";
import {
  DirectSecp256k1HdWallet,
  DirectSecp256k1Wallet,
} from "@cosmjs/proto-signing";

// import { assertIsBroadcastTxSuccess } from '@cosmjs/stargate'
import { stringToPath } from "@cosmjs/crypto";
import CryptoJS from "crypto-js";
// import { keyFromWif, keyToWif } from '../../../helpers/keys'
const isServer = typeof window === "undefined";

const set = (key, value) => {
  if (isServer) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

const get = (key) => {
  if (isServer) return;
  try {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

const del = (key) => {
  if (isServer) return;
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

const initialState = {
  wallets: get("wallets") || [],
  activeWallet: null,
  activeClient: null,
  selectedAddress: null,
  authorized: false,
  gasPrice: "0.0000025token",
  backupState: false,
  loreBalance: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case walletActions.SET_ACTIVE_WALLET: {
      const { wallet } = action.payload;
      set("lastWallet", wallet);
      return {
        ...state,
        activeWallet: wallet,
      };
    }

    case walletActions.SET_ACTIVE_CLIENT: {
      const { client } = action.payload;
      return {
        ...state,
        activeClient: client,
      };
    }

    case walletActions.ADD_WALLET: {
      let { wallet } = action.payload;
      let wallets = state.wallets;
      set("lastWallet", wallet);
      if (wallet.name && wallet.password) {
        wallets.push({
          name: wallet.name,
          wallet: CryptoJS.AES.encrypt(
            JSON.stringify(wallet),
            wallet.password
          ).toString(),
        });
      }
      return {
        ...state,
        activeWallet: wallet,
        wallets: wallets,
      };
    }

    case walletActions.PATH_INCREMENT: {
      let activeWallet = state.activeWallet;
      activeWallet.pathIncrement += 1;
      return {
        ...state,
        activeWallet,
      };
    }

    case walletActions.ADD_ACCOUNT: {
      let { account } = action.payload;
      state.activeWallet.accounts.push(account);
      if (state.activeWallet.name && state.activeWallet.password) {
        state.wallets[
          state.wallets.findIndex((x) => x.name === state.activeWallet.name)
        ].wallet = CryptoJS.AES.encrypt(
          JSON.stringify(state.activeWallet),
          state.activeWallet.password
        ).toString();
      }
      return {
        ...state,
      };
    }

    case walletActions.SET_SELECTED_ADDRESS: {
      let { address } = action.payload;
      return {
        ...state,
        selectedAddress: address,
      };
    }

    case walletActions.STORE_WALLETS: {
      set("wallets", state.wallets);
      return {
        ...state,
        backupState: false,
      };
    }

    case walletActions.SET_BACKUP_STATE: {
      let { backupState } = action.payload;
      return {
        ...state,
        backupState,
      };
    }

    case walletActions.ADD_MESSAGE_TYPE: {
      let { typeUrl, type } = action.payload;
      state.activeClient.registry.register(typeUrl, type);
      return {
        ...state,
      };
    }

    case walletActions.SIGN_OUT: {
      state.selectedAddress = null;
      state.activeClient = null;
      state.activeWallet = null;
      state.authorized = false;
      del("lastWallet");
      return {
        ...state,
      };
    }

    case walletActions.UPDATE_BALANCE: {
      let { balance } = action.payload;
      return {
        ...state,
        loreBalance: balance,
      };
    }

    case walletActions.SET_ACTIVE_WALLET_USERNAME: {
      let { username } = action.payload;
      let activeWallet = { ...state.activeWallet };
      activeWallet.username = username;
      if (activeWallet.name && activeWallet.password) {
        state.wallets[
          state.wallets.findIndex((x) => x.name === activeWallet.name)
        ].wallet = CryptoJS.AES.encrypt(
          JSON.stringify(activeWallet),
          activeWallet.password
        ).toString();
      }
      return {
        ...state,
        activeWallet,
      };
    }

    default:
      return state;
  }
};

export default reducer;
