import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import { getCommits } from "../../../../store/actions/git";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import getDiff from "../../../../helpers/getDiff";
import getDiffStat from "../../../../helpers/getDiffStat";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import useRepository from "../../../../hooks/useRepository";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryCommitDiffView(props) {
  const router = useRouter();
  const repository = useRepository();

  const [files, setFiles] = useState([]);
  const [fileHidden, setFileHidden] = useState([]);
  const [viewType, setViewType] = useState("unified");
  const [commit, setCommit] = useState({
    author: { name: "" },
    stat: { addition: 0, deletion: 0 },
    timestamp: 0,
  });
  const [hasMore, setHasMore] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const renderFile = ({ filename, stat, diff }, index) => {
    const { oldRevision, newRevision, type, hunks, oldPath, newPath } = diff[0];
    return (
      <div className="mt-8 border border-grey rounded-md" key={filename}>
        <div className="bg-base-200 flex rounded-md">
          <div className="flex-1 flex text-sm px-4 py-2 items-center">
            <div className="mr-4">
              <button
                className="btn btn-square btn-xs btn-ghost relative top-px"
                onClick={() => {
                  const arr = [...fileHidden];
                  arr[index] = !fileHidden[index];
                  setFileHidden(arr);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    "h-5 w-5 transition-transform transform-origin-top " +
                    (fileHidden[index] ? "transform -rotate-90" : "")
                  }
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="mr-4 flex">
              {stat.addition ? (
                <div className={"text-green " + (stat.deletion ? "mr-2" : "")}>
                  + {stat.addition}
                </div>
              ) : (
                ""
              )}
              {stat.deletion ? (
                <div className="text-red">- {stat.deletion}</div>
              ) : (
                ""
              )}
            </div>
            <div>
              <span>{filename}</span>
            </div>
          </div>
        </div>
        <div
          className={
            "text-sm transition-transform origin-top " +
            (fileHidden[index] ? "transform scale-y-0 h-0" : "")
          }
        >
          <Diff
            key={oldRevision + "-" + newRevision}
            viewType={viewType}
            optimizeSelection={true}
            diffType={type}
            hunks={hunks}
          >
            {(hunks) =>
              hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
            }
          </Diff>
        </div>
      </div>
    );
  };

  const loadDiffs = async (oldFiles = [], repoId = repository.id) => {
    setLoadingMore(true);
    console.log("repoId", repoId, "hasMore", hasMore);
    const data = await getDiff(repoId, router.query.commitId, hasMore);
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
    if (data && data.pagination && data.pagination.next_key) {
      setHasMore(data.pagination.next_key);
    } else {
      setHasMore(null);
    }
    console.log(newFiles);
    setFiles([...oldFiles, ...newFiles]);
    setLoadingMore(false);
  };

  useEffect(async () => {
    if (repository) {
      const c = await getCommits(
        repository.id,
        router.query.commitId,
        repository.name,
        router.query.userId,
        0
      );
      if (c) {
        setFiles([]);
        setFileHidden([]);
        console.log(repository.id, Number(repository.id));
        const data = await getDiff(
          Number(repository.id),
          router.query.commitId,
          null,
          null,
          true
        );
        if (data) {
          console.log("commit", { ...c[0].commit, ...data });
          setCommit({ ...c[0].commit, ...data });
        }
        loadDiffs([], repository.id);
      }
    }
  }, [router.query, repository.id]);

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
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div className="mt-8 px-4 py-4 border border-grey rounded-md">
            <div className="flex">
              <div className="flex-1 flex">
                <div className="avatar">
                  <div className="rounded-full w-6 h-6 mr-2">
                    <img
                      src={
                        "https://avatar.oxro.io/avatar.svg?length=1&height=40&width=40&fontSize=18&caps=1&name=" +
                        commit.author.name.slice(0, 1)
                      }
                    />
                  </div>
                </div>
                <span className="pr-4">{commit.author.name}</span>
              </div>
              <div className="flex-none">
                <span className="mr-4">
                  {dayjs(commit.author.timestamp * 1000).format("DD-MM-YYYY")}
                </span>
                <button className="btn btn-xs btn-outline">View Code</button>{" "}
              </div>
            </div>
            <div className="mt-2 text-sm text-type-secondary markdown-body">
              <ReactMarkdown>{commit.message}</ReactMarkdown>
            </div>
          </div>
          <div className="flex mt-8 px-4 py-2">
            <div className="flex-1 flex">
              <div className="pr-4">{commit.files_changed} Files Changed</div>
              <div className="pr-4 text-green ">
                {" + " + commit.stat.addition}
              </div>
              <div className="pr-4 text-red">
                {" - " + commit.stat.deletion}
              </div>
            </div>
            <div className="flex-none btn-group">
              <button
                className={
                  "btn btn-xs btn-outline btn-primary " +
                  (viewType === "unified" ? "btn-active" : "")
                }
                onClick={() => {
                  setViewType("unified");
                }}
              >
                Unified
              </button>
              <button
                className={
                  "btn btn-xs btn-outline btn-primary " +
                  (viewType === "split" ? "btn-active" : "")
                }
                onClick={() => {
                  setViewType("split");
                }}
              >
                Split
              </button>
            </div>
          </div>
          <div>{files.map(renderFile)}</div>
          {hasMore ? (
            <div className="mt-8 text-center">
              <button
                className={
                  "btn btn-sm btn-wide " + (loadingMore ? "loading" : "")
                }
                disabled={loadingMore}
                onClick={() => {
                  loadDiffs(files);
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
  };
};

export default connect(mapStateToProps, {})(RepositoryCommitDiffView);
