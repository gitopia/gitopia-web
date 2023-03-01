import { useState, useEffect } from "react";
import { connect } from "react-redux";
import * as bip39 from "bip39";
import { createWalletWithMnemonic } from "../store/actions/wallet";
import TextInput from "./textInput";
import { useRouter } from "next/router";

function RecoverWallet(props) {
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicHint, setMnemonicHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [name, setName] = useState("untitled-wallet-1");
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
  const [mnemonicValidated, setMnemonicValidated] = useState(false);
  const router = useRouter();

  const hideHints = () => {
    setMnemonicHint({ ...mnemonicHint, shown: false });
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
    if (password.length < 8) {
      setPasswordHint({
        ...passwordHint,
        shown: true,
        message: "Password should be atleast 8 characters",
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

  const validateMnemonic = () => {
    hideHints();
    if (mnemonic === "") {
      setMnemonicHint({
        ...mnemonicHint,
        shown: true,
        message: "Please enter recovery phrase",
      });
      return false;
    }

    if (!bip39.validateMnemonic(mnemonic)) {
      setMnemonicHint({
        ...mnemonicHint,
        shown: true,
        message: "Please enter 24 valid english words",
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
      router.push("/home");
    }
  };

  const recoverWallet = () => {
    if (validateMnemonic()) {
      setMnemonicValidated(true);
    }
  };

  // const newCreateWallet = () => {
  //   hideHints();
  //   setName("");
  //   setPassword("");
  //   setConfirmPassword("");
  //   setMnemonic(bip39.generateMnemonic(256));
  //   setMnemonicValidated(false);
  // };

  useEffect(() => {
    let highest = 0;
    props.wallets.every((wallet) => {
      if (wallet.name.includes("untitled-wallet")) {
        let n = Number(wallet.name.split("-")[2]) || 0;
        highest = Math.max(highest, n);
      }
      return true;
    });
    setName("untitled-wallet-" + (highest + 1));
  }, []);

  return (
    <>
      {mnemonicValidated ? (
        <>
          <div className="text-6xl mb-6">Recover Wallet</div>
          <div className="text-sm mb-8">
            Enter a password for your recovered wallet
          </div>

          <div className="max-w-md w-full p-4">
            {/* <div className="mb-4">
              <TextInput
                type="text"
                name="wallet_name"
                placeholder="Wallet Name"
                value={name}
                setValue={setName}
                hint={nameHint}
              />
            </div> */}
            <div className="mb-4">
              <TextInput
                type="password"
                name="wallet_password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
                hint={passwordHint}
              />
            </div>
            <div className="mb-8">
              <TextInput
                type="password"
                name="wallet_confirm_password"
                placeholder="Confirm Password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                hint={confirmPasswordHint}
              />
            </div>
            <div className="">
              <button
                className="btn btn-secondary btn-block"
                onClick={createWallet}
                data-test="recover_wallet_button"
              >
                Recover
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-4xl mt-16 sm:mt-0 sm:text-6xl mb-6">
            Recover Wallet
          </div>
          <div className="text-xs mb-8">
            Enter your wallet recovery phrase to log in
          </div>
          <div className="max-w-md w-full p-4">
            <div className="mb-8">
              <TextInput
                type="text"
                name="mnemonic"
                placeholder="24 word recovery phrase"
                value={mnemonic}
                setValue={setMnemonic}
                hint={mnemonicHint}
                multiline={true}
              />
            </div>
            <div className="">
              <button
                className="btn btn-secondary btn-block"
                onClick={recoverWallet}
                data-test="recover_wallet_button"
              >
                Recover
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
})(RecoverWallet);
