import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { unlockWallet } from "../store/actions/wallet";
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
        <div className="w-48">
          <TextInput
            type="password"
            name="wallet_password"
            label={"Password for " + selectedWallet}
            placeholder="Password"
            value={password}
            setValue={setPassword}
            hint={passwordHint}
          />
          <div className="card-actions">
            <button className="btn btn-primary" onClick={unlockWallet}>
              Unlock
            </button>
            <button className="btn btn-ghost" onClick={resetWallet}>
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
              >
                <div className="rounded-full w-10 h-10 absolute left-1">
                  <img src={"https://i.pravatar.cc/500?img=" + i} />
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
})(CurrentWallet);
