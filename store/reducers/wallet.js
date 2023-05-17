import { walletActions } from "../actions/actionTypes";
import { set, get, del } from "../persist";
import omit from "lodash/omit";

const initialState = {
  wallets: get("wallets") || [],
  activeWallet: null,
  selectedAddress: null,
  gasPrice: process.env.NEXT_PUBLIC_GAS_PRICE,
  backupState: get("backupState") || false,
  balance: 0,
  allowance: 0,
  getPassword: false,
  getPasswordPromise: {},
  unlockingWallet: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case walletActions.SET_ACTIVE_WALLET: {
      const { wallet } = action.payload;
      set("lastWallet", omit(wallet, ["mnemonic", "password"]));
      return {
        ...state,
        activeWallet: wallet,
        unlockingWallet: false,
      };
    }

    case walletActions.ADD_WALLET: {
      let { wallet, isLedger, encryptedWallet, index, avatarUrl } =
        action.payload;
      let wallets = state.wallets;
      const item = {
        name: wallet.name,
        address: wallet.accounts[0].address,
        avatarUrl,
        wallet: encryptedWallet,
      };
      if (isLedger) {
        item.isLedger = true;
      }
      if (index >= 0 && index <= wallets.length) {
        wallets.splice(index, 0, item);
      } else {
        wallets.push(item);
      }
      set("lastWallet", omit(wallet, ["mnemonic", "password"]));
      set("wallets", wallets);
      set("backupState", false);
      return {
        ...state,
        activeWallet: wallet,
        wallets: wallets,
        backupState: false,
      };
    }

    case walletActions.REMOVE_WALLET: {
      let { name } = action.payload;
      const updatedWallets = state.wallets.filter((x) => x.name !== name);
      set("wallets", updatedWallets);
      return {
        ...state,
        wallets: updatedWallets,
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

    case walletActions.SET_SELECTED_ADDRESS: {
      let { address } = action.payload;
      return {
        ...state,
        selectedAddress: address,
      };
    }

    case walletActions.STORE_WALLETS: {
      set("wallets", state.wallets);
      set("backupState", false);
      return {
        ...state,
        backupState: false,
      };
    }

    case walletActions.SET_BACKUP_STATE: {
      let { backupState } = action.payload;
      set("backupState", backupState);
      return {
        ...state,
        backupState,
      };
    }

    case walletActions.SIGN_OUT: {
      state.selectedAddress = null;
      state.activeWallet = null;
      state.unlockingWallet = false;
      state.balance = 0;
      del("lastWallet");
      return {
        ...state,
      };
    }

    case walletActions.UPDATE_BALANCE: {
      let { balance } = action.payload;
      return {
        ...state,
        balance: balance,
      };
    }

    case walletActions.UPDATE_ALLOWANCE: {
      let { allowance } = action.payload;
      return {
        ...state,
        allowance,
      };
    }

    case walletActions.GET_PASSWORD_FOR_UNLOCK_WALLET: {
      const { resolve, reject, usedFor, chainId } = action.payload;
      return {
        ...state,
        getPassword: usedFor,
        getPasswordPromise: { resolve, reject, chainId },
      };
    }

    case walletActions.RESET_PASSWORD_FOR_UNLOCK_WALLET: {
      return {
        ...state,
        getPassword: false,
        getPasswordPromise: {},
      };
    }

    case walletActions.START_UNLOCKING_WALLET: {
      return {
        ...state,
        unlockingWallet: true,
      };
    }

    case walletActions.STOP_UNLOCKING_WALLET: {
      return {
        ...state,
        unlockingWallet: false,
      };
    }

    default:
      return state;
  }
};

export default reducer;
