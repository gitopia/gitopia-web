import { walletActions, envActions } from "./actionTypes";
import { notify, dismissNotification } from "reapop";
import { initLedgerTransport } from "./wallet";

export const sendTransaction = ({
  message,
  memo,
  denom = process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
}) => {
  return async (dispatch, getState) => {
    const { env, wallet } = getState();
    const fee = {
      amount: [{ amount: "0", denom }],
      gas: "200000",
    };
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
      result = await env.txClient.signAndBroadcast([message], {
        fee,
        memo,
      });
      dispatch(dismissNotification(notifId));
      return result;
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

export const setupTxClients = async (dispatch, getState) => {
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
          },
        });
      });
    }
  } else {
    return null;
  }
};
