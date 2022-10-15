import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { updateUserName } from "../../store/actions/user";
import { notify } from "reapop";
import TextInput from "../textInput";

function UserName(props = { isEditable: false }) {
  const [newName, setNewName] = useState(props.user?.name || "");
  const [newNameHint, setNewNameHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingName, setSavingName] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const input = useRef();

  useEffect(() => {
    setNewName(props.user?.name || "");
  }, [props.user?.name]);

  useEffect(() => {
    if (modalOpen && input?.current) {
      input.current.focus();
    }
  }, [modalOpen]);

  const reset = () => {
    setNewName(props.user.name);
    setNewNameHint({ shown: false });
    setModalOpen(false);
  };

  const updateName = async () => {
    setSavingName(true);
    const res = await props.updateUserName(newName);
    if (res && res.code === 0) {
      props.notify("Your name is updated", "info");
      if (props.refresh) await props.refresh();
      setModalOpen(false);
    }
    setNewNameHint({ shown: false });
    setSavingName(false);
  };

  return (
    <div>
      <input
        type="checkbox"
        id="name-edit-modal"
        className="modal-toggle"
        checked={modalOpen}
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
            ref={input}
          />
          <div className="modal-action">
            <button
              className={
                "w-36 btn btn-sm btn-primary" + (savingName ? " loading" : "")
              }
              disabled={savingName}
              onClick={updateName}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="name-edit-modal"
        onClick={() => {
          setModalOpen(true);
        }}
        className={
          "modal-button text-2xl py-1 inline-block border-b" +
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
  updateUserName,
  notify,
})(UserName);
