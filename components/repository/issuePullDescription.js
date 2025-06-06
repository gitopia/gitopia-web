import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { connect } from "react-redux";
import {
  updateIssueDescription,
  updatePullRequestDescription,
} from "../../store/actions/repository";
import MarkdownEditor from "../markdownEditor";
import AccountCard from "../account/card";
import { useApiClient } from "../../context/ApiClientContext";

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
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

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
        ? await props.updatePullRequestDescription(
            apiClient,
            cosmosBankApiClient,
            cosmosFeegrantApiClient,
            {
              description: newDescription,
              repositoryId: repository.id,
              iid: issuePullObj.iid,
            }
          )
        : await props.updateIssueDescription(
            apiClient,
            cosmosBankApiClient,
            cosmosFeegrantApiClient,
            {
              description: newDescription,
              repositoryId: repository.id,
              iid: issuePullObj.iid,
            }
          );
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
        <AccountCard
          id={issuePullObj.creator}
          showAvatar={true}
          showId={false}
        />
      </div>
      <div className="flex-1 overflow-hiddden">
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
            <div className="border border-grey rounded-lg flex-none">
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

              <div className="text-xs p-6 overflow-scroll">
                <div className="text-white font-normal mb-3 markdown-body min-w=0 max-w-[252px] sm:max-w-[229px] md:max-w-[386px] lg:max-w-[598px] xl:max-w-[598px] 2xl:max-w-[598px]">
                  {issuePullObj.description.length ? (
                    <ReactMarkdown linkTarget="_blank">
                      {issuePullObj.description}
                    </ReactMarkdown>
                  ) : (
                    <ReactMarkdown>
                      {"*No issue description given*"}
                    </ReactMarkdown>
                  )}
                </div>
                <div className="flex-1 text-xs text-type-tertiary">
                  {dayjs(issuePullObj.createdAt * 1000).fromNow()}
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
