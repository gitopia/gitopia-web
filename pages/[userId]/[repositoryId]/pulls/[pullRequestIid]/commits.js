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
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";
import getPullRequestCommits from "../../../../../helpers/getPullRequestCommits";
import { getCommit } from "../../../../../store/actions/git";
import { useRouter } from "next/router";
import CommitDetailRow from "../../../../../components/repository/commitDetailRow";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryPullCommitsView(props) {
  const { repository } = useRepository();
  const { pullRequest } = usePullRequest(repository);
  const router = useRouter();
  const [viewType, setViewType] = useState("unified");
  const [commits, setCommits] = useState([]);
  const [commitShas, setCommitShas] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadedTill, setLoadedTill] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(async () => {
    const shas = await getPullRequestCommits(
      pullRequest.base.repositoryId,
      pullRequest.head.repositoryId,
      pullRequest.base.branch,
      pullRequest.head.branch
    );
    console.log(shas);
    setCommitShas(shas);
  }, [pullRequest]);

  const paginationLimit = 10;

  const loadCommits = async () => {
    setLoadingMore(true);
    let creq = [];
    for (let i = 0; i < paginationLimit; i++) {
      if (i === paginationLimit - 1) {
        if (loadedTill + i !== commitShas.length) {
          setHasMore(true);
        }
      }
      if (loadedTill + i === commitShas.length) {
        setHasMore(false);
        break;
      }

      creq.push(
        getCommit(
          repository.id,
          commitShas[loadedTill + i],
          repository.name,
          router.query.userId
        )
      );
    }
    const res = await Promise.all(creq);
    console.log("getCommit", res);
    setCommits([...commits, ...res]);
    setLoadingMore(false);
  };

  useEffect(loadCommits, [commitShas, loadedTill]);

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
          <RepositoryMainTabs
            repoOwner={repository.owner.id}
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
              active="commits"
            />
          </div>
          <div className="mt-8 px-4">{commitShas.length + " Commits"}</div>
          <div className="mt-8">
            {commits.map((c, i) => {
              return (
                <div
                  key={"commit" + i}
                  className="border border-grey rounded overflow-hidden mt-4"
                >
                  <CommitDetailRow
                    commitDetail={c}
                    commitLink={[
                      "",
                      pullRequest.head.repository.owner.id,
                      pullRequest.head.repository.name,
                      "commit",
                      c.oid,
                    ].join("/")}
                    maxMessageLength={90}
                  />
                </div>
              );
            })}
          </div>
          {hasMore ? (
            <div className="mt-8 text-center">
              <button
                className={
                  "btn btn-sm btn-wide " + (loadingMore ? "loading" : "")
                }
                disabled={loadingMore}
                onClick={() => {
                  setLoadedTill(loadedTill + paginationLimit);
                }}
              >
                Load More
              </button>
            </div>
          ) : (
            ""
          )}
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
})(RepositoryPullCommitsView);