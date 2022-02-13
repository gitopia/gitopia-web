import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { notify } from "reapop";
import { Any } from "../cosmos.gov.v1beta1/module/types/google/protobuf/any";
import { TextProposal } from "../cosmos.gov.v1beta1/module/types/cosmos/gov/v1beta1/gov";
import {
  SoftwareUpgradeProposal,
  Plan,
} from "../ibc-go/ibc.applications.transfer.v1/module/types/cosmos/upgrade/v1beta1/upgrade";
import { CommunityPoolSpendProposal } from "../cosmos.distribution.v1beta1/module/types/cosmos/distribution/v1beta1/distribution";
import { setupTxClients } from "./env";

export const submitGovernanceProposal = (title, description, proposalType) => {
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
          initialDeposit: [],
          proposer: wallet.selectedAddress,
        };

        const msg = await env.govTxClient.msgSubmitProposal(send);

        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.govTxClient.signAndBroadcast([msg], {
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
  height
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    if (wallet.activeWallet) {
      try {
        await setupTxClients(dispatch, getState);
        const { env } = getState();
        const msgPlan = Plan.fromPartial({
          name: releaseVersionTag,
          height: height,
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
          initialDeposit: [],
          proposer: wallet.selectedAddress,
        };

        const msg = await env.govTxClient.msgSubmitProposal(send);

        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.govTxClient.signAndBroadcast([msg], {
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
  amount
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
          initialDeposit: [],
          proposer: wallet.selectedAddress,
        };
        const msg = await env.govTxClient.msgSubmitProposal(send);

        const fee = {
          amount: [{ amount: "0", denom: "tlore" }],
          gas: "200000",
        };

        const memo = "";
        const result = await env.govTxClient.signAndBroadcast([msg], {
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
