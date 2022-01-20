import { walletActions } from "./actionTypes";

export const sendTransaction = async (
  { message, memo, denom = process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN },
  env
) => {
  const fee = {
    amount: [{ amount: "0", denom }],
    gas: "200000",
  };
  const result = await env.txClient.signAndBroadcast([message], {
    fee,
    memo,
  });
  return result;
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
