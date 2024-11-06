import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { connect, useDispatch } from "react-redux";
import DAOMembersList from "./DAOMembersList";
import {
  getDaoDetailsForDashboard,
  createGroupProposal,
} from "../../store/actions/dao";
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
        console.log("group proposals", response);
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
    <div className="bg-base-200 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Voting Power Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={votingPowerData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name.substring(0, 6)}...${name.substring(
                name.length - 4
              )} (${percent.toFixed(0)}%)`
            }
          >
            {votingPowerData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
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
    <main className="container mx-auto max-w-screen-lg py-4 sm:py-12">
      <div className="flex mb-12 mx-4">
        <div className="avatar flex-none items-center">
          <div className={"w-16 h-16 rounded-md"}>
            {dao?.avatarUrl == "" ? (
              <span className="bg-purple-900 flex items-center justify-center text-4xl uppercase h-full">
                {dao?.name[0]}
              </span>
            ) : (
              <img src={dao?.avatarUrl} alt={dao?.name} />
            )}
          </div>
        </div>
        <div className="pl-4">
          <Link
            href={"/" + dao?.name?.toLowerCase()}
            className="link link-primary text-2xl no-underline"
          >
            {dao?.name}
          </Link>
          <div className="text-type-secondary">{dao?.address}</div>
        </div>
      </div>

      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === "overview" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </a>
        <a
          className={`tab ${activeTab === "members" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </a>
        <a
          className={`tab ${activeTab === "proposals" ? "tab-active" : ""}`}
          onClick={() => {
            setActiveTab("proposals");
            setProposalView("list"); // Reset to list view when switching to proposals tab
          }}
        >
          Proposals
        </a>
        <a
          className={`tab ${
            activeTab === "authorizations" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("authorizations")}
        >
          Authorizations
        </a>
      </div>

      {renderContent()}
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(DaoDashboard);
