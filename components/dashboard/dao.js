import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { connect, useDispatch } from "react-redux";
import DAOMembersList from "./DAOMembersList";
import { createGroupProposal } from "../../store/actions/dao";
import AccountGrants from "../account/grants";
import GreetDao from "../greetDao";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useApiClient } from "../../context/ApiClientContext";
import getGroupInfo from "../../helpers/getGroupInfo";
import getGroupMembers from "../../helpers/getGroupMembers";
import getPolicyInfo from "../../helpers/getPolicyInfo";
import DAOInformation from "./DAOInformation";
import ProposalsSection from "./ProposalsSection";
import CreateProposalView from "./CreateProposalView";
import { notify } from "reapop";
import { voteGroupProposal } from "../../store/actions/dao";
import { Copy } from "lucide-react";

function DaoDashboard({ dao = {}, ...props }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [proposals, setProposals] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [policyInfo, setPolicyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groupMembers, setGroupMembers] = useState([]);
  const [proposalView, setProposalView] = useState("list");
  const {
    cosmosGroupApiClient,
    apiClient,
    cosmosBankApiClient,
    cosmosFeegrantApiClient,
  } = useApiClient();
  const dispatch = useDispatch();

  const COLORS = [
    "#1880DE",
    "#00C49F",
    "#3CC23A",
    "#FF8042",
    "#EE9006",
    "#82CA9D",
    "#A4DE6C",
  ];

  useEffect(() => {
    if (dao.group_id) {
      setIsLoading(true);
      fetchGroupInfo();
    }
  }, [dao.group_id]);

  useEffect(() => {
    if (groupInfo) {
      fetchPolicyInfo();
      fetchProposals();
      fetchGroupMembers();
    }
  }, [groupInfo]);

  const fetchGroupInfo = async () => {
    try {
      const info = await getGroupInfo(cosmosGroupApiClient, dao.group_id);
      setGroupInfo(info);
    } catch (error) {
      console.error("Error fetching group info:", error);
    }
  };

  const fetchPolicyInfo = async () => {
    try {
      const info = await getPolicyInfo(cosmosGroupApiClient, groupInfo.admin);
      setPolicyInfo(info);
    } catch (error) {
      console.error("Error fetching policy info:", error);
    }
  };

  const fetchProposals = async () => {
    try {
      if (groupInfo && groupInfo.admin) {
        const response = await cosmosGroupApiClient.queryProposalsByGroupPolicy(
          groupInfo.admin
        );
        setProposals(response.data.proposals);
      } else {
        console.error("Failed to fetch group info or admin address");
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const members = await getGroupMembers(cosmosGroupApiClient, dao.group_id);
      setGroupMembers(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const votingPowerData = useMemo(() => {
    const totalWeight = groupMembers.reduce(
      (sum, member) => sum + Number(member.member.weight),
      0
    );
    return groupMembers.map((member) => ({
      name: member.member.address,
      value: (Number(member.member.weight) / totalWeight) * 100,
    }));
  }, [groupMembers]);

  const handleVote = async (proposalId, option) => {
    try {
      const result = await dispatch(
        voteGroupProposal(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          proposalId,
          option
        )
      );
      if (result && result.code === 0) {
        await fetchProposals();
      }
    } catch (error) {
      console.error("Error voting on proposal:", error);
    }
  };

  const renderVotingPowerChart = () => (
    <div className="bg-base-200 p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Voting Power Distribution</h3>
        <div className="text-sm text-muted-foreground">
          Total Members: {groupMembers.length}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={votingPowerData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) =>
              `${name.substring(0, 6)}...${name.substring(
                name.length - 4
              )} (${value.toFixed(1)}%)`
            }
          >
            {votingPowerData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null;
              const { name, value } = payload[0].payload;
              return (
                <div className="bg-background p-2 rounded-md shadow-lg border">
                  <div className="text-sm">{name}</div>
                  <div className="font-semibold">{value.toFixed(2)}%</div>
                </div>
              );
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const handleCreateProposal = async (proposalData) => {
    try {
      const result = await dispatch(
        createGroupProposal(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          proposalData
        )
      );

      if (result && result.code === 0) {
        notify("Proposal created successfully");
        await fetchProposals(); // Refresh proposals list
        setProposalView("list"); // Return to list view
      } else {
        throw new Error(result?.rawLog || "Failed to create proposal");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      notify(error.message, "error");
    }
  };

  const renderHeader = () => (
    <div className="bg-base-200 rounded-lg p-6 mb-8 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="avatar">
          <div className="w-20 h-20 rounded-lg ring-2 ring-primary/10">
            {dao?.avatarUrl ? (
              <img
                src={dao?.avatarUrl}
                alt={dao?.name}
                className="object-cover"
              />
            ) : (
              <div className="bg-primary/10 flex items-center justify-center text-4xl uppercase h-full font-semibold text-primary">
                {dao?.name?.[0]}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Link
            href={"/" + dao?.name?.toLowerCase()}
            className="text-2xl font-bold hover:text-primary transition-colors"
          >
            {dao?.name}
          </Link>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>
              {dao?.address?.slice(0, 8)}...{dao?.address?.slice(-8)}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(dao?.address)}
              className="p-1 hover:bg-primary/10 rounded-md transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Treasury Balance</div>
          <div className="text-xl font-semibold"></div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="flex space-x-1 bg-base-200 p-1 rounded-lg mb-6">
      {[
        { id: "overview", label: "Overview" },
        { id: "members", label: "Members" },
        { id: "proposals", label: "Proposals" },
        // { id: "authorizations", label: "Authorizations" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            if (tab.id === "proposals") setProposalView("list");
          }}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
            ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-primary/10"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DAOInformation dao={dao} policyInfo={policyInfo} />
            {renderVotingPowerChart()}
          </div>
        );
      case "members":
        return (
          <div className="bg-base-200 p-4 rounded-lg">
            <DAOMembersList
              groupMembers={groupMembers}
              dao={dao}
              groupInfo={groupInfo}
              refreshDao={props.refreshData}
            />
          </div>
        );
      case "proposals":
        if (proposalView === "create") {
          return (
            <CreateProposalView
              dao={dao}
              groupInfo={groupInfo}
              groupMembers={groupMembers}
              policyInfo={policyInfo}
              onSubmit={handleCreateProposal}
              onCancel={() => setProposalView("list")}
            />
          );
        }

        return (
          <ProposalsSection
            dao={dao}
            proposals={proposals}
            groupInfo={groupInfo}
            policyInfo={policyInfo}
            isLoading={isLoading}
            onCreateProposal={() => setProposalView("create")}
            onVote={(proposalId, option) => handleVote(proposalId, option)}
            selectedAddress={props.selectedAddress}
            onRefreshProposals={fetchProposals}
          />
        );
      case "authorizations":
        return (
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Authorizations</h3>
            <AccountGrants address={dao.address} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto max-w-screen-xl px-4 py-8">
      {renderHeader()}
      {renderTabs()}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        renderContent()
      )}
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(DaoDashboard);
