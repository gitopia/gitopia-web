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

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryTreeView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    forks: [],
    stargazers: [],
  });

  const [files, setFiles] = useState([]);
  const [fileHidden, setFileHidden] = useState([]);
  const [viewType, setViewType] = useState("unified");
  const [commit, setCommit] = useState({ author: { name: "" }, timestamp: 0 });

  const renderFile = (
    { oldRevision, newRevision, type, hunks, oldPath, newPath },
    index
  ) => {
    let totalInsert = 0,
      totalDelete = 0;
    hunks.map((h) => {
      h.changes.map((c) => {
        if (c.isInsert) totalInsert++;
        if (c.isDelete) totalDelete++;
      });
    });

    return (
      <div className="mt-8 border border-grey rounded-md">
        <div className="bg-base-200 flex rounded-md">
          <div className="flex-1 flex text-sm px-4 py-4 items-center">
            <div className="mr-4">
              <button
                className="btn btn-square btn-xs btn-ghost"
                onClick={() => {
                  const arr = [...fileHidden];
                  arr[index] = !fileHidden[index];
                  setFileHidden(arr);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    "h-5 w-5 transition-transform " +
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
              {totalInsert ? (
                <div className={"text-green " + (totalDelete ? "mr-2" : "")}>
                  + {totalInsert}
                </div>
              ) : (
                ""
              )}
              {totalDelete ? (
                <div className="text-red">- {totalDelete}</div>
              ) : (
                ""
              )}
              {type === "delete" ? (
                <div>
                  <span>{oldPath}</span>
                </div>
              ) : (
                ""
              )}
            </div>
            {(type === "modify" && oldPath !== newPath) || type === "rename" ? (
              <div>
                <span>{oldPath}</span>
                <span className="px-4">&#8594;</span> <span>{newPath}</span>
              </div>
            ) : (
              ""
            )}
            {(type === "modify" && oldPath === newPath) || type === "add" ? (
              <div>
                <span>{newPath}</span>
              </div>
            ) : (
              ""
            )}
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

  useEffect(async () => {
    const r = await getUserRepository(repository.owner.id, repository.name);
    if (r) {
      setRepository({
        ...r,
      });
      const c = await getCommits(
        r.id,
        router.query.commitId,
        r.name,
        router.query.userId,
        1
      );
      if (c && c.length === 2) {
        setCommit(c[0].commit);
        const diff = await getDiff(r.id, c[1].oid, router.query.commitId);
        console.log(diff);
        const files = parseDiff(diff);
        setFiles(files);
        setFileHidden([]);
        console.log(files);
      }
    }
  }, [router.query]);

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
          <div className="flex mt-8 px-4 py-2 border border-grey rounded-md">
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
              <span className="pr-4 border-r border-grey">
                {commit.author.name}
              </span>
              <span className="px-4">{commit.message}</span>
            </div>
            <div className="flex-none">
              <span className="mr-4">
                {dayjs(commit.author.timestamp * 1000).format("DD-MM-YYYY")}
              </span>
              <button className="btn btn-xs btn-outline">View Code</button>{" "}
            </div>
          </div>
          <div className="flex mt-8 px-4 py-2">
            <div className="flex-1">Showing {files.length} Files</div>
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

export default connect(mapStateToProps, {})(RepositoryTreeView);
