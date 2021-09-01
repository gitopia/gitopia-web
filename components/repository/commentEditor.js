import { useState } from "react";
import { connect } from "react-redux";
import MarkdownEditor from "../markdownEditor";
import { createComment, updateComment } from "../../store/actions/repository";

function CommentEditor({
  commentId = null,
  issueId = null,
  initialComment = "",
  isEdit = false,
  onSuccess = null,
  onCancel = null,
  ...props
}) {
  const [comment, setComment] = useState(initialComment);
  const [postingComment, setPostingComment] = useState(false);

  const validateComment = () => {
    return true;
  };

  const createComment = async () => {
    setPostingComment(true);
    if (validateComment()) {
      const res = await props.createComment({
        parentId: issueId,
        body: comment,
        commentType: "Issue",
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
      <div className="text-right mt-4">
        {onCancel ? (
          <div className="inline-block w-36 mr-4">
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
        <div className="inline-block w-36">
          <button
            className={
              "btn btn-sm btn-primary btn-block " +
              (postingComment ? "loading" : "")
            }
            disabled={comment.trim().length === 0}
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

export default connect(mapStateToProps, { createComment, updateComment })(
  CommentEditor
);
