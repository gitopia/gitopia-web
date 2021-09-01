import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import CommentEditor from "./commentEditor";

function CommentView({
  comment = { creator: "" },
  userAddress,
  onUpdate,
  onDelete,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex w-full mt-8" key={comment.id}>
      <div className="flex-none mr-4">
        <div className="avatar">
          <div className="mb-8 rounded-full w-10 h-10">
            <img
              src={
                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                comment.creator.slice(-1)
              }
            />
          </div>
        </div>
      </div>
      {isEditing ? (
        <CommentEditor
          commentId={comment.id}
          initialComment={comment.body}
          isEdit={true}
          onCancel={() => {
            setIsEditing(false);
          }}
          onSuccess={async (id) => {
            if (onUpdate) await onUpdate(id);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="border border-grey rounded flex-1">
          <div className="flex text-xs px-4 py-2 bg-base-200 rounded-t items-center">
            <div className="flex-1">
              {shrinkAddress(comment.creator) +
                " commented on " +
                dayjs(comment.createdAt * 1000).format("DD MMM")}
            </div>
            <div className="flex-none">
              {comment.creator === userAddress ? (
                <div class="dropdown dropdown-end">
                  <div tabIndex="0" class="m-1 btn btn-square btn-xs btn-ghost">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <ul
                    tabIndex="0"
                    class="shadow menu dropdown-content bg-base-300 rounded-box w-32"
                  >
                    <li>
                      <a
                        onClick={() => {
                          setIsEditing(true);
                        }}
                      >
                        Edit
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          setConfirmDelete(true);
                        }}
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
          <div className="p-4 markdown-body">
            <ReactMarkdown>{comment.body}</ReactMarkdown>
          </div>
        </div>
      )}
      <input
        type="checkbox"
        checked={confirmDelete}
        readOnly
        class="modal-toggle"
      />
      <div class="modal">
        <div class="modal-box">
          <p>Are you sure ?</p>
          <div class="modal-action">
            <label
              class="btn btn-sm"
              onClick={() => {
                setConfirmDelete(false);
              }}
            >
              Cancel
            </label>
            <label
              class={"btn btn-sm btn-primary " + (isDeleting ? "loading" : "")}
              onClick={async () => {
                setIsDeleting(true);
                if (onDelete) await onDelete(comment.id);
                setConfirmDelete(false);
                setIsDeleting(false);
              }}
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
