import TextInput from "../textInput";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { updateMember, removeMember } from "../../store/actions/organization";
import getUser from "../../helpers/getUser";
import shrinkAddress from "../../helpers/shrinkAddress";

function MembersList({ orgId, members = [], refreshOrganization, ...props }) {
  const [collabAddress, setCollabAddress] = useState("");
  const [collabHint, setCollabHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [collabRole, setCollabRole] = useState("MEMBER");
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  console.log("collabs", members);

  const validateMember = async () => {
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
  const addMember = async () => {
    setIsAdding(true);
    if (await validateMember()) {
      const res = await props.updateMember({
        id: orgId,
        user: collabAddress,
        role: collabRole,
      });
      console.log(res);
    }
    if (refreshOrganization) await refreshOrganization();
    setIsAdding(false);
  };

  const removeMember = async (address, index) => {
    setIsRemoving(index);
    await props.removeMember({ id: orgId, user: address });
    if (refreshOrganization) await refreshOrganization();
    setIsRemoving(false);
  };

  return (
    <table className="table w-full">
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
                    className="link link-primary text-sm no-underline hover:underline"
                  >
                    {shrinkAddress(c.id)}
                  </a>
                </div>
              </div>
            </td>
            <td className="text-sm">{c.role}</td>
            <td>
              <button
                className={
                  "btn btn-sm btn-accent btn-outline btn-block " +
                  (isRemoving === i ? "loading" : "")
                }
                disabled={isRemoving === i}
                onClick={() => removeMember(c.id, i)}
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
  updateMember,
  removeMember,
})(MembersList);
