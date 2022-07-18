import { useState } from "react";
import { notify } from "reapop";
import { connect } from "react-redux";
import { updateUserBalance } from "../../store/actions/wallet";

function WalletInfo(props) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-96 p-4 flex flex-col">
      <div>Account</div>
      <div className="mt-4 box-content p-4 h-56 w-80 bg-white bg-opacity-5 rounded-xl">
        <div className="mt-1 box-content p-4 h-5 w-72 bg-white bg-opacity-10 rounded-xl flex">
          <div>
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12.5625" r="12" fill="#66CE67" />
            </svg>
          </div>
          <div className="text-xs mt-1 ml-2">0xa36d...26a4</div>
          <div className="ml-auto">
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
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <path
                d="M10.9544 11.267L13.6816 8.53977L10.9544 5.8125"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8.31787 3.0625H2.31787V14.0625H8.31787"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="ml-36 mt-6 text-sm">Balance</div>
        <div className="text-2xl ml-24 pl-2 font-bold">$20,500.45</div>
        <div className="flex ml-10 mt-8">
          <div className="ml-8">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 12.5V24.375"
                stroke="white"
                stroke-width="1.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.375 18.75L20 24.375L25.625 18.75"
                stroke="white"
                stroke-width="1.2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <path
                d="M13.125 26.875H26.875"
                stroke="white"
                stroke-width="1.2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                stroke="white"
                stroke-opacity="0.2"
              />
            </svg>
            <div className="text-xs text-grey-300">Recieve</div>
          </div>
          <div className="ml-8">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5757 24.5757L14.1515 25L15 25.8485L15.4243 25.4243L14.5757 24.5757ZM25.4243 15.4243C25.6586 15.1899 25.6586 14.8101 25.4243 14.5757C25.1899 14.3414 24.8101 14.3414 24.5757 14.5757L25.4243 15.4243ZM15.4243 25.4243L25.4243 15.4243L24.5757 14.5757L14.5757 24.5757L15.4243 25.4243Z"
                fill="white"
              />
              <path
                d="M16.875 15H25V23.125"
                stroke="white"
                stroke-width="1.2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                stroke="white"
                stroke-opacity="0.2"
              />
            </svg>
            <div className="text-xs text-grey-300">Send</div>
          </div>
          <div className="ml-8">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.75 21.25L26.25 23.75L23.75 26.25"
                stroke="white"
                stroke-width="1.2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <path
                d="M13.75 23.15H13.15V24.35H13.75V23.15ZM26.25 24.35C26.5814 24.35 26.85 24.0814 26.85 23.75C26.85 23.4186 26.5814 23.15 26.25 23.15V24.35ZM13.75 24.35H26.25V23.15H13.75V24.35Z"
                fill="white"
              />
              <path
                d="M16.25 18.75L13.75 16.25L16.25 13.75"
                stroke="white"
                stroke-width="1.2"
                stroke-linecap="square"
                stroke-linejoin="round"
              />
              <path
                d="M26.25 16.85H26.85V15.65H26.25V16.85ZM13.75 15.65C13.4186 15.65 13.15 15.9186 13.15 16.25C13.15 16.5814 13.4186 16.85 13.75 16.85V15.65ZM26.25 15.65H13.75V16.85H26.25V15.65Z"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="39"
                height="39"
                rx="19.5"
                stroke="white"
                stroke-opacity="0.2"
              />
            </svg>
            <div className="text-xs text-grey-300">SWAP</div>
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
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  notify,
})(WalletInfo);
