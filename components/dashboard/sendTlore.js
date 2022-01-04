import { useState } from "react";
import getUser from "../../helpers/getUser";
import { notify } from "reapop";
import { connect } from "react-redux";
import { updateUserBalance } from "../../store/actions/wallet";

function SendTlore(props) {
  const [validateAddressError, setValidateAddressError] = useState("");
  const [validateAmountError, setValidateAmountError] = useState("");
  const validAddress = new RegExp("gitopia[a-z0-9]{39}");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const validateUserAddress = async (address) => {
    if (address.trim() !== "" && validAddress.test(address)) {
      const res = await getUser(address);
      setValidateAddressError(null);
    } else {
      setValidateAddressError("Enter a valid address");
    }
  };

  function isNaturalNumber(n) {
    n = n.toString();
    var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  const validateAmount = async (amount) => {
    setValidateAmountError(null);
    let Vamount = Number(amount);
    if (amount == "" || amount == 0) {
      setValidateAmountError("Enter Valid Amount");
    }

    let balance = props.loreBalance;
    if (props.advanceUser === "FALSE") {
      Vamount = Vamount * 1000000;
    }
    if (Vamount > 0 && isNaturalNumber(Vamount)) {
      if (Vamount < 10 || Vamount > 0) {
        if (Vamount > balance) {
          setValidateAmountError("Insufficient Balance");
        }
      } else {
        setValidateAmountError("Amount should be in range 1-10");
      }
    } else {
      setValidateAmountError("Enter a Valid Amount");
    }
  };

  return (
    <div className={"dropdown dropdown-end w-full"} tabIndex="0">
      <div className="dropdown-content shadow-lg bg-base-300 rounded w-56 p-4 mt-1">
        <div className="form-control mb-2">
          <input
            name="toAddress"
            type="text"
            placeholder="Receiver's Address"
            autoComplete="off"
            onKeyUp={async (e) => {
              await validateUserAddress(e.target.value);
            }}
            onChange={(e) => {
              setReceiverAddress(e.target.value);
            }}
            className="w-full input input-sm input-ghost input-bordered"
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
            placeholder="Amount"
            autoComplete="off"
            onKeyUp={async (e) => {
              await validateAmount(e.target.value);
            }}
            onMouseUp={async (e) => {
              await validateAmount(e.target.value);
            }}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            className="w-full input input-sm input-ghost input-bordered"
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
          <a
            className="btn btn-sm flex-1"
            onClick={() => {
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
          >
            Cancel
          </a>
          <button
            className={"btn btn-sm btn-primary flex-1 "}
            onClick={(e) => {
              props.transferToWallet(
                props.selectedAddress,
                receiverAddress,
                props.advanceUser === "TRUE"
                  ? amount.toString()
                  : (amount * 1000000).toString()
              );
              props.setMenuOpen(false);
              props.setMenuState(1);
            }}
            disabled={
              validateAmountError !== null || validateAddressError !== null
            }
          >
            Send
          </button>
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
})(SendTlore);
