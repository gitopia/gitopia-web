import React from "react";
import { useState, useEffect } from "react";
import {
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Vote,
  Calendar,
  Info,
  MessageSquare,
} from "lucide-react";

const ProposalDetailsModal = ({
  proposal,
  isOpen,
  onClose,
  onVote,
  groupInfo,
  policyInfo,
  selectedAddress,
  cosmosGroupApiClient,
}) => {
  const [tally, setTally] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTally = async () => {
      if (proposal?.status === "PROPOSAL_STATUS_SUBMITTED") {
        try {
          const result = await getTallyResult(
            cosmosGroupApiClient,
            proposal.id
          );
          setTally(result);
        } catch (error) {
          console.error("Error fetching tally:", error);
        }
      }
      setLoading(false);
    };

    if (isOpen) {
      fetchTally();
    }
  }, [proposal, isOpen]);

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
  const hasVoted = proposal.votes?.some((v) => v.voter === selectedAddress);
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

            <div className="flex items-center">
              {proposal.status === "PROPOSAL_STATUS_SUBMITTED" && (
                <TimeRemaining targetDate={proposal.voting_period_end} />
              )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
