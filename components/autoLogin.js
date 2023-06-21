import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  setWallet,
  unlockWallet,
  downloadWallet,
  unlockKeplrWallet,
  unlockLedgerWallet,
} from "../store/actions/wallet";
import initKeplr from "../helpers/keplr";
import TextInput from "./textInput";
import shrinkAddress from "../helpers/shrinkAddress";
import { notify } from "reapop";

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
  const [externalWalletMsg, setExternalWalletMsg] = useState(null);
  const inputEl = useRef();
  const okayRef = useRef();

  useEffect(() => {
    async function setWallet() {
      let lastWallet;
      try {
        const data = localStorage["lastWallet"];
        if (data) lastWallet = JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
      if (lastWallet) {
        if (!props.activeWallet) {
          console.log("Last wallet found.. ", lastWallet.name);
          if (lastWallet.isKeplr) {
            await initKeplr();
            await props.unlockKeplrWallet();
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
    }
    setWallet();
  }, []);

  useEffect(() => {
    if (props.getPassword) {
      setShowDialog(true);
      if (props.getPassword === "Connect") {
        setExternalWalletMsg("Please open Cosmos app on your ledger");
      } else {
        setExternalWalletMsg(null);
      }
    }
  }, [props.getPassword]);

  useEffect(() => {
    if (showDialog)
      setTimeout(() => {
        if (inputEl.current) inputEl.current.focus();
        if (props.activeWallet?.isLedger && okayRef.current)
          okayRef.current.click();
      }, 100);
  }, [showDialog]);

  useEffect(() => {
    if (props.activeWallet) {
      setWalletName(props.activeWallet.name);
      setAddress(props.activeWallet.accounts[0].address);
    }
  }, [props.activeWallet]);

  const unlockLocalWallet = async () => {
    let res;
    if (props.getPassword === "Unlock" || props.getPassword === "Approve") {
      res = await props.unlockWallet({
        name: walletName,
        password: password,
      });
    } else if (props.getPassword === "Download") {
      res = await props.downloadWallet(password);
    } else if (props.getPassword === "Connect") {
      res = await props.unlockLedgerWallet({ name: walletName });
      if (res?.message) {
        props.notify(res.message, "error");
        if (props.getPasswordPromise.reject) {
          props.getPasswordPromise.reject("Please try again.");
        }
      }
    }
    if (res) {
      console.log("Sign in success");
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
            {externalWalletMsg ? (
              <div className="">{externalWalletMsg}</div>
            ) : (
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
            )}
            <div className="modal-action">
              <button
                className="btn btn-sm btn-block flex-1"
                onClick={() => {
                  setShowDialog(false);
                  setPassword("");
                  setPasswordHint({ shown: false });
                  if (props.getPasswordPromise.reject) {
                    props.getPasswordPromise.reject(
                      "Please unlock your wallet"
                    );
                  }
                }}
              >
                Cancel
              </button>
              <button
                className={
                  "btn btn-sm btn-block btn-primary flex-1" +
                  (props.unlockingWallet ? " loading" : "")
                }
                ref={okayRef}
                onClick={unlockLocalWallet}
                disabled={props.unlockingWallet}
                data-test={props.getPassword}
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
    unlockingWallet: state.wallet.unlockingWallet,
  };
};

export default connect(mapStateToProps, {
  setWallet,
  unlockWallet,
  downloadWallet,
  unlockKeplrWallet,
  unlockLedgerWallet,
  notify,
})(AutoLogin);
