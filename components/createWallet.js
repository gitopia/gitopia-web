import { useState } from "react";
import * as bip39 from "bip39";
import { connect } from "react-redux";
import { createWalletWithMnemonic } from "../store/actions/wallet";
import TextInput from "./textInput";

function CreateWallet(props) {
  const [mnemonic, setMnemonic] = useState(bip39.generateMnemonic(256));
  const [name, setName] = useState("");
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordHint, setConfirmPasswordHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [walletCreated, setWalletCreated] = useState(false);

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setPasswordHint({ ...passwordHint, shown: false });
    setConfirmPasswordHint({ ...confirmPasswordHint, shown: false });
  };

  const validateWallet = () => {
    hideHints();
    if (name === "") {
      setNameHint({ ...nameHint, shown: true, message: "Please enter a name" });
      return false;
    }
    let alreadyAvailable = false;
    props.wallets.every((wallet) => {
      if (wallet.name === name) {
        alreadyAvailable = true;
        return false;
      }
    });
    if (alreadyAvailable) {
      setNameHint({
        ...nameHint,
        shown: true,
        message: "Wallet name already taken",
      });
      return false;
    }
    if (password === "") {
      setPasswordHint({
        ...passwordHint,
        shown: true,
        message: "Please enter a password",
      });
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordHint({
        ...confirmPasswordHint,
        shown: true,
        message: "Confirm password and password are not matching",
      });
      return false;
    }
    return true;
  };

  const createWallet = async () => {
    if (validateWallet()) {
      let res = await props.createWalletWithMnemonic({
        name,
        mnemonic,
        password,
      });
      console.log(res);
      setWalletCreated(true);
    }
  };

  const newCreateWallet = () => {
    hideHints();
    setName("");
    setPassword("");
    setConfirmPassword("");
    setMnemonic(bip39.generateMnemonic(256));
    setWalletCreated(false);
  };

  return (
    <div className="card lg:card-side inline-block shadow bordered max-w-xs w-full">
      {walletCreated ? (
        <div className="card-body">
          <h2 className="card-title">Recovery phase</h2>
          <div className="">{mnemonic}</div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={newCreateWallet}>
              Ok
            </button>
          </div>
        </div>
      ) : (
        <div className="card-body">
          <h2 className="card-title">Create Wallet</h2>
          <div className="form-control mb-1">
            <TextInput
              type="text"
              name="wallet_name"
              placeholder="Wallet Name"
              value={name}
              setValue={setName}
              hint={nameHint}
            />
          </div>
          <div className="form-control mb-1">
            <TextInput
              type="password"
              name="wallet_password"
              placeholder="Password"
              value={password}
              setValue={setPassword}
              hint={passwordHint}
            />
          </div>
          <div className="form-control">
            <TextInput
              type="password"
              name="wallet_confirm_password"
              placeholder="Confirm Password"
              className="input input-primary input-bordered"
              value={confirmPassword}
              setValue={setConfirmPassword}
              hint={confirmPasswordHint}
            />
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" onClick={createWallet}>
              Create
            </button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
  };
};

export default connect(mapStateToProps, {
  createWalletWithMnemonic,
})(CreateWallet);
