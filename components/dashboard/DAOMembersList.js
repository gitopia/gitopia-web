import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { updateGroupMembers } from "../../store/actions/dao";
import TextInput from "../textInput";
import { notify } from "reapop";
import AccountCard from "../account/card";
import { useApiClient } from "../../context/ApiClientContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const DAOMembersList = ({ dao, groupMembers, refreshDao }) => {
  const [members, setMembers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newMember, setNewMember] = useState({ address: "", weight: "1" });
  const [newMemberError, setNewMemberError] = useState({
    shown: false,
    type: "",
    message: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const dispatch = useDispatch();
  const {
    apiClient,
    cosmosBankApiClient,
    cosmosFeegrantApiClient,
    cosmosGroupApiClient,
  } = useApiClient();

  useEffect(() => {
    setMembers(groupMembers.map((m) => ({ ...m.member })));
  }, [groupMembers]);

  const handleWeightChange = (index, newWeight) => {
    const updatedMembers = [...members];
    updatedMembers[index].weight = newWeight;
    setMembers(updatedMembers);
    setHasChanges(true);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
    setHasChanges(true);
  };

  const validateNewMember = () => {
    if (!newMember.address) {
      setNewMemberError({
        shown: true,
        type: "error",
        message: "Address is required",
      });
      return false;
    }
    if (!newMember.weight || parseInt(newMember.weight) < 1) {
      setNewMemberError({
        shown: true,
        type: "error",
        message: "Weight must be a positive number",
      });
      return false;
    }
    return true;
  };

  const handleAddMember = () => {
    if (validateNewMember()) {
      setMembers([...members, newMember]);
      setNewMember({ address: "", weight: "1" });
      setNewMemberError({ shown: false, type: "", message: "" });
      setHasChanges(true);
    }
  };

  const handleUpdateMembers = async () => {
    setIsUpdating(true);
    try {
      const memberUpdates = members.map((member) => ({
        address: member.address,
        weight: member.weight,
      }));

      await dispatch(
        updateGroupMembers(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          cosmosGroupApiClient,
          {
            groupId: dao.group_id,
            memberUpdates,
          }
        )
      );

      notify("DAO members updated successfully", "success");
      if (refreshDao) await refreshDao();
      setEditMode(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Error updating DAO members:", error);
      notify("Failed to update DAO members", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const votingDistribution = useMemo(() => {
    const totalWeight = members.reduce(
      (sum, member) => sum + parseInt(member.weight),
      0
    );
    return members.map((member) => ({
      name: member.address.substring(0, 10) + "...",
      value: Number(((parseInt(member.weight) / totalWeight) * 100).toFixed(2)),
    }));
  }, [members]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-200 p-2 rounded shadow">
          <p>{`${payload[0].name}: ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">DAO Members</h3>
        <button
          onClick={() => setEditMode(!editMode)}
          className={`btn btn-sm ${editMode ? "btn-secondary" : "btn-primary"}`}
        >
          {editMode ? "Cancel Edit" : "Edit Membership"}
        </button>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Member</th>
            <th>Weight</th>
            {editMode && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              <td>
                <AccountCard
                  id={member.address}
                  showAvatar={true}
                  avatarSize="xs"
                  dataTest={`member-${index}`}
                />
              </td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    value={member.weight}
                    onChange={(e) => handleWeightChange(index, e.target.value)}
                    className="input input-bordered input-sm w-24"
                    min="1"
                  />
                ) : (
                  member.weight
                )}
              </td>
              {editMode && (
                <td>
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editMode && (
        <div className="flex space-x-2">
          <TextInput
            value={newMember.address}
            name="new-member-address"
            placeholder="New member address"
            setValue={(v) => {
              setNewMember({ ...newMember, address: v });
              setNewMemberError({ shown: false, type: "", message: "" });
            }}
            hint={newMemberError}
            size="sm"
          />
          <input
            type="number"
            value={newMember.weight}
            onChange={(e) => {
              setNewMember({ ...newMember, weight: e.target.value });
              setNewMemberError({ shown: false, type: "", message: "" });
            }}
            placeholder="Weight"
            className="input input-bordered input-sm w-24"
            min="1"
          />
          <button
            onClick={handleAddMember}
            className="btn btn-sm btn-primary"
            disabled={!newMember.address || !newMember.weight}
          >
            Add Member
          </button>
        </div>
      )}

      {editMode && hasChanges && (
        <div className="text-right">
          <button
            onClick={handleUpdateMembers}
            className={`btn btn-primary ${isUpdating ? "loading" : ""}`}
            disabled={isUpdating}
          >
            Update DAO Members
          </button>
        </div>
      )}

      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">Voting Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={votingDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, value }) => `${name} (${value.toFixed(2)}%)`}
            >
              {votingDistribution.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DAOMembersList;
