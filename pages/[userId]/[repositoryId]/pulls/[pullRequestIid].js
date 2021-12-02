import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";

import getUserRepository from "../../../../helpers/getUserRepository";
import getRepositoryPull from "../../../../helpers/getRepositoryPull";
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
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryPullView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    forks: [],
    stargazers: [],
    branches: [],
    tags: [],
  });
  const [pullRequest, setPullRequest] = useState({
    iid: router.query.pullRequestIid,
    creator: "",
    comments: [],
    reviewers: [],
    assignees: [],
    labels: [],
  });
  const [allComments, setAllComments] = useState([]);

  useEffect(async () => {
    const [r, p] = await Promise.all([
      getUserRepository(router.query.userId, router.query.repositoryId),
      getRepositoryPull(
        router.query.userId,
        router.query.repositoryId,
        router.query.pullRequestIid
      ),
    ]);
    if (r) setRepository(r);
    if (p) setPullRequest(p);
    console.log(r, p);
  }, [router.query]);

  const getAllComments = async () => {
    const pr = pullRequest.comments.map((c) => getComment(c));
    const comments = await Promise.all(pr);
    setAllComments(comments);
  };

  const refreshPullRequest = async () => {
    const i = await getRepositoryPull(
      repository.owner.id,
      repository.name,
      pullRequest.iid
    );
    setPullRequest(i);
  };

  useEffect(getAllComments, [pullRequest]);

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
          <RepositoryMainTabs
            active="pulls"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div className="flex mt-8">
            <div className="flex-1">
              <div>
                <span className="text-3xl mr-2">{pullRequest.title}</span>
                <span className="text-3xl text-type-secondary">
                  #{pullRequest.iid}
                </span>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={
                    "flex items-center rounded-full border pl-4 pr-6 py-2 mr-4 " +
                    (pullRequest.state === "OPEN"
                      ? "border-green-900"
                      : "border-red-900")
                  }
                >
                  <span
                    className={
                      "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                      (pullRequest.state === "OPEN"
                        ? "bg-green-900"
                        : "bg-red-900")
                    }
                  />
                  <span className="text-type uppercase">
                    {pullRequest.state}
                  </span>
                </span>
                <span className="text-xs mr-2 text-type-secondary">
                  {shrinkAddress(pullRequest.creator) + " wants to merge "}
                  <Link
                    href={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/tree/" +
                      pullRequest.headBranch
                    }
                  >
                    <a className="text-xs link link-primary no-underline hover:underline">
                      {pullRequest.headBranch}
                    </a>
                  </Link>
                  {" to "}
                  <Link
                    href={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/tree/" +
                      pullRequest.baseBranch
                    }
                  >
                    <a className="text-xs link link-primary no-underline hover:underline">
                      {pullRequest.baseBranch}
                    </a>
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <div className="tabs">
              <div className="tab tab-bordered tab-active">Conversation</div>
              <div className="tab tab-bordered">Commits</div>
              <div className="tab tab-bordered">Files Changed</div>
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
                            pullRequest.creator.slice(-1)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-grey rounded flex-1">
                    <div className="flex text-xs px-4 py-2 bg-base-200 rounded-t items-center">
                      <div className="flex-1">
                        {shrinkAddress(pullRequest.creator) +
                          " commented " +
                          dayjs(pullRequest.createdAt * 1000).fromNow()}
                      </div>
                    </div>
                    <div className="p-4 markdown-body">
                      <ReactMarkdown linkTarget="_blank">
                        {pullRequest.description}
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
                    issueId={pullRequest.id}
                    issueState={pullRequest.state}
                    onSuccess={refreshPullRequest}
                    commentType="PULLREQUEST"
                  />
                </div>
              </div>
            </div>
            <div className="flex-none w-64 pl-8 divide-y divide-grey">
              <div className="pb-8">
                <AssigneeSelector
                  assignees={pullRequest.assignees}
                  collaborators={repository.collaborators}
                  onChange={async (list) => {
                    console.log("list", list);
                    const removedAssignees = pullRequest.assignees.filter(
                      (x) => !list.includes(x)
                    );
                    const addedAssignees = list.filter(
                      (x) =>
                        !(
                          removedAssignees.includes(x) ||
                          pullRequest.assignees.includes(x)
                        )
                    );

                    const res = await props.updateIssueAssignees({
                      issueId: pullRequest.id,
                      addedAssignees,
                      removedAssignees,
                    });

                    if (res) refreshPullRequest();
                  }}
                />
                <div className="text-xs px-3 mt-2">
                  {pullRequest.assignees.length ? (
                    <AssigneeGroup assignees={pullRequest.assignees} />
                  ) : (
                    "No one"
                  )}
                </div>
              </div>
              <div className="py-8">
                <LabelSelector
                  labels={pullRequest.labels}
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
                    const removedLabels = pullRequest.labels.filter(
                      (x) => !list.includes(x)
                    );
                    const addedLabels = list.filter(
                      (x) =>
                        !(
                          removedLabels.includes(x) ||
                          pullRequest.labels.includes(x)
                        )
                    );

                    const res = await props.updateIssueLabels({
                      issueId: pullRequest.id,
                      addedLabels,
                      removedLabels,
                    });

                    if (res) refreshPullRequest();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex flex-wrap">
                  {pullRequest.labels.length
                    ? pullRequest.labels.map((l, i) => {
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
})(RepositoryPullView);
