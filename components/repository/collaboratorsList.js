import TextInput from "../textInput";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  updateCollaborator,
  removeCollaborator,
} from "../../store/actions/repository";
import getUser from "../../helpers/getUser";

function CollaboratorsList({
  repoId,
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
  const [collabRole, setCollabRole] = useState("READ");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  console.log("collabs", collaborators);

  const validateCollaborator = async () => {
    const res = await getUser(collabAddress);
    console.log(res);

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
        id: repoId,
        user: collabAddress,
        role: collabRole,
      });
      console.log(res);
    }
    if (refreshRepository) await refreshRepository();
    setIsAdding(false);
  };

  const removeCollaborator = async (address, index) => {
    setIsRemoving(index);
    await props.removeCollaborator({ id: repoId, user: address });
    if (refreshRepository) await refreshRepository();
    setIsRemoving(false);
  };

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Collaborator</th>
          <th className="w-36">Role</th>
          <th className="w-56">Actions</th>
        </tr>
      </thead>
      <tbody>
        {collaborators.map((c, i) => (
          <tr key={"collaborator" + i}>
            <td className="text-sm">{c.id}</td>
            <td className="text-sm">{c.permission}</td>
            <td>
              <button
                className={
                  "btn btn-sm btn-accent btn-outline btn-block " +
                  (isRemoving === i ? "loading" : "")
                }
                disabled={isRemoving === i}
                onClick={() => removeCollaborator(c.id, i)}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <TextInput
              value={collabAddress}
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
              className="select select-bordered w-full select-sm"
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
            >
              Add
            </button>
          </td>
        </tr>
      </tbody>
    </table>
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
})(CollaboratorsList);
