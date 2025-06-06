import {
  walletActions,
  envActions,
  userActions,
  daoActions,
  ibcAssetsActions,
} from "./actionTypes";
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
import { gasConfig } from "../../ibc-assets-config";
import { getEndpoint } from "../../helpers/getEndpoints";
import { ChainIdHelper } from "../../helpers/chainIdHelper";

let ledgerTransport;

const postWalletUnlocked = async (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
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
    const { txClient, queryClient } = await import("@gitopia/gitopia-js");
    if (accountSignerSecondary) {
      const [rpcEndPointSecondary, restEndPointSecondary] = await Promise.all([
        getEndpoint("rpc", ibcAssets.chainInfo.chain.apis.rpc),
        getEndpoint(
          "rest",
          ibcAssets.chainInfo.chain.apis.rest,
          wallet.activeWallet.counterPartyAddress
        ),
      ]);
      const [tc, qc, tcs, qcs, amount] = await Promise.all([
        txClient(
          accountSigner,
          {
            addr: env.rpcNode,
            gasPrice: wallet.gasPrice,
          },
          "gitopia"
        ),
        apiClient,
        txClient(
          accountSignerSecondary,
          {
            addr: rpcEndPointSecondary,
            gasPrice: getSecondaryGasPrice(ibcAssets?.chainInfo),
          },
          ibcAssets.chainInfo.chain.bech32_prefix
        ),
        queryClient({ addr: restEndPointSecondary }),
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        ),
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
          {
            addr: env.rpcNode,
            gasPrice: wallet.gasPrice,
          },
          "gitopia"
        ),
        apiClient,
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        ),
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
    updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
      dispatch,
      getState
    );
    dispatch({
      type: envActions.SET_CLIENTS,
      payload: {
        txClient: null,
        queryClient: apiClient,
      },
    });
  }

  await refreshCurrentDashboard(apiClient, dispatch, getState);
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

export const unlockKeplrWallet = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  secondaryChainId = null
) => {
  return async (dispatch, getState) => {
    if (window.keplr && window.getOfflineSigner) {
      try {
        const { env } = getState();
        const info = await getNodeInfo(env.apiNode);
        const chainId = info.default_node_info.network;
        const offlineSigner = await window.getOfflineSignerAuto(chainId);
        let accountSignerSecondary = null,
          counterPartyAddress = null;
        const accounts = await offlineSigner.getAccounts();
        const key = await window.keplr.getKey(chainId);
        let user = await getUser(apiClient, accounts[0].address);

        if (secondaryChainId) {
          let chainInfo, chainAsset, chainIbc;
          [chainInfo, chainAsset, chainIbc] = await Promise.all([
            getChainInfo(secondaryChainId),
            getChainAssetList(secondaryChainId),
            getChainIbcAsset(secondaryChainId),
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
          const otherNodeRestEndpoint = await getEndpoint(
            "rest",
            chainInfo.apis.rest
          );
          if (otherNodeRestEndpoint) {
            const counterPartyChainInfo = await getAnyNodeInfo(
              otherNodeRestEndpoint
            );
            accountSignerSecondary = await window.getOfflineSignerAuto(
              counterPartyChainInfo.default_node_info.network
            );
            const counterPartyAccount =
              await accountSignerSecondary.getAccounts();
            counterPartyAddress = counterPartyAccount[0].address;
          }
        }

        await dispatch({
          type: walletActions.SET_ACTIVE_WALLET,
          payload: {
            wallet: {
              name: user?.username ? user.username : key.name,
              accounts,
              isKeplr: true,
              counterPartyAddress,
              counterPartyChain: secondaryChainId,
            },
          },
        });
        await postWalletUnlocked(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
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
      dispatch(notify("Please ensure keplr extension is installed", "error"));
    }
  };
};

export const setWallet = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { wallet }
) => {
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
        await postWalletUnlocked(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          null,
          dispatch,
          getState
        );
      } catch (e) {
        console.error(e);
      }
    }
  };
};

