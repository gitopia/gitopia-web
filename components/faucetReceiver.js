import { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import TextInput from "./textInput";
import { getBalance } from "../store/actions/wallet";

function FaucetReceiver(props) {
  const [loading, setLoading] = useState(0);

  const getTokens = (amount) => {
    if (loading !== 0) return;
    setLoading(amount);
    if (process.env.NODE_ENV === "development") {
      axios
        .post(
          "/api/faucet",
          {
            address: props.selectedAddress,
            coins: [amount + process.env.NEXT_PUBLIC_CURRENCY_TOKEN],
          },
          { timeout: 5000 }
        )
        .then((res) => props.getBalance(process.env.NEXT_PUBLIC_CURRENCY_TOKEN))
        .catch((err) => console.error(err))
        .finally(() => setLoading(0));
    } else if (process.env.NODE_ENV === "production") {
      axios
        .post(
          process.env.NEXT_PUBLIC_FAUCET_URL,
          {
            address: props.selectedAddress,
          },
          { timeout: 5000 }
        )
        .then((res) => props.getBalance(process.env.NEXT_PUBLIC_CURRENCY_TOKEN))
        .catch((err) => console.error(err))
        .finally(() => setLoading(0));
    }
  };

  return (
    <>
      <button
        className={"btn btn-xs " + (loading === 1 ? "loading" : "")}
        onClick={() => getTokens(1)}
      >
        Claim free LORE
      </button>
    </>
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
