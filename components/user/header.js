import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getUserDetailsForSelectedAddress } from "../../store/actions/user";
import { notify } from "reapop";
import AccountAvatar from "../account/avatar";
import UserBio from "./bio";
import UserName from "./name";
import UserUsername from "./username";

function UserHeader(props) {
  const [isEditable, setIsEditable] = useState(false);

  const refresh = async (updatedUserName) => {
    await props.refresh(updatedUserName);
    await props.getUserDetailsForSelectedAddress();
  };

  useEffect(() => {
    setIsEditable(props.user.creator === props.selectedAddress);
  }, [props.user.creator, props.selectedAddress]);

  return (
    <div className="flex flex-col sm:flex-row mb-8 items-start">
      <AccountAvatar
        user={props.user}
        isEditable={isEditable}
        refresh={refresh}
      />
      <div className="flex-1 text-md sm:pl-12 w-full max-w-2xl">
        <UserName user={props.user} isEditable={isEditable} refresh={refresh} />
        <div className="text-type-secondary mb-4">
          <UserUsername
            user={props.user}
            isEditable={isEditable}
            refresh={refresh}
          />
          <span className="mr-2 hidden sm:inline">&middot;</span>
          <a
            href={
              process.env.NEXT_PUBLIC_EXPLORER_URL +
              "/accounts/" +
              props.user.creator
            }
            target="_blank"
            rel="noreferrer"
            className="inline-block sm:inline link no-underline hover:link-primary text-type-secondary w-80 sm:w-full overflow-hidden break-words"
          >
            {props.user.creator}
          </a>
        </div>
        <UserBio user={props.user} isEditable={isEditable} refresh={refresh} />
      </div>
      {/* <div className="form-control flex justify-end">
        <label className="label cursor-pointer">
          <span className="text-xs text-type-secondary label-text mr-2">
            Edit Profile
          </span>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary"
            checked={isEditable}
            onClick={(e) => {
              setIsEditable(e.target.checked);
            }}
          />
        </label>
      </div> */}
      {/* <div className="text-xl">DAOs</div>
        <div className="flex mt-4">
          {user.organizations.length > 0 ? (
            user.organizations.map((dao) => {
              return (
                <div className="flex" key={dao.id}>
                  <div className="avatar flex-none mr-2 items-center">
                    <div className={"w-8 h-8 rounded-full"}>
                      <img
                        src={
                          "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                          dao.name.slice(0)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-type-secondary text-xs font-semibold">---</div>
          )}
        </div> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  getUserDetailsForSelectedAddress,
  notify,
})(UserHeader);
