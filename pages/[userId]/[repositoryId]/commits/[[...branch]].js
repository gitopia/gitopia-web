import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";

import BranchSelector from "../../../../components/repository/branchSelector";
import Footer from "../../../../components/footer";
import getBranchSha from "../../../../helpers/getBranchSha";
import useRepository from "../../../../hooks/useRepository";
import CommitDetailRow from "../../../../components/repository/commitDetailRow";
import getCommitHistory from "../../../../helpers/getCommitHistory";
import { useErrorStatus } from "../../../../hooks/errorHandler";
import pluralize from "../../../../helpers/pluralize";
import { useApiClient } from "../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryCommitTreeView(props) {
  const router = useRouter();
  const { repository } = useRepository();

  const { setErrorStatusCode } = useErrorStatus();
  const [commits, setCommits] = useState([]);
  const [nextKey, setNextKey] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [commitsLength, setCommitsLength] = useState(0);
  const { storageApiUrl } = useApiClient();

  useEffect(() => {
    async function initBranch() {
      if (repository) {
        const joinedPath = router.query.branch.join("/");
        let branchLen = repository.branches.length;
        repository.branches.every((b) => {
          let branch = b.name;
          let branchTest = new RegExp("^" + branch);
          if (branchTest.test(joinedPath)) {
            let path = joinedPath.replace(branch, "").split("/");
            path = path.filter((p) => p !== "");
            setBranchName(branch);
            if (branchName !== branch) {
              setCommits([]);
              setNextKey(null);
            }
            console.log("branch", branch);
            return false;
          }
          branchLen--;
          if (branchLen < 1) {
            setErrorStatusCode(404);
          }
          return true;
        });
      }
    }
    initBranch();
  }, [router.query.branch, repository.id]);

  const loadCommits = async (earlierCommits) => {
    if (branchName === "") return;
    setLoadingMore(true);
    const res = await getCommitHistory(
      storageApiUrl,
      repository.id,
      getBranchSha(branchName, repository.branches, repository.tags),
      null,
      100,
      nextKey,
      true
    );
    if (res) {
      if (res.commits && res.commits.length) {
        setCommits([...earlierCommits, ...res.commits]);
      }
      if (res.pagination && res.pagination.next_key) {
        setNextKey(res.pagination.next_key);
      } else {
        setNextKey(null);
      }
      if (res.pagination && res.pagination.total) {
        setCommitsLength(res.pagination.total);
      }
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    async function initCommits() {
      if (typeof window !== "undefined") {
        console.log(
          "branchName updated, earlier commits will be cleared",
          branchName
        );
        setNextKey(null);
        await loadCommits([]);
      }
    }
    initCommits();
  }, [branchName]);

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
          <RepositoryMainTabs repository={repository} active="code" />
          <div className="">
            <div className="flex justify-start mt-8">
              <div className="">
                <BranchSelector
                  branches={repository.branches}
                  branchName={branchName}
                  baseUrl={
                    "/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/commits"
                  }
                />
              </div>
              <div className="ml-4">
                <div className="p-2 text-type-secondary text-xs font-semibold uppercase flex">
                  <svg
                    className="w-4 h-4 mr-2"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.9 4.0293L6.04297 4.0293L6.04297 20.0293L18.043 20.0293L18.043 9.80707M12.9 4.0293L18.043 9.80707M12.9 4.0293L12.9 9.80707L18.043 9.80707"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  {commitsLength}
                  <span className="ml-1">
                    {pluralize("commit", commitsLength)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              {commits.map((c, i) => {
                return (
                  <div
                    key={"commit" + i}
                    className="border border-grey rounded overflow-hidden mt-4"
                  >
                    <CommitDetailRow
                      commitDetail={c}
                      commitLink={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/commit/" +
                        c.id
                      }
                      maxMessageLength={90}
                    />
                  </div>
                );
              })}
            </div>
            {nextKey ? (
              <div className="mt-8 text-center">
                <button
                  className={
                    "btn btn-sm btn-wide " + (loadingMore ? "loading" : "")
                  }
                  disabled={loadingMore}
                  onClick={() => {
                    loadCommits(commits);
                  }}
                >
                  Load More
                </button>
              </div>
            ) : (
              ""
            )}
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

export default connect(mapStateToProps, {})(RepositoryCommitTreeView);
