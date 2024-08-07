import { useEffect, useState } from "react";
import * as bip39 from "bip39";
import { connect } from "react-redux";
import {
  createWalletWithMnemonic,
  downloadWalletForRemoteHelper,
} from "../store/actions/wallet";
import TextInput from "./textInput";
import { useRouter } from "next/router";
import axios from "../helpers/axiosFetch";
import { updateUserBalance } from "../store/actions/wallet";
import { notify } from "reapop";
import { useApiClient } from "../context/ApiClientContext";

function CreateWallet(props) {
  const [mnemonic, setMnemonic] = useState(bip39.generateMnemonic(256));
  const onValidUsername = (val) => {
    const usernameRegex = /^(?!-)(?!.*-$)(?!.*?--)[A-Za-z0-9-]+$/;
    return usernameRegex.test(val);
  };
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
  const [walletCreated, setWalletCreated] = useState(false);
  const router = useRouter();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setPasswordHint({ ...passwordHint, shown: false });
    setConfirmPasswordHint({ ...confirmPasswordHint, shown: false });
  };

  const validateWallet = () => {
    hideHints();
    if (name.trim() === "") {
      setNameHint({ ...nameHint, shown: true, message: "Please enter a name" });
      return false;
    }
    if (name.length > 39) {
      setNameHint({
        ...nameHint,
        shown: true,
        message: "Name can be maximum 39 characters",
      });
      return false;
    }
    if (!onValidUsername(name)) {
      setNameHint({
        ...nameHint,
        shown: true,
        message:
          "Name may only contain alphanumeric characters or single hyphens",
      });
      return false;
    }
    let alreadyAvailable = false;
    props.wallets.every((wallet) => {
      if (wallet.name === name) {
        alreadyAvailable = true;
        return false;
      }
      return true;
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

  const createWallet = async () => {
    if (validateWallet()) {
      let res = await props.createWalletWithMnemonic(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          name,
          mnemonic,
          password,
        }
      );
      setWalletCreated(true);
    }
  };

  useEffect(() => {
    if (walletCreated) {
      router.push("/login?step=5");
    }
  }, [walletCreated]);

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
      {walletCreated ? (
        <>
          <div className="text-4xl mt-16 sm:mt-0 sm:text-6xl mb-6">
            Recovery Phrase
          </div>
          <div className="text-sm mb-8 text-center sm:text-left">
            If you ever lose your login information, you can use this phrase to
            recover your account
          </div>
          <div className="max-w-2xl w-full p-4 mb-5">
            <ul className="grid grid-cols-4 grid-rows-6 sm:grid-cols-6 sm:grid-rows-4 gap-5 list-decimal list-inside text-xs sm:text-base">
              {mnemonic.split(" ").map((word, i) => {
                return (
                  <li key={i} data-test="mnemonic">
                    {word}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="max-w-md w-full p-4">
            <button
              className="btn btn-outline btn-block mb-5"
              onClick={props.downloadWalletForRemoteHelper}
            >
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
        </>
      ) : (
        <>
          <div className="text-4xl mt-16 sm:mt-0 sm:text-6xl mb-6">
            Create Local Wallet
          </div>
          <div className="text-xs text-type-secondary mb-8">
            Set a password for your new wallet
          </div>

          <div className="max-w-md w-full p-4">
            <div className="mb-4">
              <TextInput
                type="password"
                name="wallet_password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
                hint={passwordHint}
                autoFocus={true}
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
                onEnter={createWallet}
              />
            </div>
            <div className="">
              <button
                className="btn btn-secondary btn-block"
                onClick={createWallet}
                data-test="create_wallet"
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
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  createWalletWithMnemonic,
  downloadWalletForRemoteHelper,
  updateUserBalance,
  notify,
})(CreateWallet);
