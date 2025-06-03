import { useState, useEffect } from "react";
import { useApiClient } from "../../context/ApiClientContext";
import { Vote, ChevronRight, Users, Circle } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CompactDaoProposals({ dao }) {
  const [proposals, setProposals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    passed: 0,
    rejected: 0,
  });
  const { apiClient } = useApiClient();

  useEffect(() => {
    const fetchProposals = async () => {
      if (!dao.group_id) return;
      try {
        const groupInfo = await apiClient.cosmos.group.v1.groupInfo({
          groupId: dao.group_id,
        });
        const response = await apiClient.cosmos.group.v1.proposalsByGroupPolicy(
          {
            address: groupInfo.info.admin,
          }
        );
        const proposalsList = response.proposals;
        setProposals(proposalsList);

        // Calculate statistics
        const stats = proposalsList.reduce(
          (acc, p) => ({
            total: acc.total + 1,
            active:
              acc.active + (p.status === "PROPOSAL_STATUS_SUBMITTED" ? 1 : 0),
            passed:
              acc.passed + (p.status === "PROPOSAL_STATUS_ACCEPTED" ? 1 : 0),
            rejected:
              acc.rejected + (p.status === "PROPOSAL_STATUS_REJECTED" ? 1 : 0),
          }),
          { total: 0, active: 0, passed: 0, rejected: 0 }
        );
        setStats(stats);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals();
  }, [dao.group_id]);

  const chartData = [
    { name: "Active", value: stats.active, color: "#FFB020" },
    { name: "Passed", value: stats.passed, color: "#2F9E44" },
    { name: "Rejected", value: stats.rejected, color: "#E03131" },
  ];

  const getLatestProposals = () => proposals.slice(0, 3);

  return (
    <div className="bg-base-200 p-6 rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Governance Overview</h2>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          Total Proposals: {stats.total}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-base-100 p-4 rounded-lg">
          <div className="text-yellow-500 text-sm font-medium">Active</div>
          <div className="text-2xl font-bold mt-1">{stats.active}</div>
        </div>
        <div className="bg-base-100 p-4 rounded-lg">
          <div className="text-green-500 text-sm font-medium">Passed</div>
          <div className="text-2xl font-bold mt-1">{stats.passed}</div>
        </div>
        <div className="bg-base-100 p-4 rounded-lg">
          <div className="text-red-500 text-sm font-medium">Rejected</div>
          <div className="text-2xl font-bold mt-1">{stats.rejected}</div>
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "rgba(0,0,0,0.8)", border: "none" }}
              itemStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" fill="#6366F1">
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {getLatestProposals().length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Latest Proposals
          </div>
          {getLatestProposals().map((proposal) => (
            <div
              key={proposal.id}
              className="flex items-center justify-between bg-base-100 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Circle
                  className="h-2 w-2"
                  fill={
                    proposal.status === "PROPOSAL_STATUS_SUBMITTED"
                      ? "#FFB020"
                      : proposal.status === "PROPOSAL_STATUS_ACCEPTED"
                      ? "#2F9E44"
                      : "#E03131"
                  }
                />
                <span className="text-sm truncate max-w-[200px]">
                  {proposal.title || `Proposal #${proposal.id}`}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
