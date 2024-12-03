import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { connect, useDispatch } from "react-redux";
import DAOMembersList from "./DAOMembersList";
import { createGroupProposal } from "../../store/actions/dao";
import AccountGrants from "../account/grants";
import GreetDao from "../greetDao";
import { useApiClient } from "../../context/ApiClientContext";
import getGroupInfo from "../../helpers/getGroupInfo";
import getGroupMembers from "../../helpers/getGroupMembers";
import getPolicyInfo from "../../helpers/getPolicyInfo";
import DAOInformation from "./DAOInformation";
import ProposalsSection from "./ProposalsSection";
import CreateProposalView from "./CreateProposalView";
import { notify } from "reapop";
import { voteGroupProposal } from "../../store/actions/dao";
import { Copy, Box } from "lucide-react";
import VotingPowerChart from "./VotingPowerChart";
import { useRouter } from "next/router";
import { getBalance } from "../../store/actions/wallet";
import getAnyRepositoryAll from "../../helpers/getAnyRepositoryAll";
import sortBy from "lodash/sortBy";
import DaoRepositories from "./DaoRepositories";
import { useQuery, gql } from "@apollo/client";
import client from "../../helpers/apolloClient";

// Define the GraphQL query
const GET_USERS = gql`
  query GetUsers($addresses: [String!]) {
    users(where: { address_in: $addresses }) {
      id
      username
      name
      avatarUrl
    }
  }
`;

function DaoDashboard({ dao = {}, advanceUser, ...props }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(router.query.tab || "overview");
  const [proposals, setProposals] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [policyInfo, setPolicyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groupMembers, setGroupMembers] = useState([]);
  const [proposalView, setProposalView] = useState("list");
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  const [repositories, setRepositories] = useState([]);

  const {
    cosmosGroupApiClient,
    apiClient,
    cosmosBankApiClient,
    cosmosFeegrantApiClient,
  } = useApiClient();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() => {
    async function initBalance() {
      const balance = await props.getBalance(cosmosBankApiClient, dao.address);
      setTreasuryBalance(
        props.advanceUser === true
          ? balance + " " + process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
          : (balance / 1000000).toFixed(2) +
              " " +
              process.env.NEXT_PUBLIC_CURRENCY_TOKEN
      );
    }
    initBalance();
  }, [dao.address]);

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
        setProposals(response.data.proposals.reverse());
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

  const memberAddresses = useMemo(
    () => groupMembers.map((member) => member.member.address),
    [groupMembers]
  );

  const { data: userData } = useQuery(GET_USERS, {
    variables: { addresses: memberAddresses },
    client: client,
    skip: memberAddresses.length === 0,
  });

  const userDataMap = useMemo(
    () =>
      userData?.users?.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {}),
    [userData]
  );

  const votingPowerData = useMemo(() => {
    const totalWeight = groupMembers.reduce(
      (sum, member) => sum + Number(member.member.weight),
      0
    );
    return groupMembers.map((member) => ({
      name:
        userDataMap?.[member.member.address]?.username || member.member.address,
      value: (Number(member.member.weight) / totalWeight) * 100,
    }));
  }, [groupMembers, userDataMap]);

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const repos = await getAnyRepositoryAll(apiClient, dao.address);
        const sortedRepos = sortBy(repos, (r) => -Number(r.updatedAt));
        setRepositories(sortedRepos);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    }

    if (dao.address) {
      fetchRepositories();
    }
  }, [dao.address]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "proposals") setProposalView("list");

    // Update URL without full page reload
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: tabId },
      },
      undefined,
      { shallow: true }
    );
  };

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
    <div className="bg-base-200 rounded-lg p-6 mb-8 flex items-center space-x-6">
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
  );

  const renderTabs = () => (
    <div className="flex space-x-1 bg-base-200 p-1 rounded-lg mb-6">
      {[
        { id: "overview", label: "Overview" },
        {
          id: "repositories",
          label: "Repositories",
          icon: <Box size={16} className="mr-2" />,
        },
        { id: "members", label: "Members" },
        { id: "proposals", label: "Proposals" },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center
            ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-primary/10"
            }`}
        >
          {tab.icon}
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
            <DAOInformation
              dao={dao}
              policyInfo={policyInfo}
              treasuryBalance={treasuryBalance}
            />
            <VotingPowerChart data={votingPowerData} />
          </div>
        );
      case "repositories":
        return <DaoRepositories repositories={repositories} dao={dao} />;

      case "members":
        return (
          <div className="bg-base-200 p-4 rounded-lg">
            <DAOMembersList
              groupMembers={groupMembers}
              dao={dao}
              groupInfo={groupInfo}
              refreshDao={props.refreshData}
              userDataMap={userDataMap}
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
              treasuryBalance={treasuryBalance}
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
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, { getBalance })(DaoDashboard);
