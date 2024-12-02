import React from "react";
import { Users, Calendar, Tag, Info } from "lucide-react";
import ProposalMessages from "../dashboard/ProposalMessages";
import ProposalStatusBadge from "../dashboard/ProposalStatusBadge";

const ProposalDetailsView = ({ proposal, groupInfo }) => {
  const calculateVotingStats = () => {
    if (!groupInfo || !proposal.final_tally_result) return null;

    const totalWeight = parseInt(groupInfo.total_weight);
    const tally = proposal.final_tally_result;

    const calculatePercentage = (count) => {
      return ((parseInt(count) / totalWeight) * 100).toFixed(1);
    };

    return {
      yes: calculatePercentage(tally.yes_count),
      no: calculatePercentage(tally.no_count),
      abstain: calculatePercentage(tally.abstain_count),
      veto: calculatePercentage(tally.no_with_veto_count),
    };
  };

  const votingStats = calculateVotingStats();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Proposal #{proposal.id}</h2>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>
                {proposal.proposers[0].slice(0, 8)}...
                {proposal.proposers[0].slice(-8)}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(proposal.submit_time).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <ProposalStatusBadge status={proposal.status} />
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Proposal Details Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{proposal.title}</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap">
              {proposal.summary}
            </p>
          </div>
        </div>

        {/* Voting Results Section */}
        {votingStats && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Voting Results</h3>
            <div className="space-y-4">
              {/* Yes Votes */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Yes</span>
                  <span className="text-sm">{votingStats.yes}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${votingStats.yes}%` }}
                  />
                </div>
              </div>

              {/* No Votes */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">No</span>
                  <span className="text-sm">{votingStats.no}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all"
                    style={{ width: `${votingStats.no}%` }}
                  />
                </div>
              </div>

              {/* Abstain Votes */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Abstain</span>
                  <span className="text-sm">{votingStats.abstain}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-gray-500 rounded-full transition-all"
                    style={{ width: `${votingStats.abstain}%` }}
                  />
                </div>
              </div>

              {/* Veto Votes */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Veto</span>
                  <span className="text-sm">{votingStats.veto}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${votingStats.veto}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proposal Messages Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Proposal Messages</h3>
          <ProposalMessages messages={proposal.messages} />
        </div>

        {/* Execution Status Section */}
        {proposal.status === "PROPOSAL_STATUS_ACCEPTED" && (
          <div className="bg-gray-800 rounded-lg p-6">
            <div
              className={`flex items-center p-4 rounded-lg ${
                proposal.executor_result === "PROPOSAL_EXECUTOR_RESULT_NOT_RUN"
                  ? "bg-yellow-500/10"
                  : "bg-green-500/10"
              }`}
            >
              <Info
                className={`w-5 h-5 mr-2 ${
                  proposal.executor_result ===
                  "PROPOSAL_EXECUTOR_RESULT_NOT_RUN"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              />
              <div>
                <p className="font-medium">
                  {proposal.executor_result ===
                  "PROPOSAL_EXECUTOR_RESULT_NOT_RUN"
                    ? "Pending Execution"
                    : "Proposal Executed"}
                </p>
                <p className="text-sm text-gray-400">
                  {proposal.executor_result ===
                  "PROPOSAL_EXECUTOR_RESULT_NOT_RUN"
                    ? "This proposal has been accepted but hasn't been executed yet."
                    : "This proposal has been executed successfully."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalDetailsView;
