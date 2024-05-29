import { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  initLedgerTransport,
  getLedgerSigner,
  showLedgerAddress,
  addLedgerWallet,
  updateUserBalance,
} from "../store/actions/wallet";
import axios from "../helpers/axiosFetch";
import { useRouter } from "next/router";
import { notify } from "reapop";
import { useApiClient } from "../context/ApiClientContext";

function ConnectLedger(props) {
  const [name, setName] = useState("untitled-ledger-1");
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
  const [walletCreated, setWalletCreated] = useState(false);
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const router = useRouter();
  useEffect(() => {
    let highest = 0;
    props.wallets.every((wallet) => {
      if (wallet.name.includes("untitled-ledger")) {
        let n = Number(wallet.name.split("-")[2]) || 0;
        highest = Math.max(highest, n);
      }
      return true;
    });
    setName("untitled-ledger-" + (highest + 1));
  }, []);
  const createWallet = async () => {
    setCreatingWallet(true);
    setAppError(null);
    setConnectError(null);
    let res = await props.initLedgerTransport();
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
          const a = await props.addLedgerWallet(
            apiClient,
            cosmosBankApiClient,
            cosmosFeegrantApiClient,
            name,
            s.addr,
            s.signer
          );
          if (a === "USER_CREATED") {
            router.push("/home");
          } else if (a === "WALLET_ADDED") {
            router.push("/login?step=5");
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
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  initLedgerTransport,
  getLedgerSigner,
  showLedgerAddress,
  addLedgerWallet,
  updateUserBalance,
  notify,
})(ConnectLedger);
