import { useEffect, useState, useRef } from "react";
import shrinkAddress from "../../helpers/shrinkAddress";
import getUser from "../../helpers/getUser";

function AssigneeSelector({
  collaborators = [],
  assignees = [],
  onChange,
  title = "Assignees",
}) {
  const [newAssignees, setNewAssignees] = useState([]);
  const [validateAddressError, setValidateAddressError] = useState(null);
  const [checkMap, setCheckMap] = useState({});
  const menuDiv = useRef(null);
  const inputEl = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const validAddress = new RegExp("gitopia[a-z0-9]{39}");
  const collabAddresses = collaborators
    .filter((x) => x.permission !== "READ")
    .map((x) => x.id);

  const validateUserAddress = async (address) => {
    if (collabAddresses.includes(address) || newAssignees.includes(address)) {
      setCheckMap({ ...checkMap, [address]: true });
      setValidateAddressError("Address already present");
      return false;
    }
    if (address.trim() !== "" && validAddress.test(address)) {
      const res = await getUser(address);
      if (res) {
        setValidateAddressError(null);
        return true;
      } else {
        setValidateAddressError("User not found");
        return false;
      }
    }
    setValidateAddressError("Enter a valid address");
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
    <div
      className={"dropdown dropdown-end w-full"}
      data-test="assignee"
      tabIndex="0"
      ref={menuDiv}
      onClick={() => {
        if (inputEl && inputEl.current) inputEl.current.focus();
      }}
    >
      <button
        className={
          "btn btn-sm btn-block btn-ghost " + (isSaving ? "loading" : "")
        }
      >
        <div className="flex-1 text-left">{title}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="dropdown-content shadow-lg bg-base-300 rounded w-56 p-4 mt-1">
        <div className="form-control mb-2">
          <input
            data-test="assignee_search"
            name="search"
            type="text"
            placeholder="Search By Address"
            autoComplete="off"
            ref={inputEl}
            value={searchAddress}
            onKeyUp={async (e) => {
              const val = e.target.value;
              if (await validateUserAddress(val)) {
                setNewAssignees([...newAssignees, val]);
                setCheckMap({ ...checkMap, [val]: true });
                setSearchAddress("");
              }
            }}
            onChange={(e) => {
              setSearchAddress(e.target.value);
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
        <div className="max-h-60 overflow-auto">
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
                <label className="cursor-pointer label justify-start">
                  <input
                    type="checkbox"
                    checked={checkMap[c]}
                    onChange={() => {
                      setCheckMap({ ...checkMap, [c]: !checkMap[c] });
                    }}
                    className="checkbox checkbox-sm mr-2"
                  />
                  <span className="label-text">{shrinkAddress(c)}</span>
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
                <label className="cursor-pointer label justify-start">
                  <input
                    type="checkbox"
                    checked={checkMap[a]}
                    onChange={() => {
                      setCheckMap({ ...checkMap, [a]: !checkMap[a] });
                    }}
                    className="checkbox checkbox-sm mr-2"
                  />
                  <span className="label-text">{shrinkAddress(a)}</span>
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex w-full mt-2 btn-group">
          <a
            className="btn btn-sm flex-1"
            onClick={() => {
              resetAssignees();
              if (menuDiv.current) {
                menuDiv.current.blur();
              }
            }}
          >
            Cancel
          </a>
          <button
            className={
              "btn btn-sm btn-primary flex-1 " + (isSaving ? "loading" : "")
            }
            data-test="assignee_save"
            onClick={(e) => {
              updateAssignees();
              if (menuDiv.current) {
                menuDiv.current.blur();
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
  );
}

export default AssigneeSelector;
