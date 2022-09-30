import { useState } from "react";
import { connect } from "react-redux";
import { renameDao } from "../../store/actions/dao";
import { notify } from "reapop";
import TextInput from "../textInput";

function DaoName(props = { isEditable: false }) {
  const [newName, setNewName] = useState(props.dao.name);
  const [newNameHint, setNewNameHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingName, setSavingName] = useState(false);

  const reset = () => {
    setNewName(props.dao.name);
    setNewNameHint({ shown: false });
  };

  const updateName = async () => {
    setSavingName(true);
    const res = await props.renameDao({ id: props.dao.address, name: newName });
    if (res && res.code === 0) {
      props.notify("Your DAO name is updated", "info");
      if (props.refresh) await props.refresh(newName);
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
              onClick={updateName}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <label
        htmlFor="name-edit-modal"
        className={
          "modal-button text-2xl py-1 inline-block border-b mb-2" +
          (props.isEditable
            ? " border-grey-300 hover:text-primary cursor-pointer"
            : " border-transparent") +
          (props.dao.name == "" ? " text-grey italic" : "")
        }
      >
        {props.dao.name}
      </label>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  renameDao,
  notify,
})(DaoName);
