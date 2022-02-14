import { walletActions } from "./actionTypes";
import { notify } from "reapop";

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
    console.log("wallet isLedger", wallet.activeWallet.isLedger);
    if (wallet.activeWallet && wallet.activeWallet.isLedger) {
      console.log("ledger device");
      dispatch(notify("Please sign the transaction on your ledger", "info"));
    }
    console.log("message", message);
    const result = await env.txClient.signAndBroadcast([message], {
      fee,
      memo,
    });
    return result;
  };
};

export const setupTxClients = async (dispatch, getState) => {
  const { env } = getState();
  if (!env.txClient && !env.bankTxClient) {
    return new Promise((resolve, reject) => {
      dispatch({
        type: walletActions.GET_PASSWORD_FOR_UNLOCK_WALLET,
        payload: {
          usedFor: "Unlock",
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
};
