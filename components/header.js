import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ClickAwayListener from "react-click-away-listener";
import {
  downloadWalletForRemoteHelper,
  transferToWallet,
  signOut,
  unlockKeplrWallet,
} from "../store/actions/wallet";
import shrinkAddress from "../helpers/shrinkAddress";
import getHomeUrl from "../helpers/getHomeUrl";
import { notify } from "reapop";

import dynamic from "next/dynamic";
import getNodeInfo from "../helpers/getNodeInfo";
const SendTlore = dynamic(() => import("./dashboard/sendTlore"));
const CurrentWallet = dynamic(() => import("./currentWallet"));
// const NotificationsCard = dynamic(() =>
//   import("./dashboard/notificationsButton")
// );
// const NotificationsList = dynamic(() =>
//   import("./dashboard/notificationsList")
// );
/*
Menu States
1 - Logged in menu
2 - Wallet selection
3 - Send Tokens
4 - Logged out with no saved wallets
5 - Notifications
*/

function Header(props) {
  const [menuState, setMenuState] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chainId, setChainId] = useState("");
  const [unread, setUnread] = useState(false);
  const router = useRouter();
  const menuRef = useRef();
  const [
    formattedIssueNotifications,
    setFormattedIssueNotifications,
  ] = useState([]);
  const [formattedPullNotifications, setFormattedPullNotifications] = useState(
    []
  );
  const [showNotificationListState, setShowNotificationListState] = useState(
    ""
  );

  const onUserMenuClose = () => {
    setMenuOpen(false);
    if (menuRef.current) {
      menuRef.current.blur();
    }
  };

  let addressToShow = "";
  if (props.selectedAddress) {
    addressToShow = shrinkAddress(props.selectedAddress);
  }

  function unreadNotification() {
    let state = props.userNotification;
    state.map((i) => {
      if (i.unread === true) {
        setUnread(true);
        if (menuOpen === true) {
          setUnread(false);
        }
      }
    });
  }

  useEffect(async () => {
    unreadNotification();
  }, [props.userNotification]);

  useEffect(() => {
    onUserMenuClose();
    if (props.activeWallet) setMenuState(1);
    else setMenuState(2);
  }, [props.activeWallet]);

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
    if (props.activeWallet && props.activeWallet.isKeplr) {
      await props.unlockKeplrWallet();
    }
  };

  useEffect(async () => {
    window.addEventListener("keplr_keystorechange", handleKeplrAccountChange);
    if (process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES) {
      const info = await getNodeInfo();
      setChainId(info.node_info.network);
    }
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
            href={process.env.NEXT_PUBLIC_EXPLORER_URL}
            target="_blank"
          >
            Explorer
          </a>
        </div>
        <div className="items-stretch">
          <a
            className="btn btn-ghost btn-sm rounded-btn"
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            target="_blank"
          >
            Docs
          </a>
        </div>
        <div className="items-stretch">
          <a
            className="btn btn-ghost btn-sm rounded-btn"
            href={process.env.NEXT_PUBLIC_FORUM_URL}
            target="_blank"
          >
            Forum
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
        {process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES ? (
          <div className="flex-col mr-8 items-end">
            <div
              className="uppercase text-type-secondary"
              style={{ fontSize: "0.6rem", lineHeight: "1rem" }}
            >
              {chainId}
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
          <ClickAwayListener
            onClickAway={() => {
              onUserMenuClose();
              if (props.activeWallet) setMenuState(1);
            }}
          >
            <div className="flex">
              {/* <div className="mt-2">
                <div className="indicator flex-none mr-4">
                  {unread === true && menuOpen !== true ? (
                    <div class="indicator-item badge badge-primary"></div>
                  ) : (
                    ""
                  )}
                  <a
                    class="btn btn-primary btn-circle btn-base btn-outline btn-sm w-10 h-10"
                    href="#"
                    onClick={(e) => {
                      setUnread(false);
                      setMenuOpen(true);
                      setMenuState(5);
                      e.preventDefault();
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask id="path-1-inside-1_728_3215" fill="white">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M15.9999 4.96387C11.9545 4.96387 8.67506 8.2433 8.67506 12.2887V16.8486H6.22461V22.7806H25.7745V16.8486H23.3247V12.2887C23.3247 8.24331 20.0453 4.96387 15.9999 4.96387Z"
                        />
                      </mask>
                      <path
                        d="M8.67506 16.8486V18.8486H10.6751V16.8486H8.67506ZM6.22461 16.8486V14.8486H4.22461V16.8486H6.22461ZM6.22461 22.7806H4.22461V24.7806H6.22461V22.7806ZM25.7745 22.7806V24.7806H27.7745V22.7806H25.7745ZM25.7745 16.8486H27.7745V14.8486H25.7745V16.8486ZM23.3247 16.8486H21.3247V18.8486H23.3247V16.8486ZM10.6751 12.2887C10.6751 9.34787 13.0591 6.96387 15.9999 6.96387V2.96387C10.8499 2.96387 6.67506 7.13873 6.67506 12.2887H10.6751ZM10.6751 16.8486V12.2887H6.67506V16.8486H10.6751ZM6.22461 18.8486H8.67506V14.8486H6.22461V18.8486ZM8.22461 22.7806V16.8486H4.22461V22.7806H8.22461ZM25.7745 20.7806H6.22461V24.7806H25.7745V20.7806ZM23.7745 16.8486V22.7806H27.7745V16.8486H23.7745ZM23.3247 18.8486H25.7745V14.8486H23.3247V18.8486ZM21.3247 12.2887V16.8486H25.3247V12.2887H21.3247ZM15.9999 6.96387C18.9407 6.96387 21.3247 9.34788 21.3247 12.2887H25.3247C25.3247 7.13874 21.1499 2.96387 15.9999 2.96387V6.96387Z"
                        fill="#ADBECB"
                        mask="url(#path-1-inside-1_728_3215)"
                      />
                      <path
                        d="M18.1402 23.8963C18.1402 24.1772 18.0848 24.4554 17.9773 24.715C17.8698 24.9746 17.7122 25.2104 17.5136 25.4091C17.3149 25.6077 17.079 25.7653 16.8195 25.8728C16.5599 25.9804 16.2817 26.0357 16.0008 26.0357C15.7198 26.0357 15.4416 25.9804 15.182 25.8728C14.9225 25.7653 14.6866 25.6077 14.488 25.4091C14.2893 25.2104 14.1317 24.9746 14.0242 24.715C13.9167 24.4554 13.8613 24.1772 13.8613 23.8963"
                        stroke="#ADBECB"
                        stroke-width="2"
                      />
                    </svg>
                  </a>
                </div>
              </div> */}
              <div
                className={
                  "dropdown dropdown-end " + (menuOpen ? "dropdown-open" : "")
                }
              >
                <button
                  tabIndex="0"
                  className={
                    "btn rounded-full px-4 relative " +
                    (props.activeWallet ? "btn-ghost" : "btn-primary") +
                    (props.unlockingWallet ? " loading" : "")
                  }
                  onClick={(e) => {
                    setMenuOpen(true);
                  }}
                  ref={menuRef}
                >
                  <div className="avatar absolute left-1">
                    <div className="rounded-full w-10 h-10">
                      {props.activeWallet && !props.unlockingWallet ? (
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
                  </div>
                  <div
                    className={
                      "mr-2 " +
                      (props.activeWallet && !props.unlockingWallet
                        ? "ml-10"
                        : "ml-2")
                    }
                  >
                    {props.activeWallet ? (
                      <>
                        <div className="text-xs text-left">
                          <span>{props.activeWallet.name}</span>
                          {props.activeWallet.isLedger ||
                          props.activeWallet.isKeplr ? (
                            <span
                              className={
                                "ml-1 border rounded-md pl-1.5 pr-2 py-px relative -top-px " +
                                (props.activeWallet.isLedger
                                  ? "text-purple-50 border-purple"
                                  : "text-teal-50 border-teal")
                              }
                              style={{ fontSize: "0.75em" }}
                            >
                              {props.activeWallet.isLedger
                                ? " Ledger"
                                : " Keplr"}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <div className="text-xs text-left text-type-tertiary">
                          {addressToShow}
                        </div>
                      </>
                    ) : (
                      "Connect Wallet"
                    )}
                  </div>
                </button>
                <div className="shadow-xl dropdown-content bg-base-300 rounded mt-1">
                  {/* {menuState === 6 && (
                    <NotificationsList
                      setMenuOpen={setMenuOpen}
                      setMenuState={setMenuState}
                      formattedIssueNotifications={formattedIssueNotifications}
                      formattedPullNotifications={formattedPullNotifications}
                      showNotificationListState={showNotificationListState}
                    />
                  )}
                  {menuState === 5 && (
                    <NotificationsCard
                      setMenuOpen={setMenuOpen}
                      setMenuState={setMenuState}
                      setFormattedIssueNotifications={
                        setFormattedIssueNotifications
                      }
                      setFormattedPullNotifications={
                        setFormattedPullNotifications
                      }
                      setShowNotificationListState={
                        setShowNotificationListState
                      }
                    />
                  )} */}
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
                                if (menuRef.current) {
                                  menuRef.current.blur();
                                }
                                props.notify("Copied to clipboard", "info");
                              }}
                            >
                              <span className="flex-1">Copy Address</span>
                            </a>
                          </li>
                          {props.activeWallet.isKeplr ||
                          props.activeWallet.isLedger ? (
                            ""
                          ) : (
                            <li>
                              <a
                                onClick={(e) => {
                                  props.downloadWalletForRemoteHelper();
                                  setMenuOpen(false);
                                  if (menuRef.current) {
                                    menuRef.current.blur();
                                  }
                                }}
                              >
                                Download Wallet
                              </a>
                            </li>
                          )}
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
                          <div className="border-b border-grey my-2"></div>
                          <li>
                            <a
                              href="#"
                              onClick={(e) => {
                                setMenuState(2);
                                e.preventDefault();
                              }}
                            >
                              Switch Wallet
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => {
                                setMenuOpen(false);
                                props.signOut();
                              }}
                            >
                              Log Out
                            </a>
                          </li>
                        </>
                      ) : (
                        ""
                      )}
                    </ul>
                  )}
                </div>
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
    unlockingWallet: state.wallet.unlockingWallet,
    userNotification: state.userNotification,
  };
};

export default connect(mapStateToProps, {
  downloadWalletForRemoteHelper,
  transferToWallet,
  signOut,
  notify,
  unlockKeplrWallet,
})(Header);
