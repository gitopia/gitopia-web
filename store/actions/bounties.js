import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { updateUserBalance } from "./wallet";
import { BountyParent } from "@gitopia/gitopia-js/dist/types/gitopia/bounty";

export const createBounty = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  amount,
  expiry,
  parentIid,
  parent,
  repositoryId
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
          creator: wallet.selectedAddress,
          amount: amount,
          expiry: expiry,
          parentIid: parentIid,
          repositoryId: repositoryId,
          parent: parent === "issue" ? BountyParent.BOUNTY_PARENT_ISSUE : "",
        };
        console.log(send);
        const message = await env.txClient.msgCreateBounty(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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

export const updateBountyExpiry = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  id,
  expiry
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
          creator: wallet.selectedAddress,
          id: id,
          expiry: expiry,
        };
        console.log(send);
        const message = await env.txClient.msgUpdateBountyExpiry(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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

export const closeBounty = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  id
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
          creator: wallet.selectedAddress,
          id: id,
        };
        console.log(send);
        const message = await env.txClient.msgCloseBounty(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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

export const deleteBounty = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  id
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
          creator: wallet.selectedAddress,
          id: id,
        };
        console.log(send);
        const message = await env.txClient.msgDeleteBounty(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
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

export const linkPullIssuebyIid = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  repositoryId,
  pullRequestIid,
  issueIid
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
          creator: wallet.selectedAddress,
          repositoryId: repositoryId,
          pullRequestIid: pullRequestIid,
          issueIid: issueIid,
        };
        const message = await env.txClient.msgLinkPullRequestIssueByIid(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Issue Linked to Pull Request", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const unlinkPullIssuebyIid = (
  apiClient,
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  repositoryId,
  pullRequestIid,
  issueIid
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
          creator: wallet.selectedAddress,
          repositoryId: repositoryId,
          pullRequestIid: pullRequestIid,
          issueIid: issueIid,
        };
        const message = await env.txClient.msgUnlinkPullRequestIssueByIid(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Issue Unlinked to Pull Request", "info"));
          } else {
            dispatch(notify(result.rawLog, "error"));
          }
        }
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};
