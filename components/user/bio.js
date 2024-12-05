import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { updateUserBio } from "../../store/actions/user";
import { notify } from "reapop";
import TextInput from "../textInput";
import { useApiClient } from "../../context/ApiClientContext";

function UserBio(props = { isEditable: false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [newBioHint, setNewBioHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingBio, setSavingBio] = useState(false);
  const input = useRef();
  const { cosmosBankApiClient, cosmosFeegrantApiClient } = useApiClient();

  const validateBio = (bio) => {
    setNewBioHint({
      ...newBioHint,
      shown: false,
    });

    if (bio === props.user.bio) {
      setNewBioHint({
        shown: true,
        type: "error",
        message: "Bio is same as earlier",
      });
      return false;
    }
    return true;
  };

  const updateBio = async () => {
    setSavingBio(true);
    if (validateBio(newBio)) {
      const res = await props.updateUserBio(
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        newBio
      );

      if (res && res.code === 0) {
        if (props.refresh) await props.refresh();
        setIsEditing(false);
      } else {
      }
    }
    setSavingBio(false);
  };

  useEffect(() => {
    setNewBio(props.user.bio);
    setNewBioHint({ shown: false });
  }, [props.user]);

  useEffect(() => {
    if (isEditing && input?.current) {
      input.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="mb-2">
      {isEditing ? (
        <div className="py-1">
          <TextInput
            type="text"
            name="bio"
            placeholder="Bio"
            multiline={true}
            value={newBio}
            setValue={setNewBio}
            hint={newBioHint}
            size="sm"
            ref={input}
          />
          <div className="flex flex-none w-60 btn-group mt-2">
            <button
              className="flex-1 btn btn-sm text-xs "
              onClick={() => {
                setIsEditing(false);
                setNewBio(props.user.bio);
                setNewBioHint({ shown: false });
              }}
            >
              Cancel
            </button>
            <button
              className={
                "flex-1 btn btn-sm btn-primary text-xs " +
                (savingBio ? "loading" : "")
              }
              onClick={updateBio}
              disabled={savingBio}
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
            (props.user.bio == "" ? " text-grey italic" : "")
          }
          onClick={() => {
            if (props.isEditable) setIsEditing(true);
          }}
        >
          {props.user.bio == "" ? "No Bio Provided" : props.user.bio}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateUserBio,
  notify,
})(UserBio);
