import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";

import getComment from "../../../../../helpers/getComment";
import shrinkAddress from "../../../../../helpers/shrinkAddress";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import CommentEditor from "../../../../../components/repository/commentEditor";
import CommentView from "../../../../../components/repository/commentView";
import SystemCommentView from "../../../../../components/repository/systemCommentView";
import {
  deleteComment,
  updatePullRequestLabels,
  updatePullRequestAssignees,
  updatePullRequestReviewers,
} from "../../../../../store/actions/repository";
import AssigneeSelector from "../../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../../components/repository/labelSelector";
import Label from "../../../../../components/repository/label";
import AssigneeGroup from "../../../../../components/repository/assigneeGroup";
import PullRequestTabs from "../../../../../components/repository/pullRequestTabs";
import PullRequestHeader from "../../../../../components/repository/pullRequestHeader";
import mergePullRequest from "../../../../../helpers/mergePullRequest";
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryPullView(props) {
  const repository = useRepository();
  const { pullRequest, refreshPullRequest } = usePullRequest(repository);
  const [allComments, setAllComments] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

  const getAllComments = async () => {
    const pr = pullRequest.comments.map((c) => getComment(c));
    const comments = await Promise.all(pr);
    setAllComments(comments);
  };

  const mergePull = async () => {
    setIsMerging(true);
    const res = await mergePullRequest(
      pullRequest.iid,
      pullRequest.base.repositoryId,
      pullRequest.head.repositoryId,
      pullRequest.base.branch,
      pullRequest.head.branch,
      "merge",
      "asdf",
      "asdf@gmail.com",
      "asdfsfd"
    );
    console.log(res);
    setIsMerging(false);
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
          <div className="mt-8">
            <PullRequestHeader
              pullRequest={pullRequest}
              repository={repository}
            />
          </div>
          <div className="mt-8">
            <PullRequestTabs
              hrefBase={[
                "",
                repository.owner.id,
                repository.name,
                "pulls",
                pullRequest.iid,
              ].join("/")}
              active="conversation"
            />
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
                    <div className="flex items-center justify-center w-10 h-10 bg-success rounded">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                      >
                        <path
                          d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="8.5"
                          cy="18.5"
                          r="2.5"
                          fill="currentColor"
                        />
                        <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
                        <path
                          d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 border border-success rounded-md">
                    <div className="flex alert-success p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div className="flex-1">
                        This branch has no conflicts with base branch
                      </div>
                    </div>
                    <button
                      className={
                        "btn btn-sm btn-primary m-4" +
                        (isMerging ? " loading" : "")
                      }
                      onClick={mergePull}
                      disabled={isMerging}
                    >
                      Merge Pull Request
                    </button>
                  </div>
                </div>
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
                  title="Reviewers"
                  assignees={pullRequest.reviewers}
                  collaborators={repository.collaborators}
                  onChange={async (list) => {
                    console.log("list", list);
                    const removedReviewers = pullRequest.reviewers.filter(
                      (x) => !list.includes(x)
                    );
                    const addedReviewers = list.filter(
                      (x) =>
                        !(
                          removedReviewers.includes(x) ||
                          pullRequest.reviewers.includes(x)
                        )
                    );

                    const res = await props.updatePullRequestReviewers({
                      pullId: pullRequest.id,
                      addedReviewers,
                      removedReviewers,
                    });

                    if (res) refreshPullRequest();
                  }}
                />
                <div className="text-xs px-3 mt-2">
                  {pullRequest.reviewers.length ? (
                    <AssigneeGroup assignees={pullRequest.reviewers} />
                  ) : (
                    "No one"
                  )}
                </div>
              </div>
              <div className="py-8">
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

                    const res = await props.updatePullRequestAssignees({
                      pullId: pullRequest.id,
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

                    const res = await props.updatePullRequestLabels({
                      pullId: pullRequest.id,
                      addedLabels,
                      removedLabels,
                    });

                    if (res) refreshPullRequest();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex flex-wrap">
                  {pullRequest.labels.length
                    ? pullRequest.labels.map((l, i) => {
                        let label = _.find(repository.labels, { id: l }) || {
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
  updatePullRequestLabels,
  updatePullRequestAssignees,
  updatePullRequestReviewers,
})(RepositoryPullView);
