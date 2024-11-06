import React, { useEffect, useState } from "react";
import {
  Vote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Timer,
  Scale,
  Plus,
  ChevronRight,
  Calendar,
  Clock3,
} from "lucide-react";
import getTallyResult from "../../helpers/getTallyResult";
import { useApiClient } from "../../context/ApiClientContext";
import ProposalDetailsModal from "./ProposalDetailsModal";

const ProposalStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "PROPOSAL_STATUS_PASSED":
        return {
          icon: CheckCircle2,
          text: "Passed",
          className: "bg-green-900/20 text-green-500",
        };
      case "PROPOSAL_STATUS_REJECTED":
        return {
          icon: XCircle,
          text: "Rejected",
          className: "bg-red-900/20 text-red-500",
        };
      case "PROPOSAL_STATUS_SUBMITTED":
        return {
          icon: Timer,
          text: "Active",
          className: "bg-blue-900/20 text-blue-500",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Unknown",
          className: "bg-gray-900/20 text-gray-500",
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${config.className}`}
    >
      <StatusIcon className="w-3 h-3 mr-1" />
      {config.text}
    </div>
  );
};

const TimeRemaining = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
    };
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft)
    return (
      <span className="text-error flex items-center">
        <Clock3 className="w-4 h-4 mr-1" />
        Expired
      </span>
    );

  const timeDisplay = [];
  if (timeLeft.days > 0) timeDisplay.push(`${timeLeft.days}d`);
  if (timeLeft.hours > 0) timeDisplay.push(`${timeLeft.hours}h`);
  if (timeLeft.minutes > 0) timeDisplay.push(`${timeLeft.minutes}m`);

  return (
    <div className="flex items-center text-primary-content/70">
      <Clock3 className="w-4 h-4 mr-1" />
      <span>{timeDisplay.join(" ")}</span>
    </div>
  );
};

const VotingProgress = ({
  proposal,
  groupInfo,
  policyInfo,
  cosmosGroupApiClient,
}) => {
  const [tally, setTally] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTally = async () => {
      if (proposal.status === "PROPOSAL_STATUS_SUBMITTED") {
        setLoading(true);
        try {
          const result = await getTallyResult(
            cosmosGroupApiClient,
            proposal.id
          );
          setTally(result);
        } catch (error) {
          console.error("Error fetching tally:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTally();
  }, [proposal.id, proposal.status, cosmosGroupApiClient]);

  const calculatePercentages = () => {
    if (!groupInfo) return { yes: 0, quorum: 0 };

    const totalWeight = parseInt(groupInfo.total_weight);

    // Use final tally for completed proposals, current tally for active ones
    const tallyResult =
      proposal.status === "PROPOSAL_STATUS_SUBMITTED"
        ? tally
        : proposal.final_tally_result;

    if (!tallyResult) return { yes: 0, quorum: 0 };

    const yesVotes = parseInt(tallyResult.yes_count || "0");
    const yesPercentage = (yesVotes / totalWeight) * 100;

    const quorumPercentage =
      policyInfo?.info.decision_policy["@type"] ===
      "/cosmos.group.v1.PercentageDecisionPolicy"
        ? parseFloat(policyInfo.info.decision_policy.percentage) * 100
        : 0;

    return { yes: yesPercentage, quorum: quorumPercentage };
  };

  const { yes, quorum } = calculatePercentages();

  if (loading) {
    return (
      <div className="w-full mt-4">
        <div className="h-1.5 bg-base-300 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between text-xs mb-1">
        <span>Yes: {yes.toFixed(1)}%</span>
        <span className="text-primary">Required: {quorum.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-base-300 rounded-full relative">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${yes}%` }}
        />
        <div
          className="absolute top-0 h-full border-r border-primary/50"
          style={{ left: `${quorum}%` }}
        />
      </div>
    </div>
  );
};

