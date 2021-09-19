import { useState } from "react";
import Label from "./label";
import LabelEditor from "./labelEditor";

function LabelView({ label, repoId, onDelete, refreshLabels, ...props }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div key={"label" + label.id} className="p-4">
      {isEditing ? (
        <LabelEditor
          isEdit={true}
          initialLabel={label}
          repoId={repoId}
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
        <div className="flex">
          <div className="flex-none w-64">
            <Label color={label.color} name={label.name} />
          </div>
          <div className="flex-1">{label.description}</div>
          <div className="flex-none w-20 mr-2">
            <button
              className={"btn btn-sm btn-ghost btn-block "}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              Edit
            </button>
          </div>
          <div className="flex-none w-20">
            <button
              className={"btn btn-sm btn-ghost btn-block "}
              onClick={() => {
                setConfirmDelete(true);
              }}
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
                if (onDelete) await onDelete(label.id);
                setConfirmDelete(false);
                setIsDeleting(false);
              }}
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
