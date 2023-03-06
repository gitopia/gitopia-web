import { useEffect, useState } from "react";
import { notify } from "reapop";
import { connect } from "react-redux";
import { updateUserBalance } from "../../store/actions/wallet";
import shrinkAddress from "../../helpers/shrinkAddress";
import { signOut } from "../../store/actions/wallet";
import getBalanceInDollars from "../../helpers/getWalletBalanceInDollars";
import { useRouter } from "next/router";
import { getAddressforChain } from "../../store/actions/wallet";
import { getAssetList } from "../../helpers/getIbcAssetList";
import { coingeckoId } from "../../ibc-assets-config";

function WalletInfo(props) {
  const [totalBalance, setTotalBalance] = useState(0);
  const [tokenBalances, setTokenBalances] = useState({});
  const [assets, setAssets] = useState([]);
  const router = useRouter();
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
    getWalletbalance();
    getAssets();
  }, [props.selectedAddress]);

  return (
    <div className="w-96 sm:w-[164] p-4 flex flex-col bg-[#28313C] rounded-2xl">
      <div className="flex">
        <div className="text-type-primary text-xs font-bold uppercase">
          Account
        </div>
        <div className="ml-auto flex">
          <div className="avatar">
            <div className="rounded-full w-6 h-6">
              <img
                src={
                  props.avatarUrl
                    ? props.avatarUrl
                    : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&background=c52a7d&caps=1&name=" +
                      props.selectedAddress.slice(-1)
                }
              ></img>
            </div>
          </div>
          <div className="text-xs mt-1 ml-2">
            {shrinkAddress(props.selectedAddress)}
          </div>
          <div
            className="ml-2 mt-1 hover:cursor-pointer"
            onClick={() => {
              props.setMenuOpen(false);
              props.signOut();
            }}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.22705 8.5625L13.2271 8.5625"
                stroke="white"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M10.9544 11.267L13.6816 8.53977L10.9544 5.8125"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.31787 3.0625H2.31787V14.0625H8.31787"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
        <div className="text-type-primary text-xs font-bold uppercase mt-6 mb-4">
          Tokens
        </div>
        <div className="flex p-3 box-content bg-grey-50 rounded-xl mb-3 items-center justify-center text-sm group">
          <div className="flex-none">
            <img width={24} src={"/tokens/gitopia.svg"} />
          </div>
          <div className="mx-3 flex-1">{"Gitopia"}</div>

          <div className="">
            {props.loreBalance / 1000000 +
              " " +
              process.env.NEXT_PUBLIC_CURRENCY_TOKEN}
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
        {assets.map((asset, index) => {
          return (
            <div
              className="flex p-3 box-content bg-grey-50 rounded-xl mb-3 items-center justify-center text-sm group"
              key={index}
            >
              <div className="">
                <img width={24} src={asset.logo_URIs?.png} />
              </div>
              <div className="mx-3 flex-1">{asset.chain_name}</div>
              <div className="lowercase">
                {(tokenBalances[asset.base_denom] /
                  Math.pow(10, coingeckoId[asset.base_denom]?.coinDecimals) ||
                  0) +
                  " " +
                  coingeckoId[asset.base_denom]?.coinDenom}
              </div>
              <div className="flex transition-all items-center cursor-pointer text-type-secondary opacity-0 w-0 group-hover:opacity-100 group-hover:w-20 group-hover:ml-3">
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
              </div>
            </div>
          );
        })}
        <div className="text-type-primary text-xs font-bold uppercase mt-6 mb-4">
          LORE REWARDS
        </div>
        <div className="mt-1 p-4 box-content h-14 rounded-lg flex bg-rewards-grad">
          <div className="mt-1 border border-grey-300 h-8 w-8 rounded-full flex items-center justify-center">
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
          <div className="ml-2 flex-1">
            <div className="font-semibold text-3xl">0</div>
            <div className="font-bold text-xs text-type-tertiary">≈ $0.0</div>
          </div>
          <div disabled={true} className="btn btn-primary btn-sm mt-3">
            Claim Rewards
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    loreBalance: state.wallet.loreBalance,
    advanceUser: state.user.advanceUser,
    avatarUrl: state.user.avatarUrl,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  notify,
  signOut,
  getAddressforChain,
})(WalletInfo);
