import { useEffect, useState } from "react";
import { notify } from "reapop";
import { connect } from "react-redux";
import { updateUserBalance } from "../../store/actions/wallet";
import { signOut } from "../../store/actions/wallet";
import getBalanceInDollars from "../../helpers/getWalletBalanceInDollars";
import {
  getAddressforChain,
  downloadWalletForRemoteHelper,
} from "../../store/actions/wallet";
import { getAssetList } from "../../helpers/getIbcAssetList";
import { coingeckoId } from "../../ibc-assets-config";
import getRewardToken from "../../helpers/getRewardTokens";
import getTokenValueInDollars from "../../helpers/getTotalTokenValueInDollars";
import Link from "next/link";

function WalletInfo(props) {
  const [totalBalance, setTotalBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState({});
  const [rewards, setRewards] = useState(0);
  const [rewardsDollarValue, setRewardsDollarValue] = useState(0);
  const [assets, setAssets] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [accountLink, setAccountLink] = useState("");
  useEffect(() => {
    async function getWalletbalance() {
      let a = await getBalanceInDollars(props.selectedAddress);
      if (a) {
        setTotalBalance(a.totalPrice);
        setTokenBalances(a.TokenBalances);
      }
    }
    async function getAssets() {
      let assets = await getAssetList();
      if (assets) {
        setAssets(assets);
      }
    }
    async function getRewards() {
      let tokens = await getRewardToken(props.selectedAddress);
      if (tokens) {
        setRewards(tokens.claimed_amount.amount);
        let dollar = await getTokenValueInDollars(
          tokens.claimed_amount.denom,
          tokens.claimed_amount.amount
        );
        if (dollar) {
          setRewardsDollarValue(dollar);
        }
      }
    }

    getWalletbalance();
    getAssets();
    getRewards();
  }, [props.selectedAddress]);

  useEffect(() => {
    setAccountName(props.userName ? props.userName : props.userUsername);
    setAccountLink("/" + props.userUsername);
  }, [props.userName, props.userUsername]);

  return (
    <div className="w-96 p-4 flex flex-col rounded-2xl overflow-hidden">
      <div className="flex items-center">
        <div className="">
          <Link
            className="text-sm font-bold text-type-primary mr-4 link-primary hover:underline"
            href={accountLink}
          >
            {accountName}
          </Link>
        </div>
        <div className="ml-auto flex gap-2">
          <div
            className="tooltip tooltip-bottom tooltip-secondary"
            data-tip="Copy Address"
          >
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={(e) => {
                navigator.clipboard.writeText(props.selectedAddress);
                props.notify("Copied to clipboard", "info");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                />
              </svg>
            </button>
          </div>
          <div
            className="tooltip tooltip-bottom tooltip-secondary"
            data-tip="Settings"
          >
            <Link className="btn btn-sm btn-circle btn-ghost" href="/settings">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
            </Link>
          </div>
          {props.activeWallet.isKeplr || props.activeWallet.isLedger ? (
            ""
          ) : (
            <div
              className="tooltip tooltip-bottom tooltip-secondary"
              data-tip="Download"
            >
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={props.downloadWalletForRemoteHelper}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
            </div>
          )}
          <div
            className="tooltip tooltip-bottom tooltip-secondary"
            data-tip="Switch"
          >
            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => {
                props.setMenuState(2);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 box-content">
        <div className="mt-1 box-content h-20 w-full border border-grey-50 rounded-xl flex items-center">
          <svg
            width="36"
            height="37"
            viewBox="0 0 36 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-6"
          >
            <path
              opacity="0.4"
              d="M0 18.3461C0 28.1227 7.92552 36.0482 17.7021 36.0482V18.3461H0Z"
              fill="#BFC4F0"
            />
            <path
              opacity="0.2"
              d="M0 18.3461C0 8.56944 7.92552 0.643921 17.7021 0.643921V18.3461H0Z"
              fill="#BFC4F0"
            />
            <path
              opacity="0.2"
              d="M35.4043 18.3461C35.4043 28.1227 27.4788 36.0482 17.7021 36.0482V18.3461H35.4043Z"
              fill="#BFC4F0"
            />
            <path
              opacity="0.4"
              d="M35.4043 18.3461C35.4043 8.56944 27.4788 0.643921 17.7021 0.643921V18.3461H35.4043Z"
              fill="#BFC4F0"
            />
          </svg>
          <div className="text-sm text-type-primary ml-4">Total Balance</div>
          <div className="text-type-primary text-2xl font-bold mx-6 text-right flex-1">
            ${totalBalance}
          </div>
        </div>
        <div className="text-type-primary text-xs font-bold mt-6 mb-4">
          Tokens
        </div>
        <div
          className={
            "flex p-3 box-content bg-grey-50 items-center justify-center text-sm group" +
            (props.allowance ? " rounded-t-xl" : " rounded-xl mb-3")
          }
        >
          <div className="flex-none">
            <img width={24} src={"/tokens/gitopia.svg"} />
          </div>
          <div className="mx-3 flex-1">{"Gitopia"}</div>

          <div className="">
            {props.balance / 1000000 +
              " " +
              (process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()}
          </div>
          <div className="flex transition-all items-center cursor-pointer text-type-secondary opacity-0 w-0 group-hover:opacity-100 group-hover:w-8 group-hover:ml-3">
            <div
              className="btn btn-circle btn-sm btn-outline tooltip tooltip-bottom tooltip-secondary"
              data-tip="Send"
              onClick={() => {
                props.setMenuState(3);
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path
                    d="M10.5757 20.5757L10.1515 21L11 21.8485L11.4243 21.4243L10.5757 20.5757ZM21.4243 11.4243C21.6586 11.1899 21.6586 10.8101 21.4243 10.5757C21.1899 10.3414 20.8101 10.3414 20.5757 10.5757L21.4243 11.4243ZM11.4243 21.4243L21.4243 11.4243L20.5757 10.5757L10.5757 20.5757L11.4243 21.4243Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.875 11H21V19.125"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="square"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
        {props.allowance ? (
          <div className="flex px-3 py-2 box-content bg-repo-grad-v bg-grey-50 rounded-b-xl mb-3 items-center justify-center text-sm group text-purple-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>

            <div className="mx-4 flex-1">{"Fee Grants"}</div>
            <div className="ml-2">
              {props.allowance / 1000000 +
                " " +
                (process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()}
            </div>
          </div>
        ) : (
          ""
        )}
        {assets.map((asset, index) => {
          return (
            <div
              className="flex p-3 box-content bg-grey-50 rounded-xl mb-3 items-center justify-center text-sm group"
              key={index}
            >
              <div className="">
                <img width={24} src={asset.logo_URIs?.png} />
              </div>
              <div className="mx-3 flex-1">
                {asset.chain_name === "osmosistestnet" ? "Osmosis" : "Atom"}
              </div>
              <div className="font-bold text-xs text-type-tertiary">
                coming soon
              </div>
              {/* <div className="lowercase">
                {(tokenBalances[asset.base_denom] /
                  Math.pow(10, coingeckoId[asset.base_denom]?.coinDecimals) ||
                  0) +
                  " " +
                  coingeckoId[asset.base_denom]?.coinDenom}
              </div> */}
              {/* <div className="flex transition-all items-center cursor-pointer text-type-secondary opacity-0 w-0 group-hover:opacity-100 group-hover:w-20 group-hover:ml-3">
                <div
                  className="btn btn-circle btn-sm btn-outline mr-3 tooltip tooltip-bottom tooltip-secondary"
                  data-tip="Deposit"
                  onClick={() => {
                    props
                      .getAddressforChain(
                        props.activeWallet.name,
                        asset.chain_name
                      )
                      .then((res) => {
                        if (res?.error) {
                          props.notify(res.message, "error");
                        } else {
                          props.setOpenDeposit(true);
                        }
                      });
                  }}
                  id={index}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M16 8.5V20.375"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.375 14.75L16 20.375L21.625 14.75"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.125 22.875H22.875"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>

                <div
                  className="btn btn-circle btn-sm btn-outline tooltip tooltip-bottom tooltip-secondary"
                  data-tip="Withdraw"
                  onClick={() => {
                    props
                      .getAddressforChain(
                        props.activeWallet.name,
                        asset.chain_name
                      )
                      .then((res) => {
                        if (res?.error) {
                          props.notify(res.message, "error");
                        } else {
                          props.setOpenWithdraw(true);
                        }
                      });
                  }}
                  id={index}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M10.5757 20.5757L10.1515 21L11 21.8485L11.4243 21.4243L10.5757 20.5757ZM21.4243 11.4243C21.6586 11.1899 21.6586 10.8101 21.4243 10.5757C21.1899 10.3414 20.8101 10.3414 20.5757 10.5757L21.4243 11.4243ZM11.4243 21.4243L21.4243 11.4243L20.5757 10.5757L10.5757 20.5757L11.4243 21.4243Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12.875 11H21V19.125"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="square"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </div>
              </div> */}
            </div>
          );
        })}
        <div className="text-type-primary text-xs font-bold mt-6 mb-4">
          Rewards
        </div>
        <div className="mt-1 p-4 box-content h-14 rounded-lg flex bg-rewards-grad items-center">
          <div className="border border-grey-300 h-8 w-8 rounded-full flex items-center justify-center">
            <svg
              width="11"
              height="18"
              viewBox="0 0 11 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-2.5 my-1"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.22377 10.0112C6.86119 10.0112 8.18862 8.68819 8.18862 7.05609C8.18862 5.42399 6.86119 4.10092 5.22377 4.10092C3.58633 4.10092 2.25893 5.42399 2.25893 7.05609C2.25893 8.68819 3.58633 10.0112 5.22377 10.0112ZM5.22377 12.2628C8.10878 12.2628 10.4476 9.9317 10.4476 7.05609C10.4476 4.18049 8.10878 1.84937 5.22377 1.84937C2.33876 1.84937 0 4.18049 0 7.05609C0 9.9317 2.33876 12.2628 5.22377 12.2628Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.2815 16.4299C6.11454 16.4299 6.91351 16.1001 7.50258 15.513C8.09165 14.9258 8.42254 14.1294 8.42254 13.2991H10.5166C10.5166 14.683 9.96502 16.0103 8.9833 16.9888C8.00152 17.9674 6.66991 18.5171 5.2815 18.5171C3.89306 18.5171 2.56148 17.9674 1.57971 16.9888C0.59794 16.0103 0.0463867 14.683 0.0463867 13.2991H2.14043C2.14043 14.1294 2.47136 14.9258 3.06043 15.513C3.64949 16.1001 4.44843 16.4299 5.2815 16.4299Z"
                fill="white"
              />
              <path d="M4.07129 0H6.43047V2.71324H4.07129V0Z" fill="white" />
              <path
                d="M4.07129 17.9075H6.43047V20.3796H4.07129V17.9075Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="mx-2 flex-1">
            <div className="font-semibold text-xl">
              {rewards / 1000000 +
                " " +
                (process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()}
            </div>
            {rewardsDollarValue ? (
              <div className="font-bold text-xs text-type-tertiary">
                &#8776;{"$" + rewardsDollarValue}
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            onClick={() => {
              if (window) {
                window.open("/rewards");
              }
            }}
            className="btn btn-primary btn-sm px-4"
          >
            {rewards ? "Claim Rewards" : "Check Eligibility"}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    balance: state.wallet.balance,
    allowance: state.wallet.allowance,
    advanceUser: state.user.advanceUser,
    avatarUrl: state.user.avatarUrl,
    userUsername: state.user.username,
    userName: state.user.name,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  notify,
  signOut,
  getAddressforChain,
  downloadWalletForRemoteHelper,
})(WalletInfo);
