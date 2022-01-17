import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ClickAwayListener from "react-click-away-listener";
import {
  downloadWalletForRemoteHelper,
  transferToWallet,
  signOut,
  unlockKeplrWallet,
  unlockLedgerWallet,
} from "../store/actions/wallet";
import shrinkAddress from "../helpers/shrinkAddress";
import getHomeUrl from "../helpers/getHomeUrl";
import { notify } from "reapop";
import initKeplr from "../keplr/init";

import dynamic from "next/dynamic";
const SendTlore = dynamic(() => import("./dashboard/sendTlore"));
const CurrentWallet = dynamic(() => import("./currentWallet"));
/*
Menu States
1 - Default menu
2 - Wallet selection
*/

function Header(props) {
  const [menuState, setMenuState] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const onUserMenuClose = () => {
    setMenuOpen(false);
    setMenuState(1);
  };

  let addressToShow = "";
  if (props.selectedAddress) {
    addressToShow = shrinkAddress(props.selectedAddress);
  }

  useEffect(onUserMenuClose, [props.activeWallet]);

  const [homeUrl, setHomeUrl] = useState(
    getHomeUrl(props.dashboards, props.currentDashboard)
  );

  useEffect(
    () => setHomeUrl(getHomeUrl(props.dashboards, props.currentDashboard)),
    [props.dashboards, props.currentDashboard]
  );

  const headerMessage = process.env.NEXT_PUBLIC_HEADER_MESSAGE;

  const handleKeplrAccountChange = async () => {
    console.log("handling keplr wallet change");
    if (props.activeWallet.isKeplr) {
      await props.unlockKeplrWallet();
    }
  };

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", handleKeplrAccountChange);
    return () => {
      window.removeEventListener(
        "keplr_keystorechange",
        handleKeplrAccountChange
      );
    };
  });

  return (
    <>
      {headerMessage && headerMessage !== "" ? (
        <div className="flex bg-purple-900 justify-center items-center text-xs p-1 text-purple-50">
          <span>{headerMessage}</span>
        </div>
      ) : (
        ""
      )}
      <div className="navbar border-b border-grey bg-base-100 text-base-content">
        <div
          className={
            "flex-none px-6 transition-all ease-out delay-150" +
            (router.pathname === "/home" ? " w-64" : " w-42")
          }
        >
          <Link href={homeUrl}>
            <a>
              <img
                width={110}
                height={30}
                src="/logo-white.svg"
                className="cursor-pointer"
              ></img>
            </a>
          </Link>
        </div>
        {/* <div className="flex-none mr-2">
          <div className="form-control">
            <div className="relative">
              <input
                name="search"
                type="text"
                placeholder="Search"
                className="w-full pr-16 input input-sm input-ghost input-bordered"
              />
              <button className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div> */}
        <div className="items-stretch">
          <a
            className="btn btn-ghost btn-sm rounded-btn"
            href="https://explorer.gitopia.com/"
            target="_blank"
          >
            Explorer
          </a>
        </div>
        <div className="items-stretch">
          <a
            className="btn btn-ghost btn-sm rounded-btn"
            href="https://docs.gitopia.com/"
            target="_blank"
          >
            Docs
          </a>
        </div>
        <div className="flex-1"></div>
        {props.activeWallet ? (
          <div className="flex-none mr-8">
            <svg
              width="10"
              height="17"
              viewBox="0 0 10 17"
              fill="none"
              className="mr-1 text-purple-50"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.00061 8.51845C6.33523 8.51845 7.41715 7.43653 7.41715 6.10192C7.41715 4.7673 6.33523 3.68538 5.00061 3.68538C3.666 3.68538 2.58408 4.7673 2.58408 6.10192C2.58408 7.43653 3.666 8.51845 5.00061 8.51845ZM5.00061 10.2314C7.28128 10.2314 9.13013 8.38259 9.13013 6.10192C9.13013 3.82125 7.28128 1.9724 5.00061 1.9724C2.71994 1.9724 0.871094 3.82125 0.871094 6.10192C0.871094 8.38259 2.71994 10.2314 5.00061 10.2314Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.58408 11.1195C2.58408 11.7593 2.84059 12.3714 3.29468 12.8215C3.74849 13.2713 4.36229 13.5225 5.00061 13.5225C5.63893 13.5225 6.25273 13.2713 6.70655 12.8215C7.16063 12.3714 7.41715 11.7593 7.41715 11.1195H9.13013C9.13013 12.2004 8.69698 13.2386 7.92343 14.0053C7.14962 14.7723 6.09841 15.2046 5.00061 15.2046C3.90281 15.2046 2.8516 14.7723 2.07779 14.0053C1.30425 13.2386 0.871094 12.2004 0.871094 11.1195H2.58408Z"
                fill="currentColor"
              />
              <path
                d="M4.19727 0.743828H5.8455V2.39206H4.19727V0.743828Z"
                fill="currentColor"
              />
              <path
                d="M4.19727 14.7537H5.8455V16.4019H4.19727V14.7537Z"
                fill="currentColor"
              />
            </svg>
            <div className="text-purple-50 uppercase">
              {props.advanceUser === true
                ? props.loreBalance
                : props.loreBalance / 1000000}{" "}
              {props.advanceUser === true
                ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
                : process.env.NEXT_PUBLIC_CURRENCY_TOKEN}
            </div>
          </div>
        ) : (
          ""
        )}
        {process.env.NEXT_PUBLIC_NETWORK_NAME ? (
          <div className="flex-col mr-8 items-end">
            <div
              className="uppercase text-type-secondary"
              style={{ fontSize: "0.6rem", lineHeight: "1rem" }}
            >
              {process.env.NEXT_PUBLIC_NETWORK_NAME}
            </div>
            <div style={{ fontSize: "0.6rem", lineHeight: "1rem" }}>
              <a
                className="link link-primary no-underline"
                target="_blank"
                href={process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES}
              >
                SEE WHATS NEW
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="flex-none mr-4">
          <ClickAwayListener onClickAway={onUserMenuClose}>
            <div
              className={
                "dropdown dropdown-end " + (menuOpen ? "dropdown-open" : "")
              }
            >
              <button
                tabIndex="0"
                className={
                  "btn rounded-full px-4 avatar relative " +
                  (props.activeWallet ? "btn-outline" : "")
                }
                onClick={(e) => {
                  setMenuOpen(true);
                }}
              >
                <div className="rounded-full w-10 h-10 absolute left-1">
                  {props.activeWallet ? (
                    <img
                      src={
                        "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&background=c52a7d&caps=1&name=" +
                        addressToShow.slice(-1)
                      }
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={"mr-2 " + (props.activeWallet ? "ml-10" : "ml-2")}
                >
                  {props.activeWallet ? (
                    <>
                      <div className="text-xs text-left">
                        {props.activeWallet.name}
                        {props.activeWallet.isKeplr ? " [Keplr]" : ""}
                      </div>
                      <div className="text-xs text-type-tertiary">
                        {addressToShow}
                      </div>
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </div>
              </button>
              <div className="shadow-xl dropdown-content bg-base-300 rounded mt-1">
                {menuState === 2 && <CurrentWallet />}
                {menuState === 3 && menuOpen && (
                  <SendTlore
                    setMenuOpen={setMenuOpen}
                    transferToWallet={props.transferToWallet}
                    setMenuState={setMenuState}
                  />
                )}
                {menuState === 1 && (
                  <ul className="menu compact w-48 rounded">
                    {props.activeWallet ? (
                      <>
                        <li>
                          <a
                            onClick={(e) => {
                              navigator.clipboard.writeText(
                                props.selectedAddress
                              );
                              setMenuOpen(false);
                              props.notify("Copied to clipboard", "info");
                            }}
                          >
                            <span className="flex-1">Copy Address</span>
                          </a>
                        </li>
                        <li>
                          <a
                            onClick={(e) => {
                              props.downloadWalletForRemoteHelper();
                              setMenuOpen(false);
                            }}
                          >
                            Download Wallet
                          </a>
                        </li>
                        {/* <li>
                          <a>Assets</a>
                        </li>
                        <li>
                          <a>Transactions</a>
                        </li> */}
                        <li className="h-4">
                          <div className="border-b border-grey mt-2"></div>
                        </li>{" "}
                      </>
                    ) : (
                      ""
                    )}

                    {props.wallets.length ? (
                      <li>
                        <a
                          href="#"
                          onClick={(e) => {
                            setMenuState(2);
                            e.preventDefault();
                          }}
                        >
                          {props.activeWallet ? "Switch" : "Saved"} Wallet
                        </a>
                      </li>
                    ) : (
                      ""
                    )}
                    <li>
                      <Link href="/login">
                        <a>Create New Wallet</a>
                      </Link>
                    </li>
                    {/* <li>
                      <a
                        href="#"
                        onClick={async () => {
                          await initKeplr();
                          await props.unlockKeplrWallet();
                        }}
                      >
                        Connect Keplr Wallet
                      </a>
                    </li> */}
                    <li>
                      <a
                        href="#"
                        onClick={async () => {
                          await props.unlockLedgerWallet();
                        }}
                      >
                        Connect Ledger Wallet
                      </a>
                    </li>

                    {props.activeWallet ? (
                      <>
                        <li className="h-4">
                          <div className="border-b border-grey mt-2"></div>
                        </li>
                        <li>
                          <a
                            href="#"
                            onClick={(e) => {
                              setMenuState(3);
                              e.preventDefault();
                            }}
                          >
                            Send{" "}
                            {props.advanceUser === true
                              ? process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN.toUpperCase()
                              : process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toUpperCase()}
                          </a>
                        </li>
                        <li>
                          <a onClick={props.signOut}>Log Out</a>
                        </li>
                      </>
                    ) : (
                      ""
                    )}
                  </ul>
                )}
              </div>
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    activeWallet: state.wallet.activeWallet,
    selectedAddress: state.wallet.selectedAddress,
    loreBalance: state.wallet.loreBalance,
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  downloadWalletForRemoteHelper,
  transferToWallet,
  signOut,
  notify,
  unlockKeplrWallet,
  unlockLedgerWallet,
})(Header);
