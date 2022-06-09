import { useState } from "react";
import { connect } from "react-redux";
import {
  initLedgerTransport,
  getLedgerSigner,
  showLedgerAddress,
  addLedgerWallet,
} from "../store/actions/wallet";
import TextInput from "./textInput";
import { useRouter } from "next/router";

function ConnectLedger(props) {
  const [name, setName] = useState("");
  const [nameHint, setNameHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [connectPermission, setConnectPermission] = useState(false);
  const [connectError, setConnectError] = useState(null);
  const [appOpen, setAppOpen] = useState(false);
  const [appError, setAppError] = useState(null);
  const [ledgerAddress, setLedgerAddress] = useState("");
  const [addressVerified, setAddressVerified] = useState(false);
  const [verifyError, setVerifyError] = useState(null);

  const router = useRouter();

  const hideHints = () => {
    setNameHint({ ...nameHint, shown: false });
    setConnectPermission(false);
    setConnectError(null);
    setAppOpen(false);
    setAppError(null);
    setAddressVerified(false);
    setVerifyError(null);
  };

  const validateWallet = () => {
    hideHints();
    if (name.trim() === "") {
      setNameHint({ ...nameHint, shown: true, message: "Please enter a name" });
      return false;
    }
    if (name.trim().length > 39) {
      setNameHint({
        ...nameHint,
        shown: true,
        message: "Name can be maximum 39 characters",
      });
      return false;
    }
    let alreadyAvailable = false;
    props.wallets.every((wallet) => {
      console.log(wallet.name, name === wallet.name);
      if (wallet.name === name) {
        alreadyAvailable = true;
        return false;
      }
      return true;
    });
    console.log(props.wallets, name);
    if (alreadyAvailable) {
      setNameHint({
        ...nameHint,
        shown: true,
        message: "Wallet name already taken",
      });
      return false;
    }
    return true;
  };

  const createWallet = async () => {
    setCreatingWallet(true);
    if (validateWallet()) {
      let res = await props.initLedgerTransport();
      console.log(res);
      if (res.transport) {
        setConnectPermission(true);
        let s = await props.getLedgerSigner(res.transport);
        console.log(s);
        if (s.signer) {
          setAppOpen(true);
          setLedgerAddress(s.addr);
          let v = await props.showLedgerAddress(s.signer);
          console.log(v);
          if (v.pubkey) {
            setAddressVerified(true);
            const a = await props.addLedgerWallet(name, s.addr, s.signer);
            if (a) {
              router.push("/home");
            }
          } else {
            setVerifyError("Unable to confirm on ledger");
          }
        } else {
          setAppError(s.message);
        }
      } else {
        setConnectError(res.message);
      }
    }
    setCreatingWallet(false);
  };

  return (
    <>
      <div className="text-4xl mt-16 sm:mt-0 sm:text-6xl mb-6">
        Connect Ledger
      </div>
      <div className="text-xs mb-8">
        Your wallet is your login information to access the app
      </div>
      <div className="max-w-md w-full p-4">
        <div className="">
          <TextInput
            type="text"
            name="wallet_name"
            placeholder="Wallet Name"
            value={name}
            setValue={setName}
            hint={nameHint}
          />
        </div>
      </div>
      <div className="max-w-md w-full px-4">
        <div className="flex py-2 justify-between items-center rounded-md">
          <div
            className={
              "w-8 h-8 flex-none mr-4 flex justify-center items-center rounded-full border" +
              (connectPermission
                ? " border-green bg-green-900"
                : " border-grey")
            }
          >
            {connectPermission ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-type-tertiary text-sm">1</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-type-secondary">
              Allow permission to access Ledger via USB
            </div>
            {connectError ? (
              <div className="text-xs text-pink">{connectError}</div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="max-w-md w-full px-4">
        <div className="flex py-2 justify-between items-center rounded-md">
          <div
            className={
              "w-8 h-8 flex-none mr-4 flex justify-center items-center rounded-full border" +
              (appOpen ? " border-green bg-green-900" : " border-grey")
            }
          >
            {appOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-type-tertiary text-sm">2</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-type-secondary">
              Open Cosmos app on Ledger
            </div>
            {appError ? (
              <div className="text-xs text-pink">{appError}</div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="max-w-md w-full px-4">
        <div className="flex py-2 justify-between items-center rounded-md">
          <div
            className={
              "w-8 h-8 flex-none mr-4 flex justify-center items-center rounded-full border" +
              (addressVerified ? " border-green bg-green-900" : " border-grey")
            }
          >
            {addressVerified ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-type-tertiary text-sm">3</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-xs text-type-secondary">
              Verify address on Ledger {ledgerAddress}
            </div>
            {verifyError ? (
              <div className="text-xs text-pink">{verifyError}</div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className="max-w-md w-full p-4">
        <div className="">
          <button
            className={
              "btn btn-secondary btn-block" + (creatingWallet ? " loading" : "")
            }
            onClick={createWallet}
            disabled={creatingWallet}
          >
            Connect
          </button>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
  };
};

export default connect(mapStateToProps, {
  initLedgerTransport,
  getLedgerSigner,
  showLedgerAddress,
  addLedgerWallet,
})(ConnectLedger);
