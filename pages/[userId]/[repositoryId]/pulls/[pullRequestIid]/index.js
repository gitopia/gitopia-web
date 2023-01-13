import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import find from "lodash/find";
import Head from "next/head";

import Header from "../../../../../components/header";
import getComment from "../../../../../helpers/getComment";
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
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";
import MergePullRequestView from "../../../../../components/repository/mergePullRequestView";
import IssuePullDescription from "../../../../../components/repository/issuePullDescription";
import getBranchSha from "../../../../../helpers/getBranchSha";
import filter from "lodash/filter";

export async function getStaticProps({ params }) {
  const fs = (await import("fs")).default;
  const repositories = JSON.parse(
      fs.readFileSync("./seo/dump-repositories.json")
    ),
    pulls = JSON.parse(fs.readFileSync("./seo/dump-pulls.json")),
    comments = JSON.parse(fs.readFileSync("./seo/dump-comments.json"));

  const r = find(
    repositories,
    (r) =>
      r.name === params.repositoryId &&
      (r.owner.id === params.userId || r.owner.username === params.userId)
  );

  if (r) {
    const p = find(
      pulls,
      (t) => t.iid === params.pullRequestIid && t.base?.repositoryId === r.id
    );
    if (p) {
      if (p.base.repositoryId === p.head.repositoryId) {
        p.head.repository = p.base.repository = r;
        if (p.state === "OPEN") {
          p.head.sha = getBranchSha(p.head.branch, r.branches, r.tags);
          p.base.sha = getBranchSha(p.base.branch, r.branches, r.tags);
        } else {
          p.base.sha = p.base.commitSha;
          p.head.sha = p.head.commitSha;
        }
      } else {
        const forkRepo = find(repositories, { id: p.head.repositoryId });
        if (forkRepo) {
          p.head.repository = forkRepo;
          p.base.repository = r;
          if (p.state === "OPEN") {
            p.head.sha = getBranchSha(
              p.head.branch,
              forkRepo.branches,
              forkRepo.tags
            );
            p.base.sha = getBranchSha(p.base.branch, r.branches, r.tags);
          } else {
            p.base.sha = p.base.commitSha;
            p.head.sha = p.head.commitSha;
          }
        }
      }
      const cs = filter(comments, (c) => p.comments.includes(c.id));
      return {
        props: { repository: r, pullRequest: p, comments: cs },
        revalidate: 1,
      };
    }
  }
  return { props: {} };
}

export async function getStaticPaths() {
  const fs = (await import("fs")).default;
  let paths = [];
  try {
    paths = JSON.parse(fs.readFileSync("./seo/paths-pulls.json"));
  } catch (e) {
    console.error(e);
  }
  return {
    paths,
    fallback: "blocking",
  };
}

function RepositoryPullView(props) {
  const { repository } = useRepository(props.repository);
  const { pullRequest, refreshPullRequest } = usePullRequest(
    repository,
    props.pullRequest
  );
  const [allComments, setAllComments] = useState(props.comments || []);

  const getAllComments = async () => {
    const pr = pullRequest.comments.map((c) => getComment(c));
    const comments = await Promise.all(pr);
    setAllComments(comments);
  };

  useEffect(() => {
    getAllComments();
  }, [pullRequest]);

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
          <RepositoryMainTabs repository={repository} active="pulls" />
          <div className="mt-8">
            <PullRequestHeader
              pullRequest={pullRequest}
              repository={repository}
              onUpdate={refreshPullRequest}
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
          <div className="sm:flex mt-8">
            <div className="flex flex-1">
              <div className="flex flex-col w-full">
                <IssuePullDescription
                  issuePullObj={pullRequest}
                  isPull={true}
                  repository={repository}
                  onUpdate={refreshPullRequest}
                />
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
                <MergePullRequestView
                  pullRequest={pullRequest}
                  refreshPullRequest={refreshPullRequest}
                />
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

            <div className="flex-none sm:w-64 sm:pl-8 divide-y divide-grey mt-8 sm:mt-0">
              <div className="pb-8">
                <AssigneeSelector
                  title="Reviewers"
                  assignees={pullRequest.reviewers}
                  collaborators={[
                    { id: repository.owner.address, permission: "CREATOR" },
                    ...repository.collaborators,
                  ]}
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
                  collaborators={[
                    { id: repository.owner.address, permission: "CREATOR" },
                    ...repository.collaborators,
                  ]}
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
                        let label = find(repository.labels, { id: l }) || {
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
  };
};

export default connect(mapStateToProps, {
  notify,
  deleteComment,
  updatePullRequestLabels,
  updatePullRequestAssignees,
  updatePullRequestReviewers,
})(RepositoryPullView);
