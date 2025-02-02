import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { updateUserUsername } from "../../store/actions/user";
import { notify } from "reapop";
import TextInput from "../textInput";
import { useApiClient } from "../../context/ApiClientContext";

function UserUsername(props = { isEditable: false }) {
  const [newUsername, setNewUsername] = useState(props.user?.username || "");
  const [newUsernameHint, setNewUsernameHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingUsername, setSavingUsername] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const input = useRef();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  useEffect(() => {
    setNewUsername(props.user?.username || "");
  }, [props.user.username]);

  useEffect(() => {
    if (modalOpen && input?.current) {
      input.current.focus();
    }
  }, [modalOpen]);

  const reset = () => {
    setNewUsername(props.user.username);
    setNewUsernameHint({ shown: false });
    setModalOpen(false);
  };

  const updateUsername = async () => {
    setSavingUsername(true);
    const res = await props.updateUserUsername(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      newUsername
    );
    if (res && res.code === 0) {
      props.notify("Your username is updated", "info");
      if (props.refresh) await props.refresh(newUsername);
      setModalOpen(false);
    }
    setNewUsernameHint({ shown: false });
    setSavingUsername(false);
  };

  return (
    <div className="inline-block">
      <input
        type="checkbox"
        id="username-edit-modal"
        className="modal-toggle"
        checked={modalOpen}
        disabled={!props.isEditable}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="username-edit-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={reset}
          >
            ✕
          </label>
          <label className="label">
            <span className="label-text text-xs font-bold text-gray-400">
              USERNAME
            </span>
          </label>
          <TextInput
            type="text"
            name="username"
            placeholder="Enter Username"
            value={newUsername}
            setValue={setNewUsername}
            hint={newUsernameHint}
            size="lg"
            ref={input}
          />
          <div className="modal-action">
            <button
              className={
                "w-36 btn btn-sm btn-primary" +
                (savingUsername ? " loading" : "")
              }
              disabled={savingUsername}
              onClick={updateUsername}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="username-edit-modal"
        onClick={() => {
          if (props.isEditable) setModalOpen(true);
        }}
        className={
          "modal-button py-1 border-b" +
          (props.isEditable
            ? " border-grey-300 hover:text-primary cursor-pointer"
            : " border-transparent") +
          (props.user.username == "" ? " text-grey italic" : "")
        }
      >
        {props.isEditable
          ? props.user.username
            ? props.user.username
            : "No Username"
          : props.user.username}
      </label>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateUserUsername,
  notify,
})(UserUsername);
