import { txClient as cosmosGovTxClient } from "../cosmos.gov.v1beta1/module/index.js";
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
async function initCosmosGovTxClient(accountSigner) {
  return await cosmosGovTxClient(accountSigner, {
    addr: "http://localhost:26657",
  });
}

export const submitGovernanceProposal = (
  repositoryName,
  description,
  proposalType
) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(state.activeWallet.HDpath + "0"),
      state.activeWallet.prefix
    );
    try {
      const textProposal = TextProposal.fromPartial({
        title: repositoryName,
        description: description,
      });
      const msgAny = Any.fromPartial({
        typeUrl: "/cosmos.gov.v1beta1.TextProposal",
        value: Uint8Array.from(TextProposal.encode(textProposal).finish()),
      });

      const send = {
        content: msgAny,
        initialDeposit: [],
        proposer: state.selectedAddress,
      };

      const cosmosGovTxClient = await initCosmosGovTxClient(accountSigner);
      const msg = await cosmosGovTxClient.msgSubmitProposal(send);

      const fee = {
        amount: [{ amount: "0", denom: "tlore" }],
        gas: "200000",
      };

      const memo = "";
      const result = await cosmosGovTxClient.signAndBroadcast([msg], {
        fee,
        memo,
      });
      console.log(send);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const chainUpgradeProposal = (
  repositoryName,
  description,
  proposalType,
  releaseVersionTag,
  height
) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(state.activeWallet.HDpath + "0"),
      state.activeWallet.prefix
    );
    try {
      const msgPlan = Plan.fromPartial({
        name: releaseVersionTag,
        height: height,
        info: "",
      });
      const softwareUpgradeProposal = SoftwareUpgradeProposal.fromPartial({
        title: repositoryName,
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
        proposer: state.selectedAddress,
      };
      const cosmosGovTxClient = await initCosmosGovTxClient(accountSigner);
      const msg = await cosmosGovTxClient.msgSubmitProposal(send);

      const fee = {
        amount: [{ amount: "0", denom: "tlore" }],
        gas: "200000",
      };

      const memo = "";
      const result = await cosmosGovTxClient.signAndBroadcast([msg], {
        fee,
        memo,
      });
      console.log(send);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};

export const communityPoolSpendProposal = (
  repositoryName,
  description,
  proposalType,
  address,
  amount
) => {
  return async (dispatch, getState) => {
    const state = getState().wallet;
    const accountSigner = await DirectSecp256k1HdWallet.fromMnemonic(
      state.activeWallet.mnemonic,
      stringToPath(state.activeWallet.HDpath + "0"),
      state.activeWallet.prefix
    );
    try {
      const amountToSend = [{ amount: amount, denom: "utlore" }];
      const communityPoolSpendProposal = CommunityPoolSpendProposal.fromPartial(
        {
          title: repositoryName,
          description: description,
          recipient: address,
          amount: amountToSend,
        }
      );
      const msgAny = Any.fromPartial({
        typeUrl: "/cosmos.distribution.v1beta1.CommunityPoolSpendProposal",
        value: Uint8Array.from(
          CommunityPoolSpendProposal.encode(communityPoolSpendProposal).finish()
        ),
      });
      const send = {
        content: msgAny,
        initialDeposit: [],
        proposer: state.selectedAddress,
      };
      const cosmosGovTxClient = await initCosmosGovTxClient(accountSigner);
      const msg = await cosmosGovTxClient.msgSubmitProposal(send);

      const fee = {
        amount: [{ amount: "0", denom: "tlore" }],
        gas: "200000",
      };

      const memo = "";
      const result = await cosmosGovTxClient.signAndBroadcast([msg], {
        fee,
        memo,
      });
      console.log(send);
      return result;
    } catch (e) {
      console.error(e);
      dispatch(notify(e.message, "error"));
    }
  };
};
