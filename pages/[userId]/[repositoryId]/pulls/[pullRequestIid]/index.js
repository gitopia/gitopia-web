import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import find from "lodash/find";
import Head from "next/head";

import Header from "../../../../../components/header";
import getPullRequestComment from "../../../../../helpers/getPullRequestComment";
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
import ReviewerSelector from "../../../../../components/repository/reviewerSelector";
import LabelSelector from "../../../../../components/repository/labelSelector";
import Label from "../../../../../components/repository/label";
import PullRequestTabs from "../../../../../components/repository/pullRequestTabs";
import PullRequestHeader from "../../../../../components/repository/pullRequestHeader";
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";
import MergePullRequestView from "../../../../../components/repository/mergePullRequestView";
import IssuePullDescription from "../../../../../components/repository/issuePullDescription";
import getBranchSha from "../../../../../helpers/getBranchSha";
import PullRequestIssueView from "../../../../../components/repository/issuesView";
import AccountCard from "../../../../../components/account/card";
import getPullRequestCommentAll from "../../../../../helpers/getPullRequestCommentAll";
import { parseDiff, Diff, Hunk, getChangeKey } from "react-diff-view";
import getDiff from "../../../../../helpers/getDiff";
import getPullDiff from "../../../../../helpers/getPullDiff";
import validAddress from "../../../../../helpers/validAddress";
import { commentType } from "../../../../../helpers/systemCommentTypeClass";

export async function getStaticProps({ params }) {
  try {
    const db = (await import("../../../../../helpers/getSeoDatabase")).default;
    let r;
    if (validAddress.test(params.userId)) {
      r = JSON.parse(
        (
          await db
            .first("*")
            .from("Repositories")
            .where({ name: params.repositoryId, ownerAddress: params.userId })
        ).data
      );
    } else {
      r = JSON.parse(
        (
          await db
            .first("*")
            .from("Repositories")
            .where({ name: params.repositoryId, ownerUsername: params.userId })
        ).data
      );
    }

    if (r) {
      const p = JSON.parse(
        (
          await db
            .first("*")
            .from("PullRequests")
            .where({ iid: params.pullRequestIid, baseRepositoryId: r.id })
        ).data
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
          const forkRepo = JSON.parse(
            (
              await db
                .first("*")
                .from("Repositories")
                .where({ id: p.head.repositoryId })
            ).data
          );
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
        let cs;
        if (p.commentsCount) {
          const csJsons = await db.select("*").from("Comments").where({
            repositoryId: r.id,
            parentIid: p.iid,
            parent: "COMMENT_PARENT_PULL_REQUEST",
          });
          cs = csJsons.map((j) => JSON.parse(j.data));
        }
        return {
          props: { repository: r, pullRequest: p, comments: cs || [] },
          revalidate: 1,
        };
      }
    }
  } catch (e) {
    console.error(e);
  }
  return { props: {} };
}

export async function getStaticPaths() {
  let paths = [];
  if (process.env.GENERATE_SEO_PAGES) {
    try {
      const fs = (await import("fs")).default;
      paths = JSON.parse(fs.readFileSync("./seo/paths-pulls.json"));
    } catch (e) {
      console.error(e);
    }
  }
  return {
    paths,
    fallback: "blocking",
  };
}

