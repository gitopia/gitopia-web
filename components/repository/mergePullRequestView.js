import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { notify } from "reapop";
import {
  updatePullRequestState,
  authorizeGitServer,
  mergePullRequest,
} from "../../store/actions/repository";
// import mergePullRequest from "../../helpers/mergePullRequest";
import pullRequestStateClass from "../../helpers/pullRequestStateClass";
import mergePullRequestCheck from "../../helpers/mergePullRequestCheck";
import getPullRequestMergePermission from "../../helpers/getPullRequestMergePermission";
import { getGitServerAuthorization } from "../../helpers/getGitServerAuthStatus";

function MergePullRequestView({ pullRequest, refreshPullRequest, ...props }) {
  const [isMerging, setIsMerging] = useState(false);
  const [stateClass, setStateClass] = useState("");
  const [iconType, setIconType] = useState("check");
  const [message, setMessage] = useState("");
  const [pullMergeAccess, setPullMergeAccess] = useState(false);
  const [pullMergeAccessDialogShown, setPullMergeAccessDialogShown] =
    useState(false);
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);

  const checkMerge = async () => {
    setIsMerging(true);
    const res = await mergePullRequestCheck(
      pullRequest.iid,
      pullRequest.base.repositoryId,
      pullRequest.head.repositoryId,
      pullRequest.base.branch,
      pullRequest.head.branch,
      "merge",
      props.selectedAddress,
      "<>",
      props.selectedAddress
    );
    console.log("mergeCheck", res);
    if (res && res.data.is_mergeable) {
      setMessage("This branch has no conflicts with base branch");
      setStateClass(pullRequestStateClass(pullRequest.state));
      setIconType("check");
    } else {
      setMessage(
        "There are conflicts in merging the branch, please resolve and push again"
      );
      setStateClass("warning");
      setIconType("warning");
    }
    setIsMerging(false);
  };

  const mergePull = async () => {
    setIsMerging(true);
    const user = await getPullRequestMergePermission(
      props.selectedAddress,
      pullRequest.id
    );
    if (user && user.havePermission) {
      let access = await getGitServerAuthorization(props.selectedAddress);
      if (!access) {
        setPullMergeAccessDialogShown(true);
        setIsMerging(false);
        return;
      }
      // const res = await mergePullRequest(
      //   pullRequest.iid,
      //   pullRequest.base.repositoryId,
      //   pullRequest.head.repositoryId,
      //   pullRequest.base.branch,
      //   pullRequest.head.branch,
      //   "merge",
      //   props.selectedAddress,
      //   "<>",
      //   props.selectedAddress
      // );
      // console.log(res);
      // if (!res.data.merged) {
      //   props.notify(res.error, "error");
      // } else {
      //   const transaction = await props.updatePullRequestState({
      //     id: pullRequest.id,
      //     state: "MERGED",
      //     mergeCommitSha: res.data.merge_commit_sha,
      //   });
      //   console.log(transaction);
      //   if (transaction && transaction.code === 0) {
      //     refreshPullRequest();
      //   }
      // }
      const res = await props.mergePullRequest({ id: pullRequest.id });
      if (res) {
        if (res.TaskState === "TASK_STATE_SUCCESS") refreshPullRequest();
        else if (res.TaskState === "TASK_STATE_FAILURE")
          props.notify(res.Message, "error");
      } else {
        props.notify("Unknown error", "error");
      }
    } else {
      props.notify("User not authorized for merging pull requests", "error");
    }

    setIsMerging(false);
  };

  useEffect(() => {
    setStateClass(pullRequestStateClass(pullRequest.state));
    switch (pullRequest.state) {
      case "OPEN":
        checkMerge();
        break;
      case "MERGED":
        setMessage("This pull request is merged");
        break;
      case "CLOSED":
        setMessage("This pull request is closed");
        setIconType("warning");
    }
  }, [pullRequest]);

  const refreshPullMergeAccess = async (mergeAfter = false) => {
    setPullMergeAccess(await getGitServerAuthorization(props.selectedAddress));
    if (mergeAfter) setTimeout(mergePull, 0);
  };
  useEffect(refreshPullMergeAccess, [props.selectedAddress]);

  return (
    <div className="flex w-full mt-8">
      <div className="flex-none mr-4">
        <div
          className={
            "flex items-center justify-center w-10 h-10 rounded-full bg-" +
            stateClass
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path
              d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="8.5" cy="18.5" r="2.5" fill="currentColor" />
            <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
            <path
              d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
      <div
        className={
          "flex flex-1 items-center border p-4 rounded-md border-" + stateClass
        }
      >
        <div className="flex">
          {iconType === "check" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:mr-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:mr-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <div className="flex-1 text-xs sm:text-base">{message}</div>
        </div>
        {pullRequest.state === "OPEN" ? (
          <div className="sm:ml-auto">
            <button
              className={
                "btn btn-xs sm:btn-sm btn-primary sm:ml-4 m-0.5 h-10" +
                (isMerging ? " loading" : "")
              }
              data-test="merge-pr"
              onClick={mergePull}
              disabled={isMerging || stateClass === "warning"}
            >
              Merge Pull Request
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <input
        type="checkbox"
        checked={pullMergeAccessDialogShown}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-sm">
          <p>
            Gitopia data server does not have repository merge access on behalf
            of your account.
          </p>
          <p className="text-xs mt-4">Server Address:</p>
          <p className="text-xs">
            {process.env.NEXT_PUBLIC_GIT_SERVER_WALLET_ADDRESS}
          </p>
          <div className="modal-action">
            <label
              className="btn btn-sm"
              onClick={() => {
                setPullMergeAccessDialogShown(false);
              }}
            >
              Cancel
            </label>
            <button
              className={
                "btn btn-sm btn-primary" + (isGrantingAccess ? " loading" : "")
              }
              onClick={async () => {
                setIsGrantingAccess(true);
                const res = await props.authorizeGitServer();
                console.log(res);
                setIsGrantingAccess(false);
                if (res.code !== 0) {
                  props.notify(res.rawLog, "error");
                } else {
                  refreshPullMergeAccess(true);
                  setPullMergeAccessDialogShown(false);
                }
              }}
              disabled={isGrantingAccess}
            >
              Grant Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  notify,
  updatePullRequestState,
  authorizeGitServer,
  mergePullRequest,
})(MergePullRequestView);
