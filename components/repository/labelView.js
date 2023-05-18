import { useState } from "react";
import Label from "./label";
import LabelEditor from "./labelEditor";

function LabelView({
  label,
  repoOwner,
  repoName,
  onDelete,
  refreshLabels,
  ...props
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div key={"label" + label.id} className="p-4" data-test="label">
      {isEditing ? (
        <LabelEditor
          isEdit={true}
          initialLabel={label}
          repoOwner={repoOwner}
          repoName={repoName}
          labelId={label.id}
          onSuccess={async (l) => {
            console.log(l);
            if (refreshLabels) await refreshLabels();
            setIsEditing(false);
          }}
          onCancel={() => {
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="flex items-center">
          <div className="flex-none mr-2 sm:mr-0 sm:w-64">
            <Label color={label.color} name={label.name} />
          </div>
          <div className="flex-1 text-sm sm:text-base">{label.description}</div>
          <div className="flex-none text-sm sm:text-base w-10 sm:w-20 sm:mr-2">
            <button
              className={"btn btn-sm btn-ghost btn-block "}
              onClick={() => {
                setIsEditing(true);
              }}
              data-test="edit_label"
            >
              Edit
            </button>
          </div>
          <div className="flex-none text-sm sm:text-base w-10 sm:w-20">
            <button
              className={"btn btn-sm btn-ghost btn-block "}
              onClick={() => {
                setConfirmDelete(true);
              }}
              data-test="delete_label"
            >
              Delete
            </button>
          </div>
        </div>
      )}
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
                  labelId: l.id,
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

export default LabelView;
