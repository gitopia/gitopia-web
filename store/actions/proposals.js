import { notify } from "reapop";
import { TextProposal, VoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { Any } from "cosmjs-types/google/protobuf/any";
import {
  SoftwareUpgradeProposal,
  Plan,
} from "cosmjs-types/cosmos/upgrade/v1beta1/upgrade";
import { CommunityPoolSpendProposal } from "cosmjs-types/cosmos/distribution/v1beta1/distribution";
import { setupTxClients } from "./env";
import { longify } from "@cosmjs/stargate/build/queries/utils";

export const submitGovernanceProposal = (
  title,
  description,
  proposalType,
  initialDeposit
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const textProposal = TextProposal.fromPartial({
          title: title,
          description: description,
        });
        const msgAny = Any.fromPartial({
          typeUrl: "/cosmos.gov.v1beta1.TextProposal",
          value: Uint8Array.from(TextProposal.encode(textProposal).finish()),
        });

        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [{ amount: initialDeposit, denom: "utlore" }]
              : [],
          proposer: wallet.selectedAddress,
        };

        const msg = await env.txClient.msgSubmitProposal(send);

        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.txClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          dispatch(notify("Proposal Submitted", "info"));
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const chainUpgradeProposal = (
  title,
  description,
  proposalType,
  releaseVersionTag,
  height,
  initialDeposit
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const msgPlan = Plan.fromPartial({
          name: releaseVersionTag,
          height: longify(height),
          info: "",
        });
        const softwareUpgradeProposal = SoftwareUpgradeProposal.fromPartial({
          title: title,
          description: description,
          plan: msgPlan,
        });
        const msgAny = Any.fromPartial({
          typeUrl: "/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal",
          value: Uint8Array.from(
            SoftwareUpgradeProposal.encode(softwareUpgradeProposal).finish()
          ),
        });
        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [{ amount: initialDeposit, denom: "utlore" }]
              : [],
          proposer: wallet.selectedAddress,
        };
        const msg = await env.txClient.msgSubmitProposal(send);

        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.txClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          dispatch(notify("Proposal Submitted", "info"));
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const communityPoolSpendProposal = (
  title,
  description,
  proposalType,
  address,
  amount,
  initialDeposit
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const amountToSend = [
          {
            amount: amount,
            denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
          },
        ];
        const communityPoolSpendProposal =
          CommunityPoolSpendProposal.fromPartial({
            title: title,
            description: description,
            recipient: address,
            amount: amountToSend,
          });
        const msgAny = Any.fromPartial({
          typeUrl: "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal",
          value: Uint8Array.from(
            CommunityPoolSpendProposal.encode(
              communityPoolSpendProposal
            ).finish()
          ),
        });
        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [{ amount: initialDeposit, denom: "utlore" }]
              : [],
          proposer: wallet.selectedAddress,
        };
        const msg = await env.txClient.msgSubmitProposal(send);

        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.txClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          dispatch(notify("Proposal Submitted", "info"));
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const proposalDeposit = (proposalId, amount) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const send = {
          proposalId: longify(proposalId),
          depositor: wallet.selectedAddress,
          amount: [
            {
              amount: amount,
              denom: process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
            },
          ],
        };

        const msg = await env.txClient.msgDeposit(send);
        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.txClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          dispatch(notify("Proposal Deposit Submitted", "info"));
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};

export const proposalVote = (proposalId, option) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    let choice;
    if (option === "VOTE_OPTION_YES") {
      choice = VoteOption.VOTE_OPTION_YES;
    }
    if (option === "VOTE_OPTION_NO") {
      choice = VoteOption.VOTE_OPTION_NO;
    }
    if (option === "VOTE_OPTION_ABSTAIN") {
      choice = VoteOption.VOTE_OPTION_ABSTAIN;
    }
    if (option === "VOTE_OPTION_NO_WITH_VETO") {
      choice = VoteOption.VOTE_OPTION_NO_WITH_VETO;
    }
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();

        const send = {
          proposalId: longify(proposalId),
          voter: wallet.selectedAddress,
          option: choice,
        };

        const msg = await env.txClient.msgVote(send);

        const fee = {
          amount: [{ amount: "0", denom: "utlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.txClient.signAndBroadcast([msg], {
          fee,
          memo,
        });
        if (result && result.code === 0) {
          dispatch(notify("Proposal Vote Submitted", "info"));
        }
        return result;
      } catch (e) {
        console.error(e);
        dispatch(notify(e.message, "error"));
      }
    }
  };
};
