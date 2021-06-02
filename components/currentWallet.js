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
    <div className="card lg:card-side inline-block shadow bordered max-w-xs w-full">
      <div className="card-body">
        <h6>
          Active Wallet: {props.activeWallet ? props.activeWallet.name : ""}
        </h6>
        <div className="flex items-center">
          <h3>Wallets({props.wallets.length}):</h3>

          <select
            className="select select-bordered select-sm w-24"
            value={selectedWallet}
            onChange={(e) => {
              startUnlockingWallet(e.target.value);
            }}
          >
            {props.wallets.map((wallet) => {
              const isSelected =
                wallet.name ===
                (props.activeWallet ? props.activeWallet.name : "");
              return (
                <option value={wallet.name} selected={isSelected}>
                  {wallet.name}
                </option>
              );
            })}
          </select>
        </div>

        {isUnlocking ? (
          <>
            <div className="form-control">
              <TextInput
                type="password"
                name="wallet_password"
                placeholder={"Password for " + selectedWallet}
                value={password}
                setValue={setPassword}
                hint={passwordHint}
              />
            </div>
            <div className="card-actions">
              <button className="btn btn-primary" onClick={unlockWallet}>
                Unlock
              </button>
              <button className="btn btn-ghost" onClick={resetWallet}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
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
