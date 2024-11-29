import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Landmark,
  Settings,
  Settings2,
  Info,
  ArrowLeft,
  ArrowRight,
  GitPullRequest,
  Tag,
  RefreshCw,
  UsersRound,
  Trash2,
  Text,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { connect } from "react-redux";
import {
  MsgUpdateGroupPolicyDecisionPolicy,
  MsgUpdateGroupMembers,
} from "cosmjs-types/cosmos/group/v1/tx";
import { PercentageDecisionPolicy } from "@gitopia/gitopia-js/dist/types/cosmos/group/v1/types";
import {
  MsgUpdateDaoConfig,
  MsgDaoTreasurySpend,
  MsgUpdateDaoMetadata,
} from "@gitopia/gitopia-js/dist/types/gitopia/tx";
import { DaoConfig } from "@gitopia/gitopia-js/dist/types/gitopia/dao";
import AccountAvatar from "../account/avatar";
import { validAddress } from "../../helpers/validAddress";

// Proposal type definitions with icons and descriptions
const PROPOSAL_TYPES = {
  GROUP_MEMBER_UPDATE: {
    id: "GROUP_MEMBER_UPDATE",
    title: "Update DAO Members",
    description: "Add, remove, or update voting power of DAO members",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  DAO_CONFIG: {
    id: "DAO_CONFIG",
    title: "Update DAO Config",
    description: "Update DAO configuration like proposal requirements",
    icon: Settings,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  DAO_METADATA_UPDATE: {
    id: "DAO_METADATA_UPDATE",
    title: "Update DAO Metadata",
    description: "Modify DAO name, description, or other metadata",
    icon: Info,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  GOVERNANCE_PARAMS: {
    id: "GOVERNANCE_PARAMS",
    title: "Update Governance Parameters",
    description: "Modify voting period, quorum, or other governance settings",
    icon: Settings2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  TREASURY_SPEND: {
    id: "TREASURY_SPEND",
    title: "Treasury Spend",
    description: "Propose spending from the DAO treasury",
    icon: Landmark,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  TEXT_PROPOSAL: {
    id: "TEXT_PROPOSAL",
    title: "Text Proposal",
    description: "Create a text-based proposal",
    icon: Text,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

const ProposalTypeCard = ({ type, selected, onClick }) => {
  const Icon = type.icon;

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer
        ${
          selected
            ? "border-primary bg-base-200"
            : "border-transparent bg-base-300"
        }
        hover:border-primary`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${type.bgColor}`}>
          <Icon className={`w-6 h-6 ${type.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{type.title}</h3>
          <p className="text-sm text-gray-400">{type.description}</p>
        </div>
        <div
          className={`w-4 h-4 rounded-full border-2 mt-1
          ${selected ? "bg-primary border-primary" : "border-gray-400"}`}
        />
      </div>
    </div>
  );
};

const COLORS = [
  "#1880DE",
  "#00C49F",
  "#3CC23A",
  "#FF8042",
  "#EE9006",
  "#82CA9D",
  "#A4DE6C",
  "#9370DB",
  "#20B2AA",
  "#FF69B4",
];

const GroupMemberForm = ({ existingMembers = [], onSubmit, onStateChange }) => {
  const [members, setMembers] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalMemberData, setOriginalMemberData] = useState({});

  // When hasChanges updates, notify parent
  useEffect(() => {
    onStateChange?.({ hasChanges });
    // Also pass the current members data to parent
    onSubmit?.(members);
  }, [members, hasChanges]);

  useEffect(() => {
    const initialMembers = existingMembers.map((member) => ({
      address: member.member.address,
      weight: member.member.weight,
      operation: "UPDATE",
    }));
    setMembers(initialMembers);

    const originalData = {};
    existingMembers.forEach((member) => {
      originalData[member.member.address] = member.member.weight;
    });
    setOriginalMemberData(originalData);
  }, [existingMembers]);

  const { currentDistribution, proposedDistribution, powerShiftData } =
    useMemo(() => {
      const currentTotal = Object.values(originalMemberData).reduce(
        (sum, weight) => sum + Number(weight),
        0
      );

      const current = Object.entries(originalMemberData).map(
        ([address, weight]) => ({
          name:
            address.substring(0, 8) +
            "..." +
            address.substring(address.length - 4),
          value: (Number(weight) / currentTotal) * 100,
          fullAddress: address,
          weight,
        })
      );

      const proposedTotal = members.reduce(
        (sum, member) => sum + Number(member.weight || 0),
        0
      );

      const proposed = members
        .map((member) => ({
          name:
            member.address.substring(0, 8) +
            "..." +
            member.address.substring(member.address.length - 4),
          value: ((Number(member.weight) || 0) / proposedTotal) * 100,
          fullAddress: member.address,
          weight: member.weight,
        }))
        .filter((member) => member.value > 0);

      const shifts = members
        .map((member) => {
          const originalWeight = originalMemberData[member.address];
          const originalPercentage = originalWeight
            ? (Number(originalWeight) / currentTotal) * 100
            : 0;
          const newPercentage = (Number(member.weight) / proposedTotal) * 100;
          const difference = newPercentage - originalPercentage;

          return {
            address: member.address,
            name:
              member.address.substring(0, 8) +
              "..." +
              member.address.substring(member.address.length - 4),
            fullAddress: member.address,
            originalPower: originalPercentage,
            newPower: newPercentage,
            difference,
          };
        })
        .sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));

      return {
        currentDistribution: current,
        proposedDistribution: proposed,
        powerShiftData: shifts,
      };
    }, [members, originalMemberData]);

  useEffect(() => {
    let changed = false;
    members.forEach((member) => {
      if (originalMemberData[member.address]) {
        if (member.weight !== originalMemberData[member.address]) {
          changed = true;
        }
      } else {
        changed = true;
      }
    });
    Object.keys(originalMemberData).forEach((address) => {
      if (!members.find((m) => m.address === address)) {
        changed = true;
      }
    });
    setHasChanges(changed);
  }, [members, originalMemberData]);

  const handleAddMember = () => {
    setMembers([...members, { address: "", weight: "1", operation: "ADD" }]);
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    const originalMembers = existingMembers.map((member) => ({
      address: member.member.address,
      weight: member.member.weight,
      operation: "UPDATE",
    }));
    setMembers(originalMembers);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base-200 p-3 rounded-lg shadow-lg border border-base-300">
          <p className="text-sm mb-1">{data.fullAddress}</p>
          <p className="text-sm font-semibold">Weight: {data.weight}</p>
          <p className="text-sm font-semibold">
            Share: {data.value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-base-300 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-sm text-gray-300">
            Update member weights or add new members to modify voting power
            distribution.
          </span>
        </div>
      </div>

      {/* Distribution Comparison */}
      {hasChanges && (
        <div className="bg-base-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-6">Voting Power Changes</h3>

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h4 className="text-center mb-4 text-sm font-semibold text-gray-400">
                Current Distribution
              </h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                    >
                      {currentDistribution.map((entry, index) => (
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
            </div>

            <ArrowRight className="w-8 h-8 text-primary" />

            <div className="flex-1">
              <h4 className="text-center mb-4 text-sm font-semibold text-gray-400">
                Proposed Distribution
              </h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={proposedDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                    >
                      {proposedDistribution.map((entry, index) => (
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
            </div>
          </div>

          {/* Power Shifts Table */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold mb-4">Voting Power Changes</h4>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th className="text-right">Current</th>
                    <th className="text-right">Proposed</th>
                    <th className="text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {powerShiftData.map((shift, index) => (
                    <tr
                      key={index}
                      className={shift.difference !== 0 ? "bg-base-300" : ""}
                    >
                      <td className="font-mono">{shift.name}</td>
                      <td className="text-right">
                        {shift.originalPower.toFixed(2)}%
                      </td>
                      <td className="text-right">
                        {shift.newPower.toFixed(2)}%
                      </td>
                      <td
                        className={`text-right ${
                          shift.difference > 0
                            ? "text-success"
                            : shift.difference < 0
                            ? "text-error"
                            : ""
                        }`}
                      >
                        {shift.difference > 0 ? "+" : ""}
                        {shift.difference.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="space-y-4">
        {members.map((member, index) => (
          <div key={index} className="bg-base-300 p-4 rounded-lg">
            <div className="grid grid-cols-12 gap-4">
              {/* Address Input - Takes 9 columns */}
              <div className="col-span-9">
                <label className="label">
                  <span className="label-text">
                    {index === 0
                      ? "Member Address"
                      : `Member ${index + 1} Address`}
                  </span>
                  {originalMemberData[member.address] &&
                    member.weight !== originalMemberData[member.address] && (
                      <span className="label-text-alt text-warning">
                        Weight changed from {originalMemberData[member.address]}
                      </span>
                    )}
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="gitopia1..."
                  value={member.address}
                  onChange={(e) =>
                    handleMemberChange(index, "address", e.target.value)
                  }
                />
              </div>

              {/* Weight Input - Takes 3 columns */}
              <div className="col-span-3">
                <label className="label">
                  <span className="label-text">Weight</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="input input-bordered w-24"
                    value={member.weight}
                    onChange={(e) =>
                      handleMemberChange(index, "weight", e.target.value)
                    }
                  />
                  {members.length > 1 && (
                    <button
                      className="btn btn-ghost btn-sm btn-square text-error"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-secondary btn-outline w-full"
        onClick={handleAddMember}
      >
        Add Member
      </button>

      {hasChanges && (
        <button className="btn btn-outline w-full" onClick={handleReset}>
          Reset Changes
        </button>
      )}
    </div>
  );
};

const DaoConfigForm = ({ dao, onSubmit, onStateChange }) => {
  const [requirePullRequestProposal, setRequirePullRequestProposal] = useState(
    dao.config?.require_pull_request_proposal || false
  );
  const [
    requireRepositoryDeletionProposal,
    setRequireRepositoryDeletionProposal,
  ] = useState(dao.config?.require_repository_deletion_proposal || false);
  const [requireCollaboratorProposal, setRequireCollaboratorProposal] =
    useState(dao.config?.require_collaborator_proposal || false);
  const [requireReleaseProposal, setRequireReleaseProposal] = useState(
    dao.config?.require_release_proposal || false
  );

  // Track if any changes have been made
  const [hasChanges, setHasChanges] = useState(false);

  // Helper to check if current settings differ from original
  const checkForChanges = (newSettings) => {
    const originalSettings = {
      requirePullRequestProposal:
        dao.config?.require_pull_request_proposal || false,
      requireRepositoryDeletionProposal:
        dao.config?.require_repository_deletion_proposal || false,
      requireCollaboratorProposal:
        dao.config?.require_collaborator_proposal || false,
      requireReleaseProposal: dao.config?.require_release_proposal || false,
    };

    const hasChanged = Object.keys(newSettings).some(
      (key) => newSettings[key] !== originalSettings[key]
    );

    setHasChanges(hasChanged);
    onStateChange?.({ hasChanges: hasChanged });
  };

  // Update form data and check for changes whenever a setting changes
  useEffect(() => {
    const newSettings = {
      requirePullRequestProposal,
      requireRepositoryDeletionProposal,
      requireCollaboratorProposal,
      requireReleaseProposal,
    };

    onSubmit(newSettings);
    checkForChanges(newSettings);
  }, [
    requirePullRequestProposal,
    requireRepositoryDeletionProposal,
    requireCollaboratorProposal,
    requireReleaseProposal,
  ]);

  const configOptions = [
    {
      icon: GitPullRequest,
      label: "Require proposal for merging pull requests",
      value: requirePullRequestProposal,
      onChange: setRequirePullRequestProposal,
      description: "Pull request merges will require DAO approval",
    },
    {
      icon: Trash2,
      label: "Require proposal for repository deletion",
      value: requireRepositoryDeletionProposal,
      onChange: setRequireRepositoryDeletionProposal,
      description: "Repository deletions will require DAO approval",
    },
    {
      icon: UsersRound,
      label: "Require proposal for managing collaborators",
      value: requireCollaboratorProposal,
      onChange: setRequireCollaboratorProposal,
      description: "Adding or removing collaborators will require DAO approval",
    },
    {
      icon: Tag,
      label: "Require proposal for release management",
      value: requireReleaseProposal,
      onChange: setRequireReleaseProposal,
      description: "Creating and managing releases will require DAO approval",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-base-300 p-4 rounded-lg mb-6">
        <div className="flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-sm text-gray-300">
            Configure which actions require DAO governance proposals. Changes
            will take effect after proposal approval.
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {configOptions.map((option, index) => (
          <div key={index} className="bg-base-200 p-4 rounded-lg">
            <div className="form-control">
              <label className="cursor-pointer space-y-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={option.value}
                    onChange={(e) => option.onChange(e.target.checked)}
                  />
                  <div className="flex items-center">
                    <option.icon
                      className={`w-5 h-5 mr-2 ${
                        option.value ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <span className="label-text font-medium">
                      {option.label}
                    </span>
                  </div>
                </div>
                <div className="ml-10 text-sm text-gray-400">
                  {option.description}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {hasChanges && (
        <div className="mt-4 p-4 bg-base-300 rounded-lg">
          <div className="flex items-center text-sm text-primary">
            <Info className="w-4 h-4 mr-2" />
            Changes detected. Submit proposal to update DAO configuration.
          </div>
        </div>
      )}
    </div>
  );
};

const MetadataForm = ({ dao, onSubmit, onStateChange }) => {
  const [name, setName] = useState(dao.name || "");
  const [description, setDescription] = useState(dao.description || "");
  const [website, setWebsite] = useState(dao.website || "");
  const [location, setLocation] = useState(dao.location || "");
  const [avatarUrl, setAvatarUrl] = useState(dao.avatarUrl || "");
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes whenever any field updates
  useEffect(() => {
    const hasFieldChanges =
      name !== (dao.name || "") ||
      description !== (dao.description || "") ||
      website !== (dao.website || "") ||
      location !== (dao.location || "") ||
      avatarUrl !== (dao.avatarUrl || "");

    setHasChanges(hasFieldChanges);
    onStateChange?.({ hasChanges: hasFieldChanges });

    // If there are changes, submit the current values
    if (hasFieldChanges) {
      onSubmit?.({
        name,
        description,
        website,
        location,
        avatarUrl,
      });
    }
  }, [name, description, website, location, avatarUrl]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <AccountAvatar
          isDao={true}
          dao={{ name, avatarUrl }}
          isEditable={true}
          callback={(url) => setAvatarUrl(url)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">DAO Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Website</span>
        </label>
        <input
          type="url"
          className="input input-bordered w-full"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {hasChanges && (
        <div className="bg-base-300 p-4 rounded-lg">
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-sm text-gray-300">
              Changes to DAO metadata will take effect after proposal approval.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const GovernanceParamsForm = ({ currentParams, onSubmit, onStateChange }) => {
  const [votingPeriod, setVotingPeriod] = useState(
    currentParams?.windows?.voting_period
      ? parseInt(currentParams.windows.voting_period) / 3600 // Convert seconds to hours
      : ""
  );
  const [quorum, setQuorum] = useState(
    currentParams?.percentage ? parseFloat(currentParams.percentage) * 100 : ""
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Helper to check if current values differ from original
  const checkForChanges = (newVotingPeriod, newQuorum) => {
    const originalVotingPeriod = currentParams?.windows?.voting_period
      ? parseInt(currentParams.windows.voting_period) / 3600
      : 0;
    const originalQuorum = currentParams?.percentage
      ? parseFloat(currentParams.percentage) * 100
      : 0;

    const hasChanged =
      newVotingPeriod !== originalVotingPeriod || newQuorum !== originalQuorum;

    setHasChanges(hasChanged);
    onStateChange?.({ hasChanges: hasChanged });
  };

  // Validate and update form data whenever inputs change
  useEffect(() => {
    const isValid =
      votingPeriod &&
      quorum &&
      parseFloat(votingPeriod) > 0 &&
      parseFloat(quorum) > 0 &&
      parseFloat(quorum) <= 100;

    if (isValid) {
      onSubmit?.({ votingPeriod, quorum });
      checkForChanges(parseFloat(votingPeriod), parseFloat(quorum));
    } else {
      onSubmit?.(null);
      setHasChanges(false);
      onStateChange?.({ hasChanges: false });
    }
  }, [votingPeriod, quorum]);

  return (
    <div className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Voting Period (hours)</span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={votingPeriod}
          onChange={(e) => setVotingPeriod(e.target.value)}
          min="1"
          step="1"
          placeholder="Enter voting period in hours"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Quorum (%)</span>
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          min="0"
          max="100"
          step="1"
          value={quorum}
          onChange={(e) => setQuorum(e.target.value)}
          placeholder="Enter required quorum percentage"
        />
      </div>

      {hasChanges && (
        <div className="bg-base-300 p-4 rounded-lg">
          <div className="flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-sm text-gray-300">
              Changes to governance parameters will take effect after proposal
              approval. Make sure to consider the impact on future voting
              procedures.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const TreasurySpendForm = ({ onSubmit, onStateChange, treasuryBalance }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Convert microLORE to LORE for display (1 LORE = 1,000,000 ulore)
  const formatLoreBalance = (microLore) => {
    return (parseInt(microLore) / 1000000).toFixed(2);
  };

  const validateGitopiaAddress = (address) => {
    if (!address.trim()) {
      return false;
    }
    return validAddress.test(address);
  };

  const validateAmount = (amount) => {
    if (!amount || isNaN(amount)) return false;
    const microLoreAmount = parseFloat(amount) * 1000000; // Convert to microLORE
    const balance = parseInt(treasuryBalance);
    return microLoreAmount > 0 && microLoreAmount <= balance;
  };

  // Validate form data and update parent component
  useEffect(() => {
    const errors = {};

    if (recipient && !validateGitopiaAddress(recipient)) {
      errors.recipient = "Invalid Gitopia address format";
    }

    if (amount) {
      if (!validateAmount(amount)) {
        errors.amount =
          "Amount must be greater than 0 and less than treasury balance";
      }
    }

    setValidationErrors(errors);

    const isValid =
      recipient &&
      amount &&
      validateGitopiaAddress(recipient) &&
      validateAmount(amount);

    setHasChanges(isValid);
    onStateChange?.({ hasChanges: isValid });

    if (isValid) {
      // Convert to microLORE
      const microLoreAmount = (parseFloat(amount) * 1000000).toString();
      onSubmit?.({
        recipient,
        amount: microLoreAmount,
        denom: "ulore",
      });
    }
  }, [recipient, amount, treasuryBalance]);

  return (
    <div className="space-y-6">
      {/* Treasury Balance Display */}
      <div className="bg-base-200 p-4 rounded-lg flex items-center space-x-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Landmark className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="text-sm text-gray-400">Treasury Balance</div>
          <div className="text-lg font-semibold">
            {formatLoreBalance(treasuryBalance)} LORE
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Recipient Address</span>
        </label>
        <input
          type="text"
          placeholder="gitopia1..."
          className={`input input-bordered w-full ${
            validationErrors.recipient ? "input-error" : ""
          }`}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        {validationErrors.recipient && (
          <label className="label">
            <span className="label-text-alt text-error">
              {validationErrors.recipient}
            </span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Amount (LORE)</span>
        </label>
        <div className="input-group">
          <input
            type="number"
            className={`input input-bordered w-full ${
              validationErrors.amount ? "input-error" : ""
            }`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.000001"
            placeholder="0.000000"
          />
          <span className="bg-base-300 px-4 flex items-center font-medium">
            LORE
          </span>
        </div>
        {validationErrors.amount && (
          <label className="label">
            <span className="label-text-alt text-error">
              {validationErrors.amount}
            </span>
          </label>
        )}
      </div>

      <div className="bg-base-300 p-4 rounded-lg">
        <div className="flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-sm text-gray-300">
            Treasury spend proposals require approval from DAO members through
            voting. Enter the amount in LORE (1 LORE = 1,000,000 ulore).
          </span>
        </div>
      </div>
    </div>
  );
};

const TextProposalForm = ({ onSubmit, onStateChange }) => {
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Text proposals are always valid as long as title and description exist
    setHasChanges(true);
    onStateChange?.({ hasChanges: true });
    onSubmit?.({});
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-base-300 p-4 rounded-lg">
        <div className="flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          <span className="text-sm text-gray-300">
            Create a general purpose proposal to discuss and vote on any topic.
          </span>
        </div>
      </div>
    </div>
  );
};

function CreateProposalView({
  dao,
  groupInfo,
  groupMembers,
  policyInfo,
  selectedAddress,
  treasuryBalance,
  onSubmit,
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({ hasChanges: false });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let messages = [];

      // Generate appropriate messages based on proposal type
      switch (selectedType) {
        case "GROUP_MEMBER_UPDATE":
          if (!formData || !Array.isArray(formData)) {
            throw new Error("Invalid form data for member updates");
          }

          // Filter out empty or invalid entries
          const memberUpdates = formData
            .filter((member) => member && member.address && member.weight)
            .map((member) => ({
              address: member.address,
              weight: member.weight,
              metadata: "",
            }));

          if (memberUpdates.length === 0) {
            throw new Error("No valid member updates provided");
          }

          messages = [
            {
              typeUrl: "/cosmos.group.v1.MsgUpdateGroupMembers",
              value: MsgUpdateGroupMembers.encode({
                admin: groupInfo.admin,
                groupId: dao.group_id,
                memberUpdates,
              }).finish(),
            },
          ];
          break;

        case "DAO_CONFIG":
          messages = [
            {
              typeUrl: "/gitopia.gitopia.gitopia.MsgUpdateDaoConfig",
              value: MsgUpdateDaoConfig.encode({
                admin: groupInfo.admin,
                id: dao.address,
                config: DaoConfig.encode({ ...formData }).finish(),
              }).finish(),
            },
          ];
          break;

        case "DAO_METADATA_UPDATE":
          messages = [
            {
              typeUrl: "/gitopia.gitopia.gitopia.MsgUpdateDaoMetadata",
              value: MsgUpdateDaoMetadata.encode({
                admin: groupInfo.admin,
                id: dao.address,
                ...formData,
              }).finish(),
            },
          ];
          break;

        case "GOVERNANCE_PARAMS":
          // Convert voting period from hours to Duration format (in seconds and nanos)
          const votingPeriodSeconds = Math.floor(formData.votingPeriod * 3600); // Convert hours to seconds

          // Create DecisionPolicyWindows object
          const windows = {
            votingPeriod: {
              seconds: votingPeriodSeconds,
              nanos: 0,
            },
            minExecutionPeriod: {
              seconds: 0,
              nanos: 0,
            },
          };

          // Convert quorum from percentage to decimal (e.g., 51% -> 0.51)
          const percentageDecimal = (
            parseFloat(formData.quorum) / 100
          ).toString();

          messages = [
            {
              typeUrl: "/cosmos.group.v1.MsgUpdateGroupPolicyDecisionPolicy",
              value: MsgUpdateGroupPolicyDecisionPolicy.encode({
                admin: groupInfo.admin,
                groupPolicyAddress: policyInfo.info.address,
                decisionPolicy: {
                  typeUrl: "/cosmos.group.v1.PercentageDecisionPolicy",
                  value: PercentageDecisionPolicy.encode({
                    percentage: percentageDecimal,
                    windows: windows,
                  }).finish(),
                },
              }).finish(),
            },
          ];
          break;

        case "TREASURY_SPEND":
          messages = [
            {
              typeUrl: "/gitopia.gitopia.gitopia.MsgDaoTreasurySpend",
              value: MsgDaoTreasurySpend.encode({
                admin: groupInfo.admin,
                id: dao.address,
                recipient: formData.recipient,
                amount: [
                  {
                    denom: formData.denom,
                    amount: formData.amount,
                  },
                ],
              }).finish(),
            },
          ];
          break;

        case "TEXT_PROPOSAL":
          messages = []; // Text proposals have no execution messages
          break;
      }

      // Create the proposal with the generated messages
      const proposalData = {
        groupPolicyAddress: groupInfo.admin,
        messages,
        metadata: "",
        proposers: [selectedAddress],
        title,
        summary: description,
        exec: 0, // EXEC_UNSPECIFIED
      };

      await onSubmit(proposalData);
    } catch (error) {
      console.error("Error creating proposal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Select Proposal Type</h2>
            <div className="space-y-4">
              {Object.values(PROPOSAL_TYPES).map((type) => (
                <ProposalTypeCard
                  key={type.id}
                  type={type}
                  selected={selectedType === type.id}
                  onClick={() => setSelectedType(type.id)}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Proposal Configuration</h2>

            {selectedType === "GROUP_MEMBER_UPDATE" && (
              <GroupMemberForm
                existingMembers={groupMembers || []}
                onSubmit={setFormData}
                onStateChange={setFormState}
              />
            )}

            {selectedType === "DAO_CONFIG" && (
              <DaoConfigForm
                dao={dao}
                onSubmit={setFormData}
                onStateChange={setFormState}
              />
            )}

            {selectedType === "DAO_METADATA_UPDATE" && (
              <MetadataForm
                dao={dao}
                onSubmit={setFormData}
                onStateChange={setFormState}
              />
            )}

            {selectedType === "GOVERNANCE_PARAMS" && (
              <GovernanceParamsForm
                currentParams={policyInfo?.info.decision_policy}
                onSubmit={setFormData}
                onStateChange={setFormState}
              />
            )}

            {selectedType === "TREASURY_SPEND" && (
              <TreasurySpendForm
                onSubmit={setFormData}
                onStateChange={setFormState}
                treasuryBalance={treasuryBalance}
              />
            )}

            {selectedType === "TEXT_PROPOSAL" && (
              <TextProposalForm
                onSubmit={setFormData}
                onStateChange={setFormState}
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Proposal Details</h2>

            {formState.hasChanges && (
              <div className="bg-base-300 p-4 rounded-lg mb-6">
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    Review your changes and provide a clear title and
                    description for the proposal.
                  </span>
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter a brief, descriptive title for your proposal"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                placeholder="Provide a detailed explanation of your proposal and its implications..."
                className="textarea textarea-bordered h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <button onClick={onCancel} className="btn btn-ghost btn-sm mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Proposals
      </button>

      {/* Progress indicator */}
      <div className="w-full mb-8">
        <ul className="steps steps-horizontal w-full">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>
            Select Type
          </li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>
            Configure
          </li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
            Add Details
          </li>
        </ul>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
            Previous
          </button>
        )}

        {step < 3 && selectedType && (
          <button
            className="btn btn-primary ml-auto"
            onClick={() => setStep(step + 1)}
            disabled={step === 2 && !formState.hasChanges}
          >
            Next
          </button>
        )}

        {step === 3 && (
          <button
            className={`btn btn-primary ml-auto ${
              isSubmitting ? "loading" : ""
            }`}
            onClick={handleSubmit}
            disabled={
              isSubmitting || !formState.hasChanges || !title || !description
            }
          >
            Create Proposal
          </button>
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(CreateProposalView);
