import { walletActions, envActions } from "./actionTypes";
import { notify, dismissNotification } from "reapop";
import {
  initLedgerTransport,
  closeLedgerTransport,
  updateUserBalance,
  unlockKeplrWallet,
} from "./wallet";
import getNodeInfo from "../../helpers/getNodeInfo";

export const sendTransaction = ({
  message,
  memo,
  denom = process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
}) => {
  return async (dispatch, getState) => {
    const { env, wallet } = getState();
    let notifId, result;
    if (wallet.activeWallet?.isLedger) {
      const msg = dispatch(
        notify(
          "Please sign the transaction on your ledger",
          "waiting-for-input",
          {
            dismissible: false,
            dismissAfter: 0,
          }
        )
      );
      notifId = msg.payload.id;
    }
    try {
      const msgArr = Array.isArray(message) ? message : [message];
      console.log(msgArr);
      result = await env.txClient.signAndBroadcast(
        msgArr,
        { fee: 1.5, memo },
        wallet.allowance ? process.env.NEXT_PUBLIC_FEE_GRANTER : null
      );
      if (wallet.activeWallet?.isLedger) {
        dispatch(dismissNotification(notifId));
        await closeLedgerTransport()(dispatch, getState);
      }
      return result;
    } catch (e) {
      let error = e;
      if (wallet.activeWallet?.isLedger) {
        dispatch(dismissNotification(notifId));
        await closeLedgerTransport()(dispatch, getState);
      }
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: Failed to execute 'transferOut' on 'USBDevice': The device was disconnected.":
        case "Ledger Native Error: InvalidStateError: Failed to execute 'transferOut' on 'USBDevice': The device must be opened first.":
        case "Ledger was disconneced during operation, please try again":
          error = {
            message: "Ledger disconneced, please try again",
          };
          break;
        case "Please close BOLOS and open the Cosmos Ledger app on your Ledger device.":
          error = {
            message: "Please open Cosmos app on your Ledger",
          };
      }
      throw new Error(error.message);
    }
  };
};

export const signMessage = ({ data = {} }) => {
  return async (dispatch, getState) => {
    try {
      await setupTxClients(dispatch, getState);
    } catch (e) {
      console.error(e);
      return null;
    }
    const { wallet, env } = getState();
    let notifId;
    if (wallet.activeWallet && wallet.activeWallet.isLedger) {
      const msg = dispatch(
        notify("Please sign the message on your ledger", "waiting-for-input", {
          dismissible: false,
          dismissAfter: 0,
        })
      );
      notifId = msg.payload.id;
    }
    try {
      const msg = await env.txClient.msgSignData({
        signer: wallet.selectedAddress,
        data,
      });
      const info = await getNodeInfo();
      const res = await env.txClient.sign(
        [msg],
        {
          amount: [
            {
              amount: "0",
              denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
            },
          ],
          gas: "0",
        },
        JSON.stringify(data),
        {
          accountNumber: 0,
          sequence: 0,
          chainId: "",
        }
      );
      if (wallet.activeWallet?.isLedger) {
        dispatch(dismissNotification(notifId));
        await closeLedgerTransport()(dispatch, getState);
      }
      return res;
    } catch (e) {
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: Failed to execute 'transferOut' on 'USBDevice': The device was disconnected.":
        case "Ledger Native Error: InvalidStateError: Failed to execute 'transferOut' on 'USBDevice': The device must be opened first.":
        case "Ledger was disconnected during operation, please try again":
        case "Failed to execute 'releaseInterface' on 'USBDevice': The device was disconnected.":
          error = {
            message: "Ledger disconnected, please try again",
          };
          break;
        case "Please close BOLOS and open the Cosmos Ledger app on your Ledger device.":
          error = {
            message: "Please open Cosmos app on your Ledger",
          };
      }
      if (wallet.activeWallet?.isLedger) {
        dispatch(dismissNotification(notifId));
        await closeLedgerTransport()(dispatch, getState);
      }
      throw new Error(e.message);
    }
  };
};

export const setupTxClients = async (dispatch, getState, chainId = null) => {
  const { env, wallet } = getState();

  if (wallet.activeWallet) {
    if (!env.txClient || chainId != wallet.activeWallet.counterPartyChain) {
      if (wallet.activeWallet.isKeplr) {
        await unlockKeplrWallet(chainId)(dispatch, getState);
      } else {
        return new Promise((resolve, reject) => {
          dispatch({
            type: walletActions.GET_PASSWORD_FOR_UNLOCK_WALLET,
            payload: {
              usedFor: wallet.activeWallet.isLedger ? "Connect" : "Unlock",
              resolve: (action) => {
                dispatch({
                  type: walletActions.RESET_PASSWORD_FOR_UNLOCK_WALLET,
                });
                resolve({ message: action });
              },
              reject: (reason) => {
                dispatch({
                  type: walletActions.RESET_PASSWORD_FOR_UNLOCK_WALLET,
                });
                reject({ message: reason, error: true });
              },
              chainId: chainId,
            },
          });
        });
      }
    }
  } else {
    return null;
  }
};

export const handlePostingTransaction = async (dispatch, getState, message) => {
  const { env } = getState();

  try {
    const result = await sendTransaction({ message })(dispatch, getState);
    updateUserBalance(env.apiNode)(dispatch, getState);
    if (result?.code === 0) {
      return result;
    } else {
      dispatch(notify(result?.rawLog, "error"));
      return null;
    }
  } catch (e) {
    console.error(e);
    dispatch(notify(e.message, "error"));
    return null;
  }
};

export const setConfig = ({ config }) => {
  return async (dispatch, getState) => {
    dispatch({
      type: envActions.SET_CONFIG,
      payload: {
        config: {
          apiNode: config.apiNode,
          rpcNode: config.rpcNode,
        },
      },
    });
  };
};
