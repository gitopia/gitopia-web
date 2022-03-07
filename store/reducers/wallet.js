import { walletActions } from "../actions/actionTypes";
import { set, get, del } from "../persist";

const initialState = {
  wallets: get("wallets") || [],
  activeWallet: null,
  selectedAddress: null,
  gasPrice: "0.0000025" + process.env.NEXT_PUBLIC_CURRENCY_TOKEN,
  backupState: false,
  loreBalance: 0,
  getPassword: false,
  getPasswordPromise: {},
  unlockingWallet: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case walletActions.SET_ACTIVE_WALLET: {
      const { wallet } = action.payload;
      set("lastWallet", wallet);
      return {
        ...state,
        activeWallet: wallet,
        unlockingWallet: false,
      };
    }

    case walletActions.ADD_WALLET: {
      let { wallet, encryptedWallet } = action.payload;
      let wallets = state.wallets;
      if (wallet.name && encryptedWallet) {
        wallets.push({
          name: wallet.name,
          wallet: encryptedWallet,
        });
        set("lastWallet", wallet);
        return {
          ...state,
          activeWallet: wallet,
          wallets: wallets,
        };
      }
      return state;
    }

    case walletActions.ADD_EXTERNAL_WALLET: {
      let { wallet, isKeplr, isLedger, encryptedWallet } = action.payload;
      let wallets = state.wallets;
      const item = {
        name: wallet.name,
        wallet: encryptedWallet,
      };
      if (isLedger) {
        item.isLedger = true;
      }
      set("lastWallet", wallet);
      wallets.push(item);
      return {
        ...state,
        activeWallet: wallet,
        wallets: wallets,
      };
    }

    case walletActions.REMOVE_WALLET: {
      let { name } = action.payload;
      return {
        ...state,
        wallets: state.wallets.filter((x) => x.name !== name),
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

    // case walletActions.ADD_ACCOUNT: {
    //   let { account } = action.payload;
    //   state.activeWallet.accounts.push(account);
    //   if (state.activeWallet.name && state.activeWallet.password) {
    //     state.wallets[
    //       state.wallets.findIndex((x) => x.name === state.activeWallet.name)
    //     ].wallet = CryptoJS.AES.encrypt(
    //       JSON.stringify(state.activeWallet),
    //       state.activeWallet.password
    //     ).toString();
    //   }
    //   return {
    //     ...state,
    //   };
    // }

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
      state.unlockingWallet = false;
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

    case walletActions.GET_PASSWORD_FOR_UNLOCK_WALLET: {
      const { resolve, reject, usedFor } = action.payload;
      return {
        ...state,
        getPassword: usedFor,
        getPasswordPromise: { resolve, reject },
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
