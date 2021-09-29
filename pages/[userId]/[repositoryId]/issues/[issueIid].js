import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";

import getUserRepository from "../../../../helpers/getUserRepository";
import getRepositoryIssue from "../../../../helpers/getRepositoryIssue";
import getComment from "../../../../helpers/getComment";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import CommentEditor from "../../../../components/repository/commentEditor";
import CommentView from "../../../../components/repository/commentView";
import SystemCommentView from "../../../../components/repository/systemCommentView";
import {
  deleteComment,
  updateIssueLabels,
  updateIssueAssignees,
} from "../../../../store/actions/repository";
import AssigneeSelector from "../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../components/repository/labelSelector";
import getIssueAllLabels from "../../../../helpers/getIssueAllLabels";
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";
import useRepository from "../../../../hooks/useRepository";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  const repository = useRepository(router.query); 
  const [issue, setIssue] = useState({
    iid: router.query.issueIid,
    creator: "",
    comments: [],
    assignees: [],
    labels: [],
  });
  const [allComments, setAllComments] = useState([]);
  const [allLabels, setAllLabels] = useState([]);

  useEffect(async () => {
    console.log(router.query.userId);
    const [i] = await Promise.all([
      getRepositoryIssue(
        router.query.userId,
        router.query.repositoryId,
        router.query.issueIid
      ),
    ]);
    if (i) setIssue(i);
    console.log(repository);
    setAllLabels(repository.labels);
    console.log(i);
  }, [router.query.issueIid, repository.id]);

  const getAllComments = async () => {
    const pr = issue.comments.map((c) => getComment(c));
    const comments = await Promise.all(pr);
    setAllComments(comments);
  };

  const refreshIssue = async () => {
    const i = await getRepositoryIssue(
      repository.owner.id,
      repository.name,
      issue.iid
    );
    setIssue(i);
  };

  useEffect(getAllComments, [issue]);

  const editMenu = (
    <div class="dropdown dropdown-end">
      <div tabindex="0" class="m-1 btn btn-square btn-xs btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </div>
      <ul
        tabindex="0"
        class="shadow menu dropdown-content bg-base-300 rounded-box w-32"
      >
        <li>
          <a>Edit</a>
        </li>
        <li>
          <a>Delete</a>
        </li>
      </ul>
    </div>
  );

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
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="issues"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div className="flex mt-8">
            <div className="flex-1">
              <div>
                <span className="text-3xl mr-2">{issue.title}</span>
                <span className="text-3xl text-neutral">#{issue.iid}</span>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={
                    "flex items-center rounded-full border pl-4 pr-6 py-2 mr-4 " +
                    (issue.state === "OPEN"
                      ? "border-green-900"
                      : "border-red-900")
                  }
                >
                  <span
                    className={
                      "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                      (issue.state === "OPEN" ? "bg-green-900" : "bg-red-900")
                    }
                  />
                  <span className="text-type uppercase">{issue.state}</span>
                </span>
                <span className="text-xs mr-2 text-type-secondary">
                  {shrinkAddress(issue.creator) +
                    " opened this issue " +
                    dayjs(issue.createdAt * 1000).fromNow()}
                </span>
                <span className="text-xl mr-2 text-type-secondary">
                  &middot;
                </span>
                <span className="text-xs text-type-secondary">
                  {issue.comments.length + " comments"}
                </span>
              </div>
            </div>
            <div className="flex-none w-36">
              <Link
                href={
                  "/" +
                  repository.owner.id +
                  "/" +
                  repository.name +
                  "/issues/new"
                }
              >
                <button className="btn btn-primary btn-sm btn-block">
                  New Issue
                </button>
              </Link>
            </div>
          </div>
          <div className="flex mt-8">
            <div className="flex flex-1">
              <div className="flex flex-col w-full">
                <div className="flex w-full">
                  <div className="flex-none mr-4">
                    <div className="avatar">
                      <div className="mb-8 rounded-full w-10 h-10">
                        <img
                          src={
                            "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                            issue.creator.slice(-1)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-grey rounded flex-1">
                    <div className="flex text-xs px-4 py-2 bg-base-200 rounded-t items-center">
                      <div className="flex-1">
                        {shrinkAddress(issue.creator) +
                          " commented " +
                          dayjs(issue.createdAt * 1000).fromNow()}
                      </div>
                    </div>
                    <div className="p-4 markdown-body">
                      <ReactMarkdown linkTarget="_blank">
                        {issue.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                {allComments.map((c, i) => {
                  if (c.system) {
                    return (
                      <SystemCommentView comment={c} key={"comment" + i} />
                    );
                  } else {
                    return (
                      <CommentView
                        comment={c}
                        key={"comment" + i}
                        userAddress={props.selectedAddress}
                        onUpdate={async (id) => {
                          const newComment = await getComment(id);
                          const newAllComments = [...allComments];
                          newAllComments[i] = newComment;
                          setAllComments(newAllComments);
                        }}
                        onDelete={async (id) => {
                          const res = await props.deleteComment({ id });
                          if (res && res.code === 0) {
                            const newAllComments = [...allComments];
                            newAllComments.splice(i, 1);
                            setAllComments(newAllComments);
                          }
                        }}
                      />
                    );
                  }
                })}
                <div className="flex w-full mt-8">
                  <div className="flex-none mr-4">
                    <div className="avatar">
                      <div className="mb-8 rounded-full w-10 h-10">
                        <img
                          src={
                            "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                            (props.selectedAddress
                              ? props.selectedAddress.slice(-1)
                              : "")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <CommentEditor
                    issueId={issue.id}
                    issueState={issue.state}
                    onSuccess={refreshIssue}
                  />
                </div>
              </div>
            </div>
            <div className="flex-none w-64 pl-8 divide-y divide-grey">
              <div className="pb-8">
                <AssigneeSelector
                  assignees={issue.assignees}
                  collaborators={repository.collaborators}
                  onChange={async (list) => {
                    console.log("list", list);
                    const removedAssignees = issue.assignees.filter(
                      (x) => !list.includes(x)
                    );
                    const addedAssignees = list.filter(
                      (x) =>
                        !(
                          removedAssignees.includes(x) ||
                          issue.assignees.includes(x)
                        )
                    );

                    const res = await props.updateIssueAssignees({
                      issueId: issue.id,
                      addedAssignees,
                      removedAssignees,
                    });

                    if (res) refreshIssue();
                  }}
                />
                <div className="text-xs px-3 mt-2">
                  {issue.assignees.length ? (
                    <AssigneeGroup assignees={issue.assignees} />
                  ) : (
                    "No one"
                  )}
                </div>
              </div>
              <div className="py-8">
                <LabelSelector
                  labels={issue.labels}
                  repoLabels={repository.labels}
                  editLabels={
                    "/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/issues/labels"
                  }
                  onChange={async (list) => {
                    console.log("list", list);
                    const removedLabels = issue.labels.filter(
                      (x) => !list.includes(x)
                    );
                    const addedLabels = list.filter(
                      (x) =>
                        !(removedLabels.includes(x) || issue.labels.includes(x))
                    );

                    const res = await props.updateIssueLabels({
                      issueId: issue.id,
                      addedLabels,
                      removedLabels,
                    });

                    if (res) refreshIssue();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex flex-wrap">
                  {issue.labels.length
                    ? issue.labels.map((l, i) => {
                        let label = _.find(allLabels, { id: l }) || {
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
                <div className="flex-1 text-left px-3 mb-1">
                  Linked Pull Requests
                </div>

                <div className="text-xs px-3 mt-2">None yet</div>
              </div> */}
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
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  deleteComment,
  updateIssueAssignees,
  updateIssueLabels,
})(RepositoryIssueView);
