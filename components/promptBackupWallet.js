import { connect } from "react-redux";
import Link from "next/link";
import { downloadWalletForRemoteHelper } from "../store/actions/wallet";

function PromptBackupWallet({ ...props }) {
  if (!props.backupState && !props.nonBackupFriendly) {
    return (
      <div>
        <div className="sm:flex bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
          <div className="flex">
            <div
              className={
                "w-14 h-14 flex-none mr-5 sm:mr-10 flex justify-center items-center rounded-full border border-grey"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>
            </div>

            <div className="flex-1 mr-8">
              <div className="text-lg">Backup your wallet</div>
              <div className="text-xs mt-2 text-type-secondary">
                Your local wallet is not backed up. Please download and save it
                securely.
              </div>
            </div>
          </div>
          <div className="flex-none w-60 mr-8 mt-4 sm:mt-0">
            <button
              onClick={props.downloadWalletForRemoteHelper}
              className="btn btn-secondary btn-block btn-sm"
            >
              Download Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  else
    return "";
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    nonBackupFriendly: state.wallet.activeWallet?.isLedger || state.wallet.activeWallet?.isKeplr,
    backupState: state.wallet.backupState,
  };
};

export default connect(mapStateToProps, {downloadWalletForRemoteHelper})(PromptBackupWallet);
