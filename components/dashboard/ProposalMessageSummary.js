import React from "react";
import {
  Users,
  ArrowRight,
  Wallet,
  Settings2,
  RefreshCw,
  Tag,
  GitMerge,
  Trash2,
  Text,
  AlertCircle,
} from "lucide-react";

const MessageTypeConfig = {
  "/cosmos.group.v1.MsgUpdateGroupMembers": {
    icon: Users,
    title: "Update Members",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    getSummary: () => "Update DAO members",
  },
  "/gitopia.gitopia.gitopia.MsgUpdateDaoConfig": {
    icon: Settings2,
    title: "Update Config",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    getSummary: () => "Update DAO configuration settings",
  },
  "/gitopia.gitopia.gitopia.MsgUpdateDaoMetadata": {
    icon: RefreshCw,
    title: "Update DAO",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    getSummary: () => "Update DAO metadata",
  },
  "/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy": {
    icon: Settings2,
    title: "Update Governance",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    getSummary: () => "Update governance parameters",
  },
  "/gitopia.gitopia.gitopia.MsgDaoTreasurySpend": {
    icon: Wallet,
    title: "Treasury Spend",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    getSummary: (msg) => {
      const amount = msg.amount[0];
      return `Send ${parseInt(amount.amount) / 1000000} ${amount.denom
        .replace("u", "")
        .toUpperCase()}`;
    },
  },
  "/gitopia.gitopia.gitopia.MsgInvokeMergePullRequest": {
    icon: GitMerge,
    title: "Merge PR",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    getSummary: (msg) => `Merge PR #${msg.iid}`,
  },
};

const ProposalMessageSummary = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Text className="w-3 h-3" />
        <span>Text proposal</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {messages.map((msg, index) => {
        const type = msg["@type"] || msg.typeUrl;
        const config = MessageTypeConfig[type] || {
          icon: AlertCircle,
          title: "Unknown Action",
          color: "text-gray-500",
          bgColor: "bg-gray-500/10",
          getSummary: () => "Execute contract action",
        };
        const Icon = config.icon;

        return (
          <div
            key={index}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.color}`}
          >
            <Icon className="w-3 h-3" />
            <span>{config.getSummary(msg)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProposalMessageSummary;
