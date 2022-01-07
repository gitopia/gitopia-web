import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { claimUsername } from "../store/actions/wallet";
import TextInput from "./textInput";
import { queryClient } from "gitopiajs";

function CreateUser(props) {
  const [name, setName] = useState("");
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const githubTest = new RegExp(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i);

  /*
  1 - No active wallet
  2 - Show banner if no associated username
  3 - Claim username
  4 - No banner because associated username found
  */
  let defaultStep = 1;
  if (props.activeWallet) {
    if (props.activeWallet.username) {
      defaultStep = 4;
    } else {
      defaultStep = 2;
    }
  }
  const [userStep, setUserStep] = useState(defaultStep);

  useEffect(() => {
    if (props.activeWallet) {
      setName(props.activeWallet.name);
      if (props.activeWallet.username) {
        setUserStep(4);
      } else {
        setUserStep(2);
      }
    }
  }, [props.activeWallet]);

  const setAndValidateName = async (inputName) => {
    setName(inputName);
    validateName(inputName);
  };

  const checkAvailability = async (inputName) => {
    try {
      const qc = await queryClient();
      const res = await qc.queryWhois(inputName.trim());
      if (res && res.data && res.data.Whois.name === inputName.trim()) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return true;
    }
  };

  const validateName = async (inputName) => {
    if (inputName.trim() === "") {
      setNameHint({
        message: "Username can't be empty",
        type: "error",
        shown: true,
      });
      return false;
    }
    if (githubTest.test(inputName.trim()) === false) {
      setNameHint({
        message: "Username fails github username test",
        type: "error",
        shown: true,
      });
      return false;
    }
    const isUsernameAvailable = await checkAvailability(inputName);
    if (!isUsernameAvailable) {
      setNameHint({
        message: "Username already taken",
        type: "error",
        shown: true,
      });
      return false;
    } else {
      setNameHint({
        message: "Username available",
        type: "success",
        shown: true,
      });
    }
    return true;
  };

  const claimName = async () => {
    if (await validateName(name)) {
      props.claimUsername(name);
    }
  };

  switch (userStep) {
    case 1:
      return "";
    case 2:
      return (
        <div className="flex mb-4 bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 border rounded-md p-2 inline ml-2 mr-6 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <div className="text-lg inline">
              Get a permalink for your profile{" "}
              <code className="text-sm text-secondary">
                https://gitopia.com/{props.activeWallet.name}
              </code>
            </div>
          </div>

          <a
            className="btn btn-primary btn-link btn-xs"
            onClick={() => {
              setUserStep(3);
              validateName(name);
            }}
          >
            Claim username
          </a>
        </div>
      );
    case 3:
      return (
        <div className="flex mb-4 bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
          <div className="max-w-md w-full">
            <TextInput
              type="text"
              name="whois_name"
              label="Username"
              placeholder="Username"
              value={name}
              setValue={setAndValidateName}
              hint={nameHint}
            />
          </div>

          <div>
            <button
              className="btn btn-primary btn-wide mr-4"
              onClick={claimName}
            >
              Claim
            </button>
            <button
              className="btn btn-ghost btn-wide"
              onClick={() => {
                setUserStep(2);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="flex mb-4 bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 border rounded-md p-2 inline ml-2 mr-6 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div className="text-lg inline">
              Permalink for your profile{" "}
              <code className="text-sm text-secondary">
                https://gitopia.com/{props.activeWallet.username}
              </code>
            </div>
          </div>
        </div>
      );
  }
  return "";
}

const mapStateToProps = (state) => {
  return {
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  claimUsername,
})(CreateUser);
