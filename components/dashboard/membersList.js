import TextInput from "../textInput";
import { useState } from "react";
import { connect } from "react-redux";
import {
  addMember,
  removeMember,
  updateMemberRole,
} from "../../store/actions/dao";
import getUser from "../../helpers/getUser";
import shrinkAddress from "../../helpers/shrinkAddress";
import { notify } from "reapop";
import AccountCard from "../account/card";
import { useApiClient } from "../../context/ApiClientContext";

function MembersList({ daoId, members = [], refreshDao, ...props }) {
  const [collabAddress, setCollabAddress] = useState("");
  const [collabHint, setCollabHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [collabRole, setCollabRole] = useState("MEMBER");
  const [updatedCollabRole, setUpdatedCollabRole] = useState(collabRole);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [startUpdate, setStartUpdate] = useState("");
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const validateMember = async () => {
    setCollabHint({
      shown: false,
      type: "error",
      message: "",
    });
    const res = await getUser(apiClient, collabAddress);
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
  const addMember = async () => {
    setIsAdding(true);
    if (await validateMember()) {
      const res = await props.addMember(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          daoId: daoId,
          userId: collabAddress,
          role: collabRole,
        }
      );
      if (refreshDao) await refreshDao();
      setCollabAddress("");
      setCollabHint({
        shown: false,
        type: "error",
        message: "",
      });
    }
    setIsAdding(false);
  };

  const removeMember = async (address, index) => {
    setIsRemoving(index);
    await props.removeMember(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      { daoId: daoId, userId: address }
    );
    if (refreshDao) await refreshDao();
    setIsRemoving(false);
  };

  const updateCollaborator = async (address, role, index) => {
    setIsUpdating(index);
    await props.updateMemberRole(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      {
        daoId: daoId,
        userId: address,
        role: role,
      }
    );
    if (refreshDao) await refreshDao();
    setIsUpdating(false);
  };

  return (
    <table className="table sm:w-full min-h-fit">
      <thead>
        <tr>
          <th>Member</th>
          <th className="w-36">Role</th>
          <th className="w-56">Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map((c, i) => (
          <tr key={"member" + i}>
            <td className="text-sm">
              <AccountCard
                id={c.address}
                showAvatar={true}
                avatarSize="xs"
                dataTest="mem_address"
              />
            </td>
            {startUpdate === c.id ? (
              <td style={{ verticalAlign: "top" }}>
                <select
                  className={
                    "select select-bordered w-full select-sm focus:outline-none focus:border-type " +
                    (updatedCollabRole?.length > 0 ? "border-green" : "")
                  }
                  value={updatedCollabRole}
                  onChange={(e) => setUpdatedCollabRole(e.target.value)}
                  data-test="member_role"
                >
                  <option value="MEMBER">Member</option>
                  <option value="OWNER">Owner</option>
                </select>
              </td>
            ) : (
              <td className="text-sm">{c.role}</td>
            )}
            <td>
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
                        updateCollaborator(
                          c.address,
                          updatedCollabRole,
                          i
                        ).then((res) => {
                          if (res) {
                            props.notify("Updated member role", "info");
                          }
                          setStartUpdate(false);
                        })
                      }
                    >
                      Update
                    </button>
                    <button
                      className={"btn btn-sm btn-outline btn-block w-24 mr-2 "}
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
                      onClick={() => removeMember(c.address, i)}
                      data-test="remove"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
        <tr>
          <td>
            <TextInput
              value={collabAddress}
              name="user address"
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
              className={
                "select select-bordered w-full select-sm focus:outline-none focus:border-type " +
                (collabRole.length > 0 ? "border-green" : "")
              }
              value={collabRole}
              onChange={(e) => setCollabRole(e.target.value)}
              data-test="member_role"
            >
              <option value="MEMBER">Member</option>
              <option value="OWNER">Owner</option>
            </select>
          </td>
          <td style={{ verticalAlign: "top" }}>
            <button
              className={
                "btn btn-sm btn-outline btn-block " +
                (isAdding ? "loading" : "")
              }
              data-test="add"
              onClick={addMember}
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
  addMember,
  removeMember,
  updateMemberRole,
  notify,
})(MembersList);
