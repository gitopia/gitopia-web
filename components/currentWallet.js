import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import {
  unlockWallet,
  removeWallet,
  unlockLedgerWallet,
  unlockKeplrWallet,
  signOut,
} from "../store/actions/wallet";
import initKeplr from "../helpers/keplr";
import TextInput from "./textInput";
import Link from "next/link";
import shrinkAddress from "../helpers/shrinkAddress";
import { useApiClient } from "../../context/ApiClientContext";

function CurrentWallet(props) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [externalWalletMsg, setExternalWalletMsg] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordHint, setPasswordHint] = useState({
    shown: false,
    type: "error",
    message: "",
  });
  const inputEl = useRef();

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

  const removeWallet = async () => {
    let res = await props.removeWallet({ name: selectedWallet });
    if (res) {
      resetWallet();
    }
  };

  const startUnlockingWallet = (walletName) => {
    setPassword("");
    setPasswordHint({ ...passwordHint, shown: false });
    setSelectedWallet(walletName);
    setIsUnlocking(true);

    const wallet =
      props.wallets[props.wallets.findIndex((x) => x.name === walletName)];
    if (wallet && wallet.isLedger) {
      props.unlockLedgerWallet({ name: wallet.name, justUnlock: true });
      setExternalWalletMsg("Please open Cosmos app on your ledger to verify");
    } else {
      setExternalWalletMsg(null);
    }
    props.setMenuOpen(true);

    setTimeout(() => {
      if (inputEl.current) inputEl.current.focus();
    }, 0);
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
    <div className="card max-w-sm w-full p-4">
      {isUnlocking ? (
        <div className="w-48 relative">
          <label
            className="flex btn btn-sm btn-circle btn-ghost left-0 top-0 text-pink-900"
            onClick={() => {
              setIsUnlocking(false);
            }}
          >
            <svg
              width="8"
              height="11"
              viewBox="0 0 8 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
            >
              <path d="M7 1L2 5.5L7 10" strokeWidth="2" />
            </svg>
          </label>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0 text-pink-900"
            onClick={removeWallet}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {externalWalletMsg ? (
            <div className="mt-2">
              <div className="text-sm">
                <span>{selectedWallet}</span>
                <span
                  style={{ fontSize: "0.7em" }}
                  className="rounded-md relative -top-px border border-secondary text-purple-50 ml-2 px-2 py-0.5"
                >
                  Ledger
                </span>
              </div>
              <div className="mt-2 text-xs text-pink-900">
                {externalWalletMsg}
              </div>
              <div className="flex mt-4 w-full btn-group">
                <button
                  className="btn btn-sm btn-block btn-primary flex-1"
                  onClick={async () => {
                    const res = await props.unlockLedgerWallet({
                      name: selectedWallet,
                    });
                    if (res?.message) {
                      setExternalWalletMsg(res.message);
                    }
                  }}
                  disabled={props.unlockingWallet}
                >
                  Connect
                </button>
              </div>
            </div>
          ) : (
            <>
              <TextInput
                type="password"
                name="wallet_password"
                label={"Password for " + selectedWallet}
                placeholder="Password"
                value={password}
                setValue={setPassword}
                hint={passwordHint}
                onEnter={unlockWallet}
                size="sm"
                ref={inputEl}
              />
              <div className="flex mt-4 w-full btn-group">
                <button
                  className="btn btn-sm btn-block btn-primary flex-1"
                  onClick={unlockWallet}
                >
                  Unlock
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          {props.wallets.map((wallet, i) => {
            const isSelected =
              wallet.name ===
              (props.activeWallet ? props.activeWallet.name : "");
            return (
              <button
                onClick={(e) => {
                  isSelected
                    ? props.signOut()
                    : startUnlockingWallet(wallet.name);
                }}
                className={
                  "btn rounded-full px-4 mb-2 relative justify-start" +
                  (isSelected ? " btn-primary" : " btn-ghost")
                }
                key={i}
              >
                <div className="avatar absolute left-1">
                  <div className="rounded-full w-10 h-10">
                    {wallet.avatarUrl ? (
                      <img src={wallet.avatarUrl} />
                    ) : (
                      <span className="bg-base-200 flex items-center justify-center text-xl uppercase h-full">
                        {wallet.name[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className={"ml-10" + (isSelected ? " mr-6" : " mr-2")}>
                  <div className="text-xs text-left whitespace-nowrap">
                    <span>{wallet.name}</span>
                    {wallet.isLedger ? (
                      <span
                        style={{ fontSize: "0.7em" }}
                        className="rounded-md relative -top-px border border-secondary text-purple-50 ml-2 px-2 py-0.5"
                      >
                        Ledger
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  {wallet.address ? (
                    <div
                      className={
                        "text-xs text-left" +
                        (isSelected ? " text-green-50" : " text-type-tertiary")
                      }
                    >
                      {"gitopia" + shrinkAddress(wallet.address)}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {isSelected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 absolute right-3 top-3 mt-px"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                ) : (
                  ""
                )}
              </button>
            );
          })}

          <button
            className="btn btn-outline border-grey mb-2 rounded-full px-4 relative justify-start"
            onClick={async () => {
              await initKeplr();
              const apiClient = useApiClient();
              props.unlockKeplrWallet(apiClient);
            }}
          >
            <div className="rounded-full mask mask-circle w-10 h-10 bg-primary flex justify-center items-center absolute left-1">
              <img src="/keplr-logo.svg"></img>
            </div>
            <div className="ml-10 mr-2 whitespace-nowrap">Connect Keplr</div>
          </button>

          <Link
            href="/login"
            className="btn btn-outline border-grey rounded-full px-4 relative justify-start"
          >
            <div className="rounded-full w-10 h-10 bg-primary flex justify-center items-center absolute left-1">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="ml-10 mr-2 whitespace-nowrap">Create New</div>
          </Link>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    unlockingWallet: state.wallet.unlockingWallet,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  unlockWallet,
  unlockLedgerWallet,
  removeWallet,
  unlockKeplrWallet,
  signOut,
})(CurrentWallet);
