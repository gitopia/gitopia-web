import { walletActions } from "../actions/actionTypes";
import CryptoJS from "crypto-js";
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
  selectedAddress: null,
  gasPrice: "0.0000025" + process.env.NEXT_PUBLIC_CURRENCY_TOKEN,
  backupState: false,
  loreBalance: 0,
  accountSigner: null,
  txClient: null,
  queryClient: null,
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

    case walletActions.SIGN_OUT: {
      state.selectedAddress = null;
      state.activeWallet = null;
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

    case walletActions.SET_ACCOUNT_SIGNER: {
      let { accountSigner } = action.payload;
      return {
        ...state,
        accountSigner,
      };
    }

    default:
      return state;
  }
};

export default reducer;
