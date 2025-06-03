import { useCallback, useEffect, useMemo, useState } from "react";
import getDiff from "../../helpers/getDiff";
import { parseDiff, Diff, Hunk, getChangeKey } from "react-diff-view";
import getPullDiff from "../../helpers/getPullDiff";
import pluralize from "../../helpers/pluralize";
import MarkdownEditor from "../markdownEditor";
import { createComment } from "../../store/actions/repository";
import { connect } from "react-redux";
import { notify } from "reapop";
import ReactMarkdown from "react-markdown";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import { InView } from "react-intersection-observer";
import { useApiClient } from "../../context/ApiClientContext";

function DiffView({
  stats,
  repoId,
  baseRepoId,
  currentSha,
  previousSha,
  parentIid,
  commentsAllowed = true,
  comments = [],
  refreshComments,
  onViewTypeChange = () => {},
  showFile = null,
  getCommentView = () => {},
  isPullDiff = false,
  ...props
}) {
  const [viewType, setViewType] = useState("unified");
  const [files, setFiles] = useState([]);
  const [fileHidden, setFileHidden] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [change, setChange] = useState({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrollingToFile, setScrollingToFile] = useState(false);
  const paginationLimit = 10;
  const { apiClient } = useApiClient();

  const renderGutter = ({
    side,
    inHoverState,
    renderDefault,
    wrapInAnchor,
    change,
  }) => {
    const canComment = inHoverState && (viewType === "split" || side === "new");
    if (!commentsAllowed) {
      return renderDefault();
    }
    return (
      <div className="relative">
        {wrapInAnchor(renderDefault())}
        {canComment ? (
          <div
            className="absolute -right-6 bottom-0 btn btn-xs btn-square btn-icon btn-secondary hover:scale-125"
            onClick={() => {
              if (change) setChange(change);
              else setChange({});
              setComment("");
            }}
          >
            <svg
              viewBox="0 0 32 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8"
            >
              <path
                d="M14.5789 21.2222H8V10H24V21.2222H21.2105H20.2105V22.2222V24.2795L15.0739 21.3533L14.8438 21.2222H14.5789Z"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const getWidgets = (hunks, filename) => {
    const changes = hunks.reduce(
      (result, { changes }) => [...result, ...changes],
      []
    );
    let commentChange = {};
    comments.map((c) => {
      hunks.map((h) => {
        if (h.content === c.diffHunk) {
          if (
            commentChange.hasOwnProperty(getChangeKey(h.changes[c.position]))
          ) {
            commentChange[getChangeKey(h.changes[c.position])] = (
              <div>
                {commentChange[getChangeKey(h.changes[c.position])]}
                <div className="text-right my-4 sm:justify-end mx-4">
                  <div
                    className="border border-grey rounded-lg flex-1"
                    data-test="comment_view"
                  >
                    <div className="p-4">
                      <div className="flex uppercase text-xs font-bold">
                        <div className="">{shrinkAddress(c.creator)}</div>
                        <div className="pl-3 text-type-tertiary">
                          {dayjs(c.createdAt * 1000).fromNow()}
                        </div>
                      </div>
                      <div className="text-left text-white font-normal markdown-body mt-4">
                        <ReactMarkdown linkTarget="_blank">
                          {c.body}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          } else {
            commentChange[getChangeKey(h.changes[c.position])] = (
              <div className="p-4">{getCommentView(c)}</div>
            );
          }
        }
      });
    });
    const longLines = changes.filter((c) => c === change);
    if (longLines.length > 0) {
      const changeKey = getChangeKey(longLines[0]);
      let diffHunk, position;
      hunks.map((h) => {
        h.changes.map((c, index = 0) => {
          if (change === c) {
            diffHunk = h;
            position = index;
          }
        });
      });
      commentChange = {
        ...commentChange,
        [changeKey]: (
          <div>
            {commentChange.hasOwnProperty(changeKey) ? (
              <div>{commentChange[changeKey]}</div>
            ) : (
              ""
            )}
            <div className="text-right my-4 sm:justify-end mx-4">
              <MarkdownEditor
                value={comment}
                setValue={setComment}
                classes={{ preview: ["markdown-body"] }}
              />
              <div className="flextext-right sm:justify-end">
                <div className="inline-block w-28 sm:w-52 mr-2 ">
                  <button
                    className={
                      "btn btn-sm rounded-md btn-block mt-2 uppercase "
                    }
                    onClick={() => {
                      setComment("");
                      setChange({});
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <div className="inline-block w-28 sm:w-52 ">
                  <button
                    className={
                      "btn btn-sm btn-primary rounded-md btn-block mt-2 uppercase " +
                      (loading ? "loading" : "")
                    }
                    onClick={() => {
                      setLoading(true);
                      props
                        .createComment(apiClient, {
                          repositoryId: baseRepoId,
                          parentIid: parentIid,
                          parent: "COMMENT_PARENT_PULLREQUEST",
                          body: comment,
                          diffHunk: diffHunk.content,
                          path: filename,
                          position: position,
                          commentType: 15,
                        })
                        .then(() => {
                          setLoading(false);
                          setComment("");
                          setChange({});
                          props.notify("Comment added", "info");
                          if (refreshComments) {
                            refreshComments();
                          }
                        });
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ),
      };
    }
    return commentChange;
  };

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
          className={
            "mt-8 border border-grey " +
            (fileHidden[index] ? "rounded-md" : "rounded-t-md border-b-0")
          }
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
        </div>
        <div
          className={
            "text-sm border border-grey border-t-0 rounded-b-md origin-top " +
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
              renderGutter={renderGutter}
              widgets={getWidgets(diff[0].hunks, filename)}
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
    if (isPullDiff) {
      data = await getPullDiff(
        baseRepoId,
        repoId,
        previousSha,
        currentSha,
        offset,
        limit
      );
    } else {
      data = await getDiff(repoId, currentSha, previousSha, offset, limit);
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
    setLoadingMore(false);
  };

  const loadFile = async (filename) => {
    let totalFiles = stats?.file_names?.length;
    let index = stats?.file_names?.indexOf(filename);
    if (index < 0 || index > totalFiles - 1) {
      return;
    }

    setScrollingToFile(true);
    if (!files[index]?.diff) {
      await loadDiffs(files, repoId, index, 1);
    }

    setTimeout(() => {
      let elem = document.querySelector("#file-" + index);
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
        return;
      }
      if (loadingMore) return;
      if (index < 0 || index > files.length - 1) {
        return;
      }
      let offset = Math.floor(index / paginationLimit) * paginationLimit;

      if (!files[offset]?.diff) {
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
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  createComment,
  notify,
})(DiffView);
