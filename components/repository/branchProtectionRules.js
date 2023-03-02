import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import getAllRepositoryBranch from "../../helpers/getAllRepositoryBranch";
import { toggleForcePush } from "../../store/actions/repository";

function BranchProtectionRules({
  repoName = "",
  repoOwner = "",
  onSuccess,
  ...props
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [addRule, setAddRule] = useState(false);
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);
  useEffect(() => {
    async function getRepositoryBranch() {
      const res = await getAllRepositoryBranch(repoOwner, repoName);
      if (res) {
        setBranches(res);
      }
    }
    getRepositoryBranch();
  }, [repoName]);

  return (
    <div className="flex items-center">
      <div className="flex-1 mr-8">
        <div className="label-text">Branch Protection Rules</div>
        <div className="label-text-alt text-type-secondary">
          Define rules to protect branches
        </div>
      </div>
      <div className="flex-none w-48">
        <button
          className="btn btn-sm btn-block btn-accent btn-outline"
          onClick={() => {
            if (branches.length === 0) {
              props.notify("There are no branches to add rule", "error");
            } else setAddRule(true);
          }}
        >
          Add Rule
        </button>
      </div>
      <input
        type="checkbox"
        checked={addRule}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor=""
            className="absolute right-5 ml-auto hover:opacity-25"
            onClick={() => {
              setAddRule(false);
              setIsAdding(false);
              setBranch("");
            }}
          >
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5303 2.0304C13.8231 1.73751 13.8231 1.26264 13.5303 0.969744C13.2374 0.676851 12.7625 0.676851 12.4696 0.969744L13.5303 2.0304ZM0.46967 12.9697C0.176777 13.2626 0.176777 13.7374 0.46967 14.0303C0.762563 14.3232 1.23744 14.3232 1.53033 14.0303L0.46967 12.9697ZM12.4696 14.0303C12.7625 14.3231 13.2374 14.3231 13.5303 14.0303C13.8231 13.7374 13.8231 13.2625 13.5303 12.9696L12.4696 14.0303ZM1.53033 0.96967C1.23744 0.676777 0.762563 0.676777 0.46967 0.96967C0.176777 1.26256 0.176777 1.73744 0.46967 2.03033L1.53033 0.96967ZM12.4696 0.969744L0.46967 12.9697L1.53033 14.0303L13.5303 2.0304L12.4696 0.969744ZM13.5303 12.9696L1.53033 0.96967L0.46967 2.03033L12.4696 14.0303L13.5303 12.9696Z"
                fill="#E5EDF5"
              />
            </svg>
          </label>
          <div className="text-type font-bold text-lg">
            Prevent Force Pushes
          </div>
          <p className="text-sm text-type-secondary">
            Prevent force pushes on your branch from users
          </p>
          <p className="flex mt-2 whitespace-normal">Branch</p>
          <select
            className={
              "mt-2 select select-bordered select-sm mr-2 sm:mr-0 focus:outline-none focus:border-type " +
              (branch.length > 0 ? "border-green" : "")
            }
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
            }}
          >
            <option selected value={""}>
              Select Branch
            </option>
            {branches.map((b, i) => {
              return (
                <option value={b.name} key={i}>
                  {b.name}
                </option>
              );
            })}
          </select>
          <div className="ml-auto modal-action">
            <label
              className={
                "btn btn-sm w-32 btn-primary " + (isAdding ? "loading" : "")
              }
              onClick={async () => {
                setIsAdding(true);
                props
                  .toggleForcePush({
                    repoOwner: repoOwner,
                    repoName: repoName,
                    branchName: branch,
                  })
                  .then(async (res) => {
                    if (res.code == 0) {
                      if (onSuccess) await onSuccess(branch);
                      setAddRule(false);
                      setIsAdding(false);
                      setBranch("");
                    }
                  });
              }}
              disabled={branch.length === 0}
            >
              Add
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  toggleForcePush,
  notify,
})(BranchProtectionRules);
