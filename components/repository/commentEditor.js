import { useState } from "react";
import { connect } from "react-redux";
import MarkdownEditor from "../markdownEditor";
import {
  createComment,
  updateComment,
  toggleIssueState,
  updatePullRequestState,
} from "../../store/actions/repository";
import { useApiClient } from "../../context/ApiClientContext";

function CommentEditor({
  commentIid = null,
  repositoryId = null,
  parent = null,
  parentIid = null,
  initialComment = "",
  isEdit = false,
  onSuccess = null,
  onCancel = null,
  issueState = "OPEN",
  commentType = "ISSUE",
  ...props
}) {
  const [comment, setComment] = useState(initialComment);
  const [postingComment, setPostingComment] = useState(false);
  const [togglingIssue, setTogglingIssue] = useState(false);
  const [commentHint, setCommentHint] = useState({ shown: false });
  const { apiClient } = useApiClient();

  const validateComment = () => {
    setCommentHint({ shown: false });
    if (comment.trim().length === 0) {
      setCommentHint({
        shown: true,
        type: "error",
        message: "Comment cannot be empty",
      });
      return false;
    }
    if (comment === initialComment) {
      setCommentHint({
        shown: true,
        type: "error",
        message: "Comment is same as earlier",
      });
      return false;
    }
    return true;
  };

  const createComment = async () => {
    setPostingComment(true);
    if (validateComment()) {
      const res = await props.createComment(apiClient, {
        repositoryId: repositoryId,
        parentIid: parentIid,
        parent: parent,
        body: comment,
      });
      if (res && res.code === 0) {
        setComment("");
        if (onSuccess) await onSuccess();
      }
    }
    setPostingComment(false);
  };

  const updateComment = async () => {
    setPostingComment(true);
    if (validateComment()) {
      const res = await props.updateComment(apiClient, {
        repositoryId: repositoryId,
        parentIid: parentIid,
        parent: parent,
        commentIid: commentIid,
        body: comment,
      });
      if (res && res.code === 0) {
        setComment("");
        if (onSuccess) await onSuccess(commentIid);
      }
    }
    setPostingComment(false);
  };

  return (
    <div className="flex-1">
      <MarkdownEditor
        value={comment}
        setValue={setComment}
        classes={{ preview: ["markdown-body"] }}
      />
      {commentHint.shown && (
        <label className="label">
          <span className={"label-text-alt text-" + commentHint.type}>
            {commentHint.message}
          </span>
        </label>
      )}
      <div className="flex text-right mt-4 sm:justify-end">
        {!isEdit ? (
          commentType === "ISSUE" ? (
            <div className="inline-block mr-4">
              <button
                className={
                  "btn btn-sm btn-outline btn-block px-6" +
                  (issueState === "OPEN" ? " btn-accent" : "") +
                  (togglingIssue ? " loading" : "")
                }
                data-test="close_issue"
                disabled={togglingIssue || postingComment}
                onClick={async () => {
                  setTogglingIssue(true);
                  const res = await props.toggleIssueState(apiClient, {
                    repositoryId: repositoryId,
                    iid: parentIid,
                    commentBody: comment,
                  });
                  if (res && res.code === 0) {
                    if (onSuccess) {
                      await onSuccess();
                    }
                    setComment("");
                  }
                  setTogglingIssue(false);
                }}
              >
                {issueState === "OPEN" ? "Close" : "Re-Open"}
                {" issue"}
                {issueState === "OPEN" && comment.trim().length !== 0
                  ? " with comment"
                  : ""}
              </button>
            </div>
          ) : issueState === "OPEN" ? (
            <div className="inline-block w-28 sm:w-36 mr-4">
              <button
                className={
                  "btn btn-sm btn-accent btn-outline btn-block " +
                  (togglingIssue ? "loading h-12" : "")
                }
                disabled={togglingIssue || postingComment}
                onClick={async () => {
                  setTogglingIssue(true);
                  const res = await props.updatePullRequestState(apiClient, {
                    repositoryId: repositoryId,
                    iid: parentIid,
                    state: "CLOSED",
                    commentBody: comment,
                  });
                  if (res && res.code === 0) {
                    if (onSuccess) {
                      await onSuccess();
                    }
                  }
                  setTogglingIssue(false);
                }}
                data-test="close_pr"
              >
                {"Close Pull Request"}
              </button>
            </div>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {onCancel ? (
          <div className="inline-block w-28 sm:w-36 mr-4">
            <button
              className="btn btn-sm btn-outline btn-block"
              onClick={onCancel}
              data-test="cancel_comment"
            >
              Cancel
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="inline-block w-28 sm:w-36">
          <button
            className={
              "btn btn-sm btn-primary btn-block " +
              (postingComment ? "loading" : "")
            }
            disabled={postingComment || togglingIssue}
            onClick={() => (isEdit ? updateComment() : createComment())}
            data-test="comment"
          >
            {isEdit ? "Update" : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  createComment,
  updateComment,
  toggleIssueState,
  updatePullRequestState,
})(CommentEditor);
