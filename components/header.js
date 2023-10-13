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
  unlockLeapWallet,
} from "../store/actions/wallet";
import { setIbcAssets } from "../store/actions/ibcAssets";
import { getAssetList } from "../helpers/getIbcAssetList";
import shrinkAddress from "../helpers/shrinkAddress";
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

  let addressToShow = "";
  if (props.selectedAddress) {
    addressToShow = "gitopia" + shrinkAddress(props.selectedAddress);
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

  const headerMessage = process.env.NEXT_PUBLIC_HEADER_MESSAGE;

  const kelprWalletChange = async () => {
    console.log("Keplr wallet change", props.activeWallet);
    if (props.activeWallet && props.activeWallet.isKeplr) {
      await props.unlockKeplrWallet();
    }
  };

  const leapWalletChange = async () => {
    console.log("Leap wallet change", props.activeWallet);
    if (props.activeWallet && props.activeWallet.isLeap) {
      await props.unlockLeapWallet();
    }
  };

  const getWalletBadge = (wallet) => {
    let text = "";
    if (wallet.isLedger) {
      text = "Ledger";
    } else if (wallet.isKeplr) {
      text = "Keplr";
    } else if (wallet.isLeap) {
      text = "Leap";
    } else if (wallet.isMetamask) {
      text = "Metamask";
    } else {
      return "";
    }
    let badge = (
      <span
        className={
          "ml-1 border rounded-md pl-1.5 pr-2 py-px relative -top-px text-purple-50 border-purple"
        }
        style={{ fontSize: "0.75em" }}
      >
        {text}
      </span>
    );
    return badge;
  }

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
    window.addEventListener("leap_keystorechange", leapWalletChange);

    return () => {
      window.removeEventListener("keplr_keystorechange", kelprWalletChange);
      window.removeEventListener("leap_keystorechange", leapWalletChange);
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
          homeUrl={"/home"}
          chainId={chainId}
        ></Drawer>
        <div
          className={
            "flex-none sm:px-6 transition-all ease-out delay-150 sm:w-42"
          }
        >
          <Link href={"/home"}>
            <img
              width={80}
              src="/logo-white.svg"
              className="cursor-pointer mt-2"
            ></img>
          </Link>
        </div>
        {!isMobile ? <SearchBar /> : ""}
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
              <div
                className={
                  "dropdown dropdown-end " + (menuOpen ? "dropdown-open" : "")
                }
              >
                <button
                  tabIndex="0"
                  data-test="wallet-menu"
                  className={
                    "btn btn-outline rounded-full px-4 relative hover:bg-base-300 hover:text-white " +
                    (props.activeWallet ? "btn-ghost" : "btn-primary") +
                    (props.unlockingWallet ? " loading" : "") +
                    (menuOpen ? " bg-base-300" : "")
                  }
                  onClick={(e) => {
                    setMenuOpen(true);
                    if (props.activeWallet) setMenuState(1);
                    e.preventDefault();
                    props.setIbcAssets(assets);
                  }}
                  ref={menuRef}
                >
                  <div className="avatar absolute left-1">
                    <div className="rounded-full w-10 h-10">
                      {props.activeWallet && !props.unlockingWallet ? (
                        props.avatarUrl ? (
                          <img
                            src={props.avatarUrl}
                            data-test="current_wallet_avatar"
                          />
                        ) : (
                          <span className="bg-purple-900 flex items-center justify-center text-xl uppercase h-full">
                            {props.activeWallet.name[0]}
                          </span>
                        )
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
                          <span data-test="current_wallet_name">
                            {props.activeWallet.name}
                          </span>
                          {getWalletBadge(props.activeWallet)}
                        </div>
                        <div
                          className="text-xs text-left text-type-tertiary"
                          data-test="current_wallet_address"
                        >
                          {addressToShow}
                        </div>
                      </>
                    ) : (
                      "Connect Wallet"
                    )}
                  </div>
                </button>
                <div className="shadow-xl dropdown-content bg-base-300 rounded mt-1">
                  {menuState === 1 && menuOpen && (
                    <WalletInfo
                      setMenuOpen={setMenuOpen}
                      setMenuState={setMenuState}
                      setOpenDeposit={setOpenDeposit}
                      setOpenWithdraw={setOpenWithdraw}
                    />
                  )}
                  {menuState === 2 && (
                    <CurrentWallet setMenuOpen={setMenuOpen} />
                  )}
                  {menuState === 3 && menuOpen && (
                    <SendTlore
                      setMenuOpen={setMenuOpen}
                      transferToWallet={props.transferToWallet}
                      setMenuState={setMenuState}
                    />
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
    balance: state.wallet.balance,
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
  unlockLeapWallet,
  setIbcAssets,
})(Header);
