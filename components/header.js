import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import ClickAwayListener from "react-click-away-listener";
import CurrentWallet from "./currentWallet";

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
    addressToShow = props.selectedAddress;
    let trimText = addressToShow.slice(10, 42);
    addressToShow = addressToShow.replace(trimText, "...");
  }

  useEffect(onUserMenuClose, [props.activeWallet]);

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
      <div className="flex-none px-6 w-64">
        <img width={120} height={30} src="/logo-white.svg"></img>
      </div>
      <div className="flex-none mr-6">
        <div className="form-control">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pr-16 input input-ghost input-bordered"
            />
            <button className="absolute right-0 top-0 rounded-l-none btn btn-ghost">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="items-stretch">
        <a className="btn btn-ghost btn-sm rounded-btn">Explore</a>
        <a className="btn btn-ghost btn-sm rounded-btn">Marketplace</a>
      </div>
      <div className="flex-1"></div>
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
                }
                setMenuOpen(true);
              }}
            >
              <div className="rounded-full w-10 h-10 absolute left-1">
                {props.activeWallet ? (
                  <img
                    src={
                      "https://i.pravatar.cc/500?img=" +
                      props.wallets.findIndex(
                        (x) => x.name === props.activeWallet.name
                      )
                    }
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                className={"mr-2 " + (props.activeWallet ? "ml-10" : "ml-2")}
              >
                {props.activeWallet
                  ? props.activeWallet.name
                  : "Connect Wallet"}
              </div>
            </button>
            <div className="shadow dropdown-content bg-base-300 rounded-box mt-2">
              {menuState === 2 && <CurrentWallet />}
              {menuState === 1 && (
                <ul className="menu w-48 rounded-box">
                  {props.activeWallet ? (
                    <>
                      {addressToShow && (
                        <li>
                          <a
                            onClick={(e) => {
                              navigator.clipboard.writeText(
                                props.activeWallet.accounts[0].address
                              );
                              setMenuOpen(false);
                            }}
                          >
                            <span className="flex-1">{addressToShow}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          </a>
                        </li>
                      )}
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
                        <a>Log Out</a>
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
  };
};

export default connect(mapStateToProps, {})(Header);
