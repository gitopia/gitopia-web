import { notify } from "reapop";
import { sendTransaction, setupTxClients } from "./env";
import { updateUserBalance } from "./wallet";

export const submitGovernanceProposal = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  title,
  description,
  proposalType,
  initialDeposit
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
        const TextProposal = (
          await import("cosmjs-types/cosmos/gov/v1beta1/gov")
        ).TextProposal;
        const Any = (await import("cosmjs-types/google/protobuf/any")).Any;
        const textProposal = TextProposal.fromPartial({
          title: title,
          description: description,
        });
        // const msgAny = Any.fromPartial({
        //   typeUrl: "/cosmos.gov.v1beta1.TextProposal",
        //   value: Uint8Array.from(TextProposal.encode(textProposal).finish()),
        // });
        const msgAny = Any.fromPartial({
          typeUrl: "/cosmos.gov.v1beta1.TextProposal",
          value: TextProposal.encode(textProposal).finish(),
        });
        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [
                  {
                    amount: initialDeposit,
                    denom:
                      process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
                  },
                ]
              : [],
          proposer: wallet.selectedAddress,
        };
        const message = await env.txClient.msgSubmitProposal(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Proposal Submitted", "info"));
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

export const chainUpgradeProposal = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
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
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState
        );
        const { env } = getState();
        const Any = (await import("cosmjs-types/google/protobuf/any")).Any;
        const { SoftwareUpgradeProposal, Plan } = await import(
          "cosmjs-types/cosmos/upgrade/v1beta1/upgrade"
        );
        const longify = (
          await import("@cosmjs/stargate/build/queryclient/utils")
        ).longify;
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
          value: SoftwareUpgradeProposal.encode(
            softwareUpgradeProposal
          ).finish(),
        });
        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [
                  {
                    amount: initialDeposit,
                    denom:
                      process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
                  },
                ]
              : [],
          proposer: wallet.selectedAddress,
        };
        const message = await env.txClient.msgSubmitProposal(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Proposal Submitted", "info"));
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

export const communityPoolSpendProposal = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
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
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState
        );
        const { env } = getState();
        const Any = (await import("cosmjs-types/google/protobuf/any")).Any;
        const CommunityPoolSpendProposal = (
          await import("cosmjs-types/cosmos/distribution/v1beta1/distribution")
        ).CommunityPoolSpendProposal;
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
          value: CommunityPoolSpendProposal.encode(
            communityPoolSpendProposal
          ).finish(),
        });
        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [
                  {
                    amount: initialDeposit,
                    denom:
                      process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
                  },
                ]
              : [],
          proposer: wallet.selectedAddress,
        };
        const message = await env.txClient.msgSubmitProposal(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Proposal Submitted", "info"));
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

export const paramChangeProposal = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  title,
  description,
  proposalType,
  paramSubspaces,
  paramKeys,
  paramValues,
  initialDeposit
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
        const Any = (await import("cosmjs-types/google/protobuf/any")).Any;
        const { ParameterChangeProposal, ParamChange } = await import(
          "cosmjs-types/cosmos/params/v1beta1/params"
        );
        const changes = [];

        for (let i = 0; i < paramSubspaces.length; i++) {
          const change = ParamChange.fromPartial({
            subspace: paramSubspaces[i],
            key: paramKeys[i],
            value: paramValues[i],
          });
          changes.push(change);
        }
        const paramChangeProposal = ParameterChangeProposal.fromPartial({
          title: title,
          description: description,
          changes: changes,
        });
        const msgAny = Any.fromPartial({
          typeUrl: "/cosmos.params.v1beta1.ParameterChangeProposal",
          value: ParameterChangeProposal.encode(paramChangeProposal).finish(),
        });
        const send = {
          content: msgAny,
          initialDeposit:
            initialDeposit != 0
              ? [
                  {
                    amount: initialDeposit,
                    denom:
                      process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toString(),
                  },
                ]
              : [],
          proposer: wallet.selectedAddress,
        };
        const message = await env.txClient.msgSubmitProposal(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Proposal Submitted", "info"));
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

export const proposalDeposit = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  proposalId,
  amount
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
        const longify = (
          await import("@cosmjs/stargate/build/queryclient/utils")
        ).longify;
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

        const message = await env.txClient.msgDeposit(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result) {
          if (result.code === 0) {
            dispatch(notify("Proposal Deposit Submitted", "info"));
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

export const proposalVote = (
  cosmosBankApiClient,
  cosmosFeegrantApiClient,
  proposalId,
  option
) => {
  return async (dispatch, getState) => {
    const { wallet } = getState();
    const VoteOption = (await import("cosmjs-types/cosmos/gov/v1beta1/gov"))
      .VoteOption;
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
        await setupTxClients(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          dispatch,
          getState
        );
        const { env } = getState();
        const longify = (
          await import("@cosmjs/stargate/build/queryclient/utils")
        ).longify;
        const send = {
          proposalId: longify(proposalId),
          voter: wallet.selectedAddress,
          option: choice,
        };
        const message = await env.txClient.msgVote(send);
        const result = await sendTransaction({ message })(dispatch, getState);
        updateUserBalance(cosmosBankApiClient, cosmosFeegrantApiClient)(
          dispatch,
          getState
        );
        if (result && result.code === 0) {
          if (result.code === 0) {
            dispatch(notify("Proposal Vote Submitted", "info"));
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
