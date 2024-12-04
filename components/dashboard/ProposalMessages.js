import React from "react";
import {
  Users,
  Wallet,
  Settings2,
  RefreshCw,
  Tag,
  Rocket,
  GitPullRequest,
  GitMerge,
  Trash2,
  Text,
  Clock,
} from "lucide-react";

const MessageTypeConfig = {
  "/cosmos.group.v1.MsgUpdateGroupMembers": {
    icon: Users,
    title: "Update DAO Members",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  "/gitopia.gitopia.gitopia.MsgUpdateDaoConfig": {
    icon: Settings2,
    title: "Update DAO Config",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  "/gitopia.gitopia.gitopia.MsgUpdateDaoMetadata": {
    icon: RefreshCw,
    title: "Update DAO Metadata",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  "/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy": {
    icon: Settings2,
    title: "Update Governance Parameters",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  "/gitopia.gitopia.gitopia.MsgDaoTreasurySpend": {
    icon: Wallet,
    title: "Treasury Spend",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  "/gitopia.gitopia.gitopia.MsgInvokeDaoMergePullRequest": {
    icon: GitMerge,
    title: "Merge Pull Request",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  "/gitopia.gitopia.gitopia.MsgDaoCreateRelease": {
    icon: Rocket,
    title: "Create Release",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
};

const GroupMemberUpdateMessage = ({ message }) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400">Group ID: {message.group_id}</div>
      <div className="space-y-2">
        {message.member_updates.map((member, index) => (
          <div key={index} className="bg-base-300 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="font-mono text-sm">{member.address}</div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Weight:</span>
                <span className="font-semibold">{member.weight}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TreasurySpendMessage = ({ message }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-base-300 p-3 rounded-lg">
        <div className="text-sm">
          <span className="text-gray-400">Recipient:</span>
          <div className="font-mono">{message.recipient}</div>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Amount:</span>
          <div className="font-semibold">
            {message.amount.map((amt, index) => (
              <div key={index}>
                {parseInt(amt.amount) / 1000000}{" "}
                {amt.denom.replace("u", "").toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DaoConfigMessage = ({ message }) => {
  const configItems = [
    {
      icon: GitPullRequest,
      label: "Pull Request Proposals",
      value: message.config.require_pull_request_proposal,
    },
    {
      icon: Trash2,
      label: "Repository Deletion Proposals",
      value: message.config.require_repository_deletion_proposal,
    },
    {
      icon: Users,
      label: "Collaborator Management",
      value: message.config.require_collaborator_proposal,
    },
    {
      icon: Tag,
      label: "Release Management",
      value: message.config.require_release_proposal,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {configItems.map((item, index) => (
        <div key={index} className="bg-base-300 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <item.icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{item.label}</span>
          </div>
          <div className="mt-2 text-sm font-semibold">
            {item.value ? "Required" : "Not Required"}
          </div>
        </div>
      ))}
    </div>
  );
};

const MergePullRequestMessage = ({ message }) => {
  return (
    <div className="bg-base-300 p-3 rounded-lg">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Repository ID:</span>
          <span className="font-mono">{message.repositoryId}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Pull Request:</span>
          <span className="font-semibold">#{message.iid}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Provider:</span>
          <span className="font-mono text-sm">{message.provider}</span>
        </div>
      </div>
    </div>
  );
};

const CreateReleaseMessage = ({ message }) => {
  return (
    <div className="space-y-4">
      <div className="bg-base-300 p-3 rounded-lg">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Repository:</span>
            <span className="font-mono">
              {message.repositoryId.id}/{message.repositoryId.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Tag:</span>
            <span className="font-semibold">{message.tagName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Target:</span>
            <span className="text-sm">{message.target}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Name:</span>
            <span className="text-sm font-medium">{message.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Type:</span>
            <div className="flex gap-2">
              {message.draft && <span className="badge badge-sm">Draft</span>}
              {message.preRelease && (
                <span className="badge badge-sm">Pre-release</span>
              )}
              {message.isTag && <span className="badge badge-sm">Tag</span>}
            </div>
          </div>
        </div>
      </div>
      {message.description && (
        <div className="bg-base-300 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">Description:</div>
          <div className="text-sm markdown-body">{message.description}</div>
        </div>
      )}
    </div>
  );
};

const DecisionPolicyMessage = ({ message }) => {
  console.log("message", message);
  const quorum = Math.round(
    parseFloat(message.decision_policy.percentage) * 100
  );
  const votingPeriod =
    parseInt(message.decision_policy.windows.voting_period) / (60 * 60 * 24); // Convert seconds to days

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-base-300 p-3 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Quorum</span>
        </div>
        <div className="text-2xl font-semibold">{quorum}%</div>
        <div className="text-xs text-gray-400 mt-1">
          Minimum YES votes required
        </div>
      </div>

      <div className="bg-base-300 p-3 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Voting Period</span>
        </div>
        <div className="text-2xl font-semibold">{votingPeriod} days</div>
        <div className="text-xs text-gray-400 mt-1">
          Time allowed for voting
        </div>
      </div>
    </div>
  );
};

const MessageContent = ({ type, message }) => {
  switch (type) {
    case "/cosmos.group.v1.MsgUpdateGroupMembers":
      return <GroupMemberUpdateMessage message={message} />;
    case "/gitopia.gitopia.gitopia.MsgDaoTreasurySpend":
      return <TreasurySpendMessage message={message} />;
    case "/gitopia.gitopia.gitopia.MsgUpdateDaoConfig":
      return <DaoConfigMessage message={message} />;
    case "/gitopia.gitopia.gitopia.MsgInvokeDaoMergePullRequest":
      return <MergePullRequestMessage message={message} />;
    case "/gitopia.gitopia.gitopia.MsgDaoCreateRelease":
      return <CreateReleaseMessage message={message} />;
    case "/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy":
      return <DecisionPolicyMessage message={message} />;
    default:
      return (
        <div className="bg-base-300 p-3 rounded-lg">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(message, null, 2)}
          </pre>
        </div>
      );
  }
};

const ProposalMessages = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center p-6 bg-base-200 rounded-lg">
        <Text className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-400">
          Text-only proposal with no executable messages
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {messages.map((msg, index) => {
        const type = msg["@type"] || msg.typeUrl;
        const config = MessageTypeConfig[type] || {
          icon: Text,
          title: "Unknown Message Type",
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
        };
        const Icon = config.icon;

        return (
          <div key={index} className="bg-base-200 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${config.bgColor}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <h3 className="font-medium">{config.title}</h3>
                <div className="text-xs text-gray-400 font-mono">{type}</div>
              </div>
            </div>
            <MessageContent type={type} message={msg} />
          </div>
        );
      })}
    </div>
  );
};

export default ProposalMessages;
