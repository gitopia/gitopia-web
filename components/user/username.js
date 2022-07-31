import { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { updateUserAvatar } from "../../store/actions/user";
import { notify } from "reapop";
import getUser from "../../helpers/getUser";
import TextInput from "../textInput";

function UserUsername(props = { isEditable: false }) {
  const [newUsername, setNewUsername] = useState(props.user.username);
  const [newUsernameHint, setNewUsernameHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingUsername, setSavingUsername] = useState(false);

  const reset = () => {
    setNewUsername(props.user.username);
    setNewUsernameHint({ shown: false });
  };

  return (
    <div className="inline-block">
      <input
        type="checkbox"
        id="username-edit-modal"
        className="modal-toggle"
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
          />
          <div className="modal-action">
            {/* <label
              htmlFor="username-edit-modal"
              className="w-36 btn btn-sm"
              onClick={reset}
            >
              Cancel
            </label> */}
            <button
              className={
                "w-36 btn btn-sm btn-primary" +
                (savingUsername ? " loading" : "")
              }
              disabled={savingUsername}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="username-edit-modal"
        className="modal-button"
        className={
          "py-1 border-b mr-2" +
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
  notify,
})(UserUsername);
