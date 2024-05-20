import { useState } from "react";
import TextInput from "../textInput";
import { connect } from "react-redux";
import { changeDefaultBranch } from "../../store/actions/repository";
import getAllRepositoryBranch from "../../helpers/getAllRepositoryBranch";
import { useEffect } from "react";
import useRepository from "../../hooks/useRepository";
import dayjs from "dayjs";
import { useApiClient } from "../../context/ApiClientContext";

function ChangeDefaultBranch({ onSuccess, ...props }) {
  const [name, setName] = useState("");
  const [textEntered, setEnteredText] = useState("");
  const [matchingBranches, setMatchingBranches] = useState([]);
  const [branchNameHint, setBranchNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [startChange, setStartChange] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [repoBranch, setRepoBranch] = useState([]);
  const { repository, refreshRepository } = useRepository();
  const { apiClient } = useApiClient();

  function getBranches(branch, substring) {
    const matchingBranches = branch.filter(
      (branch) =>
        branch.name.includes(substring) &&
        branch.name !== repository.defaultBranch
    );
    setMatchingBranches(matchingBranches);
  }

  useEffect(() => {
    const getRepoBranch = async () => {
      const repoBranch = await getAllRepositoryBranch(
        repository.owner.id,
        repository.name
      );
      setRepoBranch(repoBranch);
    };
    getRepoBranch();
  }, []);

  const changeName = async () => {
    setIsChanging(true);

    const res = await props.changeDefaultBranch(apiClient, {
      repoOwner: repository.owner.id,
      repoName: repository.name,
      branchName: name,
    });
    if (res) {
      setStartChange(false);
      setName("");
      setEnteredText("");
      setMatchingBranches([]);
      refreshRepository();
      if (onSuccess) await onSuccess(name);
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
            {name != "" ? (
              <div className="flex text-sm box-border bg-grey-500 mr-2 h-11 p-3 w-fit rounded-lg mt-2">
                {name}
                <div
                  className="link ml-4 mt-1 no-underline"
                  onClick={() => {
                    setName("");
                    setEnteredText("");
                    setMatchingBranches([]);
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5303 1.5304C13.8231 1.23751 13.8231 0.762637 13.5303 0.469744C13.2374 0.176851 12.7625 0.176851 12.4696 0.469744L13.5303 1.5304ZM0.46967 12.4697C0.176777 12.7626 0.176777 13.2374 0.46967 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L0.46967 12.4697ZM12.4696 13.5303C12.7625 13.8231 13.2374 13.8231 13.5303 13.5303C13.8231 13.2374 13.8231 12.7625 13.5303 12.4696L12.4696 13.5303ZM1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM12.4696 0.469744L0.46967 12.4697L1.53033 13.5303L13.5303 1.5304L12.4696 0.469744ZM13.5303 12.4696L1.53033 0.46967L0.46967 1.53033L12.4696 13.5303L13.5303 12.4696Z"
                      fill="#E5EDF5"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="form-control flex-1 mt-4">
                <div className="flex-1 mr-8">
                  <div className="label-text">Change Default Branch</div>
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    name="branch_name"
                    placeholder="Search"
                    label="Change Default Branch"
                    className="w-full pr-16 input input-ghost input-sm input-bordered"
                    value={textEntered}
                    onChange={(e) => {
                      setEnteredText(e.target.value);
                      getBranches(repoBranch, e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.code === "Enter") {
                        setEnteredText(e.target.value);
                        getBranches(repoBranch, e.target.value);
                      }
                    }}
                  />

                  <button
                    className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost"
                    onClick={() => {}}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  {matchingBranches.length > 0 ? (
                    <div className="card bg-grey-500 p-4">
                      {matchingBranches.map((b, key) => {
                        return (
                          <div
                            onClick={() => {
                              setName(b.name);
                              setEnteredText("");
                            }}
                            key={key}
                          >
                            <div
                              className={
                                "flex border-grey-300 pb-3 pt-3 hover:cursor-pointer " +
                                (key < matchingBranches.length - 1
                                  ? "border-b"
                                  : "")
                              }
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mt-0.5"
                              >
                                <g transform="scale(0.8)">
                                  <path
                                    d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                                    stroke="#ADBECB"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                  <circle
                                    cx="8.5"
                                    cy="18.5"
                                    r="2.5"
                                    fill="#ADBECB"
                                  />
                                  <circle
                                    cx="8.5"
                                    cy="5.5"
                                    r="2.5"
                                    fill="#ADBECB"
                                  />
                                  <path
                                    d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                                    fill="#ADBECB"
                                  />
                                </g>
                              </svg>
                              <div className="text-type-secondary ml-4 text-sm">
                                {b.name}
                              </div>
                              <div className="font-bold text-xs text-type-secondary ml-auto uppercase mt-0.5">
                                updated at {dayjs(b.updatedAt * 1000).fromNow()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            <div className="modal-action">
              <label
                className="btn btn-sm"
                onClick={() => {
                  setStartChange(false);
                  setName("");
                  setEnteredText("");
                  setMatchingBranches([]);
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
