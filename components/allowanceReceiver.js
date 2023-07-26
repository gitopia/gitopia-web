import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateUserAllowance } from "../store/actions/wallet";
import { notify } from "reapop";
import Link from "next/link";

function AllowanceReceiver(props) {
  const [loading, setLoading] = useState(false);
  const [isBalanceLow, setIsBalanceLow] = useState(
    Number(props.balance) <= 500 && Number(props.allowance) <= 500
  );

  useEffect(() => {
    setIsBalanceLow(
      Number(props.balance) <= 500 && Number(props.allowance) <= 500
    );
  }, [props.balance, props.allowance]);

  const checkAllowance = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    await props.updateUserAllowance();
    setLoading(false);
  };

  return isBalanceLow ? (
    <div className="bg-box-grad-tl bg-base-200 p-4 rounded-md mb-4">
      <div>
        <div className="text-lg">Get Fee Grant</div>
        <div className="text-xs mt-2 text-type-secondary">
          You can ask for a fee grant to start using Gitopia without buying any{" "}
          {(process.env.NEXT_PUBLIC_CURRENCY_TOKEN || "").toUpperCase()}
        </div>
      </div>
      <div className="mt-4">
        <Link
          className={"btn btn-sm btn-primary btn-wide"}
          href="/login?step=5"
          rel="noreferrer"
        >
          Request Grant
        </Link>
      </div>
    </div>
  ) : (
    ""
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    allowance: state.wallet.allowance,
    balance: state.wallet.balance,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  updateUserAllowance,
  notify,
})(AllowanceReceiver);
