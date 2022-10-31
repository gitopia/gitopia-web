import {
  walletActions,
  envActions,
  userActions,
  daoActions,
} from "./actionTypes";
import { Api } from "../cosmos.bank.v1beta1/module/rest";
import { getUserDetailsForSelectedAddress, setCurrentDashboard } from "./user";
import find from "lodash/find";
import { notify } from "reapop";
import { setupTxClients } from "./env";
import getNodeInfo from "../../helpers/getNodeInfo";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import getUser from "../../helpers/getUser";

let ledgerTransport;

const postWalletUnlocked = async (accountSigner, dispatch, getState) => {
  const { env, wallet } = getState();

  dispatch({
    type: walletActions.SET_SELECTED_ADDRESS,
    payload: { address: wallet.activeWallet.accounts[0].address },
  });

  if (accountSigner) {
    const { queryClient, txClient } = await import("@gitopia/gitopia-js");

    const [tc, qc, amount] = await Promise.all([
      txClient(accountSigner, { addr: env.rpcNode, gasPrice: wallet.gasPrice }),
      queryClient({ addr: env.apiNode }),
      updateUserBalance()(dispatch, getState),
    ]);

    dispatch({
      type: envActions.SET_CLIENTS,
      payload: {
        txClient: tc,
        queryClient: qc,
      },
    });
    if (wallet.getPasswordPromise.resolve) {
      wallet.getPasswordPromise.resolve("Unlock success");
    }
  } else {
    const { Api } = await import("@gitopia/gitopia-js/rest");

    updateUserBalance()(dispatch, getState);
    dispatch({
      type: envActions.SET_CLIENTS,
      payload: {
        txClient: null,
        queryClient: new Api({ baseUrl: env.apiNode }),
      },
    });
  }

  await getUserDetailsForSelectedAddress()(dispatch, getState);
  const daos = await getUserDaoAll(wallet.activeWallet.accounts[0].address);
  await dispatch({
    type: userActions.INIT_DASHBOARDS,
    payload: {
      name: wallet.activeWallet.name,
      id: wallet.activeWallet.accounts[0].address,
      daos: daos,
    },
  });
  const { user } = getState();
  const dashboard = find(
    user.dashboards,
    (d) => d.id === user.currentDashboard
  );
  if (!dashboard) {
    await setCurrentDashboard(wallet.activeWallet.accounts[0].address)(
      dispatch,
      getState
    );
  }
};

export const signOut = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: walletActions.SIGN_OUT,
    });
    dispatch({
      type: userActions.SET_EMPTY_USER,
    });
    dispatch({
      type: daoActions.SET_EMPTY_DAO,
    });
  };
};

export const unlockKeplrWallet = () => {
  return async (dispatch, getState) => {
    if (window.keplr && window.getOfflineSigner) {
      try {
        const info = await getNodeInfo();
        const chainId = info.default_node_info.network;
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        const accounts = await offlineSigner.getAccounts();
        const key = await window.keplr.getKey(chainId);
        let name = await getUser(accounts[0].address);
        await dispatch({
          type: walletActions.SET_ACTIVE_WALLET,
          payload: {
            wallet: {
              name: name ? name.username : key.name,
              accounts,
              isKeplr: true,
            },
          },
        });
        await postWalletUnlocked(offlineSigner, dispatch, getState);
        return accounts[0];
      } catch (e) {
        console.error(e);
        return null;
      }
    } else {
      dispatch(notify("Please ensure keplr extension is installed", "error"));
    }
  };
};

export const setWallet = ({ wallet }) => {
  return async (dispatch, getState) => {
    dispatch({
      type: walletActions.SET_ACTIVE_WALLET,
      payload: {
        wallet: {
          name: wallet.name,
          accounts: wallet.accounts,
          isLedger: wallet.isLedger,
        },
      },
    });
    if (wallet.accounts.length > 0) {
      try {
        await postWalletUnlocked(null, dispatch, getState);
      } catch (e) {
        console.error(e);
      }
    }
  };
};

