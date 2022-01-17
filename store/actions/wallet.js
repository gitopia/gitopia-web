import { walletActions, envActions, userActions } from "./actionTypes";
import { Api } from "../cosmos.bank.v1beta1/module/rest";
import { getUserDetailsForSelectedAddress, setCurrentDashboard } from "./user";
import find from "lodash/find";
import { notify } from "reapop";
import { setupTxClients } from "./env";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import { stringToPath } from "@cosmjs/crypto";

export const signOut = () => {
  return {
    type: walletActions.SIGN_OUT,
  };
};

const postWalletUnlocked = async (accountSigner, dispatch, getState) => {
  const { env, wallet } = getState();

  dispatch({
    type: walletActions.SET_SELECTED_ADDRESS,
    payload: { address: wallet.activeWallet.accounts[0].address },
  });

  if (accountSigner) {
    console.log("accountSigner", accountSigner);
    const { queryClient, txClient } = await import("@gitopia/gitopia-js");
    const cosmosBankTxClient = (
      await import("../cosmos.bank.v1beta1/module/index.js")
    ).txClient;

    const [tc, qc, amount] = await Promise.all([
      txClient(accountSigner, { addr: env.rpcNode }),
      queryClient({ addr: env.apiNode }),
      // cosmosBankTxClient(accountSigner, { addr: env.rpcNode }),
      updateUserBalance()(dispatch, getState),
    ]);

    dispatch({
      type: envActions.SET_CLIENTS,
      payload: {
        txClient: tc,
        queryClient: qc,
        bankTxClient: null,
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
        bankTxClient: null,
      },
    });
  }

  await getUserDetailsForSelectedAddress()(dispatch, getState);
  await dispatch({
    type: userActions.INIT_DASHBOARDS,
    payload: {
      name: wallet.activeWallet.name,
      id: wallet.activeWallet.accounts[0].address,
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

export const reInitClients = async (dispatch, getState) => {
  const { activeWallet } = getState().wallet;
  if (activeWallet.isKeplr) {
    const chainId = "gitopia";
    const offlineSigner = window.getOfflineSigner(chainId);
    await postWalletUnlocked(offlineSigner, dispatch, getState);
  } else {
    const DirectSecp256k1HdWallet = (await import("@cosmjs/proto-signing"))
      .DirectSecp256k1HdWallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      activeWallet.mnemonic,
      {
        prefix: activeWallet.prefix || "gitopia",
      }
    );
    await postWalletUnlocked(accountSigner, dispatch, getState);
  }
};

export const unlockKeplrWallet = () => {
  return async (dispatch, getState) => {
    if (window.keplr && window.getOfflineSigner) {
      try {
        const chainId = "gitopia";
        const offlineSigner = window.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        const key = await window.keplr.getKey(chainId);
        await dispatch({
          type: walletActions.SET_ACTIVE_WALLET,
          payload: { wallet: { name: key.name, accounts, isKeplr: true } },
        });
        await postWalletUnlocked(offlineSigner, dispatch, getState);
        return accounts[0];
      } catch (e) {
        console.log(e);
        return null;
      }
    } else {
      console.log("Unable to use keplr getOfflineSigner");
      dispatch(notify("Please ensure keplr extension is installed", "error"));
    }
  };
};

export const setWallet = ({ wallet }) => {
  return async (dispatch, getState) => {
    dispatch({
      type: walletActions.SET_ACTIVE_WALLET,
      payload: { wallet: { name: wallet.name, accounts: wallet.accounts } },
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
    dispatch({
      type: walletActions.SET_ACTIVE_WALLET,
      payload: { wallet: { name: wallet.name, accounts: wallet.accounts } },
    });
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
    wallet.accounts.push(account);
    await dispatch({
      type: walletActions.ADD_WALLET,
      payload: { wallet, password },
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
    await dispatch({
      type: walletActions.ADD_WALLET,
      payload: { wallet, password },
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
        console.log(send);
        const msg = await env.bankTxClient.msgSend(send);
        const fee = {
          amount: [
            {
              amount: "0",
              denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
            },
          ],
          gas: "200000",
        };
        const memo = "";
        const result = await env.bankTxClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          updateUserBalance()(dispatch, getState);
          dispatch(notify("Transaction Successful", "info"));
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

function unharden(hdPath) {
  //   return hdPath;
  //   return hdPath.map((n) =>
  //     n.isHardened() ? n.toNumber() - 2 ** 31 : n.toNumber()
  //   );
  return hdPath.map((n) => (n >= 0x80000000 ? n - 0x80000000 : n));
}

export const unlockLedgerWallet = () => {
  return async (dispatch, getState) => {
    // const TransportWebUSB = (await import("@ledgerhq/hw-transport-webusb"))
    //   .default;
    // const TransportWebHID = (await import("@ledgerhq/hw-transport-webhid"))
    //   .default;
    // import TransportU2F from "@ledgerhq/hw-transport-u2f";
    // const CosmosApp = (await import("ledger-cosmos-js")).default;
    // const LedgerSigner = (await import("@cosmjs/ledger-amino")).LedgerSigner;
    let accountSigner;

    try {
      const transport = await TransportWebUSB.create();
      // const app = new CosmosApp(transport);
      // const path = [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0];
      const path = stringToPath("m/44'/118'/0'/0/0");
      console.log("path", path);
      // const res = await app.appInfo();
      // if (res.return_code === 28161) {
      //   // App not open
      //   dispatch(notify("Please open cosmos app on ledger", "error"));
      //   return null;
      // }
      // console.log(res);
      // const addr = await app.getAddressAndPubKey(path, "gitopia");
      // console.log(addr);
      // if (addr.return_code === 27404) {
      //   dispatch(notify("Please unlock ledger", "error"));
      //   return null;
      // }

      accountSigner = new LedgerSigner(transport, {
        hdPaths: [path],
        prefix: "gitopia",
        ledgerAppName: "Cosmos",
      });
      // const addr = await accountSigner.ledger.app.getAddressAndPubKey(
      //   unharden(path),
      //   "gitopia"
      // );
      const pubkey = await accountSigner.ledger.getPubkey();
      console.log("pubkey", pubkey);
      const addr = await accountSigner.ledger.getCosmosAddress();
      console.log("addr", addr);
      // if (addr.return_code === 27404) {
      //   dispatch(notify("Please unlock ledger", "error"));
      //   return null;
      // }

      await dispatch({
        type: walletActions.SET_ACTIVE_WALLET,
        payload: {
          wallet: {
            name: "Ledger",
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

      // const OfflineDirectSigner = (await import("@cosmjs/proto-signing"))
      // .OfflineDirectSigner;
      // const accountSigner = {
      //   getAccounts: () => {
      //     return [
      //       {
      //         address: addr.bech32_address,
      //         pubkey: addr.compressed_pk,
      //         algo: "secp256k1",
      //       },
      //     ];
      //   },
      //   signAmino: async (signerAddress, signDoc) => {
      //     try {
      //       // const ledgerRes = await app.sign(
      //       //   path,
      //       //   '{"typeUrl":"/gitopia.gitopia.gitopia.MsgCreateUser","value":{"creator":"gitopia106ddgv6hl3me0yuf6rc8few5yn764pm9cgnzwd","username":"Ledger"}}'
      //       // );
      //       console.log(signerAddress, signDoc);
      //       // console.log(ledgerRes);
      //     } catch (e) {
      //       console.error(e);
      //       dispatch(notify(e.message, "error"));
      //     }
      //     // return { signature, signed };
      //   },
      // };
      dispatch({ type: walletActions.STORE_WALLETS });
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
      return null;
    }

    await postWalletUnlocked(accountSigner, dispatch, getState);
  };
};
