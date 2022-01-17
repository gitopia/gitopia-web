import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  setWallet,
  unlockWallet,
  downloadWallet,
  unlockKeplrWallet,
  unlockLedgerWallet,
} from "../store/actions/wallet";
import initKeplr from "../keplr/init";
import TextInput from "./textInput";
import shrinkAddress from "../helpers/shrinkAddress";

function AutoLogin(props) {
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [walletName, setWalletName] = useState("");
  const [address, setAddress] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const inputEl = useRef();

  useEffect(async () => {
    let lastWallet;
    try {
      const data = localStorage["lastWallet"];
      if (data) lastWallet = JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    if (lastWallet) {
      if (!props.activeWallet) {
        console.log(
          "Last Wallet found, unlocking.. ",
          lastWallet.name,
          "isKeplr",
          lastWallet.isKeplr
        );
        if (lastWallet.isKeplr) {
          await initKeplr();
          const acc = await props.unlockKeplrWallet();
          console.log(acc);
          if (acc) {
            console.log("Keplr sign in success");
          }
        } else if (lastWallet.isLedger) {
          const acc = await props.unlockLedgerWallet();
          console.log(acc);
          if (acc) {
            console.log("Ledger sign in success");
          }
        } else {
          setWalletName(lastWallet.name);
          setAddress(lastWallet.accounts[0].address);
          let res = await props.setWallet({
            wallet: lastWallet,
          });
        }
      } else {
        console.log("Wallet active");
      }
    } else {
      console.log("Last wallet not found");
    }
  }, []);

  useEffect(() => {
    if (props.getPassword) {
      setShowDialog(true);
    }
  }, [props.getPassword]);

  useEffect(() => {
    if (showDialog)
      setTimeout(() => {
        if (inputEl.current) inputEl.current.focus();
      }, 0);
  }, [showDialog]);

  useEffect(() => {
    if (props.activeWallet) {
      setWalletName(props.activeWallet.name);
      setAddress(props.activeWallet.accounts[0].address);
    }
  }, [props.activeWallet]);

  const unlockLocalWallet = async () => {
    let res;
    if (props.getPassword === "Unlock")
      res = await props.unlockWallet({
        name: walletName,
        password: password,
      });
    else res = await props.downloadWallet(password);
    if (res) {
      console.log("Local sign in success");
      setShowDialog(false);
      setPassword("");
      setPasswordHint({ shown: false });
    } else {
      setPasswordHint({
        ...passwordHint,
        shown: true,
        type: "error",
        message: "Wrong password",
      });
    }
  };

  return (
    <>
      <input
        type="checkbox"
        checked={showDialog}
        readOnly
        className="modal-toggle"
      />
      {showDialog ? (
        <div className="modal">
          <div className="modal-box max-w-xs">
            <div className="hidden">
              <input
                type="text"
                name="wallet_name"
                placeholder="Wallet Name"
                value={walletName}
                readOnly
              />
            </div>
            <div className="">
              <TextInput
                type="password"
                label={
                  "Unlock wallet " +
                  walletName +
                  " (" +
                  shrinkAddress(address) +
                  ")"
                }
                name="wallet_password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
                hint={passwordHint}
                onEnter={unlockLocalWallet}
                size="sm"
                ref={inputEl}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-sm btn-block flex-1"
                onClick={() => {
                  setShowDialog(false);
                  setPassword("");
                  setPasswordHint({ shown: false });
                  if (props.getPasswordPromise.reject) {
                    props.getPasswordPromise.reject("Unlock rejected");
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-block btn-primary flex-1"
                onClick={unlockLocalWallet}
              >
                {props.getPassword}
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    activeWallet: state.wallet.activeWallet,
    getPassword: state.wallet.getPassword,
    getPasswordPromise: state.wallet.getPasswordPromise,
  };
};

export default connect(mapStateToProps, {
  setWallet,
  unlockWallet,
  downloadWallet,
  unlockKeplrWallet,
  unlockLedgerWallet,
})(AutoLogin);
