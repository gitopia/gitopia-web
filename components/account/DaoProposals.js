import React, { useState, useEffect } from "react";
import { Vote, Users } from "lucide-react";
import { useApiClient } from "../../context/ApiClientContext";
import getGroupInfo from "../../helpers/getGroupInfo";
import getPolicyInfo from "../../helpers/getPolicyInfo";
import getTallyResult from "../../helpers/getTallyResult";
import ProposalMessageSummary from "../dashboard/ProposalMessageSummary";
import ProposalStatusBadge from "../dashboard/ProposalStatusBadge";

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
      <div className="h-2 bg-base-200 rounded-full overflow-hidden">
        <div className="h-full flex">
          <div className="bg-success" style={{ width: `${yesPercent}%` }} />
          <div className="bg-error" style={{ width: `${noPercent}%` }} />
          <div className="bg-warning" style={{ width: `${vetoPercent}%` }} />
          <div className="bg-muted" style={{ width: `${abstainPercent}%` }} />
        </div>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Yes: {yesPercent.toFixed(1)}%</span>
        <span>No: {noPercent.toFixed(1)}%</span>
        <span>Veto: {vetoPercent.toFixed(1)}%</span>
        <span>Abstain: {abstainPercent.toFixed(1)}%</span>
      </div>
    </div>
  );
};

const ProposalCard = ({ proposal, groupInfo, policyInfo, tally }) => {
  return (
    <div className="bg-base-200 p-4 rounded-lg space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{proposal.title}</h3>
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
        <ProposalStatusBadge status={proposal.status} />
      </div>

      <VotingProgress
        votes={
          proposal.status === "PROPOSAL_STATUS_SUBMITTED"
            ? tally
            : proposal.final_tally_result
        }
        quorum={policyInfo?.info.decision_policy.percentage || 0}
        total={parseInt(groupInfo?.total_weight || 0)}
      />

      {proposal.summary && (
        <p className="text-sm text-muted-foreground">{proposal.summary}</p>
      )}
    </div>
  );
};

export default function DaoProposals({ dao }) {
  const [proposals, setProposals] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [policyInfo, setPolicyInfo] = useState(null);
  const [tallies, setTallies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { cosmosGroupApiClient } = useApiClient();

  useEffect(() => {
    const fetchData = async () => {
      if (dao.group_id) {
        try {
          // Fetch group info
          const info = await getGroupInfo(cosmosGroupApiClient, dao.group_id);
          setGroupInfo(info);

          // Fetch policy info
          const policy = await getPolicyInfo(cosmosGroupApiClient, info.admin);
          setPolicyInfo(policy);

          // Fetch proposals
          const response =
            await cosmosGroupApiClient.queryProposalsByGroupPolicy(info.admin);
          const proposalsList = response.data.proposals.reverse();
          setProposals(proposalsList);

          // Fetch tallies for active proposals
          const activeProposals = proposalsList.filter(
            (p) => p.status === "PROPOSAL_STATUS_SUBMITTED"
          );
          const talliesData = {};
          for (const proposal of activeProposals) {
            talliesData[proposal.id] = await getTallyResult(
              cosmosGroupApiClient,
              proposal.id
            );
          }
          setTallies(talliesData);
        } catch (error) {
          console.error("Error fetching proposals data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [dao.group_id, cosmosGroupApiClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Governance Proposals</h2>
          <p className="text-sm text-muted-foreground">
            View {dao.name}'s governance proposals and their current status
          </p>
        </div>
        <div className="text-sm">
          Total Proposals:{" "}
          <span className="font-medium">{proposals.length}</span>
        </div>
      </div>

      {proposals.length > 0 ? (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              groupInfo={groupInfo}
              policyInfo={policyInfo}
              tally={tallies[proposal.id]}
            />
          ))}
        </div>
      ) : (
        <div className="bg-base-200 rounded-lg p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-base-300 mx-auto mb-4 flex items-center justify-center">
            <Vote className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Proposals Yet</h3>
          <p className="text-sm text-muted-foreground">
            This DAO hasn't created any governance proposals yet.
          </p>
        </div>
      )}
    </div>
  );
}
