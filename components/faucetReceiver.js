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
    axios
      .post(
        "/api/faucet",
        {
          address: props.selectedAddress,
          coins: [amount + "token"],
        },
        { timeout: 5000 }
      )
      .then((res) => props.getBalance("token"))
      .catch((err) => console.error(err))
      .finally(() => setLoading(0));
  };

  return (
    <>
      <div className="btn-group">
        <button
          className={"btn btn-xs " + (loading === 1 ? "loading" : "")}
          onClick={() => getTokens(1)}
        >
          1 Lore
        </button>
        <button
          className={"btn btn-xs " + (loading === 2 ? "loading" : "")}
          onClick={() => getTokens(2)}
        >
          2 Lore
        </button>
        <button
          className={"btn btn-xs " + (loading === 5 ? "loading" : "")}
          onClick={() => getTokens(5)}
        >
          5 Lore
        </button>
      </div>
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
