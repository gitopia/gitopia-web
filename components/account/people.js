import React, { useEffect, useState, useCallback } from "react";
import { useQuery, gql } from "@apollo/client";
import client from "../../helpers/apolloClient";
import getGroupMembers from "../../helpers/getGroupMembers";
import Link from "next/link";
import { useApiClient } from "../../context/ApiClientContext";
import VotingPowerChart from "../dashboard/VotingPowerChart";

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

const AccountPeople = ({ dao }) => {
  const [allMembers, setAllMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiClient } = useApiClient();

  const getAllMembers = useCallback(async () => {
    if (!dao.group_id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const members = await getGroupMembers(apiClient, dao.group_id);
      setAllMembers(members);
    } catch (err) {
      console.error("Error fetching group members:", err);
      setError("Failed to load members. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [dao.group_id, apiClient]);

  useEffect(() => {
    getAllMembers();
  }, [getAllMembers]);

  // Extract member addresses for the GraphQL query
  const memberAddresses = allMembers.map((member) => member.member.address);

  // Fetch user data using GraphQL
  const { data: userData } = useQuery(GET_USERS, {
    variables: { addresses: memberAddresses },
    client: client,
    skip: memberAddresses.length === 0,
  });

  // Create a map of address to user data
  const userDataMap =
    userData?.users?.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {}) || {};

  const totalWeight = allMembers.reduce(
    (sum, member) => sum + parseInt(member.member.weight),
    0
  );

  const chartData = allMembers.map((member) => {
    const user = userDataMap[member.member.address];
    return {
      name: user?.username || member.member.address,
      value: (parseInt(member.member.weight) / totalWeight) * 100,
    };
  });

  if (isLoading) {
    return <div className="text-center py-4">Loading members...</div>;
  }

  if (error) {
    return <div className="text-center text-error py-4">{error}</div>;
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <VotingPowerChart
        data={chartData}
        height={400}
        innerRadius={80}
        outerRadius={120}
      />

      <h2 className="text-2xl font-bold mb-4 mt-8">Members</h2>
      {allMembers.length === 0 ? (
        <p className="text-center py-4">No members found.</p>
      ) : (
        <ul className="divide-y divide-grey">
          {allMembers.map((m) => {
            const userData = userDataMap[m.member.address];
            return (
              <li
                key={m.member.address}
                className="p-4 hover:bg-base-200 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {userData?.avatarUrl && (
                      <img
                        src={userData.avatarUrl}
                        alt={userData.username}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                    )}
                    <div>
                      <Link
                        href={`/${m.member.address}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {userData?.username || m.member.address}
                      </Link>
                      <p className="text-sm text-gray-500">{userData?.name}</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    Weight: {m.member.weight}
                    <br />
                    Voting Power:{" "}
                    {((parseInt(m.member.weight) / totalWeight) * 100).toFixed(
                      2
                    )}
                    %
                  </div>
                </div>
                {userData?.bio && (
                  <p className="mt-2 text-sm text-gray-600">{userData.bio}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AccountPeople;
