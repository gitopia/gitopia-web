import React, { useState, useMemo, useEffect } from "react";
import { connect } from "react-redux";
import { createDao } from "../../../store/actions/dao";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../../../components/header";
import TextInput from "../../../components/textInput";
import Footer from "../../../components/footer";
import AccountAvatar from "../../../components/account/avatar";
import getUserDaoAll from "../../../helpers/getUserDaoAll";
import { useApiClient } from "../../../context/ApiClientContext";
import {
  Building2,
  Users,
  Settings,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Info,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const DAO_STEPS = {
  BASIC_INFO: {
    id: "BASIC_INFO",
    title: "Basic Information",
    description: "Set up your DAO's identity and branding",
    icon: Building2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  GOVERNANCE: {
    id: "GOVERNANCE",
    title: "Governance Settings",
    description: "Configure voting periods and decision policies",
    icon: Settings,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  MEMBERSHIP: {
    id: "MEMBERSHIP",
    title: "Membership Structure",
    description: "Define initial members and voting power distribution",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
};

function NewDao({ selectedAddress, createDao }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [daoCreating, setDaoCreating] = useState(false);
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();
  console.log("selected", selectedAddress);
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatarUrl: null,
    location: "",
    website: "",
    votingPeriod: "2",
    percentage: "50",
    members: [{ address: selectedAddress, weight: "1" }],
  });

  // Update first member's address if selectedAddress changes
  useEffect(() => {
    if (
      selectedAddress &&
      (!formData.members[0]?.address ||
        formData.members[0].address !== selectedAddress)
    ) {
      setFormData((prev) => ({
        ...prev,
        members: [
          { address: selectedAddress, weight: "1" },
          ...prev.members.slice(1),
        ],
      }));
    }
  }, [selectedAddress]);

  const [hints, setHints] = useState({
    name: { shown: false, type: "error", message: "" },
    description: { shown: false, type: "error", message: "" },
    website: { shown: false, type: "error", message: "" },
    votingPeriod: { shown: false, type: "error", message: "" },
    percentage: {
      shown: false,
      type: "error",
      message: "Minimum percentage required for proposal success",
    },
    members: { shown: false, type: "error", message: "" },
  });

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addMember = () => {
    updateFormData("members", [
      ...formData.members,
      { address: "", weight: "1" },
    ]);
  };

  const removeMember = (index) => {
    if (index === 0) return;
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    updateFormData("members", updatedMembers);
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    updateFormData("members", updatedMembers);
  };

  // Voting power distribution calculation for pie chart
  const votingPowerData = useMemo(() => {
    const totalWeight = formData.members.reduce(
      (sum, member) => sum + (Number(member.weight) || 0),
      0
    );
    return formData.members
      .map((member, index) => ({
        name: member.address || `Member ${index + 1}`,
        value: ((Number(member.weight) || 0) / totalWeight) * 100,
      }))
      .filter((member) => member.value > 0);
  }, [formData.members]);

  const COLORS = [
    "#1880DE",
    "#00C49F",
    "#3CC23A",
    "#FF8042",
    "#EE9006",
    "#82CA9D",
    "#A4DE6C",
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <AccountAvatar
                isDao={true}
                dao={{ name: formData.name, avatarUrl: formData.avatarUrl }}
                isEditable={true}
                callback={(url) => updateFormData("avatarUrl", url)}
              />
            </div>

            <TextInput
              label="DAO Name"
              name="name"
              placeholder="Enter DAO name"
              value={formData.name}
              setValue={(v) => updateFormData("name", v)}
              hint={hints.name}
            />

            <TextInput
              label="Description"
              name="description"
              placeholder="Describe your DAO's purpose"
              multiline={true}
              value={formData.description}
              setValue={(v) => updateFormData("description", v)}
              hint={hints.description}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Website"
                name="website"
                placeholder="https://..."
                value={formData.website}
                setValue={(v) => updateFormData("website", v)}
                hint={hints.website}
              />

              <TextInput
                label="Location"
                name="location"
                placeholder="Optional"
                value={formData.location}
                setValue={(v) => updateFormData("location", v)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-base-300 p-4 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-sm text-gray-300">
                  Configure how decisions will be made in your DAO
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-control">
                <TextInput
                  label="Voting Period (hours)"
                  name="votingPeriod"
                  type="number"
                  placeholder="2"
                  value={formData.votingPeriod}
                  setValue={(v) => updateFormData("votingPeriod", v)}
                  hint={hints.votingPeriod}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-400">
                    How long proposals stay open for voting
                  </span>
                </label>
              </div>

              <div className="form-control">
                <TextInput
                  label="Required Approval Percentage"
                  name="percentage"
                  type="number"
                  placeholder="50"
                  value={formData.percentage}
                  setValue={(v) => updateFormData("percentage", v)}
                  hint={hints.percentage}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-400">
                    Minimum % of YES votes needed
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-base-300 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-sm text-gray-300">
                  Add initial members and set their voting power. You (the
                  creator) are automatically added as the first member.
                </span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {formData.members.map((member, index) => (
                <div key={index} className="bg-base-300 p-4 rounded-lg">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Address Input Column - takes up 9 columns */}
                    <div className="col-span-9">
                      <TextInput
                        label={
                          index === 0
                            ? "DAO Creator (You)"
                            : `Member ${index + 1} Address`
                        }
                        name={`member_${index}_address`}
                        placeholder="gitopia1..."
                        value={index === 0 ? selectedAddress : member.address}
                        setValue={(v) => updateMember(index, "address", v)}
                        disabled={index === 0}
                        hint={
                          index === 0
                            ? {
                                shown: true,
                                type: "info",
                                message:
                                  "This is your address as the DAO creator",
                              }
                            : undefined
                        }
                      />
                    </div>

                    {/* Weight Input Column - takes up 3 columns */}
                    <div className="col-span-3">
                      <TextInput
                        label="Voting Weight"
                        name={`member_${index}_weight`}
                        type="number"
                        placeholder="1"
                        value={member.weight}
                        setValue={(v) => updateMember(index, "weight", v)}
                      />
                    </div>
                  </div>

                  {/* Delete Button - Positioned below the inputs */}
                  {index !== 0 && (
                    <div className="flex justify-end mt-2">
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => removeMember(index)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Member
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                className="btn btn-outline btn-sm w-full"
                onClick={addMember}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>

            <div className="bg-base-300 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Voting Power Distribution
              </h3>
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
          </div>
        );
    }
  };

  const handleCreateDao = async () => {
    setDaoCreating(true);
    try {
      const res = await createDao(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          name: formData.name.replace(sanitizedNameTest, "-"),
          description: formData.description,
          avatarUrl: formData.avatarUrl,
          location: formData.location,
          website: formData.website,
          votingPeriod: formData.votingPeriod,
          percentage: (Number(formData.percentage) / 100).toString(),
          members: formData.members,
        }
      );
      if (res?.url) {
        router.push(res.url);
      }
    } catch (error) {
      console.error("Error creating DAO:", error);
    } finally {
      setDaoCreating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <Head>
        <title>Create New DAO - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold ml-4">Create a New DAO</h1>
        </div>

        {/* Progress Steps */}
        <div className="w-full mb-8">
          <ul className="steps steps-horizontal w-full">
            {Object.values(DAO_STEPS).map((daoStep, index) => (
              <li
                key={daoStep.id}
                className={`step ${step >= index + 1 ? "step-primary" : ""}`}
                onClick={() => setStep(index + 1)}
              >
                {daoStep.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Current Step Icon & Description */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-lg ${
                Object.values(DAO_STEPS)[step - 1].bgColor
              }`}
            >
              {React.createElement(Object.values(DAO_STEPS)[step - 1].icon, {
                className: `w-6 h-6 ${
                  Object.values(DAO_STEPS)[step - 1].color
                }`,
              })}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {Object.values(DAO_STEPS)[step - 1].title}
              </h2>
              <p className="text-gray-400">
                {Object.values(DAO_STEPS)[step - 1].description}
              </p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              Previous
            </button>
          )}

          {step < 3 ? (
            <button
              className="btn btn-primary ml-auto"
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className={`btn btn-primary ml-auto ${
                daoCreating ? "loading" : ""
              }`}
              onClick={handleCreateDao}
              disabled={daoCreating}
            >
              Create DAO
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default connect(
  (state) => ({
    selectedAddress: state.wallet.selectedAddress,
  }),
  { createDao }
)(NewDao);
