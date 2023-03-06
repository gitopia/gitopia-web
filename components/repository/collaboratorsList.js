import TextInput from "../textInput";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  updateCollaborator,
  removeCollaborator,
} from "../../store/actions/repository";
import getUser from "../../helpers/getUser";
import shrinkAddress from "../../helpers/shrinkAddress";
import { notify } from "reapop";

function CollaboratorsList({
  repoOwnerId,
  repoName,
  collaborators = [],
  refreshRepository,
  ...props
}) {
  const [collabAddress, setCollabAddress] = useState("");
  const [collabHint, setCollabHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [collabRole, setCollabRole] = useState("TRIAGE");
  const [updatedCollabRole, setUpdatedCollabRole] = useState(collabRole);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [startUpdate, setStartUpdate] = useState("");

  const validateCollaborator = async () => {
    const res = await getUser(collabAddress);
    if (!res) {
      setCollabHint({
        shown: true,
        type: "error",
        message: "User dosen't exist",
      });
      return false;
    }
    return true;
  };
  const addCollaborator = async () => {
    setIsAdding(true);
    if (await validateCollaborator()) {
      const res = await props.updateCollaborator({
        repoName: repoName,
        repoOwner: repoOwnerId,
        user: collabAddress,
        role: collabRole,
      });
    }
    if (refreshRepository) await refreshRepository();
    setCollabAddress("");
    setIsAdding(false);
  };

  const removeCollaborator = async (address, index) => {
    setIsRemoving(index);
    await props.removeCollaborator({
      repoName: repoName,
      repoOwner: repoOwnerId,
      user: address,
    });
    if (refreshRepository) await refreshRepository();
    setIsRemoving(false);
  };

  const updateCollaborator = async (address, role, index) => {
    setIsUpdating(index);
    await props.updateCollaborator({
      repoName: repoName,
      repoOwner: repoOwnerId,
      user: address,
      role: role,
    });
    if (refreshRepository) await refreshRepository();
    setIsUpdating(false);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table sm:w-full">
        <thead>
          <tr>
            <th>Collaborator</th>
            <th className="sm:w-36">Role</th>
            <th className="sm:w-56">Actions</th>
          </tr>
        </thead>
        <tbody>
          {collaborators.map((c, i) => (
            <tr key={"collaborator" + i}>
              <td className="text-sm">
                <div className="flex items-center">
                  <div className="avatar mr-2">
                    <div className="w-8 h-8 rounded-full">
                      <img
                        src={
                          "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                          c.id.slice(-1)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <a
                      href={"/" + c.id}
                      target="_blank"
                      rel="noreferrer"
                      className="link link-primary text-sm no-underline hover:underline"
                    >
                      {shrinkAddress(c.id)}
                    </a>
                  </div>
                </div>
              </td>{" "}
              {startUpdate === c.id ? (
                <td style={{ verticalAlign: "top" }}>
                  <select
                    data-test="permissions"
                    className={
                      "select select-bordered w-full select-sm focus:outline-none focus:border-type " +
                      (updatedCollabRole.length > 0 ? "border-green" : "")
                    }
                    value={updatedCollabRole}
                    onChange={(e) => setUpdatedCollabRole(e.target.value)}
                  >
                    <option value="READ">Read</option>
                    <option value="TRIAGE">Triage</option>
                    <option value="WRITE">Write</option>
                    <option value="MAINTAIN">Maintain</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              ) : (
                <td className="text-sm">{c.permission}</td>
              )}
              <td>
                {c.permission !== "CREATOR" ? (
                  <div>
                    {startUpdate === c.id ? (
                      <div>
                        <button
                          className={
                            "btn btn-sm btn-outline btn-block w-24 mr-2 " +
                            (isUpdating === i ? "loading" : "")
                          }
                          disabled={isUpdating === i}
                          onClick={() =>
                            updateCollaborator(c.id, updatedCollabRole, i).then(
                              () => {
                                props.notify("Updated member role", "info");
                                setStartUpdate(false);
                              }
                            )
                          }
                        >
                          Update
                        </button>
                        <button
                          className={
                            "btn btn-sm btn-outline btn-block w-24 mr-2 "
                          }
                          onClick={() => setStartUpdate(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          className={
                            "btn btn-sm btn-accent btn-outline btn-block w-24 mr-2 "
                          }
                          onClick={() => {
                            setStartUpdate(c.id);
                            setUpdatedCollabRole(c.permission);
                          }}
                        >
                          Update
                        </button>
                        <button
                          className={
                            "btn btn-sm btn-accent btn-outline btn-block w-24 " +
                            (isRemoving === i ? "loading" : "")
                          }
                          disabled={isRemoving === i}
                          onClick={() => removeCollaborator(c.id, i)}
                          data-test="remove"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <TextInput
                value={collabAddress}
                data-test="collab_address"
                placeholder="User address"
                setValue={(v) => {
                  setCollabAddress(v);
                  setCollabHint({ shown: false });
                }}
                hint={collabHint}
                size="sm"
              />
            </td>
            <td style={{ verticalAlign: "top" }}>
              <select
                data-test="permissions"
                className={
                  "select select-bordered w-full select-sm focus:outline-none focus:border-type " +
                  (collabRole.length > 0 ? "border-green" : "")
                }
                value={collabRole}
                onChange={(e) => setCollabRole(e.target.value)}
              >
                <option value="READ">Read</option>
                <option value="TRIAGE">Triage</option>
                <option value="WRITE">Write</option>
                <option value="MAINTAIN">Maintain</option>
                <option value="ADMIN">Admin</option>
              </select>
            </td>
            <td style={{ verticalAlign: "top" }}>
              <button
                className={
                  "btn btn-sm btn-outline btn-block " +
                  (isAdding ? "loading" : "")
                }
                onClick={addCollaborator}
                disabled={collabAddress.trim() === "" || isAdding}
                data-test="add"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  updateCollaborator,
  removeCollaborator,
  notify,
})(CollaboratorsList);
