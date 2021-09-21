import { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { getBalance } from "../store/actions/wallet";

function FaucetReceiver(props) {
  const [loading, setLoading] = useState(0);

  const getTokens = (amount) => {
    if (loading !== 0) return;
    setLoading(amount);

    axios
      .post(
        process.env.NODE_ENV === "development"
          ? "/api/faucet"
          : process.env.NEXT_PUBLIC_FAUCET_URL,
        {
          address: props.selectedAddress,
        },
        { timeout: 5000 }
      )
      .then((res) => props.getBalance())
      .catch((err) => console.error(err))
      .finally(() => setLoading(0));
  };

  return (
    <div className="bg-footer-grad py-6">
      <div className="text-xs text-type-secondary mx-8 mb-4">
        &copy; Gitopia {new Date().getFullYear()}
      </div>
      <div className="mx-6">
        <button
          className={"btn btn-xs btn-link " + (loading === 1 ? "loading" : "")}
          onClick={() => getTokens(1)}
          disabled={loading}
        >
          Claim free LORE
        </button>
        {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ? (
          <a
            className={"btn btn-xs btn-link mt-2"}
            href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
            target="_blank"
          >
            View source code
          </a>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    loreBalance: state.wallet.loreBalance,
  };
};

export default connect(mapStateToProps, {
  getBalance,
})(FaucetReceiver);
