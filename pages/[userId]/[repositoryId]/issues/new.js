import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import find from "lodash/find";
import Head from "next/head";

import Header from "../../../../components/header";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import MarkdownEditor from "../../../../components/markdownEditor";
import { createIssue } from "../../../../store/actions/repository";
import { getBalance } from "../../../../store/actions/wallet";
import { updateUserBalance } from "../../../../store/actions/wallet";
import { notify } from "reapop";
import AssigneeSelector from "../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../components/repository/labelSelector";
import Label from "../../../../components/repository/label";
import AccountCard from "../../../../components/account/card";
import useRepository from "../../../../hooks/useRepository";
import CreateBounty from "../../../../components/repository/bounty";
import { createBounty } from "../../../../store/actions/bounties";
import { useApiClient } from "../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryIssueCreateView(props) {
  const router = useRouter();
  const { repository, refreshRepository } = useRepository();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [labels, setLabels] = useState([]);
  const [postingIssue, setPostingIssue] = useState(false);
  const [allLabels, setAllLabels] = useState([]);
  const [bountyAmount, setBountyAmount] = useState([]);
  const [bountyExpiry, setBountyExpiry] = useState(0);
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const validateIssue = () => {
    return true;
  };

  const createIssue = async () => {
    setPostingIssue(true);
    if (validateIssue()) {
      const issue = {
        title,
        description,
        repositoryName: repository.name,
        repositoryOwner: repository.owner.id,
        assignees,
        labels,
        bountyAmount,
        bountyExpiry,
      };
      const res = await props.createIssue(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        issue
      );
      if (res && res.code === 0) {
        props.notify("Issue created", "info");
        router.push(
          "/" +
            repository.owner.id +
            "/" +
            repository.name +
            "/issues/" +
            (Number(repository.issuesCount) + 1)
        );
      }
    }
    setPostingIssue(false);
  };

  useEffect(() => {
    if (repository) {
      setAllLabels(repository.labels);
    }
  }, [repository]);

  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="sm:flex mt-8">
            <div className="flex flex-1">
              <div className="flex-none mr-4">
                <AccountCard
                  id={props.selectedAddress}
                  showAvatar={true}
                  showId={false}
                />
              </div>
              <div className="flex-1">
                <div className="form-control mb-4">
                  <input
                    type="text"
                    placeholder="Issue Title"
                    className="input input-md input-bordered"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    data-test="issue_title"
                  />
                </div>
                <CreateBounty
                  setBountyExpiry={setBountyExpiry}
                  setBountyAmount={setBountyAmount}
                  bountyAmount={bountyAmount}
                  bountyExpiry={bountyExpiry}
                />
                <MarkdownEditor value={description} setValue={setDescription} />
                <div className="text-right mt-4">
                  <div className="inline-block w-36">
                    <button
                      className={
                        "btn btn-sm btn-primary btn-block " +
                        (postingIssue ? "loading" : "")
                      }
                      disabled={title.trim().length === 0 || postingIssue}
                      onClick={createIssue}
                      data-test="create_issue"
                    >
                      Create Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-none sm:w-64 sm:pl-8 divide-y divide-grey mt-8 sm:mt-0">
              <div className="w-full pb-8">
                <AssigneeSelector
                  assignees={assignees}
                  collaborators={[
                    ...(() =>
                      repository.owner.type === "USER"
                        ? [
                            {
                              id: repository.owner.address,
                              permission: "CREATOR",
                            },
                          ]
                        : [])(),
                    ...repository.collaborators,
                  ]}
                  onChange={async (list) => {
                    setAssignees(list);
                  }}
                />
                <div className="text-xs px-3 mt-2 flex gap-2">
                  {assignees.length
                    ? assignees.map((a, i) => (
                        <div key={"assignee" + i}>
                          <AccountCard
                            id={a}
                            showAvatar={true}
                            showId={false}
                          />
                        </div>
                      ))
                    : "No one"}
                </div>
              </div>
              <div className="py-8">
                <LabelSelector
                  labels={labels}
                  repository={repository}
                  refreshRepository={refreshRepository}
                  onChange={async (list) => {
                    console.log(list);
                    setLabels(list);
                  }}
                />
                <div className="text-xs px-3 mt-2 flex flex-wrap">
                  {labels.length
                    ? labels.map((l, i) => {
                        let label = find(allLabels, { id: l }) || {
                          name: "",
                          color: "",
                        };
                        return (
                          <span
                            className="pr-2 pb-2 whitespace-nowrap"
                            key={"label" + i}
                          >
                            <Label color={label.color} name={label.name} />
                          </span>
                        );
                      })
                    : "None yet"}
                </div>
              </div>
              {/* <div className="py-8">
                <button className="btn btn-sm btn-block btn-ghost">
                  <div className="flex-1 text-left">Linked Pull Requests</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="text-xs px-3 mt-2">None yet</div>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    balance: state.wallet.balance,
    selectedAddress: state.wallet.selectedAddress,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  createIssue,
  getBalance,
  updateUserBalance,
  notify,
  createBounty,
})(RepositoryIssueCreateView);
