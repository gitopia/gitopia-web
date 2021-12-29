import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { unlockWallet, unlockKeplrWallet } from "../store/actions/wallet";
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
        } else {
          setShowDialog(true);
          setWalletName(lastWallet.name);
          setAddress(lastWallet.accounts[0].address);
        }
      } else {
        console.log("Wallet active");
      }
    } else {
      console.log("Last wallet not found");
    }
  }, []);

  useEffect(() => {
    if (showDialog)
      setTimeout(() => {
        if (inputEl.current) inputEl.current.focus();
      }, 0);
  }, [showDialog]);

  const unlockLocalWallet = async () => {
    let res = await props.unlockWallet({
      name: walletName,
      password: password,
    });
    if (res) {
      console.log("Local sign in success");
      setShowDialog(false);
      setPassword("");
    } else {
      setPasswordHint({
        ...passwordHint,
        shown: true,
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
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-block btn-primary flex-1"
                onClick={unlockLocalWallet}
              >
                Unlock
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
    askPasswordCb: state.wallet.askPasswordCb,
  };
};

export default connect(mapStateToProps, {
  unlockWallet,
  unlockKeplrWallet,
})(AutoLogin);