const ProposalCard = ({
  proposal,
  groupInfo,
  policyInfo,
  onVote,
  isVoting,
  hasVoted,
  cosmosGroupApiClient,
  selectedAddress,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-base-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start mb-3">
          <TimeRemaining targetDate={proposal.voting_period_end} />
          <ProposalStatusBadge status={proposal.status} />
        </div>

        <h3 className="text-base font-semibold mb-2 line-clamp-2">
          {proposal.title}
        </h3>

        <div className="text-xs text-gray-400 mb-3 flex items-center">
          <Users className="w-3 h-3 mr-1" />
          <span>
            {proposal.proposers[0].slice(0, 4)}...
            {proposal.proposers[0].slice(-4)}
          </span>
          <span className="mx-2">•</span>
          <span>#{proposal.id}</span>
        </div>

        <VotingProgress
          proposal={proposal}
          groupInfo={groupInfo}
          policyInfo={policyInfo}
          cosmosGroupApiClient={cosmosGroupApiClient}
        />

        <div className="mt-4 flex flex-col gap-2">
          {!hasVoted && proposal.status === "PROPOSAL_STATUS_SUBMITTED" && (
            <div className="flex gap-2">
              <button
                onClick={() => onVote("VOTE_OPTION_YES")}
                disabled={isVoting}
                className="btn btn-xs btn-primary flex-1"
              >
                Yes
              </button>
              <button
                onClick={() => onVote("VOTE_OPTION_NO")}
                disabled={isVoting}
                className="btn btn-xs btn-error flex-1"
              >
                No
              </button>
              <button
                onClick={() => onVote("VOTE_OPTION_ABSTAIN")}
                disabled={isVoting}
                className="btn btn-xs btn-secondary flex-1"
              >
                Abstain
              </button>
            </div>
          )}

          {hasVoted && (
            <div className="text-xs text-green-500 flex items-center justify-center bg-green-500/10 py-1 rounded">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Vote submitted
            </div>
          )}

          <button
            className="btn btn-xs btn-ghost w-full"
            onClick={() => setIsModalOpen(true)}
          >
            View Details
            <ChevronRight className="w-3 h-3 ml-1" />
          </button>
        </div>
      </div>

      <ProposalDetailsModal
        proposal={proposal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVote={onVote}
        groupInfo={groupInfo}
        policyInfo={policyInfo}
        selectedAddress={selectedAddress}
        cosmosGroupApiClient={cosmosGroupApiClient}
      />
    </>
  );
};

export default function ProposalsSection({
  dao,
  proposals = [],
  groupInfo,
  policyInfo,
  isLoading,
  onCreateProposal,
  onVote,
  selectedAddress,
}) {
  const activeProposals = proposals.filter(
    (p) => p.status === "PROPOSAL_STATUS_SUBMITTED"
  );
  const completedProposals = proposals.filter(
    (p) => p.status !== "PROPOSAL_STATUS_SUBMITTED"
  );
  const { cosmosGroupApiClient } = useApiClient();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Governance Proposals</h2>
          <p className="text-gray-400">
            Participate in {dao.name}'s decision-making process
          </p>
        </div>
        <button onClick={onCreateProposal} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Proposal
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Vote className="w-5 h-5 mr-2 text-primary" />
          Active Proposals
        </h3>
        {activeProposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                groupInfo={groupInfo}
                policyInfo={policyInfo}
                onVote={(option) => onVote(proposal.id, option)}
                isVoting={false}
                hasVoted={proposal.votes?.some(
                  (v) => v.voter === selectedAddress
                )}
                cosmosGroupApiClient={cosmosGroupApiClient}
              />
            ))}
          </div>
        ) : (
          <div className="bg-base-300 rounded-lg p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No Active Proposals</h4>
            <p className="text-gray-400">
              There are currently no proposals being voted on.
            </p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Past Proposals
        </h3>
        {completedProposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                groupInfo={groupInfo}
                policyInfo={policyInfo}
                selectedAddress={selectedAddress}
                cosmosGroupApiClient={cosmosGroupApiClient}
              />
            ))}
          </div>
        ) : (
          <div className="bg-base-300 rounded-lg p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No Past Proposals</h4>
            <p className="text-gray-400">
              When proposals are completed, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
