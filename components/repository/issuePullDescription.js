import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import shrinkAddress from "../../helpers/shrinkAddress";
import {
  updateIssueDescription,
  updatePullRequestDescription,
} from "../../store/actions/repository";
import MarkdownEditor from "../markdownEditor";

function IssuePullDescription({
  issuePullObj,
  repository,
  onUpdate,
  onError,
  isPull = false,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionHint, setNewDescriptionHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingDescription, setSavingDescription] = useState(false);

  useEffect(() => {
    setNewDescription(issuePullObj.description);
    setNewDescriptionHint({ shown: false });
  }, [issuePullObj]);

  const validateDescription = (desc) => {
    setNewDescriptionHint({
      ...newDescriptionHint,
      shown: false,
    });
    if (desc.trim() === "") {
      setNewDescriptionHint({
        shown: true,
        type: "error",
        message: "Description cannot be empty",
      });
      return false;
    }
    if (desc === issuePullObj.description) {
      setNewDescriptionHint({
        shown: true,
        type: "error",
        message: "Description is same as earlier",
      });
      return false;
    }
    return true;
  };

  const updateDescription = async () => {
    setSavingDescription(true);
    if (validateDescription(newDescription)) {
      const res = isPull
        ? await props.updatePullRequestDescription({
            description: newDescription,
            id: issuePullObj.id,
          })
        : await props.updateIssueDescription({
            description: newDescription,
            id: issuePullObj.id,
          });
      if (res && res.code === 0) {
        if (onUpdate) await onUpdate(newDescription);
        setIsEditing(false);
      } else {
        if (onError) onError();
      }
    }
    setSavingDescription(false);
  };

  return (
    <div className="flex w-full">
      <div className="flex-none mr-4">
        <div className="avatar">
          <div className="mb-8 rounded-full w-10 h-10">
            <img
              src={
                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                issuePullObj.creator.slice(-1)
              }
            />
          </div>
        </div>
      </div>
      <div className="border border-grey rounded flex-1">
        {isEditing ? (
          <div className="p-4">
            <MarkdownEditor
              value={newDescription}
              setValue={setNewDescription}
              classes={{ preview: ["markdown-body"] }}
            />
            {newDescriptionHint.shown && (
              <label className="label">
                <span
                  className={"label-text-alt text-" + newDescriptionHint.type}
                >
                  {newDescriptionHint.message}
                </span>
              </label>
            )}
            <div className="text-right mt-4">
              <div className="inline-block w-36 mr-4">
                <button
                  className={"btn btn-sm btn-block"}
                  onClick={() => {
                    setIsEditing(false);
                    setNewDescription(issuePullObj.description);
                    setNewDescriptionHint({ shown: false });
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="inline-block w-36">
                <button
                  className={
                    "btn btn-sm btn-primary btn-block " +
                    (savingDescription ? "loading" : "")
                  }
                  disabled={savingDescription}
                  onClick={updateDescription}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex text-xs px-4 py-2 bg-base-200 rounded-t items-center">
              <div className="flex-1">
                {shrinkAddress(issuePullObj.creator) +
                  " commented " +
                  dayjs(issuePullObj.createdAt * 1000).fromNow()}
              </div>
              <div className="flex-none">
                {issuePullObj.creator === props.selectedAddress ? (
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex="0"
                      className="btn btn-square btn-xs btn-ghost"
                    >
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
                      className="shadow menu dropdown-content bg-base-300 rounded-md w-32"
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
                    </ul>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="p-4 markdown-body">
              {issuePullObj.description.length ? (
                <ReactMarkdown linkTarget="_blank">
                  {issuePullObj.description}
                </ReactMarkdown>
              ) : (
                <ReactMarkdown>{"*No description given*"}</ReactMarkdown>
              )}
            </div>
          </>
        )}
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
  updateIssueDescription,
  updatePullRequestDescription,
})(IssuePullDescription);
