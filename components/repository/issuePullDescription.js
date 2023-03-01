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
import Link from "next/link";

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
            repositoryId: repository.id,
            iid: issuePullObj.iid,
          })
        : await props.updateIssueDescription({
            description: newDescription,
            repositoryId: repository.id,
            iid: issuePullObj.iid,
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
      <div className="flex-1">
        {isEditing ? (
          <div className="">
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
                  className={"btn btn-sm btn-outline btn-block"}
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
          <div className="">
            <div className="border border-grey rounded-lg flex-1">
              <div className="text-xs px-2 rounded-t relative">
                <div className="absolute right-2 top-1">
                  {issuePullObj.creator === props.selectedAddress ? (
                    <div className="dropdown dropdown-end">
                      <div
                        tabIndex="0"
                        className="btn btn-square btn-xs btn-link"
                      >
                        <svg
                          width="21"
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

              <div className="text-xs p-6">
                <div className="text-white font-normal mb-3 markdown-body">
                  {issuePullObj.description.length ? (
                    <ReactMarkdown linkTarget="_blank">
                      {issuePullObj.description}
                    </ReactMarkdown>
                  ) : (
                    <ReactMarkdown>{"*No description given*"}</ReactMarkdown>
                  )}
                </div>
                <div className="flex-1 font-bold text-xs uppercase text-type-tertiary">
                  {shrinkAddress(issuePullObj.creator) +
                    " commented " +
                    dayjs(issuePullObj.createdAt * 1000).fromNow()}
                </div>
              </div>
            </div>
          </div>
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
