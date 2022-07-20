import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { updateUserBalance } from "./wallet";
import { BountyParent } from "@gitopia/gitopia-js/types/gitopia/bounty";
export const createBounty = (amount, tokenDenom, expiry, parentId, parent) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const amountToSend = [
          {
            amount: 1,
            denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
          },
        ];
        const send = {
          creator: wallet.selectedAddress,
          amount: [{ denom: tokenDenom, amount: amount }],
          expiry: expiry,
          parentId: parentId,
          parent: parent === "issue" ? BountyParent.BOUNTY_PARENT_ISSUE : "",
        };
        console.log(send);
        const message = await env.txClient.msgCreateBounty(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance()(dispatch, getState);
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Bounty Created", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const updateBountyExpiry = (id, expiry) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const send = {
          creator: wallet.selectedAddress,
          id: id,
          expiry: expiry,
        };
        console.log(send);
        const message = await env.txClient.msgUpdateBountyExpiry(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance()(dispatch, getState);
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Bounty Expiry Updated", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const closeBounty = (id) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const send = {
          creator: wallet.selectedAddress,
          id: id,
        };
        console.log(send);
        const message = await env.txClient.msgCloseBounty(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance()(dispatch, getState);
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Bounty Closed", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const deleteBounty = (id) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const send = {
          creator: wallet.selectedAddress,
          id: id,
        };
        console.log(send);
        const message = await env.txClient.msgDeleteBounty(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance()(dispatch, getState);
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Bounty Deleted", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};
