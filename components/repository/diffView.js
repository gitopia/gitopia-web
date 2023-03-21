import { useCallback, useEffect, useMemo, useState } from "react";
import getDiff from "../../helpers/getDiff";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import getPullDiff from "../../helpers/getPullDiff";
import pluralize from "../../helpers/pluralize";
import { InView } from "react-intersection-observer";

export default function DiffView({
  stats,
  repoId,
  baseRepoId,
  currentSha,
  previousSha,
  onViewTypeChange = () => {},
  showFile = null,
  ...props
}) {
  const [viewType, setViewType] = useState("unified");
  const [files, setFiles] = useState([]);
  const [fileHidden, setFileHidden] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [scrollingToFile, setScrollingToFile] = useState(false);
  const paginationLimit = 10;
  // let scroller = null;

  const renderFile = ({ filename, stat, diff }, index) => {
    // const { oldRevision, newRevision, type, hunks, oldPath, newPath } = diff[0];
    return (
      <InView
        as="div"
        onChange={(inView, entry) => {
          if (inView) loadFileBatch(index);
        }}
      >
        <div
          className="mt-8 border border-grey rounded-md"
          key={filename}
          id={"file-" + index}
        >
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
                {stat?.addition ? (
                  <div
                    className={"text-green " + (stat.deletion ? "mr-2" : "")}
                  >
                    + {stat.addition}
                  </div>
                ) : (
                  ""
                )}
                {stat?.deletion ? (
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
            {diff?.length ? (
              <Diff
                key={diff[0].oldRevision + "-" + diff[0].newRevision}
                viewType={viewType}
                optimizeSelection={true}
                diffType={diff[0].type}
                hunks={diff[0].hunks}
              >
                {(hunks) =>
                  hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
                }
              </Diff>
            ) : (
              <button
                className="btn btn-sm m-4"
                onClick={() => {
                  loadFile(filename);
                }}
              >
                Load Diff
              </button>
            )}
          </div>
        </div>
      </InView>
    );
  };

  const loadDiffs = async (
    oldFiles = [],
    repoId,
    offset = 0,
    limit = paginationLimit
  ) => {
    setLoadingMore(true);
    let data;
    if (baseRepoId === repoId) {
      data = await getDiff(repoId, currentSha, previousSha, offset, limit);
    } else {
      data = await getPullDiff(
        baseRepoId,
        repoId,
        previousSha,
        currentSha,
        offset,
        limit
      );
    }

    let newFiles = [...oldFiles];
    if (data && data.diff) {
      data.diff.map(({ file_name, patch, stat }, index) => {
        const diff = parseDiff(patch);
        newFiles[offset + index] = {
          filename: file_name,
          diff,
          patch,
          stat,
        };
      });
    }
    setFiles(newFiles);
    console.log(newFiles);
    setLoadingMore(false);
  };

  const loadFile = async (filename) => {
    let totalFiles = stats?.file_names?.length;
    let index = stats?.file_names?.indexOf(filename);
    if (index < 0 || index > totalFiles - 1) {
      console.log("Index out of bounds", index, totalFiles);
      return;
    }

    setScrollingToFile(true);
    if (!files[index]?.diff) {
      console.log("loading file", index);
      await loadDiffs(files, repoId, index, 1);
    }

    setTimeout(() => {
      let elem = document.querySelector("#file-" + index);
      console.log("elem", elem);
      if (elem) {
        elem.scrollIntoView();
        setTimeout(() => {
          setScrollingToFile(false);
        }, 1200);
      } else {
        setScrollingToFile(false);
      }
    }, 0);
  };

  const loadFileBatch = useCallback(
    (index) => {
      if (scrollingToFile) {
        console.log("scrollingToFile", scrollingToFile);
        return;
      }
      if (loadingMore) return;
      if (index < 0 || index > files.length - 1) {
        console.log("Index out of bounds", index, files.length);
        return;
      }
      let offset = Math.floor(index / paginationLimit) * paginationLimit;

      if (!files[offset]?.diff) {
        console.log("loading batch", offset, offset + paginationLimit);
        loadDiffs(files, repoId, offset);
      }
    },
    [files, scrollingToFile]
  );

  useEffect(() => {
    let onlyFilenames = stats?.file_names?.map((f) => ({ filename: f }));
    setFiles(onlyFilenames || []);
    setFileHidden([]);
    loadDiffs(onlyFilenames, repoId);
  }, [repoId, currentSha, previousSha, stats]);

  useEffect(() => {
    onViewTypeChange(viewType);
  }, [viewType]);

  useEffect(() => {
    if (showFile) loadFile(showFile);
  }, [showFile]);

  return (
    <>
      <div className="flex px-4 py-2">
        <div className="flex-1 flex">
          <div className="pr-4">
            {stats.files_changed}
            <span className="mx-1">
              {pluralize("file", stats.files_changed).replace(/^\w/, (c) =>
                c.toUpperCase()
              )}
            </span>
            Changed
          </div>
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
    </>
  );
}
