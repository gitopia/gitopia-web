import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import CommentEditor from "./commentEditor";
import AccountCard from "../account/card";

function CommentView({
  comment = { creator: "" },
  repositoryId,
  parentIid,
  parent,
  userAddress,
  onUpdate,
  onDelete,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex w-full" key={"comment" + comment.id}>
      <div className="flex-none mr-4">
        <AccountCard id={comment.creator} showAvatar={true} showId={false} />
      </div>
      {isEditing ? (
        <CommentEditor
          repositoryId={repositoryId}
          parentIid={parentIid}
          parent={parent}
          commentIid={comment.commentIid}
          initialComment={comment.body}
          isEdit={true}
          onCancel={() => {
            setIsEditing(false);
          }}
          onSuccess={async (iid) => {
            if (onUpdate) await onUpdate(iid);
            setIsEditing(false);
          }}
        />
      ) : (
        <div
          className="border border-grey rounded-lg flex-1"
          data-test="comment_view"
        >
          <div className="text-xs px-2 rounded-t relative">
            <div className="absolute right-2 top-1">
              {comment.creator === userAddress ? (
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex="0"
                    className="btn btn-square btn-xs btn-link"
                    data-test="comment_options"
                  >
                    <svg
                      width="16"
                      height="5"
                      viewBox="0 0 21 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#767C87" />
                      <circle cx="10.5" cy="2.5" r="2.5" fill="#767C87" />
                      <circle cx="18.5" cy="2.5" r="2.5" fill="#767C87" />
                    </svg>
                  </div>
                  <ul
                    tabIndex="0"
                    className="shadow menu dropdown-content bg-base-300 rounded-md w-32"
                  >
                    <li>
                      <a
                        onClick={() => {
                          setIsEditing(true);
                        }}
                        data-test="edit_comment"
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          setConfirmDelete(true);
                        }}
                        data-test="delete_comment"
                      >
                        Delete
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="text-white font-normal mb-3 markdown-body">
              {comment.body.length ? (
                <ReactMarkdown linkTarget="_blank">
                  {comment.body}
                </ReactMarkdown>
              ) : (
                <ReactMarkdown>{"*No description given*"}</ReactMarkdown>
              )}
            </div>
            <div className="flex-1 text-xs text-type-tertiary">
              {dayjs(comment.createdAt * 1000).fromNow()}
              {(comment.updatedAt - comment.createdAt) > 120
                ? ", edited " + dayjs(comment.updatedAt * 1000).fromNow()
                : ""}
            </div>
          </div>
        </div>
      )}
      <input
        type="checkbox"
        checked={confirmDelete}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <p>Are you sure ?</p>
          <div className="modal-action">
            <label
              className="btn btn-sm"
              onClick={() => {
                setConfirmDelete(false);
              }}
              data-test="cancel_delete_comment"
            >
              Cancel
            </label>
            <label
              className={
                "btn btn-sm btn-primary " + (isDeleting ? "loading" : "")
              }
              onClick={async () => {
                setIsDeleting(true);
                if (onDelete) await onDelete(comment.commentIid);
                setConfirmDelete(false);
                setIsDeleting(false);
              }}
              data-test="del_comment"
            >
              Delete
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentView;
