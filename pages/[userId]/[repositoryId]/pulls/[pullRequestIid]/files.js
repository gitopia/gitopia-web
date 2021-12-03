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
import getPullDiff from "../../../../../helpers/getPullDiff";
import getDiff from "../../../../../helpers/getDiff";
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryPullFilesView(props) {
  const repository = useRepository();
  const { pullRequest } = usePullRequest(repository);
  const [stats, setStats] = useState({ stat: {} });
  const [viewType, setViewType] = useState("unified");

  useEffect(async () => {
    let diff;
    if (pullRequest.base.repositoryId === pullRequest.head.repositoryId) {
      diff = await getDiff(
        pullRequest.base.repositoryId,
        pullRequest.base.sha,
        null,
        pullRequest.head.sha,
        true
      );
    } else {
      diff = await getPullDiff(
        pullRequest.base.repositoryId,
        pullRequest.head.repositoryId,
        pullRequest.base.sha,
        pullRequest.head.sha,
        null,
        true
      );
    }
    setStats(diff);
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
        <main
          className={
            "py-12 px-4 " +
            (viewType === "unified" ? "container mx-auto max-w-screen-lg" : "")
          }
        >
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
              active="files"
            />
          </div>
          <div className="mt-8">
            <DiffView
              stats={stats}
              repoId={pullRequest.base.repositoryId}
              targetRepoId={pullRequest.head.repositoryId}
              currentSha={pullRequest.base.sha}
              previousSha={pullRequest.head.sha}
              onViewTypeChange={(v) => setViewType(v)}
            />
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
})(RepositoryPullFilesView);
