import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { createRepository } from "../store/actions/repository";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/header";
import TextInput from "../components/textInput";
import shrinkAddress from "../helpers/shrinkAddress";
import Footer from "../components/footer";
import isRepositoryNameTaken from "../helpers/isRepositoryNameTaken";
import { useApiClient } from "../context/ApiClientContext";
import { notify } from "reapop";
import {
  Users,
  User,
  Lock,
  Globe,
  AlertCircle,
  FolderGit2,
} from "lucide-react";

function NewRepository(props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [description, setDescription] = useState("");
  const [descriptionHint, setDescriptionHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [ownerId, setOwnerId] = useState(props.currentDashboard);
  const [repositoryCreating, setRepositoryCreating] = useState(false);
  const [accountsList, setAccountsList] = useState([
    { value: "", display: "" },
  ]);
  const { apiClient } = useApiClient();

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);

  useEffect(() => {
    setAccountsList([...props.dashboards]);
    setOwnerId(props.currentDashboard);
  }, [props.dashboards, props.currentDashboard]);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setDescriptionHint({ ...descriptionHint, shown: false });
  };

  const validateRepository = async () => {
    hideHints();
    if (name === "") {
      setNameHint({
        type: "error",
        shown: true,
        message: "Please enter a repository name",
      });
      return false;
    }
    if (name.length < 3) {
      setNameHint({
        type: "error",
        shown: true,
        message: "Repository name must have at least 3 characters",
      });
      return false;
    }
    const alreadyAvailable = await isRepositoryNameTaken(
      apiClient,
      name,
      ownerId
    );

    if (alreadyAvailable) {
      setNameHint({
        type: "error",
        shown: true,
        message: "Repository name already taken",
      });
      return false;
    }
    return true;
  };

  const createRepo = async () => {
    setRepositoryCreating(true);
    if (await validateRepository()) {
      let ownerName = ownerId;
      accountsList.every((a) => {
        if (a.id === ownerId) {
          ownerName = a.name;
          return false;
        }
        return true;
      });

      let res = await props.createRepository(apiClient, {
        name: name.replace(sanitizedNameTest, "-"),
        description,
        ownerId: ownerName,
      });
      if (res && res.url) {
        props.notify("Repository created", "info");
        router.push(res.url);
      }
    }
    setRepositoryCreating(false);
  };

  const CustomSelect = ({ value, onChange, options }) => (
    <div className="relative">
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center`}
      >
        {options.map((account) => {
          if (account.id === value) {
            return (
              <div key={account.id} className="flex items-center">
                {account.type === "Dao" ? (
                  <div className="bg-purple-500/10 p-1 rounded">
                    <Users className="w-4 h-4 text-purple-500" />
                  </div>
                ) : (
                  <div className="bg-primary/10 p-1 rounded">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
      <select
        className="select select-bordered w-full pl-12 pr-4 focus:outline-none focus:border-primary text-base"
        value={value}
        onChange={onChange}
      >
        {options.map((account, i) => (
          <option key={i} value={account.id} className="flex items-center">
            <span>
              {account.name} {shrinkAddress(account.id)}
            </span>
          </option>
        ))}
      </select>
      {options.map((account) => {
        if (account.id === value) {
          return (
            <div
              key={account.id}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            >
              <span
                className={`px-4 py-0.5 text-xs rounded-full ${
                  account.type === "Dao"
                    ? "bg-purple-500/10 text-purple-500"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {account.type}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>New Repository - Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />

      <div className="flex flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg min-h-full py-12 px-4">
          <div className="flex items-center space-x-3 mb-6">
            <FolderGit2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Create a new repository</h1>
          </div>

          <div className="bg-base-200 rounded-lg p-8 mb-8">
            <div className="flex flex-col space-y-8">
              <div className="max-w-3xl">
                <p className="text-base text-gray-300 mb-4">
                  Your repository will be created on the blockchain, meaning it
                  will outlive even you once it's created. You can archive
                  repositories, but they will still be visible to the public.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>
                    All repositories on Gitopia are public and transparent
                  </span>
                </div>
              </div>
              <div className="w-full flex justify-center bg-box-grad-v rounded-lg p-8">
                <img
                  src="new-repository.svg"
                  className="w-full max-w-2xl h-auto object-contain"
                  alt="New Repository"
                />
              </div>
            </div>
          </div>

          <div className="bg-base-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Repository Owner
                  </span>
                  <span className="label-text-alt text-gray-400">
                    Choose who will own this repository
                  </span>
                </label>
                <CustomSelect
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  options={accountsList}
                />
              </div>

              <TextInput
                type="text"
                label="Repository Name"
                name="repository_name"
                placeholder="awesome-project"
                value={name}
                setValue={(v) => {
                  if (sanitizedNameTest.test(v)) {
                    setNameHint({
                      type: "info",
                      shown: true,
                      message:
                        "Your repository would be named as " +
                        v.replace(sanitizedNameTest, "-"),
                    });
                  } else {
                    setNameHint({ shown: false });
                  }
                  setName(v);
                }}
                hint={nameHint}
              />
            </div>

            <div className="mt-6">
              <TextInput
                type="text"
                label="Repository Description"
                name="repository_description"
                placeholder="Optional description of your repository"
                multiline={true}
                value={description}
                setValue={setDescription}
                hint={descriptionHint}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className={`btn btn-primary btn-wide ${
                  repositoryCreating ? "loading" : ""
                }`}
                disabled={repositoryCreating}
                onClick={createRepo}
                data-test="create-repo-button"
              >
                <FolderGit2 className="w-4 h-4 mr-2" />
                Create Repository
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => ({
  dashboards: state.user.dashboards,
  currentDashboard: state.user.currentDashboard,
});

export default connect(mapStateToProps, { createRepository, notify })(
  NewRepository
);
