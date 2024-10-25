import React, { useState, useMemo } from "react";
import {
  Users,
  Wallet,
  Settings,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

// Proposal type definitions with icons and descriptions
const PROPOSAL_TYPES = {
  GROUP_MEMBER_UPDATE: {
    id: "GROUP_MEMBER_UPDATE",
    title: "Update Group Members",
    description: "Add, remove, or update voting power of group members",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  DAO_METADATA_UPDATE: {
    id: "DAO_METADATA_UPDATE",
    title: "Update DAO Metadata",
    description: "Modify DAO name, description, or other metadata",
    icon: Settings,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  GOVERNANCE_PARAMS: {
    id: "GOVERNANCE_PARAMS",
    title: "Update Governance Parameters",
    description: "Modify voting period, quorum, or other governance settings",
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
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

const GroupMemberForm = ({ onSubmit, existingMembers = [] }) => {
  const [members, setMembers] = useState([
    { address: "", weight: "", operation: "ADD" },
  ]);

  const handleAddMember = () => {
    setMembers([...members, { address: "", weight: "", operation: "ADD" }]);
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  return (
    <div className="space-y-6">
      {members.map((member, index) => (
        <div key={index} className="bg-base-300 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Member {index + 1}</h4>
            {index > 0 && (
              <button
                className="btn btn-ghost btn-sm text-error"
                onClick={() => handleRemoveMember(index)}
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Operation</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={member.operation}
                onChange={(e) =>
                  handleMemberChange(index, "operation", e.target.value)
                }
              >
                <option value="ADD">Add Member</option>
                <option value="REMOVE">Remove Member</option>
                <option value="UPDATE">Update Weight</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Member Address</span>
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

            {member.operation !== "REMOVE" && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Voting Weight</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="1"
                  value={member.weight}
                  onChange={(e) =>
                    handleMemberChange(index, "weight", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        className="btn btn-secondary btn-outline w-full"
        onClick={handleAddMember}
      >
        Add Another Member
      </button>
    </div>
  );
};

const MetadataForm = ({ dao, onSubmit }) => {
  const [name, setName] = useState(dao.name || "");
  const [description, setDescription] = useState(dao.description || "");
  const [website, setWebsite] = useState(dao.website || "");
  const [location, setLocation] = useState(dao.location || "");

  return (
    <div className="space-y-6">
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
    </div>
  );
};

const GovernanceParamsForm = ({ currentParams, onSubmit }) => {
  const [votingPeriod, setVotingPeriod] = useState(
    currentParams?.windows.votingPeriod || ""
  );
  const [quorum, setQuorum] = useState(currentParams?.percentage || "");

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
          value={quorum}
          onChange={(e) => setQuorum(e.target.value)}
        />
      </div>
    </div>
  );
};

export default function CreateProposalView({
  dao,
  groupInfo,
  policyInfo,
  onSubmit,
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const proposalData = {
        type: selectedType,
        title,
        description,
        formData,
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
            <h2 className="text-xl font-bold mb-6">Proposal Details</h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter proposal title"
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
                placeholder="Explain your proposal..."
                className="textarea textarea-bordered h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Proposal Configuration</h2>

            {selectedType === "GROUP_MEMBER_UPDATE" && (
              <GroupMemberForm
                existingMembers={groupInfo?.members}
                onSubmit={setFormData}
              />
            )}

            {selectedType === "DAO_METADATA_UPDATE" && (
              <MetadataForm dao={dao} onSubmit={setFormData} />
            )}

            {selectedType === "GOVERNANCE_PARAMS" && (
              <GovernanceParamsForm
                currentParams={policyInfo?.info.decision_policy}
                onSubmit={setFormData}
              />
            )}
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
            Add Details
          </li>
          <li className={`step ${step >= 3 ? "step-primary" : ""}`}>
            Configure
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
            disabled={step === 2 && (!title || !description)}
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
            disabled={isSubmitting}
          >
            Create Proposal
          </button>
        )}
      </div>
    </div>
  );
}
