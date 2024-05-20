import { useEffect, useState, useRef } from "react";
import Label from "./label";
import LabelEditor from "./labelEditor";
import { deleteRepositoryLabel } from "../../store/actions/repository";
import { connect } from "react-redux";
import { notify } from "reapop";
import { useApiClient } from "../../context/ApiClientContext";

function LabelSelector({
  onChange,
  labels = [],
  repository,
  refreshRepository,
  ...props
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [checkMap, setCheckMap] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [labelId, setLabelId] = useState(null);
  const labelsModal = useRef();
  const { apiClient } = useApiClient();

  const updateLabels = async () => {
    setIsSaving(true);
    const list = [];
    repository?.labels.map((l) => {
      if (checkMap[l.id]) list.push(l.id);
    });
    if (onChange) await onChange(list);
    setIsSaving(false);
  };

  const resetLabels = () => {
    const newCheckMap = {};
    repository?.labels.map((l) => {
      newCheckMap[l.id] = labels.includes(l.id);
    });
    setCheckMap(newCheckMap);
  };

  useEffect(resetLabels, [labels]);

  return (
    <div className={"w-full"}>
      <div className="flex">
        <label
          className={
            "btn btn-ghost btn-sm btn-block modal-button " +
            (isSaving ? "loading" : "")
          }
          data-test="labels"
          htmlFor="label-modal"
          onClick={() => {
            if (!repository?.labels?.length) {
              setCreating(true);
            }
          }}
        >
          <div className="flex-1 text-left">Labels</div>

          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            stroke="currentColor"
          >
            <path
              d="M16.0553 6.7982L20.2338 11.908C20.3203 12.0138 20.3676 12.1463 20.3676 12.283V23.3363C20.3676 23.6634 20.1024 23.9286 19.7752 23.9286H11.4182C11.0911 23.9286 10.8258 23.6634 10.8258 23.3363L10.8258 12.283C10.8258 12.1463 10.8731 12.0138 10.9596 11.908L15.1381 6.7982C15.3751 6.50836 15.8183 6.50835 16.0553 6.7982Z"
              strokeWidth="1.8"
            />
            <circle cx="15.6716" cy="12.9305" r="1.81331" fill="currentColor" />
            <path d="M22.9107 8.64216C23.4647 9.00242 23.8316 9.47334 23.9798 10.0117C24.128 10.55 24.0533 11.1404 23.7607 11.7298C23.4685 12.3183 22.9686 12.8865 22.3061 13.3829C21.6436 13.8793 20.8394 14.2884 19.9662 14.5731C19.093 14.8578 18.1782 15.0092 17.3044 15.0136C16.4306 15.0181 15.6255 14.8754 14.9616 14.5986L15.5766 13.1239C16.0056 13.3029 16.5916 13.4195 17.2963 13.4159C17.9963 13.4124 18.7469 13.2901 19.4709 13.054C20.1958 12.8177 20.84 12.485 21.348 12.1043C21.8611 11.7198 22.1735 11.3337 22.3296 11.0193C22.4791 10.7181 22.4658 10.5319 22.4394 10.4357C22.4127 10.3387 22.3271 10.1685 22.0397 9.98163C21.2122 9.44357 19.8477 9.35892 18.8917 9.42736L17.774 7.99178C19.357 7.74635 21.5153 7.7348 22.9107 8.64216Z" />
          </svg>
        </label>
      </div>

      <input
        type="checkbox"
        id="label-modal"
        className="modal-toggle"
        ref={labelsModal}
      />
      <div className="modal">
        <div className="modal-box shadow-lg bg-[#28313B] rounded mt-1">
          <div className="flex">
            <div className="text-type-primary text-lg font-bold">Labels</div>
            <label
              htmlFor="label-modal"
              className="btn btn-circle btn-sm btn-ghost ml-auto"
              onClick={async () => {
                await resetLabels();
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
          <div className="mt-4 divide-y divide-grey">
            {repository?.labels?.map((l, i) => {
              return l.id === editing ? (
                <div className="bg-grey-900 mr-2 px-2 py-1 rounded-lg border-t border-[#3E4051]">
                  <LabelEditor
                    isEdit={true}
                    initialLabel={l}
                    repoOwner={repository?.owner?.id}
                    repoName={repository?.name}
                    labelId={l.id}
                    onSuccess={async (l) => {
                      await refreshRepository();
                      await updateLabels();
                      setEditing(null);
                      props.notify("Label updated", "info");
                    }}
                    onCancel={async () => {
                      setEditing(null);
                      await resetLabels();
                    }}
                    className="checkbox checkbox-sm ml-4 mr-2"
                  />
                </div>
              ) : (
                <div className="form-control" key={"label" + i}>
                  <label
                    className="cursor-pointer label justify-start hover:bg-[#1A2028] rounded-md"
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
                      className="checkbox checkbox-sm ml-2 mr-2"
                    />
                    <div className="flex-1">
                      <Label color={l.color} name={l.name} />
                    </div>
                    <button
                      className="btn btn-square btn-xs mr-2"
                      onClick={() => {
                        setEditing(l.id);
                      }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
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
                    </button>
                    <button
                      className="btn btn-square btn-xs mr-2"
                      onClick={() => {
                        setConfirmDelete(true);
                        setLabelId(l.id);
                      }}
                      disabled={labels.includes(l.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        stroke="currentColor"
                      >
                        <rect
                          x="6"
                          y="9"
                          width="12"
                          height="12"
                          strokeWidth="2"
                        />
                        <rect x="5.5" y="4.5" width="13" height="1" />
                        <rect x="9.5" y="2.5" width="5" height="1" />
                        <rect
                          x="10.5"
                          y="12.5"
                          width="5"
                          height="1"
                          transform="rotate(90 10.5 12.5)"
                        />
                        <rect
                          x="14.5"
                          y="12.5"
                          width="5"
                          height="1"
                          transform="rotate(90 14.5 12.5)"
                        />
                      </svg>
                    </button>
                  </label>
                </div>
              );
            })}
          </div>
          {!creating ? (
            <div className="flex mt-4 ml-1">
              <label
                className={
                  "link text-xs uppercase no-underline font-bold text-green "
                }
                onClick={() => {
                  setCreating(true);
                }}
              >
                Create New Label
              </label>
            </div>
          ) : (
            ""
          )}
          <div
            className={
              "bg-grey-900 shadow-xl rounded-lg transition-all" +
              (creating
                ? " mt-4 h-72 opacity-100"
                : " h-0 opacity-0 pointer-events-none overflow-hidden")
            }
          >
            <LabelEditor
              repoOwner={repository?.owner?.id}
              repoName={repository?.name}
              onSuccess={async (label) => {
                await new Promise((resolve, reject) =>
                  setTimeout(async () => {
                    await refreshRepository();
                    await updateLabels();
                    setCreating(false);
                    props.notify("Label created", "info");
                    resolve();
                  }, 2000)
                );
              }}
              onCancel={async () => {
                setCreating(false);
                await resetLabels();
              }}
            />
          </div>
          <div className="flex justify-center mt-2 mb-4 mt-4 modal-action">
            <button
              className={
                "btn btn-primary btn-block flex-1 uppercase " +
                (isSaving ? "loading" : "")
              }
              onClick={async () => {
                await updateLabels();
                if (labelsModal?.current) {
                  labelsModal.current.checked = false;
                }
              }}
              disabled={isSaving || creating}
              data-test="save_label"
            >
              Save
            </button>
          </div>
        </div>
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
                const res = await props.deleteRepositoryLabel(apiClient, {
                  repoOwner: repository?.owner?.id,
                  repoName: repository?.name,
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
