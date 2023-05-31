import { useEffect, useState, useRef } from "react";
import Label from "./label";
import LabelEditor from "./labelEditor";
import useRepository from "../../hooks/useRepository";
import { deleteRepositoryLabel } from "../../store/actions/repository";
import { connect } from "react-redux";
import { notify } from "reapop";

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
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [labelId, setLabelId] = useState(null);

  const updateLabels = async () => {
    setIsSaving(true);
    const list = [];
    repository.labels.map((l) => {
      if (checkMap[l.id]) list.push(l.id);
    });
    if (onChange) await onChange(list);
    await resetLabels();
    setIsSaving(false);
  };

  const resetLabels = () => {
    const newCheckMap = {};
    repository.labels.map((l) => {
      newCheckMap[l.id] = labels.includes(l.id);
    });
    setCheckMap(newCheckMap);
  };

  useEffect(resetLabels, [repository, labels]);

  return (
    <div className={"dropdown dropdown-end w-full"} tabIndex="0" ref={menuDiv}>
      <div className="flex ml-4">
        <div className="flex-1 text-left">Labels</div>
        <label
          className={
            "link modal-button text-xs uppercase no-underline font-bold text-[#29B7E4] " +
            (isSaving ? "loading" : "")
          }
          data-test="labels"
          htmlFor="label-modal"
        >
          ADD / REMOVE
        </label>
      </div>

      <input type="checkbox" id="label-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box shadow-lg bg-[#28313B] rounded mt-1">
          <div className="flex">
            <div className="text-type-primary uppercase text-sm font-bold">
              Attach Label
            </div>
            <label
              htmlFor="label-modal"
              className="btn btn-circle btn-sm btn-ghost ml-auto"
              onClick={async () => {
                await resetLabels();
                if (menuDiv.current) {
                  menuDiv.current.blur();
                }
                setCreating(false);
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

          {creating ? (
            <div className="bg-grey-900 mr-2 px-2 py-1 rounded-lg mb-2 mt-5">
              <LabelEditor
                repoOwner={repository.owner.id}
                repoName={repository.name}
                onSuccess={async (label) => {
                  await refreshRepository();
                  console.log(repository);
                  await updateLabels();
                  props.notify("label updated", "info");
                }}
                onCancel={async () => {
                  setCreating(false);
                  await resetLabels();
                  if (menuDiv.current) {
                    menuDiv.current.blur();
                  }
                }}
              />
            </div>
          ) : (
            ""
          )}
          <div className="flex">
            {!creating ? (
              <label
                className={
                  "link text-xs uppercase no-underline font-bold text-green "
                }
                onClick={() => {
                  setCreating(true);
                }}
              >
                Create Label
              </label>
            ) : (
              ""
            )}
          </div>
          <div className="mt-5 max-h-60 overflow-auto">
            {repository.labels.map((l, i) => {
              return l.id === editing ? (
                <div className="bg-grey-900 mr-2 px-2 py-1 rounded-lg border-t border-[#3E4051]">
                  <LabelEditor
                    isEdit={true}
                    initialLabel={l}
                    repoOwner={repository.owner.id}
                    repoName={repository.name}
                    labelId={l.id}
                    onSuccess={async (l) => {
                      console.log(l);
                      await refreshRepository();
                      console.log(repository);
                      await updateLabels();
                      setEditing(null);
                      props.notify("label updated", "info");
                    }}
                    onCancel={async () => {
                      setEditing(null);
                      await resetLabels();
                      if (menuDiv.current) {
                        menuDiv.current.blur();
                      }
                    }}
                  />
                </div>
              ) : (
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-auto link text-xs uppercase no-underline"
                      onClick={() => {
                        setEditing(l.id);
                      }}
                    >
                      <path
                        d="M14.1211 4.22183L19.7779 9.87869L9.46424 20.1924L3.80738 20.1924L3.80738 14.5355L14.1211 4.22183Z"
                        stroke="#ADBECB"
                        strokeWidth="2"
                      />
                      <path
                        d="M15.1816 9.52515L11.6461 13.0607"
                        stroke="#ADBECB"
                        strokeWidth="2"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 link text-xs uppercase no-underline mr-2"
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
                        strokeWidth="2"
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
          <div className="flex justify-center mt-2 mb-4 mt-4 modal-action">
            <button
              className={
                "btn btn-primary btn-block flex-1 " +
                (isSaving ? "loading" : "")
              }
              htmlFor="label-modal"
              onClick={async () => {
                updateLabels();
                await resetLabels();
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
                  await refreshRepository();
                  console.log(repository);
                  await updateLabels();
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

export default connect(mapStateToProps, { deleteRepositoryLabel, notify })(
  LabelSelector
);
