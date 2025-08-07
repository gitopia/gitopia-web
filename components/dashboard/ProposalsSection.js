import React, { useState, useEffect } from "react";
import {
  Vote,
  CheckCircle2,
  Users,
  Timer,
  Plus,
  ChevronRight,
  Filter,
  Search,
  GitPullRequest,
  Trash2,
  Settings2,
  Tag,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  Loader2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useApiClient } from "../../context/ApiClientContext";
import ProposalDetailsModal from "./ProposalDetailsModal";
import ProposalMessageSummary from "./ProposalMessageSummary";
import { TimeRemainingBadge } from "./ProposalCountdown";
import ProposalStatusBadge from "./ProposalStatusBadge";
import getTallyResult from "../../helpers/getTallyResult";
import { executeGroupProposal } from "../../store/actions/dao";
import { useDispatch } from "react-redux";

const ProposalTypeIcon = ({ type }) => {
  const iconMap = {
    pull_request: GitPullRequest,
    repository_delete: Trash2,
    collaborator: Users,
    release: Tag,
    settings: Settings2,
    default: FileText,
  };

  const Icon = iconMap[type] || iconMap.default;
  return <Icon className="w-4 h-4" />;
};

const VotingProgress = ({ votes, quorum, total }) => {
  const yesVotes = parseInt(votes.yes_count || 0);
  const noVotes = parseInt(votes.no_count || 0);
  const abstainVotes = parseInt(votes.abstain_count || 0);
  const vetoVotes = parseInt(votes.veto_count || 0);

  const yesPercent = (yesVotes / total) * 100;
  const noPercent = (noVotes / total) * 100;
  const abstainPercent = (abstainVotes / total) * 100;
  const vetoPercent = (vetoVotes / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Total Votes: {total}</span>
        <span>Required: {(quorum * 100).toFixed(1)}%</span>
      </div>

      <div className="h-2 bg-base-200 rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-success transition-all duration-500"
            style={{ width: `${yesPercent}%` }}
          />
          <div
            className="bg-error transition-all duration-500"
            style={{ width: `${noPercent}%` }}
          />
          <div
            className="bg-warning transition-all duration-500"
            style={{ width: `${vetoPercent}%` }}
          />
          <div
            className="bg-muted transition-all duration-500"
            style={{ width: `${abstainPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span>Yes ({yesPercent.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-error" />
          <span>No ({noPercent.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span>Veto ({vetoPercent.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <span>Abstain ({abstainPercent.toFixed(1)}%)</span>
        </div>
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
  selectedAddress,
  votes,
  onViewDetails,
  proposalTallies,
}) => {
  const hasVoted = votes?.some((vote) => vote.voter === selectedAddress);
  const latestVotes = votes?.slice(0, 3) || [];
  const needsExecution =
    proposal.status === "PROPOSAL_STATUS_ACCEPTED" &&
    proposal.executor_result === "PROPOSAL_EXECUTOR_RESULT_NOT_RUN" &&
    proposal.messages?.length > 0;

  const renderVoteButton = (option, icon, label, className) => (
    <button
      onClick={() => onVote(proposal.id, option)}
      disabled={isVoting || hasVoted}
      className={`btn btn-sm ${className} gap-1 flex-1`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="bg-base-200 rounded-xl p-5 hover:bg-base-300/70 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ProposalTypeIcon type={proposal.type} />
          </div>
          <div>
            <h3 className="font-medium mb-1 line-clamp-2">{proposal.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>
                {proposal.proposers[0].slice(0, 6)}...
                {proposal.proposers[0].slice(-4)}
              </span>
              <span>•</span>
              <span>#{proposal.id}</span>
            </div>
            <ProposalMessageSummary messages={proposal.messages} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {proposal.status === "PROPOSAL_STATUS_SUBMITTED" && (
            <TimeRemainingBadge endTime={proposal.voting_period_end} />
          )}
          <ProposalStatusBadge status={proposal.status} />
        </div>
      </div>

      {!needsExecution && proposal.id == 44 && (
        <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center text-warning">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="text-sm">
              The proposal message(s) needs to be executed
            </span>
          </div>
        </div>
      )}

      <VotingProgress
        votes={
          proposal.status === "PROPOSAL_STATUS_SUBMITTED"
            ? proposalTallies[proposal.id] || {}
            : proposal.final_tally_result || {}
        }
        quorum={policyInfo?.info.decision_policy.percentage || 0}
        total={parseInt(groupInfo?.total_weight || 0)}
      />

      {latestVotes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="text-xs text-muted-foreground mb-2">Recent Votes</div>
          <div className="space-y-2">
            {latestVotes.map((vote, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {vote.voter.slice(0, 6)}...{vote.voter.slice(-4)}
                </span>
                <span
                  className={
                    vote.option === "VOTE_OPTION_YES"
                      ? "text-success"
                      : vote.option === "VOTE_OPTION_NO"
                        ? "text-error"
                        : vote.option === "VOTE_OPTION_NO_WITH_VETO"
                          ? "text-warning"
                          : "text-muted"
                  }
                >
                  {vote.option.replace("VOTE_OPTION_", "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {proposal.status === "PROPOSAL_STATUS_SUBMITTED" && !hasVoted && (
          <div className="flex gap-2">
            {renderVoteButton(
              "VOTE_OPTION_YES",
              <ThumbsUp className="w-4 h-4" />,
              "Yes",
              "btn-success"
            )}
            {renderVoteButton(
              "VOTE_OPTION_NO",
              <ThumbsDown className="w-4 h-4" />,
              "No",
              "btn-error"
            )}
            {renderVoteButton(
              "VOTE_OPTION_ABSTAIN",
              <MinusCircle className="w-4 h-4" />,
              "Abstain",
              "btn-ghost"
            )}
          </div>
        )}

        {hasVoted && (
          <div className="bg-success/10 text-success rounded-lg p-2 text-sm text-center">
            <CheckCircle2 className="w-4 h-4 inline mr-2" />
            You have voted on this proposal
          </div>
        )}

        <button
          onClick={() => onViewDetails(proposal)}
          className="btn btn-sm btn-ghost w-full"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ProposalFilters = ({ onFilter, activeFilter }) => (
  <div className="flex items-center gap-4 bg-base-200 p-2 rounded-lg mb-6">
    <div className="flex items-center gap-2 px-2">
      <Filter className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Filter:</span>
    </div>
    {["All", "Active", "Passed", "Rejected"].map((filter) => (
      <button
        key={filter}
        onClick={() => onFilter(filter.toLowerCase())}
        className={`btn btn-sm ${activeFilter === filter.toLowerCase() ? "btn-primary" : "btn-ghost"
          }`}
      >
        {filter}
      </button>
    ))}
    {/* <div className="flex-1">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search proposals..."
          className="input input-sm w-full pl-9"
        />
      </div>
    </div> */}
  </div>
);

const ProposalsOverview = ({ proposals, totalVotes, quorum }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {[
      {
        icon: Vote,
        label: "Total Proposals",
        value: proposals.length,
        color: "primary",
      },
      {
        icon: Timer,
        label: "Active Proposals",
        value: proposals.filter((p) => p.status === "PROPOSAL_STATUS_SUBMITTED")
          .length,
        color: "warning",
      },
      {
        icon: CheckCircle2,
        label: "Accepted Proposals",
        value: proposals.filter((p) => p.status === "PROPOSAL_STATUS_ACCEPTED")
          .length,
        color: "success",
      },
    ].map((stat, index) => (
      <div
        key={index}
        className="bg-base-200 rounded-xl p-4 hover:bg-base-300/70 transition-all duration-200"
      >
        <div
          className={`w-10 h-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center mb-3`}
        >
          <stat.icon className={`w-5 h-5 text-${stat.color}`} />
        </div>
        <div className="text-2xl font-bold mb-1">{stat.value}</div>
        <div className="text-sm text-muted-foreground">{stat.label}</div>
      </div>
    ))}
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
  onRefreshProposals,
}) {
  const [filter, setFilter] = useState("all");
  const [proposalTallies, setProposalTallies] = useState({});
  const [proposalVotes, setProposalVotes] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const {
    apiClient,
    cosmosBankApiClient,
    cosmosFeegrantApiClient,
    cosmosGroupApiClient,
    storageApiClient,
  } = useApiClient();
  const [isExecuting, setIsExecuting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchVotesForProposals = async () => {
      try {
        const votesResults = await Promise.all(
          proposals.map((proposal) =>
            cosmosGroupApiClient.queryVotesByProposal(proposal.id)
          )
        );

        const votesMap = {};
        votesResults.forEach((result, index) => {
          votesMap[proposals[index].id] = result.data.votes || [];
        });

        setProposalVotes(votesMap);
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };

    if (proposals.length > 0) {
      fetchVotesForProposals();
    }
  }, [proposals, cosmosGroupApiClient]);

  useEffect(() => {
    const fetchTalliesForActiveProposals = async () => {
      try {
        const activeProposals = proposals.filter(
          (p) => p.status === "PROPOSAL_STATUS_SUBMITTED"
        );

        const tallyResults = await Promise.all(
          activeProposals.map((proposal) =>
            getTallyResult(cosmosGroupApiClient, proposal.id)
          )
        );

        const talliesMap = {};
        activeProposals.forEach((proposal, index) => {
          talliesMap[proposal.id] = tallyResults[index];
        });

        setProposalTallies(talliesMap);
      } catch (error) {
        console.error("Error fetching tallies:", error);
      }
    };

    if (proposals.length > 0) {
      fetchTalliesForActiveProposals();
    }
  }, [proposals, cosmosGroupApiClient]);

  const handleExecuteProposal = async (proposal) => {
    setIsExecuting(true);
    try {
      const result = await dispatch(
        executeGroupProposal(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          storageApiClient,
          proposal
        )
      );

      if (result && result.code === 0) {
        // Refresh proposals list after successful execution
        await onRefreshProposals();

        // Fetch updated proposal data to update the modal UI
        try {
          const updatedProposalRes = await cosmosGroupApiClient.queryProposal(proposal.id);
          if (updatedProposalRes && updatedProposalRes.data && updatedProposalRes.data.proposal) {
            setSelectedProposal(updatedProposalRes.data.proposal);
          }
        } catch (error) {
          console.error("Error fetching updated proposal:", error);
        }
      }
    } catch (error) {
      console.error("Error executing proposal:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const filteredProposals = proposals.filter((proposal) => {
    if (filter === "active")
      return proposal.status === "PROPOSAL_STATUS_SUBMITTED";
    if (filter === "passed")
      return proposal.status === "PROPOSAL_STATUS_ACCEPTED";
    if (filter === "rejected")
      return proposal.status === "PROPOSAL_STATUS_REJECTED";
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div className="text-muted-foreground">Loading proposals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Governance Proposals</h2>
          <p className="text-muted-foreground">
            Participate in {dao.name}'s decision-making process
          </p>
        </div>
        <button onClick={onCreateProposal} className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Create Proposal
        </button>
      </div>

      <ProposalsOverview
        proposals={proposals}
        totalVotes={Object.values(proposalVotes).flat().length}
        quorum={policyInfo?.info.decision_policy.percentage || 0}
      />

      <ProposalFilters onFilter={setFilter} activeFilter={filter} />

      {filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              groupInfo={groupInfo}
              policyInfo={policyInfo}
              onVote={onVote}
              isVoting={false}
              selectedAddress={selectedAddress}
              proposalTallies={proposalTallies}
              votes={proposalVotes[proposal.id]}
              onViewDetails={(p) => {
                setSelectedProposal(p);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-base-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-base-300 mx-auto mb-4 flex items-center justify-center">
            <Vote className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Proposals Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {filter === "all"
              ? "There are no proposals yet. Create a new proposal to get started."
              : `No ${filter} proposals found. Try changing the filter or create a new proposal.`}
          </p>
          <button onClick={onCreateProposal} className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" />
            Create First Proposal
          </button>
        </div>
      )}

      {selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProposal(null);
          }}
          onVote={onVote}
          onExecute={() => handleExecuteProposal(selectedProposal)}
          isExecuting={isExecuting}
          groupInfo={groupInfo}
          policyInfo={policyInfo}
          selectedAddress={selectedAddress}
          votes={proposalVotes[selectedProposal.id]}
          cosmosGroupApiClient={cosmosGroupApiClient}
          storageApiClient={storageApiClient}
        />
      )}
    </div>
  );
}