function RepositoryPullView(props) {
  const { repository, refreshRepository } = useRepository(props.repository);
  const { pullRequest, refreshPullRequest } = usePullRequest(
    repository,
    props.pullRequest
  );
  const [allComments, setAllComments] = useState(props.comments || []);
  const [files, setFiles] = useState([]);

  const getAllComments = async () => {
    const comments = await getPullRequestCommentAll(
      repository.id,
      pullRequest.iid
    );
    if (comments) {
      setAllComments(comments);
    }
  };

  // const getCommentView = (creator, body, createdAt) => {
  //   return (
  //     <div className="text-right my-4 sm:justify-end mx-4">
  //       <div
  //         className="border border-grey rounded-lg flex-1"
  //         data-test="comment_view"
  //       >
  //         <div className="p-4">
  //           <div className="flex uppercase text-xs font-bold">
  //             <div className="">{shrinkAddress(creator)}</div>
  //             <div className="pl-3 text-type-tertiary">
  //               {dayjs(createdAt * 1000).fromNow()}
  //             </div>
  //           </div>
  //           <div className="text-left text-white font-normal markdown-body mt-4">
  //             <ReactMarkdown linkTarget="_blank">{body}</ReactMarkdown>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const getCommentView = (comment) => {
    return (
      <CommentView
        comment={comment}
        repositoryId={repository.id}
        parentIid={pullRequest.iid}
        parent={"COMMENT_PARENT_PULL_REQUEST"}
        key={"comment" + comment.id}
        userAddress={props.selectedAddress}
        onUpdate={async (iid) => {
          const newComment = await getPullRequestComment(
            repository.id,
            pullRequest.iid,
            iid
          );
          const newAllComments = [...allComments];
          let index = allComments.findIndex((c) => c.id === comment.id);
          if (index > -1) newAllComments[index] = newComment;
          setAllComments(newAllComments);
        }}
        onDelete={async (iid) => {
          const res = await props.deleteComment({
            repositoryId: repository.id,
            parentIid: pullRequest.iid,
            parent: "COMMENT_PARENT_PULL_REQUEST",
            commentIid: iid,
          });
          if (res && res.code === 0) {
            const newAllComments = [...allComments];
            let index = allComments.findIndex((c) => c.id === comment.id);
            if (index > -1) newAllComments.splice(index, 1);
            setAllComments(newAllComments);
          }
        }}
      />
    );
  };

  const getWidgets = (hunks, comment) => {
    const changesLength = hunks[0]?.changes?.length;
    if (changesLength) {
      const longLines = [hunks[0].changes[changesLength - 1]];
      return longLines.reduce((widgets, change) => {
        const changeKey = getChangeKey(change);

        return {
          ...widgets,
          [changeKey]: <div className="p-4">{getCommentView(comment)}</div>,
        };
      }, {});
    } else return "";
  };

  const renderFile = ({ diff }, hunks, comment) => {
    const { oldRevision, newRevision, type } = diff[0];
    if (hunks && hunks.length && hunks[0].content) {
      return (
        <div className="border border-grey rounded-lg w-11/12 sm:w-full">
          <div className={"text-sm transition-transform origin-top "}>
            <Diff
              key={oldRevision + "-" + newRevision}
              viewType={"unified"}
              optimizeSelection={true}
              diffType={type}
              hunks={hunks}
              widgets={getWidgets(hunks, comment)}
            >
              {(hunks) => <Hunk key={hunks[0].content} hunk={hunks[0]} />}
            </Diff>
          </div>
        </div>
      );
    }
    return "";
  };

  const loadDiff = async () => {
    let data = await getPullDiff(
      pullRequest.base.repository.id,
      pullRequest.head.repository.id,
      pullRequest.base.sha,
      pullRequest.head.sha
    );
    let newFiles = [];
    if (data && data.diff) {
      data.diff.map(({ file_name, patch, stat }) => {
        const diff = parseDiff(patch);
        newFiles.push({
          filename: file_name,
          diff,
          patch,
          stat,
        });
      });
    }
    setFiles([...newFiles]);
  };

  useEffect(() => {
    getAllComments();
    loadDiff();
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
                  } else if (c.commentType === "COMMENT_TYPE_REVIEW") {
                    let fileDiff = files.find((d) => d.filename === c.path);
                    let hunks = [];
                    if (fileDiff && fileDiff.diff && fileDiff.diff.length > 0) {
                      fileDiff.diff[0].hunks.map((hunk) => {
                        if (hunk.content === c.diffHunk) {
                          hunks = [
                            {
                              ...hunk,
                              changes: hunk.changes.slice(
                                parseInt(c.position) > 2
                                  ? parseInt(c.position) - 2
                                  : 0,
                                parseInt(c.position) + 1
                              ),
                            },
                          ];
                        }
                      });
                      return (
                        <div className="flex w-full" key={c.id}>
                          <div className="flex-none mr-4 w-10"></div>
                          <div className="flex-none w-12 relative pt-5 flex justify-center">
                            <div className="w-6 h-6 bg-base-100 z-10">
                              {commentType["COMMENT_TYPE_ADD_REVIEWERS"]}
                            </div>
                            <div className="border-l border-grey h-full absolute left-1/2 top-0 z-0"></div>
                          </div>
                          <div className="w-full">
                            <div className="mt-5 mb-2 text-sm text-type-primary">
                              {c.path}
                              {!hunks.length ? (
                                <div className="text-type-tertiary text-xs">
                                  Unable to load diff
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            {hunks.length ? (
                              [fileDiff].map((diff) =>
                                renderFile(diff, hunks, c)
                              )
                            ) : (
                              <div className="mt-4">{getCommentView(c)}</div>
                            )}
                          </div>
                        </div>
                      );
                    }
                  } else {
                    return <div className="mt-8">{getCommentView(c)}</div>;
                  }
                })}
                <MergePullRequestView
                  pullRequest={pullRequest}
                  repositoryId={repository.id}
                  refreshPullRequest={refreshPullRequest}
                />
                <div className="flex w-full mt-8">
                  <div className="flex-none mr-4">
                    <AccountCard
                      id={props.selectedAddress}
                      showAvatar={true}
                      showId={false}
                    />
                  </div>
                  <CommentEditor
                    repositoryId={repository.id}
                    parentIid={pullRequest.iid}
                    parent={"COMMENT_PARENT_PULL_REQUEST"}
                    issueState={pullRequest.state}
                    onSuccess={refreshPullRequest}
                    commentType="PULLREQUEST"
                  />
                </div>
              </div>
            </div>

            <div className="flex-none sm:w-72 sm:pl-8 divide-y divide-grey mt-8 sm:mt-0">
              <div className="pb-8">
                <ReviewerSelector
                  reviewers={pullRequest.reviewers}
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
                      repositoryId: repository.id,
                      pullIid: pullRequest.iid,
                      addedReviewers,
                      removedReviewers,
                    });

                    if (res) refreshPullRequest();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex gap-2">
                  {pullRequest.reviewers.length
                    ? pullRequest.reviewers.map((a, i) => (
                        <div key={"reviewer" + i}>
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
                <AssigneeSelector
                  assignees={pullRequest.assignees}
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
                      repositoryId: repository.id,
                      pullIid: pullRequest.iid,
                      addedAssignees,
                      removedAssignees,
                    });

                    if (res) refreshPullRequest();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex gap-2">
                  {pullRequest.assignees.length
                    ? pullRequest.assignees.map((a, i) => (
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
                  labels={pullRequest.labels}
                  repository={repository}
                  refreshRepository={refreshRepository}
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
                      repositoryId: repository.id,
                      pullIid: pullRequest.iid,
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
              {pullRequest.issues.length > 0 ? (
                <PullRequestIssueView
                  issues={pullRequest.issues}
                  repositoryId={repository.id}
                  repositoryName={repository.name}
                  repoOwner={repository.owner.id}
                />
              ) : (
                ""
              )}
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
