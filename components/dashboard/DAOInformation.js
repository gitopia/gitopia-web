import React from "react";
import {
  Globe,
  Clock,
  Info,
  Percent,
  Settings2,
  GitPullRequest,
  Trash2,
  UsersRound,
  Tag,
  ExternalLink,
  Copy,
  Landmark,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const InfoItem = ({ icon: Icon, title, value, isLink, copyable }) => (
  <div className="flex items-center space-x-3 py-3 border-b border-base-300 last:border-0">
    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    <div className="flex-grow">
      <div className="text-sm text-muted-foreground">{title}</div>
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 flex items-center space-x-1"
        >
          <span className="break-all">{value}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ) : copyable && value ? (
        <div className="flex items-center justify-between">
          <span>{value}</span>
          <button
            onClick={() => navigator.clipboard.writeText(value)}
            className="p-1 hover:bg-base-200 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="text-base">
          {value || (
            <span className="text-muted-foreground italic">Not specified</span>
          )}
        </div>
      )}
    </div>
  </div>
);

const GovernanceRequirement = ({ icon: Icon, title, value }) => (
  <div className="flex items-center space-x-4 py-3">
    <div className="bg-base-200 p-2 rounded-lg">
      <Icon className="w-4 h-4 text-base-content" />
    </div>
    <span className="flex-1 text-base-content">{title}</span>
    {value ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    )}
  </div>
);

export default function DAOInformation({ dao, policyInfo, treasuryBalance }) {
  const getQuorumPercentage = () => {
    if (
      policyInfo &&
      policyInfo.info.decision_policy["@type"] ===
        "/cosmos.group.v1.PercentageDecisionPolicy"
    ) {
      return parseFloat(policyInfo.info.decision_policy.percentage) * 100;
    }
    return null;
  };

  const getVotingPeriod = () => {
    if (policyInfo) {
      const hours =
        parseInt(policyInfo.info.decision_policy.windows.voting_period) / 3600;
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-base-100 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">DAO Information</h3>
            <p className="text-sm text-muted-foreground">
              General information and settings
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-base-200/50 rounded-lg p-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Landmark className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Treasury</div>
              <div className="font-medium uppercase">{treasuryBalance}</div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-base-200">
          <InfoItem icon={Info} title="Description" value={dao.description} />
          <InfoItem
            icon={Globe}
            title="Website"
            value={dao.website}
            isLink={true}
          />
          <InfoItem
            icon={Clock}
            title="Voting Period"
            value={getVotingPeriod()}
          />
          <InfoItem
            icon={Percent}
            title="Quorum Required"
            value={
              getQuorumPercentage()
                ? `${getQuorumPercentage().toFixed(2)}%`
                : null
            }
          />
        </div>

        <div className="mt-8 pt-6 border-t border-base-200">
          <div className="flex items-center space-x-2 mb-4">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-medium">Governance Requirements</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <GovernanceRequirement
              icon={GitPullRequest}
              title="Pull Request Approval"
              value={dao.config?.require_pull_request_proposal}
            />
            <GovernanceRequirement
              icon={Trash2}
              title="Repository Deletion"
              value={dao.config?.require_repository_deletion_proposal}
            />
            <GovernanceRequirement
              icon={UsersRound}
              title="Collaborator Management"
              value={dao.config?.require_collaborator_proposal}
            />
            <GovernanceRequirement
              icon={Tag}
              title="Release Management"
              value={dao.config?.require_release_proposal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
