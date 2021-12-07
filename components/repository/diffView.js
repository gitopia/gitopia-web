import { useEffect, useState } from "react";
import getDiff from "../../helpers/getDiff";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import getPullDiff from "../../helpers/getPullDiff";

export default function DiffView({
  stats,
  repoId,
  baseRepoId,
  currentSha,
  previousSha,
  onViewTypeChange = () => {},
  ...props
}) {
  const [viewType, setViewType] = useState("unified");
  const [files, setFiles] = useState([]);
  const [fileHidden, setFileHidden] = useState([]);
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

  const loadDiffs = async (oldFiles = [], repoId) => {
    setLoadingMore(true);
    console.log("repoId", repoId, "hasMore", hasMore);
    let data;
    if (baseRepoId === repoId) {
      data = await getDiff(repoId, currentSha, hasMore, previousSha);
    } else {
      data = await getPullDiff(
        baseRepoId,
        repoId,
        previousSha,
        currentSha,
        hasMore,
        false
      );
    }

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

  useEffect(() => {
    setFiles([]);
    setFileHidden([]);
    loadDiffs([], repoId);
  }, [repoId, currentSha, previousSha]);

  useEffect(() => {
    onViewTypeChange(viewType);
  }, [viewType]);

  return (
    <>
      <div className="flex px-4 py-2">
        <div className="flex-1 flex">
          <div className="pr-4">{stats.files_changed} Files Changed</div>
          <div className="pr-4 text-green ">
            {" + " + (stats.stat ? stats.stat.addition : 0)}
          </div>
          <div className="pr-4 text-red">
            {" - " + (stats.stat ? stats.stat.deletion : 0)}
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
            className={"btn btn-sm btn-wide " + (loadingMore ? "loading" : "")}
            disabled={loadingMore}
            onClick={() => {
              loadDiffs(files, repoId);
            }}
          >
            Load More
          </button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
