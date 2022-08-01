import shrinkAddress from "../../helpers/shrinkAddress";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import {
  updateUserBio,
  updateUserAvatar,
  getUserDetailsForSelectedAddress,
} from "../../store/actions/user";
import { notify } from "reapop";
import { useEffect } from "react";
import UserAvatar from "./avatar";
import UserBio from "./bio";
import UserName from "./name";
import UserUsername from "./username";

function UserHeader(props) {
  const [isEditable, setIsEditable] = useState(false);

  const refresh = async () => {
    await props.refresh();
    await props.getUserDetailsForSelectedAddress();
  };

  useEffect(() => {
    setIsEditable(props.user.creator === props.selectedAddress);
  }, [props.user.creator, props.selectedAddress]);

  return (
    <div className="flex flex-1 mb-8">
      <UserAvatar user={props.user} isEditable={isEditable} refresh={refresh} />
      <div className="flex flex-1 text-md items-start">
        <div className="pl-12">
          <UserName
            user={props.user}
            isEditable={isEditable}
            refresh={refresh}
          />
          <div className="text-type-secondary mb-2">
            <UserUsername
              user={props.user}
              isEditable={isEditable}
              refresh={refresh}
            />
            &middot;
            <span className="ml-2">{props.user.creator}</span>
          </div>
          <UserBio
            user={props.user}
            isEditable={isEditable}
            refresh={refresh}
          />
        </div>
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
  updateUserAvatar,
  updateUserBio,
  getUserDetailsForSelectedAddress,
  notify,
})(UserHeader);
