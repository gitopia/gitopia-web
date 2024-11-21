import React from "react";
import {
  Globe,
  MapPin,
  Clock,
  Info,
  Percent,
  Users,
  Link as LinkIcon,
  Wallet,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  GitPullRequest,
  Trash2,
  UsersRound,
  Tag,
  Settings2,
  Copy,
} from "lucide-react";

const InfoCard = ({ icon: Icon, title, value, isLink, copyable }) => (
  <div className="bg-base-300/50 rounded-lg p-4 hover:bg-base-300 transition-colors">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
    </div>
    <div className="min-h-[28px]">
      {isLink && value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 flex items-center space-x-1 font-medium"
        >
          <span className="break-all">{value}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : copyable && value ? (
        <div className="flex items-center justify-between">
          <span className="font-medium">{value}</span>
          <button
            onClick={() => navigator.clipboard.writeText(value)}
            className="p-1 hover:bg-base-200 rounded-md transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <p className="font-medium">
          {value || (
            <span className="text-muted-foreground">Not specified</span>
          )}
        </p>
      )}
    </div>
  </div>
);

const ConfigCard = ({ title, icon: Icon, value, description }) => (
  <div className="bg-base-300/50 rounded-lg p-4 hover:bg-base-300 transition-colors">
    <div className="flex items-start space-x-3">
      <div className="p-2 bg-base-200 rounded-lg">
        <Icon
          className={`w-4 h-4 ${
            value ? "text-primary" : "text-muted-foreground"
          }`}
        />
      </div>
      <div className="space-y-1">
        <h5 className="font-medium">{title}</h5>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div
          className={`text-sm font-medium ${
            value ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {value ? "Required" : "Not Required"}
        </div>
      </div>
    </div>
  </div>
);

const DaoConfigCard = ({ config }) => {
  const configItems = [
    {
      icon: GitPullRequest,
      title: "Pull Request Proposals",
      value: config?.require_pull_request_proposal,
      description: "DAO approval required for merging pull requests",
    },
    {
      icon: Trash2,
      title: "Repository Deletion",
      value: config?.require_repository_deletion_proposal,
      description: "DAO approval required for deleting repositories",
    },
    {
      icon: UsersRound,
      title: "Collaborator Management",
      value: config?.require_collaborator_proposal,
      description: "DAO approval required for managing collaborators",
    },
    {
      icon: Tag,
      title: "Release Management",
      value: config?.require_release_proposal,
      description: "DAO approval required for managing releases",
    },
  ];

  return (
    <div className="col-span-2 bg-base-300/50 rounded-lg p-6 hover:bg-base-300/70 transition-colors">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Settings2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="font-medium">DAO Configuration</h4>
          <div className="text-sm text-muted-foreground">
            Governance requirements
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configItems.map((item, index) => (
          <ConfigCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default function DAOInformation({ dao, policyInfo }) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={Info} title="Description" value={dao.description} />
        <InfoCard icon={MapPin} title="Location" value={dao.location} />
        <InfoCard
          icon={Globe}
          title="Website"
          value={dao.website}
          isLink={true}
        />
        <InfoCard
          icon={Clock}
          title="Voting Period"
          value={getVotingPeriod()}
        />
        <InfoCard
          icon={Percent}
          title="Quorum Required"
          value={
            getQuorumPercentage()
              ? `${getQuorumPercentage().toFixed(2)}%`
              : null
          }
        />
      </div>

      <DaoConfigCard config={dao.config} />
    </div>
  );
}
