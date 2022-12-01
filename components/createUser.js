import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  createUser,
  getUserDetailsForSelectedAddress,
} from "../store/actions/user";
import Link from "next/link";
import { notify } from "reapop";
import TextInput from "./textInput";
import UserAvatar from "./user/avatar";
import { useRouter } from "next/router";

function CreateUser(props) {
  const [loading, setLoading] = useState(false);
  const [userCreated, setUserCreated] = useState(props.user.creator);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [usernameHint, setUsernameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [bioHint, setBioHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });

  const usernameRegex = /^[a-zA-Z0-9]+(?:[-]?[a-zA-Z0-9])*$/;
  const router = useRouter();

  useEffect(() => {
    setUserCreated(props.user.creator);
  }, [props.user]);

  const hideHints = () => {
    setUsernameHint({ ...usernameHint, shown: false });
    setNameHint({ ...nameHint, shown: false });
    setBioHint({ ...bioHint, shown: false });
  };

  const validateProfile = async () => {
    hideHints();
    if (username.trim() === "") {
      setUsernameHint({
        shown: true,
        type: "error",
        message: "Username cannot be empty",
      });
      return false;
    }
    if (username.trim().length < 3) {
      setUsernameHint({
        shown: true,
        type: "error",
        message: "Username must be atleast 3 characters long",
      });
      return false;
    }
    if (username.trim().length > 39) {
      setUsernameHint({
        shown: true,
        type: "error",
        message: "Username can be atmost 39 characters long",
      });
      return false;
    }
    if (!usernameRegex.test(username)) {
      setUsernameHint({
        shown: true,
        type: "error",
        message:
          "Username may only contain alphanumeric characters or single hyphens",
      });
      return false;
    }
    if (props.wallets?.length) {
      let foundName = false;
      props.wallets.every((w) => {
        if (w.name.toLowerCase() === username.toLowerCase()) {
          foundName = true;
          return false;
        }
        return true;
      });
      if (foundName) {
        setUsernameHint({
          shown: true,
          type: "error",
          message:
            "Same named local wallet already present, either delete other wallet or choose a different name",
        });
        return false;
      }
    }
    return true;
  };

  const createProfile = async () => {
    setLoading(true);
    if (await validateProfile()) {
      let res = await props.createUser({
        username,
        name,
        bio,
        avatarUrl,
      });
      if (res && res.code === 0) {
        await props.getUserDetailsForSelectedAddress();
        router.push("/home");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="text-2xl mt-16 sm:mt-0 mb-6">Setup Your Profile</div>
      <div className="text-base mb-8">On chain profile</div>

      <div>
        <UserAvatar
          user={{ avatarUrl, name, username, bio }}
          refresh={() => {}}
          isEditable={true}
          callback={(newUrl) => {
            setAvatarUrl(newUrl);
          }}
        />
      </div>
      <div className="max-w-md w-full p-4">
        <div className="mb-4">
          <TextInput
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            setValue={setUsername}
            hint={usernameHint}
            required={true}
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            name="full name"
            placeholder="Full Name"
            value={name}
            setValue={setName}
            hint={nameHint}
          />
        </div>
        <div className="mb-8">
          <TextInput
            type="text"
            name="bio"
            placeholder="Bio"
            multiline={true}
            value={bio}
            setValue={setBio}
            hint={bioHint}
          />
        </div>
        <div className="">
          <button
            className={
              "btn btn-secondary btn-block" + (loading ? " loading" : "")
            }
            onClick={createProfile}
            disabled={loading}
          >
            Finish
          </button>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
    wallets: state.wallet.wallets,
  };
};

export default connect(mapStateToProps, {
  createUser,
  getUserDetailsForSelectedAddress,
  notify,
})(CreateUser);
