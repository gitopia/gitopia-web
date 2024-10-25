import React, { useEffect, useState, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import getGroupMembers from "../../helpers/getGroupMembers";
import getUser from "../../helpers/getUser";
import { useApiClient } from "../../context/ApiClientContext";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const AccountPeople = ({ dao }) => {
  const [allMembers, setAllMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cosmosGroupApiClient, apiClient } = useApiClient();

  const getAllMembers = useCallback(async () => {
    if (!dao.group_id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const members = await getGroupMembers(cosmosGroupApiClient, dao.group_id);
      const membersWithDetails = await Promise.all(
        members.map(async (member) => {
          const userDetails = await getUser(apiClient, member.member.address);
          return { ...member, userDetails };
        })
      );
      setAllMembers(membersWithDetails);
    } catch (err) {
      console.error("Error fetching group members:", err);
      setError("Failed to load members. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [dao.group_id, cosmosGroupApiClient, apiClient]);

  useEffect(() => {
    getAllMembers();
  }, [getAllMembers]);

  const totalWeight = allMembers.reduce(
    (sum, member) => sum + parseInt(member.member.weight),
    0
  );

  const chartData = allMembers.map((member) => ({
    name: member.userDetails?.username || member.member.address,
    value: parseInt(member.member.weight),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const member = allMembers.find(
        (m) =>
          m.userDetails?.username === data.name ||
          m.member.address === data.name
      );
      const percentage = ((data.value / totalWeight) * 100).toFixed(2);
      return (
        <div className="bg-base-200 p-4 rounded shadow-lg">
          <div className="flex items-center mb-2">
            {member.userDetails?.avatarUrl && (
              <img
                src={member.userDetails.avatarUrl}
                alt={data.name}
                className="w-12 h-12 rounded-full mr-3"
              />
            )}
            <div>
              <p className="font-bold">{data.name}</p>
              <p className="text-sm">{member.userDetails?.name}</p>
            </div>
          </div>
          <p>Voting Power: {percentage}%</p>
          <p>Weight: {data.value}</p>
          {member.userDetails?.bio && (
            <p className="mt-2 text-sm">{member.userDetails.bio}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading members...</div>;
  }

  if (error) {
    return <div className="text-center text-error py-4">{error}</div>;
  }

  return (
    <div className="mt-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Voting Power Distribution</h2>
      <div className="h-80 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <h2 className="text-2xl font-bold mb-4">Members</h2>
      {allMembers.length === 0 ? (
        <p className="text-center py-4">No members found.</p>
      ) : (
        <ul className="divide-y divide-grey">
          {allMembers.map((m) => (
            <li
              key={m.member.address}
              className="p-4 hover:bg-base-200 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {m.userDetails?.avatarUrl && (
                    <img
                      src={m.userDetails.avatarUrl}
                      alt={m.userDetails.username}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {m.userDetails?.username || m.member.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      {m.userDetails?.name}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  Weight: {m.member.weight}
                  <br />
                  Voting Power:{" "}
                  {((parseInt(m.member.weight) / totalWeight) * 100).toFixed(2)}
                  %
                </div>
              </div>
              {m.userDetails?.bio && (
                <p className="mt-2 text-sm text-gray-600">
                  {m.userDetails.bio}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccountPeople;
