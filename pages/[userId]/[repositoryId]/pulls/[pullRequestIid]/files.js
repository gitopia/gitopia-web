import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";

import getUserRepository from "../../../../../helpers/getUserRepository";
import getRepositoryPull from "../../../../../helpers/getRepositoryPull";
import getRepository from "../../../../../helpers/getRepository";
import getComment from "../../../../../helpers/getComment";
import shrinkAddress from "../../../../../helpers/shrinkAddress";
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
import getBranchSha from "../../../../../helpers/getBranchSha";

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
    head: {},
    base: {},
  });
  const [allComments, setAllComments] = useState([]);
  const [stats, setStats] = useState({ stat: {} });
  const [compare, setCompare] = useState({
    source: { repository: {}, name: "", sha: "" },
    target: { repository: {}, name: "", sha: "" },
  });
  const [viewType, setViewType] = useState("unified");

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
    if (p) {
      setPullRequest(p);
      let diff;
      if (p.base.repositoryId === p.head.repositoryId) {
        let baseBranchSha = getBranchSha(p.base.branch, r.branches, r.tags),
          headBranchSha = getBranchSha(p.head.branch, r.branches, r.tags);
        diff = await getDiff(
          p.base.repositoryId,
          baseBranchSha,
          null,
          headBranchSha,
          true
        );
        setCompare({
          source: {
            repository: r,
            name: p.head.branch,
            sha: headBranchSha,
          },
          target: {
            repository: r,
            name: p.base.branch,
            sha: baseBranchSha,
          },
        });
      } else {
        const forkRepo = await getRepository(p.head.repositoryId);
        if (forkRepo) {
          diff = await getPullDiff(
            p.base.repositoryId,
            p.head.repositoryId,
            getBranchSha(p.base.branch, r.branches, r.tags),
            getBranchSha(p.head.branch, forkRepo.branches, forkRepo.tags),
            null,
            true
          );
        }
      }
      console.log("diffStat", diff);
      setStats(diff);
    }
    console.log(r, p);
  }, [router.query]);

  const refreshPullRequest = async () => {
    const i = await getRepositoryPull(
      repository.owner.id,
      repository.name,
      pullRequest.iid
    );
    console.log(i);
    setPullRequest(i);
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
              active="files"
            />
          </div>
          <div className="mt-8">
            <DiffView
              stats={stats}
              repoId={compare.source.repository.id}
              targetRepoId={compare.target.repository.id}
              currentSha={compare.source.sha}
              previousSha={compare.target.sha}
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
})(RepositoryPullView);
