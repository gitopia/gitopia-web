import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import {
  updateIssueTitle,
  updatePullRequestTitle,
} from "../../store/actions/repository";
import TextInput from "../textInput";

function IssuePullTitle({
  issuePullObj,
  repository,
  onUpdate,
  onError,
  isPull = false,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTitleHint, setNewTitleHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingTitle, setSavingTitle] = useState(false);

  useEffect(() => {
    setNewTitle(issuePullObj.title);
    setNewTitleHint({ shown: false });
  }, [issuePullObj]);

  const validateTitle = (title) => {
    setNewTitleHint({
      ...newTitleHint,
      shown: false,
    });
    if (title.trim() === "") {
      setNewTitleHint({
        shown: true,
        type: "error",
        message: "Title cannot be empty",
      });
      return false;
    }
    if (title === issuePullObj.title) {
      setNewTitleHint({
        shown: true,
        type: "error",
        message: "Title is same as earlier",
      });
      return false;
    }
    return true;
  };

  const updateTitle = async () => {
    setSavingTitle(true);
    if (validateTitle(newTitle)) {
      const res = isPull
        ? await props.updatePullRequestTitle({
            title: newTitle,
            id: issuePullObj.id,
          })
        : await props.updateIssueTitle({
            title: newTitle,
            id: issuePullObj.id,
          });
      if (res && res.code === 0) {
        if (onUpdate) await onUpdate(newTitle);
        setIsEditing(false);
      } else {
        if (onError) onError();
      }
    }
    setSavingTitle(false);
  };

  return (
    <div className="flex">
      <div className="flex-1">
        {isEditing ? (
          <TextInput
            type="text"
            name="title"
            placeholder="Title"
            value={newTitle}
            setValue={setNewTitle}
            hint={newTitleHint}
            size="sm"
          />
        ) : (
          <div>
            <span className="text-3xl mr-2">{issuePullObj.title}</span>
            <span className="text-3xl text-neutral">#{issuePullObj.iid}</span>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="flex flex-none w-60 btn-group ml-4">
          <button
            className="flex-1 btn btn-sm "
            onClick={() => {
              setIsEditing(false);
              setNewTitle(issuePullObj.title);
              setNewTitleHint({ shown: false });
            }}
          >
            Cancel
          </button>
          <button
            className={
              "flex-1 btn btn-sm btn-primary " + (savingTitle ? "loading" : "")
            }
            onClick={updateTitle}
            disabled={savingTitle}
          >
            Save
          </button>
        </div>
      ) : (
        <>
          {issuePullObj.creator === props.selectedAddress ? (
            <button
              className="btn btn-sm btn-ghost ml-4"
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          ) : (
            ""
          )}

          <Link
            href={
              "/" +
              repository.owner.id +
              "/" +
              repository.name +
              (isPull ? "/pulls/new" : "/issues/new")
            }
            className="btn btn-ghost btn-sm ml-4"
          >
            {isPull ? "New Pull Request" : "New Issue"}
          </Link>
        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  updateIssueTitle,
  updatePullRequestTitle,
})(IssuePullTitle);
