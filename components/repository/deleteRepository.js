import { useState } from "react";
import { connect } from "react-redux";
import { deleteRepository } from "../../store/actions/repository";

function DeleteRepository({
  repoName = "",
  currentOwnerId = "",
  onSuccess,
  ...props
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center">
      <div className="flex-1 mr-8">
        <div className="label-text">Delete Repository</div>
        <div className="label-text-alt text-type-secondary">
          Delete repository and all its content
        </div>
      </div>
      <div className="flex-none w-48">
        <button
          className="btn btn-sm btn-block btn-accent btn-outline"
          onClick={() => setConfirmDelete(true)}
        >
          Delete
        </button>
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

                props
                  .deleteRepository({
                    repoOwnerId: currentOwnerId,
                    repositoryName: repoName,
                  })
                  .then(async (res) => {
                    if (res.code == 0) {
                      if (onSuccess) await onSuccess;
                      setConfirmDelete(false);
                      setIsDeleting(false);
                    }
                  });
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

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  deleteRepository,
})(DeleteRepository);
