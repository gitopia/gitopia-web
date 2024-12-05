import TextInput from "../textInput";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  updateCollaborator,
  removeCollaborator,
  updateDaoRepositoryCollaborator,
  removeDaoRepositoryCollaborator,
} from "../../store/actions/repository";
import getUser from "../../helpers/getUser";
import getDao from "../../helpers/getDao";
import { notify } from "reapop";
import AccountCard from "../account/card";
import { useApiClient } from "../../context/ApiClientContext";

function CollaboratorsList({
  repoOwnerId,
  repoName,
  collaborators = [],
  refreshRepository,
  repository,
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
  const [daoData, setDaoData] = useState(null);
  const {
    apiClient,
    cosmosBankApiClient,
    cosmosFeegrantApiClient,
    cosmosGroupApiClient,
  } = useApiClient();

  const isDAORepository = repository?.owner?.type === "DAO";

  // Fetch DAO data including config when component mounts
  useEffect(() => {
    const fetchDaoData = async () => {
      if (isDAORepository) {
        try {
          const daoData = await getDao(apiClient, repository.owner.id);
          setDaoData(daoData);
        } catch (error) {
          console.error("Error fetching DAO:", error);
        }
      }
    };

    fetchDaoData();
  }, [repository?.owner]);

  const requiresProposal =
    isDAORepository && daoData?.config?.require_collaborator_proposal;

  const validateCollaborator = async () => {
    const res = await getUser(apiClient, collabAddress);
    if (!res) {
      setCollabHint({
        shown: true,
        type: "error",
        message: "User doesn't exist",
      });
      return false;
    }
    return true;
  };

  const handleAddCollaborator = async () => {
    setIsAdding(true);
    if (await validateCollaborator()) {
      if (isDAORepository && requiresProposal) {
        // Get DAO info to get group ID
        const dao = await getDao(apiClient, repository.owner.id);
        if (!dao) {
          props.notify("Failed to fetch DAO info", "error");
          setIsAdding(false);
          return;
        }

        const result = await props.updateDaoRepositoryCollaborator(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          cosmosGroupApiClient,
          {
            repositoryId: {
              id: repoOwnerId,
              name: repoName,
            },
            user: collabAddress,
            role: collabRole,
            groupId: daoData.group_id,
          }
        );

        if (result?.proposalId) {
          // props.notify(
          //   `Collaborator add proposal #${result.proposalId} created`,
          //   "info"
          // );
        }
      } else {
        await props.updateCollaborator(
          apiClient,
          cosmosBankApiClient,
          cosmosFeegrantApiClient,
          {
            repoName: repoName,
            repoOwner: repoOwnerId,
            user: collabAddress,
            role: collabRole,
          }
        );
      }
    }
    if (refreshRepository) await refreshRepository();
    setCollabAddress("");
    setIsAdding(false);
  };

  const handleUpdateCollaborator = async (address, role, index) => {
    setIsUpdating(index);

    if (requiresProposal) {
      if (!daoData) {
        props.notify("Failed to fetch DAO info", "error");
        setIsUpdating(false);
        return;
      }

      const result = await props.updateDaoRepositoryCollaborator(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        cosmosGroupApiClient,
        {
          repositoryId: {
            id: repoOwnerId,
            name: repoName,
          },
          user: address,
          role: role,
          groupId: daoData.groupId,
        }
      );

      if (result?.proposalId) {
        // props.notify(
        //   `Collaborator update proposal #${result.proposalId} created`,
        //   "info"
        // );
      }
    } else {
      await props.updateCollaborator(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          repoName: repoName,
          repoOwner: repoOwnerId,
          user: address,
          role: role,
        }
      );
      props.notify("Updated collaborator role", "info");
    }

    if (refreshRepository) await refreshRepository();
    setIsUpdating(false);
  };

  const handleRemoveCollaborator = async (address, index) => {
    setIsRemoving(index);

    if (requiresProposal) {
      if (!daoData) {
        props.notify("Failed to fetch DAO info", "error");
        setIsRemoving(false);
        return;
      }

      const result = await props.removeDaoRepositoryCollaborator(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        cosmosGroupApiClient,
        {
          repositoryId: {
            id: repoOwnerId,
            name: repoName,
          },
          user: address,
          groupId: daoData.group_id,
        }
      );

      if (result?.proposalId) {
        // props.notify(
        //   `Collaborator removal proposal #${result.proposalId} created`,
        //   "info"
        // );
      }
    } else {
      await props.removeCollaborator(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          repoName: repoName,
          repoOwner: repoOwnerId,
          user: address,
        }
      );
      props.notify("Removed collaborator", "info");
    }

    if (refreshRepository) await refreshRepository();
    setIsRemoving(false);
  };

  return (
    <div className="">
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
              <td>
                <AccountCard id={c.id} showAvatar={true} avatarSize="xs" />
              </td>
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
                            handleUpdateCollaborator(
                              c.id,
                              updatedCollabRole,
                              i
                            ).then(() => setStartUpdate(false))
                          }
                        >
                          {requiresProposal ? "Propose" : "Update"}
                        </button>
                        <button
                          className={
                            "btn btn-sm btn-outline btn-block w-24 mr-2"
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
                            "btn btn-sm btn-accent btn-outline btn-block w-24 mr-2"
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
                          onClick={() => handleRemoveCollaborator(c.id, i)}
                          data-test="remove"
                        >
                          {requiresProposal ? "Propose Remove" : "Remove"}
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
                onClick={handleAddCollaborator}
                disabled={collabAddress.trim() === "" || isAdding}
                data-test="add"
              >
                {isDAORepository && requiresProposal ? "Propose Add" : "Add"}
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
  updateDaoRepositoryCollaborator,
  removeDaoRepositoryCollaborator,
  notify,
})(CollaboratorsList);
