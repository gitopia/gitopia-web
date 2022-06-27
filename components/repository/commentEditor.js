import { useState } from "react";
import { connect } from "react-redux";
import MarkdownEditor from "../markdownEditor";
import {
  createComment,
  updateComment,
  toggleIssueState,
  updatePullRequestState,
} from "../../store/actions/repository";

function CommentEditor({
  commentId = null,
  issueId = null,
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
      const res = await props.createComment({
        parentId: issueId,
        body: comment,
        commentType: commentType,
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
      const res = await props.updateComment({
        id: commentId,
        body: comment,
      });
      if (res && res.code === 0) {
        setComment("");
        if (onSuccess) await onSuccess(commentId);
      }
    }
    setPostingComment(false);
  };

  return (
    <div className="border border-grey rounded flex-1 p-4">
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
            <div className="inline-block w-28 sm:w-36 mr-4">
              <button
                className={
                  "btn btn-sm btn-accent btn-outline btn-block " +
                  (togglingIssue ? "loading" : "")
                }
                disabled={togglingIssue || postingComment}
                onClick={async () => {
                  setTogglingIssue(true);
                  const res = await props.toggleIssueState({ id: issueId });
                  console.log(res);
                  if (res && res.code === 0) {
                    if (onSuccess) {
                      await onSuccess();
                    }
                  }
                  setTogglingIssue(false);
                }}
              >
                {issueState === "OPEN" ? "Close" : "Re-Open"}
                {" Issue"}
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
                  const res = await props.updatePullRequestState({
                    id: issueId,
                    state: "CLOSED",
                  });
                  console.log(res);
                  if (res && res.code === 0) {
                    if (onSuccess) {
                      await onSuccess();
                    }
                  }
                  setTogglingIssue(false);
                }}
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
              className="btn btn-sm btn-ghost btn-block"
              onClick={onCancel}
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
