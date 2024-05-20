import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import {
  deleteComment,
  updateIssueLabels,
  updateIssueAssignees,
} from "../../../../../store/actions/repository";
import PullRequestTabs from "../../../../../components/repository/pullRequestTabs";
import PullRequestHeader from "../../../../../components/repository/pullRequestHeader";
import DiffView from "../../../../../components/repository/diffView";
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";
import getPullRequestCommentAll from "../../../../../helpers/getPullRequestCommentAll";
import FileTreeView from "../../../../../components/repository/fileTreeView";
import getPullDiffStats from "../../../../../helpers/getPullDiffStats";
import Sticky from "react-stickynode";
import CommentView from "../../../../../components/repository/commentView";
import getPullRequestComment from "../../../../../helpers/getPullRequestComment";
import { useApiClient } from "../../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryPullFilesView(props) {
  const { repository } = useRepository();
  const { pullRequest } = usePullRequest(repository);
  const [stats, setStats] = useState({ stat: {} });
  const [viewType, setViewType] = useState("unified");
  const [allComments, setAllComments] = useState(props.comments || []);
  const [showFile, setShowFile] = useState(null);
  const { apiClient } = useApiClient();

  useEffect(() => {
    async function initDiff() {
      const diff = await getPullDiffStats(
        pullRequest.base.repositoryId,
        pullRequest.head.repositoryId,
        pullRequest.base.sha,
        pullRequest.head.sha
      );
      setStats(diff);
    }
    initDiff();
  }, [pullRequest]);

  useEffect(() => {
    const getAllComments = async () => {
      const comments = await getPullRequestCommentAll(
        apiClient,
        repository.id,
        pullRequest.iid
      );
      if (comments) {
        const reviewComments = comments.filter(
          (c) => c.commentType === "COMMENT_TYPE_REVIEW"
        );
        setAllComments(reviewComments);
      }
    };
    getAllComments();
  }, [pullRequest]);

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

  const refreshComments = async () => {
    const getAllComments = async () => {
      const comments = await getPullRequestCommentAll(
        apiClient,
        repository.id,
        pullRequest.iid
      );
      if (comments) {
        const reviewComments = comments.filter(
          (c) => c.commentType === "COMMENT_TYPE_REVIEW"
        );
        setAllComments(reviewComments);
      }
    };
    getAllComments();
  };

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
        <main
          className={
            "py-12 px-4 " +
            (viewType === "unified" ? "container mx-auto max-w-screen-lg" : "")
          }
        >
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="pulls" />
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
              active="files"
            />
          </div>
          <div className="mt-8 flex gap-2">
            <div className="w-64">
              <Sticky top={0}>
                <FileTreeView
                  pathList={stats?.file_names}
                  onShowFile={(filename) => setShowFile(filename)}
                />
              </Sticky>
            </div>
            <div className="flex-1">
              <DiffView
                stats={stats}
                repoId={pullRequest.head.repositoryId}
                baseRepoId={pullRequest.base.repositoryId}
                currentSha={pullRequest.head.sha}
                previousSha={pullRequest.base.sha}
                parentIid={pullRequest.iid}
                comments={allComments}
                refreshComments={refreshComments}
                onViewTypeChange={(v) => setViewType(v)}
                showFile={showFile}
                getCommentView={getCommentView}
                isPullDiff={true}
              />
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
})(RepositoryPullFilesView);