export const unlockWallet = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { name, password }
) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    let accountSignerSecondary;
    let chainInfo,
      chainAsset,
      chainIbc,
      chainId = state.getPasswordPromise.chainId;

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

      if (state.getPassword === "Approve") {
        state.getPasswordPromise.resolve(password);
        return true;
      }

      if (chainId) {
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
        accountSignerSecondary = await DirectSecp256k1HdWallet.fromMnemonic(
          wallet.mnemonic,
          {
            prefix: chainInfo.bech32_prefix,
          }
        );
        const [counterPartyAccount] =
          await accountSignerSecondary.getAccounts();
        wallet.counterPartyAddress = counterPartyAccount.address;
        wallet.counterPartyChain = chainId;
      }

      // Check if user exists, rename the old wallet to correct username
      let user = await getUser(apiClient, wallet.accounts[0].address),
        oldWalletName,
        oldWalletIndex = state.wallets.findIndex((x) => x.name === name);

      if (user?.username) {
        oldWalletName = name;
        wallet.name = user.username;
        if (
          name !== user.username ||
          state.wallets[oldWalletIndex].avatarUrl !== user.avatarUrl
        ) {
          const CryptoJS = (await import("crypto-js")).default;
          encryptedWallet = CryptoJS.AES.encrypt(
            JSON.stringify(wallet),
            password
          ).toString();
          await dispatch({
            type: walletActions.REMOVE_WALLET,
            payload: { name: oldWalletName },
          });

          await dispatch({
            type: walletActions.ADD_WALLET,
            payload: {
              wallet: wallet,
              encryptedWallet,
              index: oldWalletIndex,
              avatarUrl: user.avatarUrl,
            },
          });
        }
      }

      dispatch({
        type: walletActions.SET_ACTIVE_WALLET,
        payload: { wallet },
      });

      try {
        await postWalletUnlocked(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          accountSigner,
          dispatch,
          getState,
          accountSignerSecondary
        );
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
    return true;
  };
};

export const createWalletWithMnemonic = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  {
    name = null,
    mnemonic,
    HDpath = "m/44'/118'/0'/0/",
    prefix = "gitopia",
    password = null,
  }
) => {
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
    const user = await getUser(apiClient, firstAccount.address);
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
      await postWalletUnlocked(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        accountSigner,
        dispatch,
        getState
      );
    } catch (e) {
      console.error(e);
    }
  };
};

