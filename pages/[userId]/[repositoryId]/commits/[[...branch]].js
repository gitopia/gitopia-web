import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";

import { getCommits } from "../../../../store/actions/git";
import BranchSelector from "../../../../components/repository/branchSelector";
import Footer from "../../../../components/footer";
import getBranchSha from "../../../../helpers/getBranchSha";
import dayjs from "dayjs";
import Link from "next/link";
import useRepository from "../../../../hooks/useRepository";

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
                    className="flex border border-grey rounded overflow-hidden mt-4 px-4 py-2"
                  >
                    <div className="flex-1 flex">
                      <div className="avatar">
                        <div className="rounded-full w-6 h-6 mr-2">
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=40&width=40&fontSize=18&caps=1&name=" +
                              c.commit.author.name.slice(0, 1)
                            }
                          />
                        </div>
                      </div>
                      <span className="pr-4 border-r border-grey">
                        {c.commit.author.name}
                      </span>
                      <span className="px-4">
                        {c.commit.message.length > maxMessageLength
                          ? c.commit.message.slice(0, maxMessageLength) + ".."
                          : c.commit.message}
                      </span>
                    </div>
                    <div className="flex-none">
                      <span className="mr-4">
                        {dayjs(c.commit.author.timestamp * 1000).format(
                          "DD MMM YY"
                        )}
                      </span>
                      <Link
                        href={
                          "/" +
                          repository.owner.id +
                          "/" +
                          repository.name +
                          "/commit/" +
                          c.oid
                        }
                      >
                        <a className="mr-4 btn btn-xs btn-outline btn-primary w-24">
                          {c.oid.slice(0, 6)}
                        </a>
                      </Link>
                    </div>
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
