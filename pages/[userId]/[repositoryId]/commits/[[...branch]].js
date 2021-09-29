import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";

import { getCommits } from "../../../../store/actions/git";
import BranchSelector from "../../../../components/repository/branchSelector";
import Footer from "../../../../components/footer";
import getBranchSha from "../../../../helpers/getBranchSha";
import useRepository from "../../../../hooks/useRepository";
import CommitDetailRow from "../../../../components/repository/commitDetailRow";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryCommitTreeView(props) {
  const router = useRouter();
  const repository = useRepository();

  const [commits, setCommits] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [branchName, setBranchName] = useState("");
  const maxMessageLength = 60;
  // let repoPath = router.query.path || [];
  // let branchName = "";

  useEffect(async () => {
    if (repository) {
      const joinedPath = router.query.branch.join("/");
      repository.branches.every((b) => {
        let branch = b.name.replace("refs/heads/", "");
        if (joinedPath.includes(branch)) {
          let path = joinedPath.replace(branch, "").split("/");
          path = path.filter((p) => p !== "");
          setBranchName(branch);
          if (branchName !== branch) setCommits([]);
          console.log("branch", branch);
          return false;
        }
        return true;
      });
    }
  }, [router.query, repository.id]);

  const loadCommits = async (earlierCommits) => {
    if (branchName === "") return;
    setLoadingMore(true);
    const res = await getCommits(
      repository.id,
      hasMore
        ? hasMore
        : getBranchSha(branchName, repository.branches, repository.tags),
      repository.name,
      router.query.userId,
      9
    );
    console.log("getCommits", res);
    setCommits([...earlierCommits, ...res]);
    if (res && res[res.length - 1] && res[res.length - 1].hasMore) {
      setHasMore(res[res.length - 1].commit.parent[0]);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  useEffect(async () => {
    if (typeof window !== "undefined") {
      console.log(
        "branchName updated, earlier commits will be cleared",
        branchName
      );
      await loadCommits([]);
    }
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
          <RepositoryMainTabs
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
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
                        c.oid
                      }
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
