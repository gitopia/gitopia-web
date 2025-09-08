import React from "react";
import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Vote,
  Calendar,
  Info,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { TimeRemaining } from "./ProposalCountdown";
import getTallyResult from "../../helpers/getTallyResult";
import ProposalMessages from "./ProposalMessages";
import ProposalStatusBadge from "./ProposalStatusBadge";

const VoteList = ({ votes }) => {
  const getVoteOptionDisplay = (option) => {
    switch (option) {
      case "VOTE_OPTION_YES":
        return { text: "Yes", color: "text-green-500", icon: CheckCircle2 };
      case "VOTE_OPTION_NO":
        return { text: "No", color: "text-red-500", icon: XCircle };
      case "VOTE_OPTION_ABSTAIN":
        return { text: "Abstain", color: "text-gray-500", icon: AlertCircle };
      case "VOTE_OPTION_NO_WITH_VETO":
        return { text: "Veto", color: "text-purple-500", icon: Vote };
      default:
        return { text: "Unknown", color: "text-gray-500", icon: AlertCircle };
    }
  };

  return (
    <div className="mt-6 bg-base-300 rounded-lg p-4">
      <h5 className="font-semibold mb-4 flex items-center">
        <Users className="w-4 h-4 mr-2" />
        Votes Cast ({votes.length})
      </h5>
      <div className="space-y-3">
        {votes.map((vote, index) => {
          const voteDisplay = getVoteOptionDisplay(vote.option);
          const VoteIcon = voteDisplay.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <div className="text-sm font-mono">
                  {vote.voter.slice(0, 8)}...{vote.voter.slice(-8)}
                </div>
              </div>
              <div className={`flex items-center ${voteDisplay.color}`}>
                <VoteIcon className="w-4 h-4 mr-1" />
                {voteDisplay.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProposalDetailsModal = ({
  proposal,
  isOpen,
  onClose,
  onVote,
  onExecute,
  isExecuting,
  groupInfo,
  policyInfo,
  selectedAddress,
  cosmosGroupApiClient,
  storageApiClient,
}) => {
  const [tally, setTally] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && proposal) {
        setLoading(true);
        try {
          // Fetch both tally and votes
          const [tallyResult, votesResult] = await Promise.all([
            getTallyResult(cosmosGroupApiClient, proposal.id),
            cosmosGroupApiClient.queryVotesByProposal(proposal.id),
          ]);

          setTally(tallyResult);
          setVotes(votesResult.data.votes || []);
        } catch (error) {
          console.error("Error fetching proposal data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [proposal, isOpen, cosmosGroupApiClient]);

  const canExecute = React.useMemo(() => {
    return (
      proposal?.status === "PROPOSAL_STATUS_ACCEPTED" &&
      proposal?.executor_result === "PROPOSAL_EXECUTOR_RESULT_NOT_RUN" &&
      proposal?.messages?.length > 0
    );
  }, [proposal]);

  const isTextProposal = React.useMemo(() => {
    return proposal?.messages?.length === 0;
  }, [proposal]);

  if (!isOpen || !proposal) return null;

  const calculatePercentages = () => {
    if (!groupInfo) return { yes: 0, no: 0, abstain: 0, veto: 0, quorum: 0 };

    const totalWeight = parseInt(groupInfo.total_weight);
    const tallyResult =
      proposal.status === "PROPOSAL_STATUS_SUBMITTED"
        ? tally
        : proposal.final_tally_result;

    if (!tallyResult) return { yes: 0, no: 0, abstain: 0, veto: 0, quorum: 0 };

    const yesVotes = parseInt(tallyResult.yes_count || "0");
    const noVotes = parseInt(tallyResult.no_count || "0");
    const abstainVotes = parseInt(tallyResult.abstain_count || "0");
    const vetoVotes = parseInt(tallyResult.no_with_veto_count || "0");

    return {
      yes: (yesVotes / totalWeight) * 100,
      no: (noVotes / totalWeight) * 100,
      abstain: (abstainVotes / totalWeight) * 100,
      veto: (vetoVotes / totalWeight) * 100,
      quorum:
        policyInfo?.info.decision_policy["@type"] ===
          "/cosmos.group.v1.PercentageDecisionPolicy"
          ? parseFloat(policyInfo.info.decision_policy.percentage) * 100
          : 0,
    };
  };

  const { yes, no, abstain, veto, quorum } = calculatePercentages();
  const hasVoted = votes.some((vote) => vote.voter === selectedAddress);
  const isActive = proposal.status === "PROPOSAL_STATUS_SUBMITTED";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black opacity-50"
          onClick={onClose}
        ></div>

        <div className="relative bg-base-200 rounded-lg w-full max-w-2xl p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Proposal #{proposal.id}
              </h3>
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                Created by {proposal.proposers[0].slice(0, 8)}...
                <span className="mx-2">•</span>
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(proposal.submit_time).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {proposal.status === "PROPOSAL_STATUS_SUBMITTED" && (
                <TimeRemaining endTime={proposal.voting_period_end} />
              )}
              <ProposalStatusBadge status={proposal.status} />
              <button className="btn btn-sm btn-ghost ml-4" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Title & Description */}
            <div>
              <h4 className="text-xl font-semibold mb-3">{proposal.title}</h4>
              <p className="text-gray-300 whitespace-pre-wrap">
                {proposal.summary}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Proposal Messages</h3>
              <ProposalMessages messages={proposal.messages} />
            </div>

            {/* Execution Status */}
            {proposal.status === "PROPOSAL_STATUS_ACCEPTED" && (
              <div
                className={`p-4 rounded-lg ${canExecute ? "bg-warning/10" : "bg-success/10"
                  }`}
              >
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-warning" />
                  <div>
                    <p className="font-medium">
                      {isTextProposal
                        ? "Text Proposal Passed"
                        : canExecute
                          ? "Proposal Execution Required"
                          : "Proposal Executed"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {isTextProposal
                        ? "This is a text-only proposal that required no execution."
                        : canExecute
                          ? "This proposal has passed but hasn't been executed yet. Execute it to apply the changes."
                          : "This proposal has been executed successfully."}
                    </p>
                  </div>
                </div>

                {canExecute && (
                  <button
                    onClick={onExecute}
                    disabled={isExecuting}
                    className="btn btn-warning mt-3 w-full"
                  >
                    {isExecuting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Execute Proposal
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Voting Stats */}
            <div className="bg-base-300 rounded-lg p-4">
              <h5 className="font-semibold mb-4 flex items-center">
                <Vote className="w-4 h-4 mr-2" />
                Voting Progress
              </h5>

              <div className="space-y-4">
                {/* Yes Votes */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Yes</span>
                    <span>{yes.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-base-100 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${yes}%` }}
                    />
                  </div>
                </div>

                {/* No Votes */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>No</span>
                    <span>{no.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-base-100 rounded-full">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all"
                      style={{ width: `${no}%` }}
                    />
                  </div>
                </div>

                {/* Abstain Votes */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Abstain</span>
                    <span>{abstain.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-base-100 rounded-full">
                    <div
                      className="h-full bg-gray-500 rounded-full transition-all"
                      style={{ width: `${abstain}%` }}
                    />
                  </div>
                </div>

                {/* Veto Votes */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Veto</span>
                    <span>{veto.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-base-100 rounded-full">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${veto}%` }}
                    />
                  </div>
                </div>

                {/* Quorum Indicator */}
                <div className="flex items-center justify-between text-sm text-primary mt-4">
                  <span className="flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    Required Quorum
                  </span>
                  <span>{quorum.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Voting Actions */}
            {isActive && !hasVoted && (
              <div className="bg-base-300 rounded-lg p-4">
                <h5 className="font-semibold mb-4 flex items-center">
                  <Vote className="w-4 h-4 mr-2" />
                  Cast Your Vote
                </h5>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onVote("VOTE_OPTION_YES")}
                    className="btn btn-success"
                  >
                    Vote Yes
                  </button>
                  <button
                    onClick={() => onVote("VOTE_OPTION_NO")}
                    className="btn btn-error"
                  >
                    Vote No
                  </button>
                  <button
                    onClick={() => onVote("VOTE_OPTION_ABSTAIN")}
                    className="btn"
                  >
                    Abstain
                  </button>
                  <button
                    onClick={() => onVote("VOTE_OPTION_NO_WITH_VETO")}
                    className="btn btn-secondary"
                  >
                    Veto
                  </button>
                </div>
              </div>
            )}

            {hasVoted && (
              <div className="bg-green-900/20 text-green-500 p-4 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                You have already voted on this proposal
              </div>
            )}

            {/* Vote List */}
            <VoteList votes={votes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
