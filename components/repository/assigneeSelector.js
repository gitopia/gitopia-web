import { useEffect, useState, useRef } from "react";
import getUser from "../../helpers/getUser";
import { validUserAddress } from "../../helpers/validAddress";
import AccountCard from "../../components/account/card";

function AssigneeSelector({ collaborators = [], assignees = [], onChange }) {
  const [newAssignees, setNewAssignees] = useState([]);
  const [validateAddressError, setValidateAddressError] = useState(null);
  const [checkMap, setCheckMap] = useState({});
  const menuDiv = useRef(null);
  const inputEl = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchText, setSearchText] = useState("");
  const assigneesModal = useRef();

  const collabAddresses = collaborators
    .filter((x) => x.permission !== "READ")
    .map((x) => x.id);

  const validateUser = async (addressOrUsername) => {
    let foundAddress;
    if (validUserAddress.test(addressOrUsername)) {
      foundAddress = addressOrUsername;
    } else if (addressOrUsername.trim() !== "") {
      const res = await getUser(addressOrUsername);
      if (res) {
        foundAddress = res.creator;
        setValidateAddressError(null);
      } else {
        setValidateAddressError("User not found");
        return false;
      }
    }
    if (foundAddress) {
      if (
        collabAddresses.includes(foundAddress) ||
        newAssignees.includes(foundAddress)
      ) {
        setCheckMap({ ...checkMap, [foundAddress]: true });
        setValidateAddressError("User already present");
        return false;
      }
      return foundAddress;
    }
    setValidateAddressError("User not found");
    return false;
  };

  const updateAssignees = async () => {
    const list = [];
    setIsSaving(true);
    for (let address in checkMap) {
      if (checkMap[address] && !list.includes(address)) list.push(address);
    }
    if (onChange) await onChange(list);
    setNewAssignees([]);
    setIsSaving(false);
  };

  const resetAssignees = () => {
    const newCheckMap = {};
    const otherAddresses = [];
    assignees.map((a) => {
      newCheckMap[a] = true;
      if (!collabAddresses.includes(a)) {
        otherAddresses.push(a);
      }
    });
    setNewAssignees(otherAddresses);
    setCheckMap(newCheckMap);
  };

  useEffect(resetAssignees, [assignees]);

  return (
    <div className={"w-full"} data-test="assignee" tabIndex="0">
      <label
        className={
          "btn btn-sm btn-block btn-ghost modal-button " +
          (isSaving ? "loading" : "")
        }
        data-test="labels"
        htmlFor="assignee-modal"
      >
        <div className="flex-1 text-left">Assignees</div>
        <svg
          className="h-5 w-5"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.0552 12.674C14.7484 12.674 15.3104 12.112 15.3104 11.4188C15.3104 10.7256 14.7484 10.1636 14.0552 10.1636C13.362 10.1636 12.8 10.7256 12.8 11.4188C12.8 12.112 13.362 12.674 14.0552 12.674ZM14.0552 14.474C15.7425 14.474 17.1104 13.1061 17.1104 11.4188C17.1104 9.73145 15.7425 8.36359 14.0552 8.36359C12.3679 8.36359 11 9.73145 11 11.4188C11 13.1061 12.3679 14.474 14.0552 14.474Z"
            fill="#3E4051"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.29118 16.857C10.377 15.7809 11.9388 15.169 13.8547 15.169V16.969C12.3299 16.969 11.2519 17.448 10.5582 18.1355C9.86128 18.8262 9.47523 19.8029 9.47523 20.9417V21.9343H14.8053V23.7343H8.67466C8.34118 23.7343 7.67523 23.4899 7.67523 22.7565V20.9417C7.67523 19.3894 8.20855 17.9299 9.29118 16.857Z"
            fill="#3E4051"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.3899 21.8057V21.0756C23.3899 18.7602 21.5129 16.8831 19.1975 16.8831C16.882 16.8831 15.005 18.7602 15.005 21.0756V21.8057H23.3899ZM19.1975 15.0831C15.8879 15.0831 13.205 17.766 13.205 21.0756V23.5078C13.205 23.5619 13.2489 23.6057 13.303 23.6057H25.092C25.1461 23.6057 25.1899 23.5619 25.1899 23.5078V21.0756C25.1899 17.766 22.507 15.0831 19.1975 15.0831Z"
            fill="#ADBECB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.0552 11.7731C19.7484 11.7731 20.3104 11.2111 20.3104 10.5179C20.3104 9.82462 19.7484 9.26265 19.0552 9.26265C18.362 9.26265 17.8 9.82462 17.8 10.5179C17.8 11.2111 18.362 11.7731 19.0552 11.7731ZM19.0552 13.5731C20.7425 13.5731 22.1104 12.2052 22.1104 10.5179C22.1104 8.83051 20.7425 7.46265 19.0552 7.46265C17.3679 7.46265 16 8.83051 16 10.5179C16 12.2052 17.3679 13.5731 19.0552 13.5731Z"
            fill="#ADBECB"
          />
        </svg>
      </label>

      <input
        type="checkbox"
        id="assignee-modal"
        className="modal-toggle"
        ref={assigneesModal}
      />
      <div className="modal">
        <div className="modal-box shadow-lg shadow-lg bg-[#28313B] rounded p-4 mt-1 h-fit">
          <div className="flex">
            <div className="text-type-primary text-lg font-bold">Assignees</div>
            <label
              className="btn btn-circle btn-sm btn-ghost ml-auto"
              htmlFor="assignee-modal"
              onClick={() => {
                setSearchText("");
                setValidateAddressError(null);
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
          </div>
          <div className="form-control mb-2 mt-4">
            <input
              data-test="assignee_search"
              name="search"
              type="text"
              placeholder="User address or username [Enter to search]"
              autoComplete="off"
              ref={inputEl}
              value={searchText}
              onKeyUp={async (e) => {
                const val = e.target.value;
                if (e.code == "Enter") {
                  const address = await validateUser(val);
                  if (address) {
                    setNewAssignees([...newAssignees, address]);
                    setCheckMap({ ...checkMap, [address]: true });
                    setSearchText("");
                  }
                }
              }}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              className="w-full input input-sm input-ghost input-bordered"
            />
            {validateAddressError ? (
              <label className="label">
                <span className="label-text-alt text-error">
                  {validateAddressError}
                </span>
              </label>
            ) : (
              ""
            )}
          </div>
          <div className="">
            {collabAddresses.length ? (
              <div className="py-2 text-type-secondary font-bold text-xs uppercase">
                Collaborators
              </div>
            ) : (
              ""
            )}
            {collabAddresses.map((c, i) => {
              return (
                <div className="form-control" key={"collaborator" + i}>
                  <label className="cursor-pointer label justify-start hover:bg-[#1A2028] rounded-md">
                    <input
                      type="checkbox"
                      checked={checkMap[c]}
                      onChange={() => {
                        setCheckMap({ ...checkMap, [c]: !checkMap[c] });
                      }}
                      className="checkbox checkbox-sm ml-2 mr-2"
                    />
                    <AccountCard id={c} showAvatar={true} avatarSize="xs" />
                  </label>
                </div>
              );
            })}
            {newAssignees.length ? (
              <div className="py-2 text-type-secondary font-bold text-xs uppercase">
                Others
              </div>
            ) : (
              ""
            )}
            {newAssignees.map((a, i) => {
              return (
                <div className="form-control" key={"newassignee" + i}>
                  <label className="cursor-pointer label justify-start hover:bg-[#1A2028] rounded-md">
                    <input
                      type="checkbox"
                      checked={checkMap[a]}
                      onChange={() => {
                        setCheckMap({ ...checkMap, [a]: !checkMap[a] });
                      }}
                      className="checkbox checkbox-sm ml-2 mr-2"
                    />
                    <AccountCard id={a} showAvatar={true} avatarSize="xs" />
                  </label>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center mt-2 mb-4 mt-4 modal-action">
            <button
              className={
                "btn btn-primary btn-block flex-1 " +
                (isSaving ? "loading" : "")
              }
              data-test="assignee_save"
              onClick={(e) => {
                updateAssignees();
                setSearchText("");
                setValidateAddressError(null);
                if (menuDiv.current) {
                  menuDiv.current.blur();
                }
                if (assigneesModal?.current) {
                  assigneesModal.current.checked = false;
                }
                e.stopPropagation();
              }}
              disabled={isSaving}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssigneeSelector;
