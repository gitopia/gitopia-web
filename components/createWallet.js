import { useState } from "react";
import * as bip39 from "bip39";
import { connect } from "react-redux";
import { createWalletWithMnemonic } from "../store/actions/wallet";
import TextInput from "./textInput";
import { useRouter } from "next/router";

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
  const router = useRouter();

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
    <>
      {walletCreated ? (
        <>
          <div className="text-6xl mt-12 mb-6">Recovery Phrase</div>
          <div className="text-sm mb-8">
            If you ever lose your login information, you can use this phrase to
            recover your account
          </div>
          <div className="max-w-2xl w-full p-4">
            <ul className="grid grid-cols-6 grid-rows-4 gap-5 list-decimal list-inside">
              {mnemonic.split(" ").map((word, i) => {
                return <li>{word}</li>;
              })}
            </ul>
          </div>
          <div className="max-w-md w-full p-4">
            <div className="card-actions">
              <button className="btn btn-outline btn-block">
                Download Backup
              </button>
              <button
                className="btn btn-secondary btn-block"
                onClick={() => {
                  router.push("/home");
                }}
              >
                Done
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-6xl mt-12 mb-6">Create Wallet</div>
          <div className="text-xs mb-8">
            Your wallet is your login information to access the app
          </div>

          <div className="max-w-md w-full p-4">
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
                value={confirmPassword}
                setValue={setConfirmPassword}
                hint={confirmPasswordHint}
              />
            </div>
            <div className="card-actions">
              <button
                className="btn btn-secondary btn-block"
                onClick={createWallet}
              >
                Create
              </button>
            </div>
          </div>
        </>
      )}
    </>
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
