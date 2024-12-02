import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, connect } from "react-redux";
import { useQuery, gql } from "@apollo/client";
import client from "../../helpers/apolloClient";
import {
  Users,
  UserPlus,
  X,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { notify } from "reapop";
import Link from "next/link";
import AccountCard from "../account/card";
import TextInput from "../textInput";
import { useApiClient } from "../../context/ApiClientContext";
import { MsgUpdateGroupMembers } from "cosmjs-types/cosmos/group/v1/tx";
import { createGroupProposal } from "../../store/actions/dao";
import VotingPowerChart from "./VotingPowerChart";

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

const MemberRow = ({
  member,
  index,
  isEditing,
  onWeightChange,
  onRemove,
  userData,
}) => (
  <div
    className={`flex items-center gap-4 p-4 ${
      index !== 0 ? "border-t border-base-300" : ""
    }`}
  >
    <div className="flex-1">
      {userData ? (
        <div className="flex items-center gap-3">
          {userData.avatarUrl && (
            <img
              src={userData.avatarUrl}
              alt={userData.username || member.address}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <Link
              href={`/${member.address}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {userData.username || member.address}
            </Link>
            {userData.name && (
              <div className="text-sm text-muted-foreground">
                {userData.name}
              </div>
            )}
          </div>
        </div>
      ) : (
        <AccountCard
          id={member.address}
          showAvatar={true}
          avatarSize="sm"
          dataTest={`member-${index}`}
        />
      )}
    </div>
    <div className="w-32">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={member.weight}
            onChange={(e) => onWeightChange(index, e.target.value)}
            className="input input-bordered input-sm w-20"
            min="1"
          />
          <button
            onClick={() => onRemove(index)}
            className="btn btn-ghost btn-sm btn-square text-error hover:text-error"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="text-right font-medium">{member.weight} votes</div>
      )}
    </div>
  </div>
);

const AddMemberForm = ({ newMember, error, onChange, onAdd }) => (
  <div className="border-t border-base-300 p-4">
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
          Member Address
        </label>
        <TextInput
          value={newMember.address}
          name="new-member-address"
          placeholder="Enter wallet address"
          setValue={(v) => onChange({ ...newMember, address: v })}
          hint={error}
          size="sm"
        />
      </div>
      <div className="w-24">
        <label className="text-sm font-medium mb-1.5 block text-muted-foreground">
          Weight
        </label>
        <input
          type="number"
          value={newMember.weight}
          onChange={(e) => onChange({ ...newMember, weight: e.target.value })}
          className="input input-bordered input-sm w-full"
          min="1"
          placeholder="1"
        />
      </div>
      <button
        onClick={onAdd}
        disabled={!newMember.address || !newMember.weight}
        className="btn btn-primary btn-sm gap-2"
      >
        <UserPlus size={16} />
        Add
      </button>
    </div>
  </div>
);

function DAOMembersList({
  dao,
  groupInfo,
  groupMembers,
  refreshDao,
  selectedAddress,
}) {
  const [members, setMembers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [newMember, setNewMember] = useState({ address: "", weight: "1" });
  const [error, setError] = useState({ shown: false, type: "", message: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const dispatch = useDispatch();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  useEffect(() => {
    setMembers(groupMembers.map((m) => ({ ...m.member })));
  }, [groupMembers]);

  // Get the list of member addresses for GraphQL query
  const memberAddresses = members.map((member) => member.address);

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

  const votingDistribution = useMemo(() => {
    const totalWeight = members.reduce(
      (sum, member) => sum + Number(member.weight),
      0
    );
    return members.map((member) => ({
      name: userDataMap[member.address]?.username || member.address,
      value: (Number(member.weight) / totalWeight) * 100,
    }));
  }, [members, userDataMap]);

  const handleWeightChange = (index, newWeight) => {
    const updatedMembers = [...members];
    updatedMembers[index].weight = newWeight;
    setMembers(updatedMembers);
    setHasChanges(true);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const validateNewMember = () => {
    if (!newMember.address) {
      setError({
        shown: true,
        type: "error",
        message: "Address is required",
      });
      return false;
    }
    if (!newMember.weight || parseInt(newMember.weight) < 1) {
      setError({
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
      setError({ shown: false, type: "", message: "" });
      setHasChanges(true);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const memberUpdates = members.map((member) => ({
        address: member.address,
        weight: member.weight,
        metadata: "",
      }));

      const messages = [
        {
          typeUrl: "/cosmos.group.v1.MsgUpdateGroupMembers",
          value: MsgUpdateGroupMembers.encode({
            admin: groupInfo.admin,
            groupId: dao.group_id,
            memberUpdates,
          }).finish(),
        },
      ];

      const result = await dispatch(
        createGroupProposal(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          {
            groupPolicyAddress: groupInfo.admin,
            messages,
            metadata: "",
            proposers: [selectedAddress],
            title: "Update DAO Members",
            summary: `Update voting weights for DAO members`,
            exec: 0,
          }
        )
      );

      if (result && result.code === 0) {
        notify("Member update proposal created successfully", "success");
        if (refreshDao) await refreshDao();
        setEditMode(false);
        setHasChanges(false);
      } else {
        throw new Error(result?.rawLog || "Failed to create proposal");
      }
    } catch (error) {
      console.error("Error creating member update proposal:", error);
      notify("Failed to create proposal: " + error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-base-300/50 rounded-lg">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">DAO Members</h3>
              <p className="text-sm text-muted-foreground">
                {members.length} member{members.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`btn btn-sm ${
              editMode ? "btn-ghost" : "btn-primary"
            } gap-2`}
          >
            {editMode ? (
              <>
                <X size={16} />
                Cancel
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Manage Members
              </>
            )}
          </button>
        </div>

        <div className="divide-y divide-base-300">
          {members.map((member, index) => (
            <MemberRow
              key={member.address}
              member={member}
              index={index}
              isEditing={editMode}
              onWeightChange={handleWeightChange}
              onRemove={handleRemoveMember}
              userData={userDataMap[member.address]}
            />
          ))}
        </div>

        {editMode && (
          <>
            <AddMemberForm
              newMember={newMember}
              error={error}
              onChange={setNewMember}
              onAdd={handleAddMember}
            />

            {hasChanges && (
              <div className="p-4 bg-warning/10 border-t border-warning/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertTriangle size={16} />
                    <span className="text-sm font-medium">
                      You have unsaved changes
                    </span>
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="btn btn-primary btn-sm gap-2"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <VotingPowerChart data={votingDistribution} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(DAOMembersList);
