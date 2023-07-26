import { connect } from "react-redux";
import Link from "next/link";
import { downloadWalletForRemoteHelper } from "../store/actions/wallet";

function PromptBackupWallet({ ...props }) {
  if (!props.backupState && !props.nonBackupFriendly) {
    return (
      <div className="bg-box-grad-tl bg-base-200 p-4 rounded-md">
        <div className="text-lg">Backup your wallet</div>
        <div className="text-xs mt-2 text-type-secondary">
          Your local wallet is not backed up. Please download and save it
          securely.
        </div>
        <div className="mt-4">
          <button
            onClick={props.downloadWalletForRemoteHelper}
            className="btn btn-secondary btn-wide btn-sm"
          >
            Download Wallet
          </button>
        </div>
      </div>
    );
  } else return "";
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    nonBackupFriendly:
      state.wallet.activeWallet?.isLedger || state.wallet.activeWallet?.isKeplr,
    backupState: state.wallet.backupState,
  };
};

export default connect(mapStateToProps, { downloadWalletForRemoteHelper })(
  PromptBackupWallet
);
