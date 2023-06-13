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
  const [typedData, setTypedData] = useState("");

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
          disabled={true}
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
          <p>
            This is a non-reversible action and all the associated issues, pull
            requests, etc will be permanently deleted from Gitopia.
          </p>
          <div className="mt-0.5 inline-block whitespace-nowrap overflow-hidden text-ellipsis">
            <div className="inline-block whitespace-normal">
              Please type&nbsp;
              <div className="font-bold inline">
                {currentOwnerId}/{repoName}
              </div>
              &nbsp;to confirm deletion.
            </div>
          </div>
          <input
            type="text"
            className={
              "input input-lg input-bordered text-xs h-8 focus:outline-none focus:border-type mt-4 " +
              (typedData.length > 0 ? "border-green" : "")
            }
            value={typedData}
            onChange={(e) => {
              setTypedData(e.target.value);
            }}
          />

          <div className="modal-action">
            <label
              className="btn btn-sm"
              onClick={() => {
                setConfirmDelete(false);
                setIsDeleting(false);
                setTypedData("");
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
                    ownerId: currentOwnerId,
                    name: repoName,
                  })
                  .then(async (res) => {
                    if (res.code == 0) {
                      if (onSuccess) await onSuccess;
                      setConfirmDelete(false);
                      setIsDeleting(false);
                      setTypedData("");
                    }
                  });
              }}
              disabled={
                typedData !== (currentOwnerId + "/" + repoName).toString()
              }
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
