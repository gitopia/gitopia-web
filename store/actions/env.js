import { walletActions, envActions } from "./actionTypes";
import { notify, dismissNotification } from "reapop";
import { initLedgerTransport, updateUserBalance } from "./wallet";
import getNodeInfo from "../../helpers/getNodeInfo";

export const sendTransaction = ({
  message,
  memo,
  denom = process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
}) => {
  return async (dispatch, getState) => {
    const { env, wallet } = getState();
    let notifId, result;
    if (wallet.activeWallet && wallet.activeWallet.isLedger) {
      const msg = dispatch(
        notify("Please sign the transaction on your ledger", "loading", {
          dismissible: false,
          dismissAfter: 0,
        })
      );
      notifId = msg.payload.id;
    }
    try {
      const msgArr = Array.isArray(message) ? message : [message];
      console.log(msgArr);
      result = await env.txClient.signAndBroadcast(msgArr, {
        fee: "auto",
        memo,
      });
      dispatch(dismissNotification(notifId));
      return result;
    } catch (e) {
      let error = e;
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: Failed to execute 'transferOut' on 'USBDevice': The device was disconnected.":
          initLedgerTransport({ force: true })(dispatch, getState);
          dispatch({
            type: envActions.SET_CLIENTS,
            payload: {
              txClient: null,
              queryClient: env.queryClient,
            },
          });
          error = {
            message:
              "Ledger was disconneced during operation, please try again",
          };
          await setupTxClients(dispatch, getState);
          break;
        case "Please close BOLOS and open the Cosmos Ledger app on your Ledger device.":
          error = {
            message: "Please open Cosmos app on your Ledger",
          };
      }
      dispatch(dismissNotification(notifId));
      throw new Error(error);
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
        notify("Please sign the message on your ledger", "loading", {
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
          chainId: info.default_node_info.network,
        }
      );
      dispatch(dismissNotification(notifId));
      return res;
    } catch (e) {
      switch (e.message) {
        case "Ledger Native Error: DisconnectedDeviceDuringOperation: The device was disconnected.":
          initLedgerTransport({ force: true })(dispatch, getState);
          dispatch({
            type: envActions.SET_CLIENTS,
            payload: {
              txClient: null,
              queryClient: env.queryClient,
            },
          });
          setupTxClients(dispatch, getState);
      }
      dispatch(dismissNotification(notifId));
      throw new Error(e.message);
    }
  };
};

export const setupTxClients = async (dispatch, getState, chainId = null) => {
  const { env, wallet } = getState();

  if (wallet.activeWallet) {
    if (!env.txClient) {
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
              reject({ message: reason });
            },
            chainId: chainId,
          },
        });
      });
    }
  } else {
    return null;
  }
};

export const handlePostingTransaction = async (dispatch, getState, message) => {
  try {
    const result = await sendTransaction({ message })(dispatch, getState);
    updateUserBalance()(dispatch, getState);
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
