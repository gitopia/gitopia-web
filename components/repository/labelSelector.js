import { useEffect, useState, useRef } from "react";
import getIssueAllLabels from "../../helpers/getIssueAllLabels";
import Label from "./label";
import Link from "next/link";
import LabelEditor from "./labelEditor";
import useRepository from "../../hooks/useRepository";
import { deleteRepositoryLabel } from "../../store/actions/repository";
import { connect } from "react-redux";

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
  const { repository, refreshRepository } = useRepository();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [labelId, setLabelId] = useState(null);

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
      <div className="flex ml-4">
        <div className="flex-1 text-left">Labels</div>
        <button
          className={
            "link text-xs uppercase no-underline font-bold text-[#29B7E4] " +
            (isSaving ? "loading" : "")
          }
          data-test="labels"
        >
          ADD / REMOVE
        </button>
      </div>
      <div className="dropdown-content shadow-lg bg-[#28313B] rounded w-96 mt-1">
        <div className="px-4 my-4">
          <LabelEditor
            repoOwner={repository.owner.id}
            repoName={repository.name}
            onSuccess={async (label) => {
              console.log(label);
              refreshRepository();
              //setIsAddingLabel(false);
            }}
          />
        </div>
        <div className="max-h-60 overflow-auto">
          {repoLabels.map((l, i) => {
            return (
              <div className="form-control" key={"label" + i}>
                <label
                  className="cursor-pointer label justify-start border-t border-[#3E4051] hover:bg-[#1A2028]"
                  data-test="select_label"
                >
                  <input
                    type="checkbox"
                    checked={checkMap[l.id]}
                    onChange={() => {
                      let newCheckMap = { ...checkMap };
                      newCheckMap[l.id] = !newCheckMap[l.id];
                      setCheckMap(newCheckMap);
                    }}
                    className="checkbox checkbox-sm ml-4 mr-2"
                  />
                  <Label color={l.color} name={l.name} />
                  <div className="mx-2 text-type-secondary text-xs">
                    {l.description}
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-auto link text-xs uppercase no-underline mr-2"
                    onClick={() => {
                      setConfirmDelete(true);
                      setLabelId(l.id);
                    }}
                  >
                    <rect
                      x="6"
                      y="9"
                      width="12"
                      height="12"
                      stroke="#ADBECB"
                      stroke-width="2"
                    />
                    <rect
                      x="5.5"
                      y="4.5"
                      width="13"
                      height="1"
                      stroke="#ADBECB"
                    />
                    <rect
                      x="9.5"
                      y="2.5"
                      width="5"
                      height="1"
                      stroke="#ADBECB"
                    />
                    <rect
                      x="10.5"
                      y="12.5"
                      width="5"
                      height="1"
                      transform="rotate(90 10.5 12.5)"
                      stroke="#ADBECB"
                    />
                    <rect
                      x="14.5"
                      y="12.5"
                      width="5"
                      height="1"
                      transform="rotate(90 14.5 12.5)"
                      stroke="#ADBECB"
                    />
                  </svg>
                </label>
              </div>
            );
          })}
        </div>
        <div className="flex mt-2 btn-group mb-4 mt-4 mx-4">
          <a
            className="btn btn-sm flex-1"
            onClick={async () => {
              await resetLabels();
              if (menuDiv.current) {
                menuDiv.current.blur();
              }
            }}
            data-test="cancel_label"
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
            data-test="save_label"
          >
            Save
          </button>
        </div>
      </div>

      <input
        type="checkbox"
        checked={confirmDelete}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <p>Are you sure ?</p>
          <div className="modal-action">
            <label
              className="btn btn-sm"
              onClick={() => {
                setConfirmDelete(false);
              }}
            >
              Cancel
            </label>
            <label
              className={
                "btn btn-sm btn-primary " + (isDeleting ? "loading" : "")
              }
              onClick={async () => {
                setIsDeleting(true);
                const res = await props.deleteRepositoryLabel({
                  repoOwner: repository.owner.id,
                  repoName: repository.name,
                  labelId: labelId,
                });
                if (res && res.code === 0) {
                  refreshRepository();
                }
                setConfirmDelete(false);
                setIsDeleting(false);
              }}
              data-test="del_label"
            >
              Delete
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
  };
};

export default connect(mapStateToProps, { deleteRepositoryLabel })(
  LabelSelector
);
