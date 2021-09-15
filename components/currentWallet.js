import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { unlockWallet, removeWallet } from "../store/actions/wallet";
import TextInput from "./textInput";

function CurrentWallet(props) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });

  const unlockWallet = async () => {
    if (password === "") {
      setPasswordHint({
        ...passwordHint,
        shown: true,
        message: "Please enter the password",
      });
      return;
    }
    let res = await props.unlockWallet({ name: selectedWallet, password });
    if (res) {
      resetWallet(false);
    } else {
      setPasswordHint({
        ...passwordHint,
        shown: true,
        message: "Wrong password",
      });
      return;
    }
  };

  const removeWallet = async () => {
    let res = await props.removeWallet({ name: selectedWallet });
    if (res) {
      resetWallet();
    }
  };

  const startUnlockingWallet = (walletName) => {
    setPassword("");
    setPasswordHint({ ...passwordHint, shown: false });
    setSelectedWallet(walletName);
    setIsUnlocking(true);
  };

  const resetWallet = (changeSelectedWallet = true) => {
    setPassword("");
    setPasswordHint({ ...passwordHint, shown: false });
    if (changeSelectedWallet)
      setSelectedWallet(props.activeWallet ? props.activeWallet.name : "");
    setIsUnlocking(false);
  };

  useEffect(() => {
    setSelectedWallet(props.activeWallet ? props.activeWallet.name : "");
  }, [props.activeWallet]);

  return (
    <div className="card max-w-sm w-full p-4">
      {isUnlocking ? (
        <div className="w-48 relative">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0 text-red"
            onClick={removeWallet}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <TextInput
            type="password"
            name="wallet_password"
            label={"Password for " + selectedWallet}
            placeholder="Password"
            value={password}
            setValue={setPassword}
            hint={passwordHint}
          />
          <div className="card-actions w-full">
            <button
              className="btn btn-sm btn-block btn-primary"
              onClick={unlockWallet}
            >
              Unlock
            </button>
            <button
              className="btn btn-sm btn-block btn-ghost"
              onClick={resetWallet}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {props.wallets.map((wallet, i) => {
            const isSelected =
              wallet.name ===
              (props.activeWallet ? props.activeWallet.name : "");
            return (
              <button
                onClick={(e) => {
                  startUnlockingWallet(wallet.name);
                }}
                className={
                  "btn rounded-full px-4 mb-1 avatar relative " +
                  (isSelected ? "btn-disabled" : "btn-ghost")
                }
                key={i}
              >
                <div className="rounded-full w-10 h-10 absolute left-1">
                  <img
                    src={
                      "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                      wallet.name
                    }
                  />
                </div>
                <div className="ml-10 mr-2">{wallet.name}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  unlockWallet,
  removeWallet,
})(CurrentWallet);
