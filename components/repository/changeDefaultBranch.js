import { useState } from "react";
import TextInput from "../textInput";
import { connect } from "react-redux";
import { changeDefaultBranch } from "../../store/actions/repository";
import getAllRepositoryBranch from "../../helpers/getAllRepositoryBranch";

function ChangeDefaultBranch({
  repoId = null,
  repoName = null,
  repoOwner = null,
  repoDefaultBranch = null,
  onSuccess,
  ...props
}) {
  const [name, setName] = useState("");
  const [branchNameHint, setBranchNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [startChange, setStartChange] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const validateName = async () => {
    const repoBranch = await getAllRepositoryBranch(repoOwner, repoName);
    if (repoBranch.find((branch) => branch.name === name) === undefined) {
      setBranchNameHint({
        type: "error",
        shown: true,
        message: "Branch doesn't exist in the repository",
      });
      return false;
    }
    if (repoDefaultBranch === name) {
      setBranchNameHint({
        type: "error",
        shown: true,
        message: name + " is already the default branch",
      });
      return false;
    }
    setBranchNameHint({
      type: "error",
      shown: false,
      message: "",
    });
    return true;
  };

  const changeName = async () => {
    setIsChanging(true);
    if (await validateName()) {
      const res = await props.changeDefaultBranch({
        repoOwner: repoOwner,
        repoName: repoName,
        branchName: name,
      });
      if (res) {
        setStartChange(false);
        setName("");
        if (onSuccess) await onSuccess(name);
      }
    }
    setIsChanging(false);
  };

  return (
    <div>
      <div className="sm:flex items-center">
        <div className="flex-1 mr-8">
          <div className="label-text">Change Default Branch</div>
          <div className="label-text-alt text-type-secondary">
            Change your default repository branch
          </div>
        </div>
        <div className="flex-none w-48 pt-4 sm:pt-0">
          <button
            className="btn btn-sm btn-block btn-accent btn-outline"
            onClick={() => setStartChange(true)}
          >
            Change
          </button>
        </div>
      </div>

      <input
        type="checkbox"
        checked={startChange}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <div className="items-top">
            <div className="flex-1">
              <TextInput
                type="text"
                name="branch_name"
                placeholder="Branch Name"
                label="Change Default Branch"
                value={name}
                setValue={(v) => {
                  setName(v);
                }}
                onEnter={() => {
                  validateName();
                }}
                hint={branchNameHint}
                size="sm"
              />
            </div>
            <div className="modal-action">
              <label
                className="btn btn-sm"
                onClick={() => {
                  setStartChange(false);
                  setName("");
                }}
              >
                Cancel
              </label>
              <label
                className={
                  "btn btn-sm btn-primary " + (isChanging ? "loading" : "")
                }
                onClick={changeName}
              >
                Change
              </label>
            </div>
          </div>
        </div>
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
  changeDefaultBranch,
})(ChangeDefaultBranch);
