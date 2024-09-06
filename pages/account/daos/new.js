import React, { useState, useMemo } from "react";
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

function NewDao(props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [votingPeriod, setVotingPeriod] = useState(72);
  const [quorumPercentage, setQuorumPercentage] = useState(33);
  const [members, setMembers] = useState([
    { address: props.selectedAddress, weight: 1 },
  ]);
  const [daoCreating, setDaoCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("configuration");

  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const [hints, setHints] = useState({
    name: { shown: false, type: "error", message: "" },
    description: { shown: false, type: "error", message: "" },
    website: { shown: false, type: "error", message: "" },
    votingPeriod: { shown: false, type: "error", message: "" },
    quorumPercentage: { shown: false, type: "error", message: "" },
    members: { shown: false, type: "error", message: "" },
  });

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  const isValidUrl = (urlString) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  const hideHints = () => {
    setHints(
      Object.fromEntries(
        Object.keys(hints).map((key) => [key, { ...hints[key], shown: false }])
      )
    );
  };

  const validateDao = async () => {
    hideHints();
    let isValid = true;

    if (name === "") {
      setHints((prev) => ({
        ...prev,
        name: { type: "error", shown: true, message: "Please enter a name" },
      }));
      isValid = false;
    }

    const daos = await getUserDaoAll(apiClient, props.selectedAddress);
    if (daos?.some((dao) => dao.name === name)) {
      setHints((prev) => ({
        ...prev,
        name: { type: "error", shown: true, message: "DAO name already taken" },
      }));
      isValid = false;
    }

    if (!isValidUrl(website) && website.length > 0) {
      setHints((prev) => ({
        ...prev,
        website: {
          type: "error",
          shown: true,
          message: "Please enter a valid URL",
        },
      }));
      isValid = false;
    }

    if (votingPeriod <= 0) {
      setHints((prev) => ({
        ...prev,
        votingPeriod: {
          type: "error",
          shown: true,
          message: "Voting period must be positive",
        },
      }));
      isValid = false;
    }

    if (quorumPercentage <= 0 || quorumPercentage > 100) {
      setHints((prev) => ({
        ...prev,
        quorumPercentage: {
          type: "error",
          shown: true,
          message: "Quorum percentage must be between 1 and 100",
        },
      }));
      isValid = false;
    }

    if (
      members.length === 0 ||
      members.some((member) => !member.address || member.weight <= 0)
    ) {
      setHints((prev) => ({
        ...prev,
        members: {
          type: "error",
          shown: true,
          message: "All members must have a valid address and positive weight",
        },
      }));
      isValid = false;
    }

    return isValid;
  };

  const createDao = async () => {
    setDaoCreating(true);
    if (await validateDao()) {
      try {
        const res = await props.createDao(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          {
            name: name.replace(sanitizedNameTest, "-"),
            description,
            avatarUrl,
            location,
            website,
            votingPeriod,
            quorumPercentage,
            members,
          }
        );
        if (res && res.url) {
          router.push(res.url);
        }
      } catch (error) {
        console.error("Error creating DAO:", error);
        // Handle error (e.g., show error message to user)
      }
    }
    setDaoCreating(false);
  };

  const addMember = () => {
    setMembers([...members, { address: "", weight: 1 }]);
  };

  const removeMember = (index) => {
    if (index === 0) {
      // Prevent removing the first member (DAO creator)
      return;
    }
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  // Calculate voting power distribution
  const votingPowerData = useMemo(() => {
    const totalWeight = members.reduce(
      (sum, member) => sum + (Number(member.weight) || 0),
      0
    );
    return members
      .map((member, index) => ({
        name: member.address || `Member ${index + 1}`,
        value: ((Number(member.weight) || 0) / totalWeight) * 100,
      }))
      .filter((member) => member.value > 0);
  }, [members]);

  // Generate colors for the pie chart
  const COLORS = [
    "#1880DE",
    "#00C49F",
    "#3CC23A",
    "#FF8042",
    "#EE9006",
    "#82CA9D",
    "#A4DE6C",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <Head>
        <title>Create New DAO - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Create a New DAO
        </h1>

        <div className="tabs tabs-boxed mb-6 flex justify-center">
          <a
            className={`tab ${
              activeTab === "configuration" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("configuration")}
          >
            DAO Configuration
          </a>
          <a
            className={`tab ${activeTab === "membership" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("membership")}
          >
            Membership
          </a>
        </div>

        {activeTab === "configuration" && (
          <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">DAO Configuration</h2>
            <div className="flex justify-center mb-6">
              <AccountAvatar
                isDao={true}
                dao={{ name, avatarUrl }}
                isEditable={true}
                callback={(newAvatarUrl) => setAvatarUrl(newAvatarUrl)}
              />
            </div>

            <div className="space-y-4">
              <TextInput
                type="text"
                label="Name"
                name="dao_name"
                placeholder="DAO Name"
                value={name}
                setValue={(v) => {
                  if (sanitizedNameTest.test(v)) {
                    setHints((prev) => ({
                      ...prev,
                      name: {
                        type: "info",
                        shown: true,
                        message: `Your DAO would be named as ${v.replace(
                          sanitizedNameTest,
                          "-"
                        )}`,
                      },
                    }));
                  } else {
                    setHints((prev) => ({
                      ...prev,
                      name: { shown: false, type: "error", message: "" },
                    }));
                  }
                  setName(v);
                }}
                hint={hints.name}
              />

              <TextInput
                type="text"
                label="Description"
                name="dao_description"
                placeholder="Description"
                multiline={true}
                value={description}
                setValue={setDescription}
                hint={hints.description}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  type="text"
                  label="Website"
                  name="dao_website"
                  placeholder="Website"
                  value={website}
                  setValue={(v) => {
                    setHints((prev) => ({
                      ...prev,
                      website: { shown: false, type: "error", message: "" },
                    }));
                    setWebsite(v);
                  }}
                  hint={hints.website}
                />

                <TextInput
                  type="text"
                  label="Location"
                  name="dao_location"
                  placeholder="Location"
                  value={location}
                  setValue={setLocation}
                  hint={{ shown: false, type: "error", message: "" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  type="number"
                  label="Voting Period (hours)"
                  name="voting_period"
                  placeholder="Voting Period in Hours"
                  value={votingPeriod}
                  setValue={(v) => setVotingPeriod(Number(v))}
                  hint={hints.votingPeriod}
                />

                <TextInput
                  type="number"
                  label="Quorum Percentage"
                  name="quorum_percentage"
                  placeholder="Quorum Percentage (1-100)"
                  value={quorumPercentage}
                  setValue={(v) => setQuorumPercentage(Number(v))}
                  hint={hints.quorumPercentage}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "membership" && (
          <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">DAO Membership</h2>
            <div className="space-y-4">
              {members.map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <TextInput
                    type="text"
                    label={
                      index === 0
                        ? "DAO Creator Address"
                        : `Member ${index + 1} Address`
                    }
                    name={`member_${index}_address`}
                    placeholder="Member Address"
                    value={member.address}
                    setValue={(v) => updateMember(index, "address", v)}
                    hint={{ shown: false, type: "error", message: "" }}
                    className="flex-grow"
                    disabled={index === 0}
                  />
                  <TextInput
                    type="number"
                    label="Weight"
                    name={`member_${index}_weight`}
                    placeholder="Weight"
                    value={member.weight}
                    setValue={(v) => updateMember(index, "weight", Number(v))}
                    hint={{ shown: false, type: "error", message: "" }}
                    className="w-24"
                  />
                  <button
                    className="btn btn-error btn-sm mt-6"
                    onClick={() => removeMember(index)}
                    disabled={index === 0}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary btn-sm mt-4"
              onClick={addMember}
            >
              Add Member
            </button>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
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
                      `${name} ${(percent * 100).toFixed(0)}%`
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
        )}

        <div className="flex justify-center mt-8">
          <button
            className={`btn btn-primary btn-wide ${
              daoCreating ? "loading" : ""
            }`}
            disabled={daoCreating}
            onClick={createDao}
            data-test="create_dao"
          >
            Create DAO
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => ({
  selectedAddress: state.wallet.selectedAddress,
});

export default connect(mapStateToProps, { createDao })(NewDao);
