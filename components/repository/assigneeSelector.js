import { useEffect, useState, useRef } from "react";
import shrinkAddress from "../../helpers/shrinkAddress";
import getUser from "../../helpers/getUser";
import ClickAwayListener from "react-click-away-listener";

function AssigneeSelector({ collaborators = [], assignees = [], onChange }) {
  const [newAssignees, setNewAssignees] = useState([]);
  const [validateAddressError, setValidateAddressError] = useState(null);
  const [checkMap, setCheckMap] = useState({});
  // const [menuOpen, setMenuOpen] = useState(false);
  const menuDiv = useRef(null);

  const validateUserAddress = async (address) => {
    if (
      assignees.includes(address) ||
      collaborators.includes(address) ||
      newAssignees.includes(address)
    ) {
      setCheckMap({ ...checkMap, [address]: true });
      setValidateAddressError("Address already present");
      return false;
    }
    if (address !== "") {
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
    for (let address in checkMap) {
      if (checkMap[address] && !list.includes(address)) list.push(address);
    }
    if (onChange) await onChange(list);
    setNewAssignees([]);
  };

  useEffect(() => {
    const newCheckMap = {};
    collaborators.map((c) => {
      if (checkMap[c] !== undefined) newCheckMap[c] = true;
    });
    assignees.map((a) => {
      if (checkMap[a] !== undefined) newCheckMap[a] = true;
    });
    setCheckMap(newCheckMap);
  }, [collaborators, assignees]);

  return (
    <div className={"dropdown dropdown-end w-full"} tabIndex="0" ref={menuDiv}>
      <button className="btn btn-sm btn-block btn-ghost">
        <div className="flex-1 text-left">Assignees</div>
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
      <div className="dropdown-content shadow bg-base-300 rounded w-56 p-2">
        <div className="form-control">
          <input
            name="search"
            type="text"
            placeholder="Search By Address"
            onKeyUp={async (e) => {
              if (e.code === "Enter") {
                if (await validateUserAddress(e.target.value)) {
                  setNewAssignees([...newAssignees, e.target.value]);
                  setCheckMap({ ...checkMap, [e.target.value]: true });
                  e.target.value = "";
                }
              } else {
                setValidateAddressError(null);
              }
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
        {newAssignees.map((a) => {
          return (
            <div className="form-control">
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
        {assignees.map((a) => {
          return (
            <div className="form-control">
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
        {collaborators.map((c) => {
          if (!assignees.includes(c))
            return (
              <div className="form-control">
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
        <div className="flex w-full mt-2 btn-group">
          <a
            className="btn btn-sm flex-1"
            onClick={() => {
              setNewAssignees([]);
              const newCheckMap = {};
              collaborators.map((c) => {
                newCheckMap[c] = true;
              });
              assignees.map((a) => {
                newCheckMap[a] = true;
              });
              setCheckMap(newCheckMap);
              if (menuDiv.current) {
                menuDiv.current.blur();
              }
            }}
          >
            Cancel
          </a>
          <a
            className="btn btn-sm btn-primary flex-1"
            onClick={() => {
              updateAssignees();
              if (menuDiv.current) {
                menuDiv.current.blur();
              }
            }}
          >
            Save
          </a>
        </div>
      </div>
    </div>
  );
}

export default AssigneeSelector;
