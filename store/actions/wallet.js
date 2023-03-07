import {
  walletActions,
  envActions,
  userActions,
  daoActions,
  ibcAssetsActions,
} from "./actionTypes";
import { Api } from "../cosmos.bank.v1beta1/module/rest";
import { getUserDetailsForSelectedAddress, setCurrentDashboard } from "./user";
import find from "lodash/find";
import { notify, dismissNotification } from "reapop";
import { setupTxClients, sendTransaction } from "./env";
import getNodeInfo from "../../helpers/getNodeInfo";
import getAnyNodeInfo from "../../helpers/getAnyNodeInfo";
import getUserDaoAll from "../../helpers/getUserDaoAll";
import getUser from "../../helpers/getUser";
import getChainInfo from "../../helpers/getChainInfo";
import getChainAssetList from "../../helpers/getChainAssetList";
import getChainIbcAsset from "../../helpers/getChainIbcAssets";
import dayjs from "dayjs";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { gasConfig } from "../../ibc-assets-config";

let ledgerTransport;

const postWalletUnlocked = async (
  accountSigner,
  dispatch,
  getState,
  accountSignerSecondary = null
) => {
  const { env, wallet, ibcAssets } = getState();

  dispatch({
    type: walletActions.SET_SELECTED_ADDRESS,
    payload: { address: wallet.activeWallet.accounts[0].address },
  });

  if (accountSigner) {
    const { queryClient, txClient } = await import("@gitopia/gitopia-js/dist");
    if (accountSignerSecondary !== null) {
      const [tc, qc, tcs, qcs, amount] = await Promise.all([
        txClient(
          accountSigner,
          { addr: env.rpcNode, gasPrice: wallet.gasPrice },
          "gitopia"
        ),
        queryClient({ addr: env.apiNode }),
        txClient(
          accountSignerSecondary,
          {
            addr: ibcAssets.chainInfo.chain.apis.rpc[3].address,
            gasPrice: wallet.gasPrice,
          },
          ibcAssets.chainInfo.chain.bech32_prefix
        ),
        queryClient({ addr: ibcAssets.chainInfo.chain.apis.rest[3].address }),
        updateUserBalance()(dispatch, getState),
      ]);
      dispatch({
        type: envActions.SET_CLIENTS,
        payload: {
          txClient: tc,
          queryClient: qc,
          txClientSecondary: tcs,
          queryClientSecondary: qcs,
        },
      });
    } else {
      const [tc, qc, amount] = await Promise.all([
        txClient(
          accountSigner,
          { addr: env.rpcNode, gasPrice: wallet.gasPrice },
          "gitopia"
        ),
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
    }
    if (wallet.getPasswordPromise.resolve) {
      wallet.getPasswordPromise.resolve("Unlock success");
    }
  } else {
    const { Api } = await import("@gitopia/gitopia-js/dist/rest");

    updateUserBalance()(dispatch, getState);
    dispatch({
      type: envActions.SET_CLIENTS,
      payload: {
        txClient: null,
        queryClient: new Api({ baseURL: env.apiNode }),
      },
    });
  }

  await refreshCurrentDashboard(dispatch, getState);
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
        let user = await getUser(accounts[0].address);
        await dispatch({
          type: walletActions.SET_ACTIVE_WALLET,
          payload: {
            wallet: {
              name: user?.username ? user.username : key.name,
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

export const unlockWallet = ({ name, password, chainId = null }) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    let accountSignerSecondary;
    let chainInfo, chainAsset, chainIbc;
    if (chainId !== null && chainId !== undefined) {
      [chainInfo, chainAsset, chainIbc] = await Promise.all([
        getChainInfo(chainId),
        getChainAssetList(chainId),
        getChainIbcAsset(chainId),
      ]);
      if (chainInfo && chainAsset && chainIbc) {
        await dispatch({
          type: ibcAssetsActions.SET_CHAIN_INFO,
          payload: {
            chain: chainInfo,
            assets: chainAsset,
            ibc: chainIbc,
          },
        });
      }
    }
    let encryptedWallet =
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

    if (wallet.accounts.length > 0) {
      const DirectSecp256k1HdWallet = (await import("@cosmjs/proto-signing"))
        .DirectSecp256k1HdWallet;
      const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
        wallet.mnemonic,
        {
          prefix: "gitopia",
        }
      );
      if (chainId !== null) {
        accountSignerSecondary = await DirectSecp256k1HdWallet.fromMnemonic(
          wallet.mnemonic,
          {
            prefix: chainInfo.bech32_prefix,
          }
        );
        const [counterPartyAccount] =
          await accountSignerSecondary.getAccounts();
        const counterPartyAddress = counterPartyAccount.address;
        wallet.counterPartyAddress = counterPartyAddress;
        wallet.counterPartyChain = chainId;
      }

      // Check if user exists, rename the old wallet to correct username
      let user = await getUser(wallet.accounts[0].address),
        oldWalletName,
        oldWalletIndex = state.wallets.findIndex((x) => x.name === name);

      if (user?.username) {
        const CryptoJS = (await import("crypto-js")).default;
        oldWalletName = name;
        wallet.name = user.username;
        encryptedWallet = CryptoJS.AES.encrypt(
          JSON.stringify(wallet),
          password
        ).toString();

        if (name !== user.username) {
          await dispatch({
            type: walletActions.REMOVE_WALLET,
            payload: { name: oldWalletName },
          });

          await dispatch({
            type: walletActions.ADD_WALLET,
            payload: { wallet, encryptedWallet, index: oldWalletIndex },
          });

          dispatch({
            type: walletActions.STORE_WALLETS,
          });
        } else {
          dispatch({
            type: walletActions.SET_ACTIVE_WALLET,
            payload: {
              wallet,
            },
          });
        }
      } else {
        dispatch({
          type: walletActions.SET_ACTIVE_WALLET,
          payload: { wallet },
        });
      }

      try {
        if (chainId !== null) {
          await postWalletUnlocked(
            accountSigner,
            dispatch,
            getState,
            accountSignerSecondary
          );
        } else {
          await postWalletUnlocked(accountSigner, dispatch, getState);
        }
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
    let oldWalletName = wallet.name;
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
      payload: { name: oldWalletName },
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
    if (!address) return null;
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
        let downloadWallet = {
          name: wallet.name,
          mnemonic: wallet.mnemonic,
          HDpath: wallet.HDpath,
          accounts: wallet.accounts,
        };
        const backup = JSON.stringify(downloadWallet);
        const blob = new Blob([backup.toString()], {
          type: "application/json; charset=utf-8",
        });
        const saveAs = (await import("file-saver")).default.saveAs;
        saveAs(blob, wallet.name + ".json");
        if (state.getPasswordPromise.resolve) {
          state.getPasswordPromise.resolve("Download success");
          dispatch({
            type: walletActions.SET_BACKUP_STATE,
            payload: { backupState: true },
          });
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

export const unlockLedgerWallet = ({ name, chainId = null }) => {
  return async (dispatch, getState) => {
    const TransportWebUSB = (await import("@ledgerhq/hw-transport-webusb"))
      .default;
    // const TransportWebHID = (await import("@ledgerhq/hw-transport-webhid"))
    //   .default;
    const LedgerSigner = (await import("@cosmjs/ledger-amino")).LedgerSigner;
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    const { wallet } = getState();
    let accountSigner;
    let encryptedWallet =
      wallet.wallets[wallet.wallets.findIndex((x) => x.name === name)].wallet;
    let accountSignerSecondary;
    let chainInfo, chainAsset, chainIbc;
    if (chainId !== null) {
      [chainInfo, chainAsset, chainIbc] = await Promise.all([
        getChainInfo(chainId),
        getChainAssetList(chainId),
        getChainIbcAsset(chainId),
      ]);
      if (chainInfo && chainAsset && chainIbc) {
        await dispatch({
          type: ibcAssetsActions.SET_CHAIN_INFO,
          payload: {
            chain: chainInfo,
            assets: chainAsset,
            ibc: chainIbc,
          },
        });
      }
    }
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
      const addr = (await accountSigner.getAccounts())[0].address;

      const CryptoJS = (await import("crypto-js")).default;
      let newWallet = JSON.parse(
        CryptoJS.AES.decrypt(encryptedWallet, "STRONG_LEDGER").toString(
          CryptoJS.enc.Utf8
        )
      );
      if (chainId !== null) {
        accountSignerSecondary = new LedgerSigner(ledgerTransport, {
          hdPaths: [path],
          prefix: chainInfo.bech32_prefix,
          ledgerAppName: "Cosmos",
        });
        const [counterPartyAccount] =
          await accountSignerSecondary.getAccounts();
        const counterPartyAddress = counterPartyAccount.address;
        console.log(accountSignerSecondary);
        newWallet.counterPartyAddress = counterPartyAddress;
        newWallet.counterPartyChain = chainId;
      }
      if (addr !== newWallet.accounts[0].address) {
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

      // Check if user exists, rename the old wallet to correct username

      let user = await getUser(addr),
        oldWalletName,
        oldWalletIndex = wallet.wallets.findIndex(
          (x) => x.name === newWallet.name
        );
      if (user?.username) {
        const CryptoJS = (await import("crypto-js")).default;
        oldWalletName = newWallet.name;
        newWallet.name = user.username;
        encryptedWallet = CryptoJS.AES.encrypt(
          JSON.stringify(newWallet),
          "STRONG_LEDGER"
        ).toString();
      }

      await dispatch({
        type: walletActions.REMOVE_WALLET,
        payload: { name: oldWalletName },
      });

      await dispatch({
        type: walletActions.ADD_WALLET,
        payload: {
          wallet: newWallet,
          encryptedWallet,
          isLedger: true,
          index: oldWalletIndex,
        },
      });

      if (chainId !== null) {
        await postWalletUnlocked(
          accountSigner,
          dispatch,
          getState,
          accountSignerSecondary
        );
      } else {
        await postWalletUnlocked(accountSigner, dispatch, getState);
      }

      dispatch({ type: walletActions.STOP_UNLOCKING_WALLET });
      dispatch({
        type: walletActions.STORE_WALLETS,
      });

      return true;
    } catch (e) {
      let error = e;
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: Failed to execute 'transferOut' on 'USBDevice': The device was disconnected.":
          ledgerTransport = null;
          error = {
            message:
              "Ledger was disconneced during operation, please try again",
          };
          break;
        case "Please close BOLOS and open the Cosmos Ledger app on your Ledger device.":
          error = {
            message: "Please open Cosmos app on your Ledger",
          };
      }
      const { wallet } = getState();
      if (!wallet.selectedAddress) {
        dispatch({ type: walletActions.SIGN_OUT });
      } else {
        dispatch({ type: walletActions.STOP_UNLOCKING_WALLET });
      }
      return error;
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
      const addr = (await accountSigner.getAccounts())[0].address;
      return { signer: accountSigner, addr: addr };
    } catch (e) {
      let error = e;
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: Failed to execute 'transferOut' on 'USBDevice': The device was disconnected.":
          ledgerTransport = null;
          error = {
            message:
              "Ledger was disconneced during operation, please try again",
          };
          break;
        case "Please close BOLOS and open the Cosmos Ledger app on your Ledger device.":
          error = {
            message: "Please open Cosmos app on your Ledger",
          };
      }
      return error;
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
      const user = await getUser(address);
      const wallet = {
        name: user ? user.username : name,
        accounts: [{ address, path }],
        isLedger: true,
      };
      const password = "STRONG_LEDGER";
      const encryptedWallet = CryptoJS.AES.encrypt(
        JSON.stringify(wallet),
        password
      ).toString();

      let oldWalletIndex = getState().wallet.wallets.findIndex(
        (x) => x.name === wallet.name
      );

      await dispatch({
        type: walletActions.REMOVE_WALLET,
        payload: { name: wallet.name },
      });

      await dispatch({
        type: walletActions.ADD_WALLET,
        payload: {
          isLedger: true,
          wallet,
          encryptedWallet,
          index: oldWalletIndex,
        },
      });

      await postWalletUnlocked(ledgerSigner, dispatch, getState);
      dispatch({ type: walletActions.STORE_WALLETS });

      return user?.username ? "USER_CREATED" : "WALLET_ADDED";
    } catch (e) {
      console.error(e);
      return null;
    }
  };
};

export const refreshCurrentDashboard = async (dispatch, getState) => {
  const { wallet } = getState();
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
};

export const getAddressforChain = (name, chainId) => {
  return async (dispatch, getState) => {
    try {
      const { wallet } = getState();
      let activeWallet = wallet.activeWallet;
      if (activeWallet.isKeplr) {
        if (window.keplr && window.getOfflineSigner) {
          try {
            let chainInfo, chainAsset, chainIbc;
            if (chainId !== null && chainId !== undefined) {
              [chainInfo, chainAsset, chainIbc] = await Promise.all([
                getChainInfo(chainId),
                getChainAssetList(chainId),
                getChainIbcAsset(chainId),
              ]);
              if (chainInfo && chainAsset && chainIbc) {
                await dispatch({
                  type: ibcAssetsActions.SET_CHAIN_INFO,
                  payload: {
                    chain: chainInfo,
                    assets: chainAsset,
                    ibc: chainIbc,
                  },
                });
              }
            }
            const info = await getNodeInfo();
            const counterPartyChainInfo = await getAnyNodeInfo(
              chainInfo.apis.rest[3].address
            );
            const chain = info.default_node_info.network;
            const offlineSigner = await window.getOfflineSignerAuto(chain);
            const accountSignerSecondary = await window.getOfflineSignerAuto(
              counterPartyChainInfo.default_node_info.network
            );
            const accounts = await offlineSigner.getAccounts();
            const counterPartyAccount =
              await accountSignerSecondary.getAccounts();
            activeWallet.counterPartyAddress = counterPartyAccount[0].address;
            activeWallet.counterPartyChain = chainId;
            await dispatch({
              type: walletActions.SET_ACTIVE_WALLET,
              payload: {
                wallet: activeWallet,
              },
            });
            await postWalletUnlocked(
              offlineSigner,
              dispatch,
              getState,
              accountSignerSecondary
            );
            return accounts[0];
          } catch (e) {
            console.error(e);
            return null;
          }
        } else {
          dispatch(
            notify("Please ensure keplr extension is installed", "error")
          );
        }
      } else {
        return await setupTxClients(dispatch, getState, chainId);
      }
      return {};
    } catch (e) {
      return e;
    }
  };
};

export const ibcWithdraw = (sourcePort, sourceChannel, amount, denom) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(
          dispatch,
          getState,
          wallet.activeWallet.counterPartyChain
        );
        const { env } = getState();
        const send = {
          sourcePort: sourcePort,
          sourceChannel: sourceChannel,
          sender: wallet.selectedAddress,
          receiver: wallet.activeWallet.counterPartyAddress,
          timeoutTimestamp: dayjs(dayjs().add(1, "day")).valueOf() * 1000000000,
          token: {
            amount: amount,
            denom: denom,
          },
        };
        const message = await env.txClient.msgTransfer(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance()(dispatch, getState);
        if (result && result.code === 0) {
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

export const ibcDeposit = (sourcePort, sourceChannel, amount, denom) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(
          dispatch,
          getState,
          wallet.activeWallet.counterPartyChain
        );
        const { env } = getState();
        const send = {
          sourcePort: sourcePort,
          sourceChannel: sourceChannel,
          sender: wallet.activeWallet.counterPartyAddress,
          receiver: wallet.selectedAddress,
          timeoutTimestamp: dayjs(dayjs().add(1, "day")).valueOf() * 1000000000,
          token: {
            amount: amount,
            denom: denom,
          },
        };

        const msg = await env.txClientSecondary.msgTransfer(send);
        const memo = "";
        let fees = await estimateFee(
          wallet.activeWallet.counterPartyAddress,
          wallet.activeWallet.counterPartyChain,
          [msg],
          memo
        )(getState);
        const fee = {
          amount: [
            { amount: fees.amount[0].amount, denom: fees.amount[0].denom },
          ],
          gas: fees.gas,
        };
        const result = await env.txClientSecondary.signAndBroadcast([msg], {
          fee,
          memo,
        });
        updateUserBalance()(dispatch, getState);

        if (result && result.code === 0) {
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

export const estimateFee = (address, chain, msg, memo) => {
  return async (getState) => {
    const { env } = getState();
    const gasPrice = GasPrice.fromString(gasConfig[chain].gasPrice);
    const gasEstimation = await env.txClientSecondary.simulate(
      address,
      msg,
      memo
    );
    const fees = calculateFee(
      Math.round(gasEstimation * gasConfig[chain].multiplier),
      gasPrice
    );
    return fees;
  };
};