export const unlockWallet = ({ name, password }) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const encryptedWallet =
      state.wallets[state.wallets.findIndex((x) => x.name === name)].wallet;
    let wallet;
    try {
      const CryptoJS = (await import("crypto-js")).default;
      wallet = JSON.parse(
        CryptoJS.AES.decrypt(encryptedWallet, password).toString(
          CryptoJS.enc.Utf8
        )
      );
    } catch (e) {
      console.error(e);
      return false;
    }
    if (wallet.name.includes("untitled-wallet") || !wallet.isUsernameSetup) {
      dispatch({
        type: walletActions.SET_ACTIVE_WALLET,
        payload: { wallet },
      });
    } else {
      dispatch({
        type: walletActions.SET_ACTIVE_WALLET,
        payload: { wallet: { name: wallet.name, accounts: wallet.accounts } },
      });
    }
    if (wallet.accounts.length > 0) {
      const DirectSecp256k1HdWallet = (await import("@cosmjs/proto-signing"))
        .DirectSecp256k1HdWallet;
      const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
        wallet.mnemonic,
        {
          prefix: "gitopia",
        }
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

export const removeWallet = ({ name }) => {
  return async (dispatch, getState) => {
    dispatch({ type: walletActions.REMOVE_WALLET, payload: { name } });
    dispatch({ type: walletActions.STORE_WALLETS });
    return true;
  };
};

export const createWalletWithMnemonic = ({
  name = null,
  mnemonic,
  HDpath = "m/44'/118'/0'/0/",
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
    const DirectSecp256k1HdWallet = (await import("@cosmjs/proto-signing"))
      .DirectSecp256k1HdWallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: prefix,
    });
    const [firstAccount] = await accountSigner.getAccounts();
    const account = { address: firstAccount.address, pathIncrement: 0 };
    const user = await getUser(firstAccount.address);
    if (user?.username) {
      wallet.name = user.username;
    }
    wallet.accounts.push(account);

    const CryptoJS = (await import("crypto-js")).default;
    const encryptedWallet = CryptoJS.AES.encrypt(
      JSON.stringify(wallet),
      password
    ).toString();

    await dispatch({
      type: walletActions.REMOVE_WALLET,
      payload: { name: wallet.name },
    });

    await dispatch({
      type: walletActions.ADD_WALLET,
      payload: { wallet, encryptedWallet },
    });

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
    const CryptoJS = (await import("crypto-js")).default;
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
    const DirectSecp256k1HdWallet = (await import("@cosmjs/proto-signing"))
      .DirectSecp256k1HdWallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      wallet.mnemonic,
      {
        prefix: wallet.prefix,
      }
    );

    const encryptedWallet = CryptoJS.AES.encrypt(
      JSON.stringify(wallet),
      password
    ).toString();

    await dispatch({
      type: walletActions.ADD_WALLET,
      payload: { wallet, encryptedWallet },
    });

    try {
      await postWalletUnlocked(accountSigner, dispatch, getState);
    } catch (e) {
      console.error(e);
    }

    dispatch({ type: walletActions.STORE_WALLETS });
  };
};

export const updateUserBalance = (showNotification = false) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
    try {
      const res = await api.queryBalance(
        state.selectedAddress,
        process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
      );
      dispatch({
        type: walletActions.UPDATE_BALANCE,
        payload: {
          balance: res.data.balance.amount,
        },
      });
      if (showNotification) {
        dispatch(notify("Balance updated", "info"));
      }
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

export const getBalance = (address) => {
  return async (dispatch, getState) => {
    const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
    try {
      const res = await api.queryBalance(
        address,
        process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
      );
      if (res && res.ok) return res.data.balance.amount;
      else console.error(res.error);
    } catch (e) {
      console.error("Unable to get balance", e);
    }
  };
};

export const downloadWalletForRemoteHelper = () => {
  return async (dispatch, getState) => {
    const state = getState().wallet;

    if (state.activeWallet) {
      dispatch({
        type: walletActions.GET_PASSWORD_FOR_UNLOCK_WALLET,
        payload: {
          usedFor: "Download",
          resolve: (action) => {
            dispatch({
              type: walletActions.RESET_PASSWORD_FOR_UNLOCK_WALLET,
            });
            dispatch(notify(action, "info"));
          },
          reject: (reason) => {
            dispatch({
              type: walletActions.RESET_PASSWORD_FOR_UNLOCK_WALLET,
            });
            dispatch(notify(reason, "error"));
          },
        },
      });
    }
  };
};

export const downloadWallet = (password) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    if (state.activeWallet) {
      const encryptedWallet =
        state.wallets[
          state.wallets.findIndex((x) => x.name === state.activeWallet.name)
        ].wallet;
      let wallet;
      try {
        const CryptoJS = (await import("crypto-js")).default;
        wallet = JSON.parse(
          CryptoJS.AES.decrypt(encryptedWallet, password).toString(
            CryptoJS.enc.Utf8
          )
        );
      } catch (e) {
        console.error(e);
        return false;
      }
      if (wallet) {
        const backup = JSON.stringify(wallet);
        const blob = new Blob([backup.toString()], {
          type: "application/json; charset=utf-8",
        });
        const saveAs = (await import("file-saver")).default.saveAs;
        saveAs(blob, wallet.name + ".json");
        if (state.getPasswordPromise.resolve) {
          state.getPasswordPromise.resolve("Download success");
        }
        return true;
      }
      return false;
    }
    return false;
  };
};

export const transferToWallet = (fromAddress, toAddress, amount) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const send = {
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: [
            {
              amount: amount,
              denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
            },
          ],
        };
        const msg = await env.txClient.msgSend(send);
        const fee = "auto";
        const memo = "";
        const result = await env.txClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          updateUserBalance()(dispatch, getState);
          dispatch(notify("Transaction Successful", "info"));
          return true;
        } else {
          dispatch(notify(result.rawLog, "error"));
          return null;
        }
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
        return null;
      }
    }
  };
};

