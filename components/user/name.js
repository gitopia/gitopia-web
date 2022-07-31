import { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { updateUserAvatar } from "../../store/actions/user";
import { notify } from "reapop";
import getUser from "../../helpers/getUser";
import TextInput from "../textInput";

function UserName(props = { isEditable: false }) {
  const [newName, setNewName] = useState(props.user.name);
  const [newNameHint, setNewNameHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingName, setSavingName] = useState(false);

  const reset = () => {
    setNewName(props.user.name);
    setNewNameHint({ shown: false });
  };

  return (
    <div>
      <input
        type="checkbox"
        id="name-edit-modal"
        className="modal-toggle"
        disabled={!props.isEditable}
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="name-edit-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={reset}
          >
            ✕
          </label>
          <label className="label">
            <span className="label-text text-xs font-bold text-gray-400">
              NAME
            </span>
          </label>
          <TextInput
            type="text"
            name="name"
            placeholder="Enter Name"
            value={newName}
            setValue={setNewName}
            hint={newNameHint}
            size="lg"
          />
          <div className="modal-action">
            {/* <label
              htmlFor="name-edit-modal"
              className="w-36 btn btn-sm"
              onClick={reset}
            >
              Cancel
            </label> */}
            <button
              className={
                "w-36 btn btn-sm btn-primary" + (savingName ? " loading" : "")
              }
              disabled={savingName}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="name-edit-modal"
        className="modal-button"
        className={
          "text-2xl py-1 inline-block border-b mb-2" +
          (props.isEditable
            ? " border-grey-300 hover:text-primary cursor-pointer"
            : " border-transparent") +
          (props.user.name == "" ? " text-grey italic" : "")
        }
      >
        {props.isEditable
          ? props.user.name
            ? props.user.name
            : "No Name"
          : props.user.name}
      </label>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  notify,
})(UserName);
