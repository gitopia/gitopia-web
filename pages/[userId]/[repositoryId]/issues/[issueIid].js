import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import find from "lodash/find";

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
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";
import useRepository from "../../../../hooks/useRepository";
import IssuePullTitle from "../../../../components/repository/issuePullTitle";
import IssuePullDescription from "../../../../components/repository/issuePullDescription";
import { useErrorStatus } from "../../../../hooks/errorHandler";
import pluralize from "../../../../helpers/pluralize";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const { repository } = useRepository();
  const [issue, setIssue] = useState({
    iid: router.query.issueIid,
    creator: "",
    description: "",
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
    if (i) {
      setIssue(i);
    } else {
      setErrorStatusCode(404);
    }
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
                "flex items-center rounded-full border pl-4 pr-6 py-2 mr-4 " +
                (issue.state === "OPEN" ? "border-green-900" : "border-red-900")
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
            <span className="text-xl mr-2 text-type-secondary">&middot;</span>
            <span className="text-xs text-type-secondary">
              {issue.comments.length}
              <span className="ml-1">
                {pluralize("comment", issue.comments.length)}
              </span>
            </span>
          </div>
          <div className="flex mt-8">
            <div className="flex flex-1">
              <div className="flex flex-col w-full">
                <IssuePullDescription
                  issuePullObj={issue}
                  repository={repository}
                  onUpdate={refreshIssue}
                />
                {allComments.map((c, i) => {
                  if (c.system) {
                    return <SystemCommentView comment={c} />;
                  } else {
                    return (
                      <CommentView
                        comment={c}
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
                  collaborators={[
                    { id: repository.owner.id, permission: "CREATOR" },
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
