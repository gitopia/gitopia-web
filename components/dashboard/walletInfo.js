import { useState } from "react";
import { notify } from "reapop";
import { connect } from "react-redux";
import { updateUserBalance } from "../../store/actions/wallet";
import Link from "next/link";
import shrinkAddress from "../../helpers/shrinkAddress";
import { signOut } from "../../store/actions/wallet";

function WalletInfo(props) {
  return (
    <div className="w-96 p-4 flex flex-col bg-[#28313C] rounded-2xl">
      <div className="px-2 flex">
        <div className="text-type-primary text-xs font-bold uppercase">
          Account
        </div>
        <div className="ml-auto flex">
          <div className="avatar">
            <div className="rounded-full w-6 h-6">
              <img src={props.avatarUrl}></img>
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
      <div className="mt-2 box-content px-2 h-[35.56rem]">
        <div className="mt-1 box-content h-24 w-full border border-[#404450] rounded-xl flex items-center">
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
          <div className="text-type-primary text-2xl font-bold ml-6">
            $20,500.45
          </div>
        </div>
        <div className="text-type-primary text-xs font-bold uppercase mt-6 mb-4">
          Tokens
        </div>
        <div className="flex p-3 box-content h-7 bg-white bg-opacity-10 rounded-xl flex">
          <div className="">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_22_289)">
                <rect
                  y="0.692383"
                  width="24"
                  height="24"
                  rx="12"
                  fill="#505D7D"
                />
                <g clip-path="url(#clip1_22_289)">
                  <path
                    d="M15.6551 16.5495L11.9999 8.19446L8.34473 16.5495H11.5714V17.8352H12.4285V16.5495H15.6551Z"
                    fill="#FCFCFC"
                  />
                  <path
                    d="M15.2783 13.5495H16.9792L14.1428 7.87677L13.4248 9.31287L15.2783 13.5495Z"
                    fill="#FCFCFC"
                  />
                  <path
                    d="M10.5749 9.31287L9.85686 7.87677L7.02051 13.5495H8.72137L10.5749 9.31287Z"
                    fill="#FCFCFC"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_22_289">
                  <rect
                    y="0.692383"
                    width="24"
                    height="24"
                    rx="12"
                    fill="white"
                  />
                </clipPath>
                <clipPath id="clip1_22_289">
                  <rect
                    width="10.2857"
                    height="10.2857"
                    fill="white"
                    transform="translate(6.85693 7.5495)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="ml-3">Treecoin</div>
          <div className="ml-auto flex mr-4">
            <div className="text-type-primary text-xs mr-3 mt-1.5">Recieve</div>
            <Link className="hover:cursor-pointer" href="/assets/withdraw">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_22_357)">
                  <path
                    d="M16 8.5V20.375"
                    stroke="white"
                    stroke-width="1.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.375 14.75L16 20.375L21.625 14.75"
                    stroke="white"
                    stroke-width="1.2"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.125 22.875H22.875"
                    stroke="white"
                    stroke-width="1.2"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                </g>
                <rect
                  x="0.5"
                  y="0.5"
                  width="31"
                  height="31"
                  rx="15.5"
                  stroke="white"
                  stroke-opacity="0.2"
                />
                <defs>
                  <clipPath id="clip0_22_357">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(6 6)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
          </div>
          <div className="border-l-2 border-[#5A6068] h-8"></div>
          <div className="ml-4 flex">
            <div className="text-type-primary text-xs mr-3 mt-1.5">Send</div>
            <Link className="mr-1" href="/assets/deposit">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_22_365)">
                  <path
                    d="M10.5757 20.5757L10.1515 21L11 21.8485L11.4243 21.4243L10.5757 20.5757ZM21.4243 11.4243C21.6586 11.1899 21.6586 10.8101 21.4243 10.5757C21.1899 10.3414 20.8101 10.3414 20.5757 10.5757L21.4243 11.4243ZM11.4243 21.4243L21.4243 11.4243L20.5757 10.5757L10.5757 20.5757L11.4243 21.4243Z"
                    fill="white"
                  />
                  <path
                    d="M12.875 11H21V19.125"
                    stroke="white"
                    stroke-width="1.2"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                  />
                </g>
                <rect
                  x="0.5"
                  y="0.5"
                  width="31"
                  height="31"
                  rx="15.5"
                  stroke="white"
                  stroke-opacity="0.2"
                />
                <defs>
                  <clipPath id="clip0_22_365">
                    <rect
                      width="20"
                      height="20"
                      fill="white"
                      transform="translate(6 6)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </Link>
          </div>
        </div>
        <div className="mt-2 p-4 box-content h-5 bg-white bg-opacity-10 rounded-xl flex"></div>
        <div className="mt-2 p-4 box-content h-5 bg-white bg-opacity-10 rounded-xl flex"></div>
        <div className="mt-2 p-4 box-content h-5 bg-white bg-opacity-10 rounded-xl flex"></div>
        <div className="mt-10 border-b border-[#3E4051] w-[21rem]"></div>
        <div className="text-type-primary text-xs font-bold uppercase mt-2 mb-2">
          LORE REWARDS
        </div>
        <div className="mt-1 p-4 bg-grey box-content h-14 rounded-lg flex">
          <div className="mt-1 border border-[#747D96] h-8 w-8 rounded-full">
            <svg
              width="11"
              height="21"
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
          <div className="ml-2">
            <div className="font-semibold text-3xl">0</div>
            <div className="font-bold text-xs">≈$0.0</div>
          </div>
          <Link href="">
            <a className="mt-4 ml-auto h-8 px-3.5 py-2 w-32 rounded text-white text-xs font-bold bg-green active:bg-green hover:bg-green-400 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 uppercase">
              claim rewards
            </a>
          </Link>
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
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  notify,
  signOut,
})(WalletInfo);
