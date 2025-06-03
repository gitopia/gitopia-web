import { useState } from "react";
import { notify } from "reapop";
import { connect } from "react-redux";
import { updateUserBalance } from "../../store/actions/wallet";
import validAddress from "../../helpers/validAddress";
import { useApiClient } from "../../context/ApiClientContext";

function SendTlore(props) {
  const [validateAddressError, setValidateAddressError] = useState(null);
  const [validateAmountError, setValidateAmountError] = useState(null);
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { apiClient } = useApiClient;

  const validateUserAddress = (address) => {
    if (address.trim() !== "" && validAddress.test(address)) {
      setValidateAddressError(null);
      return true;
    } else {
      setValidateAddressError("Enter a valid address");
      return false;
    }
  };

  function isNaturalNumber(n) {
    n = n.toString();
    var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  const validateAmount = (amount) => {
    setValidateAmountError(null);
    let Vamount = Number(amount);
    if (amount == "" || amount == 0) {
      setValidateAmountError("Enter a valid amount");
    }

    let balance = props.balance;
    if (props.advanceUser === false) {
      Vamount = Vamount * 1000000;
    }
    if (Vamount > 0 && isNaturalNumber(Vamount)) {
      if (Vamount < 10 || Vamount > 0) {
        if (Vamount > balance) {
          setValidateAmountError("Insufficient balance");
          return false;
        }
      } else {
        setValidateAmountError("Amount should be in range 1-10");
        return false;
      }
    } else {
      setValidateAmountError("Enter a valid amount");
      return false;
    }
    return true;
  };

  return (
    <div className="w-60 p-4 flex flex-col">
      <div className="form-control mb-2">
        <input
          name="toAddress"
          type="text"
          placeholder="Receiver's Address"
          autoComplete="off"
          onKeyUp={(e) => {
            validateUserAddress(e.target.value);
          }}
          onChange={(e) => {
            setReceiverAddress(e.target.value);
          }}
          className={
            "w-full input input-sm input-ghost input-bordered focus:outline-none focus:border-type " +
            (validateAddressError
              ? "border-pink text-pink focus:border-pink"
              : receiverAddress.length > 0
              ? "border-green"
              : "")
          }
        />
        {validateAddressError ? (
          <label className="label">
            <span className="label-text-alt text-error">
              {validateAddressError}
            </span>
          </label>
        ) : (
          ""
        )}
      </div>
      <div>
        <input
          name="amount"
          type="number"
          step="0.1"
          placeholder="Amount"
          autoComplete="off"
          onKeyUp={(e) => {
            validateAmount(e.target.value);
          }}
          onMouseUp={(e) => {
            validateAmount(e.target.value);
          }}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          className={
            "w-full input input-sm input-ghost input-bordered focus:outline-none focus:border-type " +
            (validateAmountError
              ? "border-pink text-pink focus:border-pink"
              : amount.length > 0
              ? "border-green"
              : "")
          }
        />
        {validateAmountError ? (
          <label className="label">
            <span className="label-text-alt text-error">
              {validateAmountError}
            </span>
          </label>
        ) : (
          ""
        )}
      </div>
      <div className="flex w-full mt-2 btn-group">
        <button
          className={
            "btn btn-sm btn-primary flex-1" + (loading ? " loading" : "")
          }
          disabled={
            loading ||
            validateAmountError !== null ||
            validateAddressError !== null ||
            amount.length <= 0 ||
            receiverAddress === ""
          }
          onClick={async (e) => {
            setLoading(true);
            if (
              validateUserAddress(receiverAddress) &&
              validateAmount(amount)
            ) {
              const res = await props.transferToWallet(
                apiClient,
                props.selectedAddress,
                receiverAddress,
                props.advanceUser === true
                  ? amount.toString()
                  : (amount * 1000000).toString()
              );
              if (res) {
                props.setMenuState(1);
                props.setMenuOpen(false);
              }
            }
            setLoading(false);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    balance: state.wallet.balance,
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  updateUserBalance,
  notify,
})(SendTlore);
