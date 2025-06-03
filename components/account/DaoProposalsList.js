import { useState, useEffect } from "react";
import { useApiClient } from "../../context/ApiClientContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Users,
  Wallet,
  Settings2,
  RefreshCw,
  Tag,
  Rocket,
  GitMerge,
  Text,
  AlertCircle,
  Search,
  X,
} from "lucide-react";
import ProposalDetailsView from "./ProposalDetailsView";
import getGroupInfo from "../../helpers/getGroupInfo";

dayjs.extend(relativeTime);

const MessageTypeConfig = {
  "/cosmos.group.v1.MsgUpdateGroupMembers": {
    icon: Users,
    title: "Update Members",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  "/gitopia.gitopia.gitopia.MsgUpdateDaoConfig": {
    icon: Settings2,
    title: "Update Config",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
  "/gitopia.gitopia.gitopia.MsgUpdateDaoMetadata": {
    icon: RefreshCw,
    title: "Update Metadata",
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
  },
  "/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy": {
    icon: Settings2,
    title: "Update Governance",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  "/gitopia.gitopia.gitopia.MsgDaoTreasurySpend": {
    icon: Wallet,
    title: "Treasury Spend",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  "/gitopia.gitopia.gitopia.MsgInvokeDaoMergePullRequest": {
    icon: GitMerge,
    title: "Merge PR",
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  "/gitopia.gitopia.gitopia.MsgDaoCreateRelease": {
    icon: Rocket,
    title: "Create Release",
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
  },
  Text: {
    icon: Text,
    title: "Text Proposal",
    color: "text-gray-400",
    bgColor: "bg-gray-400/10",
  },
};

export default function DaoProposalsList({ dao }) {
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    voting: 0,
    passed: 0,
    rejected: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const { apiClient } = useApiClient();

  useEffect(() => {
    const fetchProposals = async () => {
      if (!dao.group_id) return;
      try {
        const info = await getGroupInfo(apiClient, dao.group_id);
        setGroupInfo(info);

        const response = await apiClient.cosmos.group.v1.proposalsByGroupPolicy(
          {
            address: info.admin,
          }
        );
        const proposalsList = response.proposals.reverse();
        setProposals(proposalsList);

        const stats = proposalsList.reduce(
          (acc, p) => ({
            total: acc.total + 1,
            voting:
              acc.voting + (p.status === "PROPOSAL_STATUS_SUBMITTED" ? 1 : 0),
            passed:
              acc.passed + (p.status === "PROPOSAL_STATUS_ACCEPTED" ? 1 : 0),
            rejected:
              acc.rejected + (p.status === "PROPOSAL_STATUS_REJECTED" ? 1 : 0),
          }),
          { total: 0, voting: 0, passed: 0, rejected: 0 }
        );
        setStats(stats);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals();
  }, [dao.group_id]);

  const getMessageType = (proposal) => {
    if (!proposal.messages || proposal.messages.length === 0) return "Text";
    return proposal.messages[0]["@type"];
  };

  const getTypeConfig = (type) => {
    return (
      MessageTypeConfig[type] || {
        icon: AlertCircle,
        title: "Unknown Type",
        color: "text-gray-400",
        bgColor: "bg-gray-400/10",
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PROPOSAL_STATUS_SUBMITTED":
        return "text-orange-400";
      case "PROPOSAL_STATUS_ACCEPTED":
        return "text-green-400";
      case "PROPOSAL_STATUS_REJECTED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const formatTime = (time) => {
    const date = dayjs(time);
    const now = dayjs();
    if (now.diff(date, "day") > 30) {
      return date.format("MMM DD, YYYY");
    }
    return date.fromNow();
  };

  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.id.toString().includes(searchQuery)
  );

  return (
    <div className="bg-gray-900 p-6 rounded-lg space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Total</div>
          <div className="text-2xl text-white">{stats.total}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Passed</div>
          <div className="text-2xl text-white">{stats.passed}</div>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-400">Rejected</div>
          <div className="text-2xl text-white">{stats.rejected}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-gray-200">
            All Proposals{" "}
            <span className="text-gray-400">{proposals.length}</span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm bg-gray-800 text-white pl-9 pr-4"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="p-2">ID</th>
                <th className="p-2">Submitted</th>
                <th className="p-2">Type</th>
                <th className="p-2">Title</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((proposal) => {
                const type = getMessageType(proposal);
                const config = getTypeConfig(type);
                const Icon = config.icon;

                return (
                  <tr
                    key={proposal.id}
                    className="border-t border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedProposal(proposal)}
                  >
                    <td className="p-2 text-gray-400">#{proposal.id}</td>
                    <td className="p-2 text-gray-400">
                      {formatTime(proposal.submit_time)}
                    </td>
                    <td className="p-2">
                      <div
                        className={`flex items-center space-x-2 ${config.color}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{config.title}</span>
                      </div>
                    </td>
                    <td className="p-2 text-white">
                      {proposal.title || proposal.messages[0]?.content}
                    </td>
                    <td className={`p-2 ${getStatusColor(proposal.status)}`}>
                      {proposal.status.replace("PROPOSAL_STATUS_", "")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposal Details Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-4 flex justify-end border-b border-gray-800">
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-1 hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <ProposalDetailsView
                proposal={selectedProposal}
                groupInfo={groupInfo}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
