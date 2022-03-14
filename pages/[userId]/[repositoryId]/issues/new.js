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
import AssigneeSelector from "../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../components/repository/labelSelector";
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";
import useRepository from "../../../../hooks/useRepository";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryIssueCreateView(props) {
  const router = useRouter();
  const { repository } = useRepository();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [labels, setLabels] = useState([]);
  const [postingIssue, setPostingIssue] = useState(false);
  const [allLabels, setAllLabels] = useState([]);

  const validateIssue = () => {
    return true;
  };

  const createIssue = async () => {
    setPostingIssue(true);
    if (validateIssue()) {
      const issue = {
        title,
        description,
        repositoryId: parseInt(repository.id),
        assignees,
        labels,
      };
      const res = await props.createIssue(issue);
      if (res && res.code === 0) {
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

  useEffect(async () => {
    if (repository) {
      setAllLabels(repository.labels);
    }
  }, [repository.id]);

  const username = props.selectedAddress ? props.selectedAddress.slice(-1) : "";
  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="flex bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="flex mt-8">
            <div className="flex flex-1">
              <div className="flex-none mr-4">
                <div className="avatar">
                  <div className="mb-8 rounded-full w-10 h-10">
                    <img
                      src={
                        "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                        username
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border border-grey rounded flex-1 p-4">
                <div className="form-control mb-4">
                  <input
                    type="text"
                    placeholder="Issue Title"
                    className="input input-md input-bordered"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
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
                    >
                      Create Issue
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-none w-64 pl-8 divide-y divide-grey">
              <div className="w-full pb-8">
                <AssigneeSelector
                  assignees={assignees}
                  collaborators={[
                    { id: repository.owner.id, permission: "CREATOR" },
                    ...repository.collaborators,
                  ]}
                  onChange={async (list) => {
                    setAssignees(list);
                  }}
                />
                <div className="text-xs px-3 mt-2">
                  {assignees.length ? (
                    <AssigneeGroup assignees={assignees} />
                  ) : (
                    "No one"
                  )}
                </div>
              </div>
              <div className="py-8">
                <LabelSelector
                  labels={labels}
                  repoLabels={repository.labels}
                  editLabels={
                    "/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/issues/labels"
                  }
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
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, { createIssue })(
  RepositoryIssueCreateView
);
