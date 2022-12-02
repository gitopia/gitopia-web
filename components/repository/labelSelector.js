import { useEffect, useState, useRef } from "react";
import getIssueAllLabels from "../../helpers/getIssueAllLabels";
import Label from "./label";
import Link from "next/link";

function LabelSelector({
  onChange,
  labels = [],
  repoLabels = [],
  editLabels = "",
  ...props
}) {
  const menuDiv = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [checkMap, setCheckMap] = useState({});

  const updateLabels = async () => {
    setIsSaving(true);
    const list = [];
    repoLabels.map((l) => {
      if (checkMap[l.id]) list.push(l.id);
    });
    if (onChange) await onChange(list);
    await resetLabels();
    setIsSaving(false);
  };

  const resetLabels = () => {
    const newCheckMap = {};
    repoLabels.map((l) => {
      newCheckMap[l.id] = labels.includes(l.id);
    });
    setCheckMap(newCheckMap);
  };

  useEffect(resetLabels, [repoLabels, labels]);

  return (
    <div className={"dropdown dropdown-end w-full"} tabIndex="0" ref={menuDiv}>
      <button
        className={
          "btn btn-sm btn-block btn-ghost " + (isSaving ? "loading" : "")
        }
      >
        <div className="flex-1 text-left">Labels</div>
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
        <div className="mb-2">
          <Link href={editLabels} className="btn btn-block btn-ghost btn-sm">
            Edit Labels
          </Link>
        </div>
        <div className="max-h-60 overflow-auto">
          {repoLabels.map((l, i) => {
            return (
              <div className="form-control" key={"label" + i}>
                <label className="cursor-pointer label justify-start">
                  <input
                    type="checkbox"
                    checked={checkMap[l.id]}
                    onChange={() => {
                      let newCheckMap = { ...checkMap };
                      newCheckMap[l.id] = !newCheckMap[l.id];
                      setCheckMap(newCheckMap);
                    }}
                    className="checkbox checkbox-sm mr-2"
                  />
                  <Label color={l.color} name={l.name} />
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex w-full mt-2 btn-group">
          <a
            className="btn btn-sm flex-1"
            onClick={async () => {
              await resetLabels();
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
            onClick={() => {
              updateLabels();
              if (menuDiv.current) {
                menuDiv.current.blur();
              }
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

export default LabelSelector;
