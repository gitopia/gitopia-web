import Head from "next/head";
import Header from "../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import Footer from "../../../components/footer";
import isRepositoryNameTaken from "../../../helpers/isRepositoryNameTaken";
import getRepository from "../../../helpers/getRepository";
import shrinkAddress from "../../../helpers/shrinkAddress";
import useRepository from "../../../hooks/useRepository";
import TextInput from "../../../components/textInput";
import {
  forkRepository,
} from "../../../store/actions/repository";
import { useRouter } from "next/router";
import { useApiClient } from "../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryInvokeForkView(props) {
  const { repository } = useRepository();
  const [childRepos, setChildRepos] = useState([]);
  const [parentRepo, setParentRepo] = useState(null);

  const [ownerId, setOwnerId] = useState(props.currentDashboard || "");
  const [ownerIdHint, setOwnerIdHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [forkRepositoryName, setForkRepositoryName] = useState(
    repository?.name || ""
  );
  const [forkRepositoryNameHint, setForkRepositoryNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [forkRepositoryDescription, setForkRepositoryDescription] = useState(
    repository?.description || ""
  );
  const [forkRepositoryDescriptionHint, setForkRepositoryDescriptionHint] =
    useState({
      shown: false,
      type: "error",
      message: "",
    });
  const [forkOnlyOneBranch, setForkOnlyOneBranch] = useState(true);
  const [forkOnlyOneBranchName, setForkOnlyOneBranchName] = useState(
    repository?.defaultBranch || ""
  );
  const [isForking, setIsForking] = useState(false);
  const [forkingSuccess, setForkingSuccess] = useState(false);

  const sanitizedNameTest = new RegExp(/[^\w.-]/g);
  const router = useRouter();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const hideHints = () => {
    setForkRepositoryNameHint({ ...forkRepositoryNameHint, shown: false });
    setForkRepositoryDescriptionHint({
      ...forkRepositoryDescriptionHint,
      shown: false,
    });
    setOwnerIdHint({ ...ownerIdHint, shwon: false });
  };

  const validateRepository = async () => {
    hideHints();
    if (forkRepositoryName === "") {
      setForkRepositoryNameHint({
        type: "error",
        shown: true,
        message: "Please enter a repository name",
      });
      return false;
    }
    if (forkRepositoryName.length < 3) {
      setForkRepositoryNameHint({
        type: "error",
        shown: true,
        message: "Repository name must have atleat 3 characters",
      });
      return false;
    }
    if (ownerId === "") {
      setOwnerIdHint({
        type: "error",
        shown: true,
        message: "Already owner of this repository",
      });
      return false;
    }
    const alreadyAvailable = await isRepositoryNameTaken(
      apiClient,
      forkRepositoryName,
      ownerId
    );

    if (alreadyAvailable) {
      setForkRepositoryNameHint({
        type: "error",
        shown: true,
        message: "Repository name already taken",
      });
      return false;
    }
    return true;
  };

  const invokeForkRepository = async () => {
    setIsForking(true);
    let validate = await validateRepository();
    console.log(validate);
    if (validate) {
      const res = await props.forkRepository(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          ownerId,
          repoOwner: repository.owner.address,
          repoName: repository.name,
          repoBranch: forkOnlyOneBranch ? forkOnlyOneBranchName : null,
          forkRepositoryName: forkRepositoryName.replace(
            sanitizedNameTest,
            "-"
          ),
          forkRepositoryDescription,
        }
      );
      if (res?.url) {
        router.push(res.url);
      }
    }
    setIsForking(false);
  };

  useEffect(() => {
    setForkRepositoryName(repository?.name || "");
    setForkRepositoryDescription(repository?.description || "");
    setOwnerId(props.currentDashboard);
    setForkOnlyOneBranchName(repository?.defaultBranch);
  }, [repository, props.currentDashboard]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="" />
          <div className="mt-8 flex justify-center">
            <div className="max-w-lg w-full">
              <div className="text-2xl">Create a new Fork</div>
              <div className="mt-2 text-xs text-type-secondary">
                A fork is a copy of a repository. Forking a repository allows
                you to freely experiment with changes without affecting the
                original project.
              </div>
              <div className="mt-4 flex items-start">
                <div className="">
                  <label className="label">
                    <span className="label-text text-sm">Owner</span>
                  </label>
                  <select
                    className={
                      "select select-bordered select-primary select-sm text-xs h-8 focus:outline-none focus:border-type " +
                      (ownerIdHint.shown && ownerIdHint.type == "error"
                        ? "border-pink text-pink input-" + ownerIdHint.type
                        : ownerId.length > 0
                        ? "border-green-900"
                        : "")
                    }
                    value={ownerId}
                    onChange={(e) => {
                      setOwnerId(e.target.value);
                    }}
                  >
                    {props.dashboards.map((d) => {
                      return (
                        <option
                          key={d.id}
                          value={d.id}
                          disabled={d.id === repository?.owner?.address}
                        >
                          {d.name} - {shrinkAddress(d.id)}
                        </option>
                      );
                    })}
                  </select>
                  {ownerIdHint.shown && (
                    <label className="label">
                      <span
                        className={"label-text-alt text-" + ownerIdHint.type}
                      >
                        {ownerIdHint.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="mx-2 mt-10 text-sm text-type-tertiary">/</div>
                <div className="flex-1">
                  <TextInput
                    type="text"
                    label="Repository name"
                    name="fork_repository_name"
                    placeholder="Repository Name"
                    value={forkRepositoryName}
                    setValue={(v) => {
                      if (sanitizedNameTest.test(v)) {
                        setForkRepositoryNameHint({
                          type: "info",
                          shown: true,
                          message:
                            "Your repository would be named as " +
                            v.replace(sanitizedNameTest, "-"),
                        });
                      } else {
                        setForkRepositoryNameHint({ shown: false });
                      }
                      setForkRepositoryName(v);
                    }}
                    hint={forkRepositoryNameHint}
                    size="sm"
                  />
                </div>
              </div>
              <div className="mt-2 text-xs text-type-secondary">
                By default, forks are named the same as their upstream
                repository. You can customize the name to distinguish it
                further.
              </div>
              <div className="mt-4">
                <TextInput
                  type="text"
                  label="Description"
                  name="fork_repository_description"
                  placeholder="Description"
                  value={forkRepositoryDescription}
                  setValue={setForkRepositoryDescription}
                  hint={forkRepositoryDescriptionHint}
                  size="sm"
                />
              </div>
              <div className="mt-4 flex items-center">
                <div>
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={forkOnlyOneBranch}
                      className="checkbox checkbox-sm checkbox-primary"
                      onChange={() => {
                        setForkOnlyOneBranch(!forkOnlyOneBranch);
                      }}
                    />
                    <span className="label-text ml-2 text-sm">Copy the</span>
                  </label>
                </div>
                <div className="ml-1">
                  <select
                    className="select select-bordered select-primary select-sm text-xs h-8 focus:outline-none focus:border-type"
                    defaultValue={repository?.defaultBranch || ""}
                    value={forkOnlyOneBranchName}
                    onChange={(e) => {
                      setForkOnlyOneBranchName(e.target.value);
                    }}
                    disabled={!forkOnlyOneBranch}
                  >
                    {repository?.branches?.map((b) => {
                      return (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="text-sm ml-2">branch only</div>
              </div>
              <div className="mt-8">
                <button
                  className={
                    "btn btn-primary btn-wide btn-sm" +
                    (isForking ? " loading" : "")
                  }
                  onClick={invokeForkRepository}
                  disabled={isForking}
                >
                  Create Fork
                </button>
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={forkingSuccess}
            readOnly
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box max-w-xs">
              <p>Successfully forked repository</p>
              <div className="modal-action mt-8">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    setForkingSuccess(false);
                  }}
                >
                  Stay here
                </button>
                <label
                  className="btn btn-sm btn-primary"
                  data-test="go-to-repo"
                  onClick={() => {
                    router.push(forkingSuccess);
                    setForkingSuccess(false);
                  }}
                >
                  Go to new repo
                </label>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    dashboards: state.user.dashboards,
    currentDashboard: state.user.currentDashboard,
  };
};

export default connect(mapStateToProps, { forkRepository })(
  RepositoryInvokeForkView
);
