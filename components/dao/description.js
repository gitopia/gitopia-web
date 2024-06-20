import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { updateDaoDescription } from "../../store/actions/dao";
import { notify } from "reapop";
import TextInput from "../textInput";
import { useApiClient } from "../../context/ApiClientContext";

function DaoDescription(props = { isEditable: false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionHint, setNewDescriptionHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingDescription, setSavingDescription] = useState(false);
  const input = useRef();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const validateDescription = (description) => {
    setNewDescriptionHint({
      ...newDescriptionHint,
      shown: false,
    });

    if (description === props.dao.description) {
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
      const res = await props.updateDaoDescription(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          id: props.dao.address,
          description: newDescription,
        }
      );

      if (res && res.code === 0) {
        if (props.refresh) await props.refresh();
        setIsEditing(false);
      } else {
      }
    }
    setSavingDescription(false);
  };

  useEffect(() => {
    setNewDescription(props.dao.description);
    setNewDescriptionHint({ shown: false });
  }, [props.dao]);

  useEffect(() => {
    if (isEditing && input?.current) {
      input.current.focus();
    }
  }, [isEditing]);

  return (
    <div>
      {isEditing ? (
        <div className="py-1">
          <TextInput
            type="text"
            name="description"
            placeholder="Description"
            multiline={true}
            value={newDescription}
            setValue={setNewDescription}
            hint={newDescriptionHint}
            size="sm"
            ref={input}
          />
          <div className="flex flex-none w-60 btn-group mt-2">
            <button
              className="flex-1 btn btn-sm text-xs "
              onClick={() => {
                setIsEditing(false);
                setNewDescription(props.dao.description);
                setNewDescriptionHint({ shown: false });
              }}
            >
              Cancel
            </button>
            <button
              className={
                "flex-1 btn btn-sm btn-primary text-xs " +
                (savingDescription ? "loading" : "")
              }
              onClick={updateDescription}
              disabled={savingDescription}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            "text-type-secondary py-1 inline-block border-b" +
            (props.isEditable
              ? " border-grey-300 hover:text-primary cursor-pointer"
              : " border-transparent") +
            (props.dao.description == "" ? " text-grey italic" : "")
          }
          onClick={() => {
            if (props.isEditable) setIsEditing(true);
          }}
        >
          {props.dao.description == ""
            ? "No Description Provided"
            : props.dao.description}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateDaoDescription,
  notify,
})(DaoDescription);
