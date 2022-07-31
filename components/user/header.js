import shrinkAddress from "../../helpers/shrinkAddress";
import { useRouter } from "next/router";
import { useState } from "react";
import { connect } from "react-redux";
import { updateUserBio, updateUserAvatar } from "../../store/actions/user";
import { notify } from "reapop";
import getUser from "../../helpers/getUser";
import { useEffect } from "react";
import UserAvatar from "./avatar";
import UserBio from "./bio";
import UserName from "./name";
import UserUsername from "./username";

function UserHeader(props) {
  const router = useRouter();

  const [user, setUser] = useState({
    creator: "",
    repositories: [],
    organizations: [],
  });

  const [isEditable, setIsEditable] = useState(false);

  useEffect(async () => {
    const u = await getUser(router.query.userId);
    if (u) {
      setUser(u);
    } else {
      setErrorStatusCode(404);
    }
  }, [router.query.userId]);

  useEffect(() => {
    setIsEditable(user.creator === props.selectedAddress);
  }, [user.creator, props.selectedAddress]);

  const refresh = async () => {
    const u = await getUser(router.query.userId);
    if (u) {
      setUser(u);
    } else {
      setErrorStatusCode(404);
    }
  };
  return (
    <div className="flex flex-1 mb-8">
      <UserAvatar user={user} isEditable={isEditable} />
      <div className="flex flex-1 text-md items-start">
        <div className="pl-12">
          <UserName user={user} isEditable={isEditable} />
          <div className="text-type-secondary mb-2">
            <UserUsername user={user} isEditable={isEditable} />
            &middot;
            <span className="ml-2">{user.creator}</span>
          </div>
          <UserBio user={user} isEditable={isEditable} />
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
      {/*router.query.userId == props.selectedAddress ? (
          <div className="text-xs font-bold uppercase no-underline text-primary mt-20">
            EDIT PROFILE
          </div>
        ) : (
          ""
        )*/}
    </div>
  );
}

const mapStateToProps = (state) => {
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, {
  updateUserAvatar,
  updateUserBio,
  notify,
})(UserHeader);
