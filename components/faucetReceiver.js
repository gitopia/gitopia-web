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
    <div className="my-8">
      <div className="text-md mx-8 border-b border-grey py-2 mb-4">Faucet</div>
      <div className="mx-8">
        <button
          className={"btn btn-xs " + (loading === 1 ? "loading" : "")}
          onClick={() => getTokens(1)}
        >
          Claim free LORE
        </button>
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