export const updateUserBalance = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  showNotification = false
) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    try {
      const res = await cosmosBankApiClient.queryBalance(
        state.selectedAddress,
        process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
      );
      if (Number(res?.data?.balance?.amount) <= 500) {
        await updateUserAllowance(cosmosFeegrantApiClient)(dispatch, getState);
      }
      dispatch({
        type: walletActions.UPDATE_BALANCE,
        payload: {
          balance: res.data.balance.amount || 0,
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

export const updateUserAllowance = (
  cosmosFeegrantApiClient,
  showNotification = false
) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const getAllowance = (await import("../../helpers/getAllowance")).default;

    try {
      const res = await getAllowance(
        cosmosFeegrantApiClient,
        state.selectedAddress
      );
      let limit = res?.allowance?.spend_limit[0];
      if (limit?.denom === process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN) {
        dispatch({
          type: walletActions.UPDATE_ALLOWANCE,
          payload: { allowance: Number(limit.amount) },
        });
      } else {
        dispatch({
          type: walletActions.UPDATE_ALLOWANCE,
          payload: {
            allowance: 0,
          },
        });
      }
      if (showNotification) {
        dispatch(notify("Allowance updated", "info"));
      }
    } catch (e) {
      dispatch({
        type: walletActions.UPDATE_ALLOWANCE,
        payload: {
          allowance: 0,
        },
      });
      console.error("Unable to update lore allowance", e);
    }
  };
};

export const getBalance = (cosmosBankApiClient, address) => {
  return async (dispatch, getState) => {
    if (!address) return null;
    try {
      const res = await cosmosBankApiClient.queryBalance(
        address,
        process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
      );
      if (res?.status === 200) return res.data.balance.amount;
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

export const transferToWallet = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  fromAddress,
  toAddress,
  amount
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState
        );
        const { env } = getState();
        const send = {
          fromAddress: fromAddress,
          toAddress: toAddress,
          amount: [
            {
              amount: amount.toString(),
              denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
            },
          ],
        };
        const msg = await env.txClient.msgSend(send);
        const result = await sendTransaction({ message: msg })(
          dispatch,
          getState
        );
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result && result.code === 0) {
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

export const unlockLedgerWallet = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  { name, justUnlock = false }
) => {
  return async (dispatch, getState) => {
    // const TransportWebHID = (await import("@ledgerhq/hw-transport-webhid"))
    //   .default;
    const LedgerSigner = (await import("@cosmjs/ledger-amino")).LedgerSigner;
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    const { wallet } = getState();
    let accountSigner;
    let encryptedWallet =
      wallet.wallets[wallet.wallets.findIndex((x) => x.name === name)].wallet;
    let accountSignerSecondary;
    let chainId = wallet.getPasswordPromise.chainId,
      chainInfo,
      chainAsset,
      chainIbc;

    dispatch({ type: walletActions.START_UNLOCKING_WALLET });
    try {
      const path = stringToPath("m/44'/118'/0'/0/0");

      let tp = (await initLedgerTransport({ force: true })(dispatch, getState))
        .transport;

      accountSigner = new LedgerSigner(tp, {
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

      let user = await getUser(apiClient, addr),
        oldWalletName = newWallet.name,
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
          avatarUrl: user?.avatarUrl,
        },
      });

      if (chainId) {
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
        accountSignerSecondary = new LedgerSigner(tp, {
          hdPaths: [path],
          prefix: chainInfo.bech32_prefix,
          ledgerAppName: "Cosmos",
        });
        const [counterPartyAccount] =
          await accountSignerSecondary.getAccounts();
        newWallet.counterPartyAddress = counterPartyAccount.address;
        newWallet.counterPartyChain = chainId;
        await postWalletUnlocked(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          accountSigner,
          dispatch,
          getState,
          accountSignerSecondary
        );
      } else {
        await postWalletUnlocked(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          accountSigner,
          dispatch,
          getState
        );
      }

      console.log("justUnlock", justUnlock);
      if (justUnlock) {
        await closeLedgerTransport()(dispatch, getState);
      }
      dispatch({ type: walletActions.STOP_UNLOCKING_WALLET });

      return true;
    } catch (e) {
      let error = e;
      console.error(error);
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: Failed to execute 'transferOut' on 'USBDevice': The device was disconnected.":
        case "Ledger Native Error: InvalidStateError: Failed to execute 'transferOut' on 'USBDevice': The device must be opened first.":
        case "Ledger was disconnected during operation, please try again":
          await closeLedgerTransport()(dispatch, getState);
          error = {
            message: "Ledger disconnected, please try again",
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
      if (justUnlock) {
        await closeLedgerTransport()(dispatch, getState);
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

export const closeLedgerTransport = () => {
  return async (dispatch, getState) => {
    const { env } = getState();
    await ledgerTransport?.close();
    ledgerTransport = null;
    dispatch({
      type: envActions.SET_CLIENTS,
      payload: {
        txClient: null,
        queryClient: env.queryClient,
        txClientSecondary: null,
        queryClientSecondary: env.queryClientSecondary,
      },
    });
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
        case "Ledger Native Error: InvalidStateError: Failed to execute 'transferOut' on 'USBDevice': The device must be opened first.":
        case "Ledger was disconnected during operation, please try again":
          await closeLedgerTransport()(dispatch, getState);
          error = {
            message: "Ledger disconnected, please try again",
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

export const addLedgerWallet = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  name,
  address,
  ledgerSigner
) => {
  return async (dispatch, getState) => {
    if (!ledgerSigner) return { message: "No connection available" };
    const stringToPath = (await import("@cosmjs/crypto")).stringToPath;
    const CryptoJS = (await import("crypto-js")).default;

    try {
      const path = stringToPath("m/44'/118'/0'/0/0");
      const user = await getUser(apiClient, address);
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
          avatarUrl: user?.avatarUrl,
        },
      });

      await postWalletUnlocked(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        ledgerSigner,
        dispatch,
        getState
      );
      await closeLedgerTransport()(dispatch, getState);

      return user?.username ? "USER_CREATED" : "WALLET_ADDED";
    } catch (e) {
      console.error(e);
      return null;
    }
  };
};

export const refreshCurrentDashboard = async (
  apiClient,
  dispatch,
  getState
) => {
  const { wallet } = getState();
  await getUserDetailsForSelectedAddress(apiClient)(dispatch, getState);
  const daos = await getUserDaoAll(
    apiClient,
    wallet.activeWallet.accounts[0].address
  );
  await dispatch({
    type: userActions.INIT_DASHBOARDS,
    payload: {
      name: wallet.activeWallet.name,
      id: wallet.activeWallet.accounts[0].address,
      daos: daos,
    },
  });
};

export const ibcWithdraw = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  sourcePort,
  sourceChannel,
  amount,
  denom
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState,
          wallet.activeWallet.counterPartyChain
        );
        const { env, ibcAssets } = getState();
        let currentHeight = await env.txClientSecondary.getHeight();
        const send = {
          sourcePort: sourcePort,
          sourceChannel: sourceChannel,
          sender: wallet.selectedAddress,
          receiver: wallet.activeWallet.counterPartyAddress,
          timeoutHeight: {
            revisionHeight: (currentHeight + 150).toString(),
            revisionNumber: ChainIdHelper.parse(
              ibcAssets.chainInfo.chain.chain_id
            ).version.toString(),
          },
          token: {
            amount: amount,
            denom: denom,
          },
        };
        const message = await env.txClient.msgTransfer(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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

export const ibcDeposit = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  sourcePort,
  sourceChannel,
  amount,
  denom
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    let notif;
    if (wallet.activeWallet) {
      try {
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState,
          wallet.activeWallet.counterPartyChain
        );
        const { env, ibcAssets } = getState();
        if (wallet.activeWallet.isLedger) {
          notif = dispatch(
            notify(
              "Please sign the transaction on your ledger",
              "waiting-for-input",
              {
                dismissible: false,
                dismissAfter: 0,
              }
            )
          );
        }
        let currentHeight = await env.txClientSecondary.getHeight();
        const send = {
          sourcePort: sourcePort,
          sourceChannel: sourceChannel,
          sender: wallet.activeWallet.counterPartyAddress,
          receiver: wallet.selectedAddress,
          timeoutHeight: {
            revisionHeight: (currentHeight + 150).toString(),
            revisionNumber: ChainIdHelper.parse(
              ibcAssets.chainInfo.chain.chain_id
            ).version.toString(),
          },
          token: {
            amount: amount,
            denom: denom,
          },
        };

        const msg = await env.txClientSecondary.msgTransfer(send);
        const memo = "";
        const result = await env.txClientSecondary.signAndBroadcast([msg], {
          fee: 1.8,
          memo,
        });
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (wallet.activeWallet?.isLedger) {
          dispatch(dismissNotification(notif?.payload?.id));
          await closeLedgerTransport()(dispatch, getState);
        }

        if (result && result.code === 0) {
          return true;
        } else {
          dispatch(notify(result.rawLog, "error"));
          return null;
        }
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
        if (wallet.activeWallet?.isLedger) {
          dispatch(dismissNotification(notif?.payload?.id));
          await closeLedgerTransport()(dispatch, getState);
        }
        return null;
      }
    }
  };
};

export const getAddressforChain = (chainId) => {
  return async (dispatch, getState) => {
    await setupTxClients(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      dispatch,
      getState,
      chainId
    );
    const { wallet } = getState();
    if (wallet.activeWallet.isLedger) {
      await closeLedgerTransport()(dispatch, getState);
    }
  };
};

const getSecondaryGasPrice = (chainInfo) => {
  let gas,
    chainFeesInfo = chainInfo?.chain?.fees?.fee_tokens[0];
  if (chainFeesInfo?.average_gas_price) {
    gas = chainFeesInfo.average_gas_price + chainFeesInfo.denom;
  } else if (chainFeesInfo?.fixed_min_gas_price) {
    gas = chainFeesInfo.fixed_min_gas_price + chainFeesInfo.denom;
  } else {
    gas = gasConfig[chain].gasPrice;
  }
  return gas;
};