export const unlockLedgerWallet = ({ name }) => {
  return async (dispatch, getState) => {
    const TransportWebUSB = (await import("@ledgerhq/hw-transport-webusb"))
      .default;
    // const TransportWebHID = (await import("@ledgerhq/hw-transport-webhid"))
    //   .default;
    const LedgerSigner = (await import("@cosmjs/ledger-amino")).LedgerSigner;
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    const { wallet } = getState();
    let accountSigner;
    const encryptedWallet =
      wallet.wallets[wallet.wallets.findIndex((x) => x.name === name)].wallet;

    dispatch({ type: walletActions.START_UNLOCKING_WALLET });
    try {
      const path = stringToPath("m/44'/118'/0'/0/0");

      if (!ledgerTransport) {
        ledgerTransport = await TransportWebUSB.create();
      }

      accountSigner = new LedgerSigner(ledgerTransport, {
        hdPaths: [path],
        prefix: "gitopia",
        ledgerAppName: "Cosmos",
      });

      const pubkey = await accountSigner.ledger.getPubkey();
      const addr = await accountSigner.ledger.getCosmosAddress();

      const CryptoJS = (await import("crypto-js")).default;
      const wallet = JSON.parse(
        CryptoJS.AES.decrypt(encryptedWallet, "STRONG_LEDGER").toString(
          CryptoJS.enc.Utf8
        )
      );
      if (addr !== wallet.accounts[0].address) {
        dispatch(
          notify("Wallet address not matching Ledger's address", "error")
        );
        if (!wallet.selectedAddress) {
          dispatch({ type: walletActions.SIGN_OUT });
        } else {
          dispatch({ type: walletActions.STOP_UNLOCKING_WALLET });
        }
        return null;
      }

      await dispatch({
        type: walletActions.SET_ACTIVE_WALLET,
        payload: {
          wallet: {
            name: wallet.name,
            accounts: [
              {
                address: addr,
                pubkey: pubkey,
                algo: "secp256k1",
              },
            ],
            isLedger: true,
          },
        },
      });
      await postWalletUnlocked(accountSigner, dispatch, getState);

      return true;
    } catch (e) {
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
          ledgerTransport = null;
      }
      dispatch(notify(e.message, "error"));
      const { wallet } = getState();
      if (!wallet.selectedAddress) {
        dispatch({ type: walletActions.SIGN_OUT });
      } else {
        dispatch({ type: walletActions.STOP_UNLOCKING_WALLET });
      }
      return null;
    }
  };
};

export const initLedgerTransport = ({ force } = { force: false }) => {
  return async (dispatch, getState) => {
    const TransportWebUSB = (await import("@ledgerhq/hw-transport-webusb"))
      .default;
    try {
      if (!ledgerTransport || force) {
        ledgerTransport = await TransportWebUSB.create();
      }
      return { transport: ledgerTransport };
    } catch (e) {
      return e;
    }
  };
};

export const getLedgerSigner = () => {
  return async (dispatch, getState) => {
    if (!ledgerTransport) return { message: "No connection available" };
    const LedgerSigner = (await import("@cosmjs/ledger-amino")).LedgerSigner;
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    try {
      const path = stringToPath("m/44'/118'/0'/0/0");
      const accountSigner = new LedgerSigner(ledgerTransport, {
        hdPaths: [path],
        prefix: "gitopia",
        ledgerAppName: "Cosmos",
      });
      const addr = await accountSigner.ledger.getCosmosAddress();
      return { signer: accountSigner, addr: addr };
    } catch (e) {
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
          ledgerTransport = null;
          return e;
        case "Please close BOLOS and open the Cosmos Ledger app on your Ledger device.":
          return {
            message: "Please open Cosmos Ledger app on your Ledger device.",
          };
      }
      return e;
    }
  };
};

export const showLedgerAddress = (ledgerSigner) => {
  return async (dispatch, getState) => {
    if (!ledgerSigner) return { message: "No connection available" };
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    try {
      const path = stringToPath("m/44'/118'/0'/0/0");
      const addr = await ledgerSigner.showAddress(path);
      return addr;
    } catch (e) {
      return e;
    }
  };
};

export const addLedgerWallet = (name, address, ledgerSigner) => {
  return async (dispatch, getState) => {
    if (!ledgerSigner) return { message: "No connection available" };
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    const CryptoJS = (await import("crypto-js")).default;

    try {
      const path = stringToPath("m/44'/118'/0'/0/0");
      const wallet = { name, accounts: [{ address, path }], isLedger: true };
      const password = "STRONG_LEDGER";
      const encryptedWallet = CryptoJS.AES.encrypt(
        JSON.stringify(wallet),
        password
      ).toString();
      dispatch({
        type: walletActions.ADD_EXTERNAL_WALLET,
        payload: {
          isLedger: true,
          wallet,
          encryptedWallet,
        },
      });
      dispatch({ type: walletActions.STORE_WALLETS });
      await postWalletUnlocked(ledgerSigner, dispatch, getState);
      return true;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
};
