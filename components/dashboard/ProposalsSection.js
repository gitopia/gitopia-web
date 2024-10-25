import React from "react";
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
} from "lucide-react";

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
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${config.className}`}
    >
      <StatusIcon className="w-4 h-4 mr-1" />
      {config.text}
    </div>
  );
};

const VotingProgressBar = ({ proposal, groupInfo, policyInfo }) => {
  const calculatePercentages = () => {
    if (!proposal.final_tally_result || !groupInfo)
      return { yes: 0, quorum: 0 };

    const totalWeight = parseInt(groupInfo.total_weight);
    const yesVotes = parseInt(proposal.final_tally_result.yes_count);
    const yesPercentage = (yesVotes / totalWeight) * 100;

    const quorumPercentage =
      policyInfo?.info.decision_policy["@type"] ===
      "/cosmos.group.v1.PercentageDecisionPolicy"
        ? parseFloat(policyInfo.info.decision_policy.percentage) * 100
        : 0;

    return { yes: yesPercentage, quorum: quorumPercentage };
  };

  const { yes, quorum } = calculatePercentages();

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span>Yes Votes: {yes.toFixed(1)}%</span>
        <span>Quorum: {quorum.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-base-300 rounded-full relative">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${yes}%` }}
        />
        <div
          className="absolute top-0 h-full border-r-2 border-red-500"
          style={{ left: `${quorum}%` }}
        />
      </div>
    </div>
  );
};

const VoteButtons = ({ onVote, isVoting, hasVoted }) => {
  if (hasVoted) {
    return (
      <div className="text-sm text-green-500 flex items-center">
        <CheckCircle2 className="w-4 h-4 mr-1" />
        Vote submitted
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      {["Yes", "No", "Abstain", "Veto"].map((option) => (
        <button
          key={option}
          onClick={() => onVote(`VOTE_OPTION_${option.toUpperCase()}`)}
          disabled={isVoting}
          className={`btn btn-sm ${
            option === "Yes"
              ? "btn-primary"
              : option === "No"
              ? "btn-error"
              : option === "Abstain"
              ? "btn-secondary"
              : "btn-warning"
          }`}
        >
          {isVoting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            option
          )}
        </button>
      ))}
    </div>
  );
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();

    if (difference <= 0) {
      return null;
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-error">Expired</span>;

  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.keys(timeLeft).map((interval) => (
        <div key={interval} className="bg-base-300 rounded-lg p-2 text-center">
          <div className="text-xl font-bold">
            {timeLeft[interval].toString().padStart(2, "0")}
          </div>
          <div className="text-xs text-gray-400 uppercase">{interval}</div>
        </div>
      ))}
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
  selectedAddress,
}) => (
  <div className="bg-base-300 rounded-lg p-6 transition-all hover:shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">{proposal.title}</h3>
        <div className="text-sm text-gray-400 mb-2">
          Proposal #{proposal.id} • Created by {proposal.proposers.slice(0, 6)}
          ...{proposal.proposers.slice(-4)}
        </div>
      </div>
      <ProposalStatusBadge status={proposal.status} />
    </div>

    <div className="space-y-4">
      {proposal.status === "PROPOSAL_STATUS_SUBMITTED" && (
        <>
          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Time Remaining
            </h4>
            <CountdownTimer targetDate={proposal.voting_period_end} />
          </div>

          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Voting Progress
            </h4>
            <VotingProgressBar
              proposal={proposal}
              groupInfo={groupInfo}
              policyInfo={policyInfo}
            />
          </div>

          <div className="bg-base-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Your Vote
            </h4>
            <VoteButtons
              onVote={onVote}
              isVoting={isVoting}
              hasVoted={hasVoted}
            />
          </div>
        </>
      )}

      <div className="flex justify-between items-center mt-4">
        <button className="btn btn-sm btn-ghost">
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-400">
            <Scale className="w-4 h-4 mr-1" />
            {proposal.final_tally_result.total_count} votes
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            {groupInfo?.total_weight} eligible
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
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

      {/* Active Proposals Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Vote className="w-5 h-5 mr-2 text-primary" />
          Active Proposals
        </h3>
        {activeProposals.length > 0 ? (
          <div className="grid gap-6">
            {activeProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                groupInfo={groupInfo}
                policyInfo={policyInfo}
                onVote={(option) => onVote(proposal.id, option)}
                isVoting={false} // Add proper loading state
                hasVoted={proposal.votes?.some(
                  (v) => v.voter === selectedAddress
                )}
                selectedAddress={selectedAddress}
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

      {/* Past Proposals Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-primary" />
          Past Proposals
        </h3>
        {completedProposals.length > 0 ? (
          <div className="grid gap-6">
            {completedProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                groupInfo={groupInfo}
                policyInfo={policyInfo}
                selectedAddress={selectedAddress}
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
