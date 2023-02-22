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
import { setIbcAssets } from "../store/actions/ibcAssets";
import { getAssetList } from "../helpers/getIbcAssetList";
import shrinkAddress from "../helpers/shrinkAddress";
import getHomeUrl from "../helpers/getHomeUrl";
import { notify } from "reapop";

import dynamic from "next/dynamic";
import getNodeInfo from "../helpers/getNodeInfo";
const SendTlore = dynamic(() => import("./dashboard/sendTlore"));
const CurrentWallet = dynamic(() => import("./currentWallet"));
import Drawer from "./drawer";
import useWindowSize from "../hooks/useWindowSize";
import WalletInfo from "./dashboard/walletInfo";
import SearchBar from "./searchBar";
import DepositIbcAsset from "./assets/deposit";
import WithdrawIbcAsset from "./assets/withdraw";
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
6 - Wallet
*/

function Header(props) {
  const [menuState, setMenuState] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chainId, setChainId] = useState("");
  const [assets, setAssets] = useState([]);
  const [unread, setUnread] = useState(false);
  const router = useRouter();
  const menuRef = useRef();
  const [formattedIssueNotifications, setFormattedIssueNotifications] =
    useState([]);
  const [showNotificationListState, setShowNotificationListState] =
    useState("");
  const { isMobile } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);

  const onUserMenuClose = () => {
    setMenuOpen(false);
    if (menuRef.current) {
      menuRef.current.blur();
    }
  };

  let addressToShow = "",
    avatarUrl = "";
  if (props.selectedAddress) {
    addressToShow = "gitopia"+ shrinkAddress(props.selectedAddress);
    if (props.avatarUrl) {
      avatarUrl = props.avatarUrl;
    } else {
      avatarUrl =
        "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&background=c52a7d&caps=1&name=" +
        addressToShow.slice(-1);
    }
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

  useEffect(unreadNotification, [props.userNotification]);

  useEffect(() => {
    onUserMenuClose();
    if (props.activeWallet) setMenuState(1);
    else setMenuState(2);
  }, [props.activeWallet]);

  const [homeUrl, setHomeUrl] = useState(
    getHomeUrl(props.dashboards, props.currentDashboard)
  );

  useEffect(() => {
    setHomeUrl(getHomeUrl(props.dashboards, props.currentDashboard));
  }, [props.dashboards, props.currentDashboard]);

  const headerMessage = process.env.NEXT_PUBLIC_HEADER_MESSAGE;

  const kelprWalletChange = async () => {
    console.log("Keplr wallet change", props.activeWallet);
    if (props.activeWallet && props.activeWallet.isKeplr) {
      await props.unlockKeplrWallet();
    }
  };

  useEffect(() => {
    const updateNetworkName = async () => {
      if (process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES) {
        const info = await getNodeInfo();
        setChainId(info.default_node_info.network);
      }
    };
    const getIbcAssets = async () => {
      const assets = await getAssetList();
      setAssets(assets);
    };
    getIbcAssets();
    updateNetworkName();
  }, []);

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", kelprWalletChange);
    return () => {
      window.removeEventListener("keplr_keystorechange", kelprWalletChange);
    };
  }, [null, props.activeWallet]);

  return (
    <>
      {headerMessage && headerMessage !== "" ? (
        <div className="flex bg-purple-900 justify-center items-center text-xs px-6 py-2 sm:p-2 text-purple-50">
          <span>{headerMessage}</span>
        </div>
      ) : (
        ""
      )}
      <div className="navbar border-b border-grey bg-base-100 text-base-content sticky top-0 z-20 sm:relative ">
        {isMobile ? (
          <div className="items-stretch">
            <a
              className="btn btn-ghost btn-sm rounded-btn"
              onClick={() => setIsOpen(true)}
              target="_blank"
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </a>
          </div>
        ) : (
          ""
        )}
        <Drawer
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          homeUrl={homeUrl}
          chainId={chainId}
        ></Drawer>
        <div
          className={"flex-none sm:px-6 transition-all ease-out delay-150 sm:w-42"}
        >
          <Link href={homeUrl}>
            <img
              width={80}
              src="/logo-white.svg"
              className="cursor-pointer mt-2"
            ></img>
          </Link>
        </div>
        {!isMobile ? (
          <SearchBar />) : ""}
        {!isMobile ? (
          <div className="items-stretch">
            <a
              className="btn btn-ghost btn-sm rounded-btn"
              href={process.env.NEXT_PUBLIC_EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
            >
              Explorer
            </a>
          </div>
        ) : (
          ""
        )}
        {!isMobile ? (
          <div className="items-stretch">
            <a
              className="btn btn-ghost btn-sm rounded-btn"
              href={process.env.NEXT_PUBLIC_DOCS_URL}
              target="_blank"
              rel="noreferrer"
            >
              Docs
            </a>
          </div>
        ) : (
          ""
        )}
        {!isMobile ? (
          <div className="items-stretch">
            <a
              className="btn btn-ghost btn-sm rounded-btn"
              href={process.env.NEXT_PUBLIC_FORUM_URL}
              target="_blank"
              rel="noreferrer"
            >
              Forum
            </a>
          </div>
        ) : (
          ""
        )}
        <div className="flex-1"></div>
        {process.env.NEXT_PUBLIC_NETWORK_RELEASE_NOTES && !isMobile ? (
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
                rel="noreferrer"
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
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.9999 4.96387C11.9545 4.96387 8.67506 8.2433 8.67506 12.2887V16.8486H6.22461V22.7806H25.7745V16.8486H23.3247V12.2887C23.3247 8.24331 20.0453 4.96387 15.9999 4.96387Z"
                      />
                    </svg>
                  </a>
                </div>
              </div> */}
              {props.selectedAddress !== null && !isMobile ? (
                <div>
                  <div className="indicator flex-none mr-4">
                    <a
                      className="btn btn-circle btn-outline btn-sm w-12 h-12"
                      href="#"
                      onClick={(e) => {
                        setMenuOpen(true);
                        setMenuState(6);
                        e.preventDefault();
                        props.setIbcAssets(assets);
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4 5H20C21.1046 5 22 5.89543 22 7V9H14V16H22V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V7C2 5.89543 2.89543 5 4 5ZM22 14V11H16V14H22ZM24 16V18C24 20.2091 22.2091 22 20 22H4C1.79086 22 0 20.2091 0 18V7C0 4.79086 1.79086 3 4 3H20C22.2091 3 24 4.79086 24 7V9V16Z"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                ""
              )}

              <div
                className={
                  "dropdown dropdown-end " + (menuOpen ? "dropdown-open" : "")
                }
              >
                <button
                  tabIndex="0"
                  className={
                    "btn btn-outline rounded-full px-4 relative " +
                    (props.activeWallet ? "btn-ghost" : "btn-primary") +
                    (props.unlockingWallet ? " loading" : "")
                  }
                  onClick={(e) => {
                    setMenuOpen(true);
                    if (props.activeWallet) setMenuState(1);
                  }}
                  ref={menuRef}
                >
                  <div className="avatar absolute left-1">
                    <div className="rounded-full w-10 h-10">
                      {props.activeWallet && !props.unlockingWallet ? (
                        <img src={avatarUrl} />
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
                  {menuState === 6 && menuOpen && (
                    <WalletInfo
                      setMenuOpen={setMenuOpen}
                      setMenuState={setMenuState}
                      setOpenDeposit={setOpenDeposit}
                      setOpenWithdraw={setOpenWithdraw}
                    />
                  )}
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
                          {isMobile ? (
                            <li>
                              <a
                                href="#"
                                onClick={(e) => {
                                  setMenuState(6);
                                  e.preventDefault();
                                }}
                              >
                                IBC Transfer
                              </a>
                            </li>
                          ) : (
                            ""
                          )}
                          <li>
                            <Link
                              href={
                                props.username
                                  ? "/" + props.username
                                  : "/" + props.selectedAddress
                              }
                            >
                              My Profile
                            </Link>
                          </li>
                          <li>
                            <Link href="/settings">Settings</Link>
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
        <DepositIbcAsset
          openDeposit={openDeposit}
          setOpenDeposit={setOpenDeposit}
        />
        <WithdrawIbcAsset
          openWithdraw={openWithdraw}
          setOpenWithdraw={setOpenWithdraw}
        />
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
    avatarUrl: state.user.avatarUrl,
    username: state.user.username,
  };
};

export default connect(mapStateToProps, {
  downloadWalletForRemoteHelper,
  transferToWallet,
  signOut,
  notify,
  unlockKeplrWallet,
  setIbcAssets,
})(Header);
