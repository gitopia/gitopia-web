import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import find from "lodash/find";

import getIssue from "../../../../../helpers/getIssue";
import getIssueComment from "../../../../../helpers/getIssueComment";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import CommentEditor from "../../../../../components/repository/commentEditor";
import CommentView from "../../../../../components/repository/commentView";
import SystemCommentView from "../../../../../components/repository/systemCommentView";
import {
  deleteComment,
  updateIssueLabels,
  updateIssueAssignees,
} from "../../../../../store/actions/repository";
import AssigneeSelector from "../../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../../components/repository/labelSelector";
import Label from "../../../../../components/repository/label";
import useRepository from "../../../../../hooks/useRepository";
import IssuePullTitle from "../../../../../components/repository/issuePullTitle";
import IssuePullDescription from "../../../../../components/repository/issuePullDescription";
import { useErrorStatus } from "../../../../../hooks/errorHandler";
import pluralize from "../../../../../helpers/pluralize";
import IssueTabs from "../../../../../components/repository/issueTabs";
import IssuePullRequestView from "../../../../../components/repository/pullRequestView";
import IssueBountyView from "../../../../../components/repository/bountiesView";
import getIssueCommentAll from "../../../../../helpers/getIssueCommentAll";
import validAddress from "../../../../../helpers/validAddress";
import AccountCard from "../../../../../components/account/card";
import { useApiClient } from "../../../../../context/ApiClientContext";

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
      const i = JSON.parse(
        (
          await db
            .first("*")
            .from("Issues")
            .where({ iid: params.issueIid, repositoryId: r.id })
        ).data
      );
      if (i) {
        let cs;
        if (i.commentsCount) {
          const csJsons = await db.select("*").from("Comments").where({
            repositoryId: r.id,
            parentIid: i.iid,
            parent: "COMMENT_PARENT_ISSUE",
          });
          cs = csJsons.map((j) => JSON.parse(j.data));
        }
        return {
          props: { repository: r, issue: i, comments: cs || [] },
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
      paths = JSON.parse(fs.readFileSync("./seo/paths-issues.json"));
    } catch (e) {
      console.error(e);
    }
  }
  return {
    paths,
    fallback: "blocking",
  };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const { repository, refreshRepository } = useRepository(props.repository);
  const [issue, setIssue] = useState({
    iid: router.query.issueIid,
    creator: "",
    description: "",
    comments: [],
    assignees: [],
    labels: [],
    pullRequests: [],
    bounties: [],
    ...props.issue,
  });
  const [allComments, setAllComments] = useState(props.comments || []);
  const [allLabels, setAllLabels] = useState([]);
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  useEffect(() => {
    async function initIssues() {
      const [i, c] = await Promise.all([
        getIssue(
          apiClient,
          router.query.userId,
          router.query.repositoryId,
          router.query.issueIid
        ),
        getIssueCommentAll(apiClient, repository.id, router.query.issueIid),
      ]);
      if (i) {
        i.comments = c;
        setIssue(i);
      } else {
        setErrorStatusCode(404);
      }
    }
    initIssues();
  }, [router.query.issueIid, repository.id]);

  useEffect(() => {
    setAllLabels(repository.labels);
  }, [repository]);

  const getAllComments = async () => {
    const comments = await getIssueCommentAll(
      apiClient,
      repository.id,
      issue.iid
    );
    if (comments) {
      setAllComments(comments);
    } else {
      setAllComments([]);
    }
  };

  const refreshIssue = async () => {
    const [i, c] = await Promise.all([
      getIssue(apiClient, router.query.userId, repository.name, issue.iid),
      getIssueCommentAll(apiClient, repository.id, router.query.issueIid),
    ]);
    if (i) {
      i.comments = c;
      setIssue(i);
    }
  };

  useEffect(() => {
    getAllComments();
  }, [issue]);

  const userCommentsLength = allComments.filter((c) => !c.system).length;

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
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="mt-8">
            <IssuePullTitle
              issuePullObj={issue}
              repository={repository}
              onUpdate={refreshIssue}
            />
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={
                "flex items-center rounded-full border pl-4 pr-6 py-1 mr-4 " +
                (issue.state === "OPEN" ? "border-green-900" : "border-red-900")
              }
            >
              <span
                className={
                  "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                  (issue.state === "OPEN" ? "bg-green-900" : "bg-red-900")
                }
              />
              <span className="text-type text-sm uppercase">{issue.state}</span>
            </span>
            <span className="text-xs mr-2 text-type-secondary">
              <AccountCard id={issue.creator} />
              {" opened this issue " + dayjs(issue.createdAt * 1000).fromNow()}
            </span>
            <span className="text-xl mr-2 text-type-secondary">&middot;</span>
            <span className="text-xs text-type-secondary">
              {userCommentsLength}
              <span className="ml-1">
                {pluralize("comment", userCommentsLength)}
              </span>
            </span>
          </div>
          <IssueTabs
            repository={repository}
            issueId={issue.iid}
            active="conversation"
          />
          <div className="sm:flex mt-8">
            <div className="flex flex-1">
              <div className="flex flex-col w-full">
                <IssuePullDescription
                  issuePullObj={issue}
                  repository={repository}
                  onUpdate={refreshIssue}
                />
                {allComments.map((c, i) => {
                  if (c.system) {
                    return (
                      <SystemCommentView comment={c} key={"comment" + i} />
                    );
                  } else {
                    return (
                      <div className="mt-8">
                        <CommentView
                          comment={c}
                          repositoryId={repository.id}
                          parentIid={issue.iid}
                          parent={"COMMENT_PARENT_ISSUE"}
                          userAddress={props.selectedAddress}
                          onUpdate={async (iid) => {
                            const newComment = await getIssueComment(
                              repository.id,
                              issue.iid,
                              iid
                            );
                            const newAllComments = [...allComments];
                            newAllComments[i] = newComment;
                            setAllComments(newAllComments);
                          }}
                          onDelete={async (iid) => {
                            const res = await props.deleteComment(
                              apiClient,
                              cosmosBankApiClient,
                              cosmosFeegrantApiClient,
                              {
                                repositoryId: repository.id,
                                parentIid: issue.iid,
                                parent: "COMMENT_PARENT_ISSUE",
                                commentIid: iid,
                              }
                            );
                            if (res && res.code === 0) {
                              const newAllComments = [...allComments];
                              newAllComments.splice(i, 1);
                              setAllComments(newAllComments);
                            }
                          }}
                          key={"comment" + i}
                        />
                      </div>
                    );
                  }
                })}
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
                    parentIid={issue.iid}
                    parent={"COMMENT_PARENT_ISSUE"}
                    issueState={issue.state}
                    onSuccess={refreshIssue}
                  />
                </div>
              </div>
            </div>
            <div className="flex-none sm:w-72 sm:pl-8 divide-y divide-grey mt-8 sm:mt-0">
              <div className="pb-8">
                <AssigneeSelector
                  assignees={issue.assignees}
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

                    const res = await props.updateIssueAssignees(
                      apiClient,
                      cosmosBankApiClient,
                      cosmosFeegrantApiClient,
                      {
                        repositoryId: repository.id,
                        iid: issue.iid,
                        addedAssignees,
                        removedAssignees,
                      }
                    );

                    if (res) refreshIssue();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex gap-2">
                  {issue.assignees.length
                    ? issue.assignees.map((a, i) => (
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
                  labels={issue.labels}
                  repository={repository}
                  refreshRepository={refreshRepository}
                  onChange={async (list) => {
                    console.log("list", list);
                    const removedLabels = issue.labels.filter(
                      (x) => !list.includes(x)
                    );
                    const addedLabels = list.filter(
                      (x) =>
                        !(removedLabels.includes(x) || issue.labels.includes(x))
                    );

                    const res = await props.updateIssueLabels(
                      apiClient,
                      cosmosBankApiClient,
                      cosmosFeegrantApiClient,
                      {
                        repositoryId: repository.id,
                        iid: issue.iid,
                        addedLabels,
                        removedLabels,
                      }
                    );

                    if (res) refreshIssue();
                  }}
                />
                <div className="text-xs px-3 mt-2 flex flex-wrap">
                  {issue.labels.length
                    ? issue.labels.map((l, i) => {
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
              {issue.pullRequests.length > 0 ? (
                <IssuePullRequestView
                  pullRequests={issue.pullRequests}
                  repositoryId={repository.id}
                  repositoryName={repository.name}
                  repoOwner={repository.owner.id}
                />
              ) : (
                ""
              )}
              {issue.bounties?.length > 0 ? (
                <IssueBountyView bounties={issue.bounties} />
              ) : (
                ""
              )}
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
  };
};

export default connect(mapStateToProps, {
  deleteComment,
  updateIssueAssignees,
  updateIssueLabels,
})(RepositoryIssueView);
