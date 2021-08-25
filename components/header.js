import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ClickAwayListener from "react-click-away-listener";
import CurrentWallet from "./currentWallet";
import {
  downloadWalletForRemoteHelper,
  signOut,
} from "../store/actions/wallet";
import shrinkAddress from "../helpers/shrinkAddress";
import getHomeUrl from "../helpers/getHomeUrl";
import _ from "lodash";
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

  let addressToShow;
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

  return (
    <div className="navbar border-b border-grey bg-base-100 text-base-content">
      <div className="flex-none lg:hidden">
        <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
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
        </label>
      </div>
      <div className="flex-none px-6">
        <Link href={homeUrl}>
          <img
            width={120}
            height={30}
            src="/logo-white.svg"
            className="cursor-pointer"
          ></img>
        </Link>
      </div>
      <div className="flex-none mr-2">
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
      </div>
      <div className="items-stretch">
        <a
          className="btn btn-ghost btn-sm rounded-btn"
          href="https://explorer.gitopia.com/"
          target="_blank"
        >
          Explorer
        </a>
      </div>
      <div className="flex-1"></div>
      {props.activeWallet ? (
        <div className="flex-none mr-4">
          <div className="badge badge-secondary">
            {props.loreBalance / 1000000} LORE
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
                "btn btn-primary rounded-full px-4 avatar relative " +
                (props.activeWallet ? "btn-outline" : "")
              }
              onClick={(e) => {
                if (!props.activeWallet && !props.wallets.length) {
                  router.push("/login");
                  return;
                }
                setMenuOpen(true);
              }}
            >
              <div className="rounded-full w-10 h-10 absolute left-1">
                {props.activeWallet ? (
                  <img
                    src={
                      "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&background=c52a7d&caps=1&name=" +
                      props.activeWallet.name
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
                    </div>
                    <div className="text-xs text-base-content">
                      {addressToShow}
                    </div>
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </div>
            </button>
            <div className="shadow dropdown-content bg-base-300 rounded-box mt-2">
              {menuState === 2 && <CurrentWallet />}
              {menuState === 1 && (
                <ul className="menu w-48 rounded-box">
                  {props.activeWallet ? (
                    <>
                      <li>
                        <a
                          onClick={(e) => {
                            navigator.clipboard.writeText(
                              props.selectedAddress
                            );
                            setMenuOpen(false);
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
                      <li>
                        <a>Assets</a>
                      </li>
                      <li>
                        <a>Transactions</a>
                      </li>
                      <li className="h-4">
                        <div className="border-b border-grey mt-2"></div>
                      </li>{" "}
                    </>
                  ) : (
                    ""
                  )}

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
                  <li>
                    <Link href="/login">
                      <a>Create New Wallet</a>
                    </Link>
                  </li>
                  {props.activeWallet ? (
                    <>
                      <li className="h-4">
                        <div className="border-b border-grey mt-2"></div>
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
  };
};

export default connect(mapStateToProps, {
  downloadWalletForRemoteHelper,
  signOut,
})(Header);
