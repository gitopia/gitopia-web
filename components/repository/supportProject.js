import { useState } from "react";
import { getBalance } from "../../store/actions/wallet";
import { notify } from "reapop";
import { connect } from "react-redux";

function SupportProject(props) {
  const [validateAmountError, setValidateAmountError] = useState("");
  const [amount, setAmount] = useState(0);
  function isNaturalNumber(n) {
    n = n.toString();
    var n1 = Math.abs(n),
      n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
  }

  const validateAmount = async (amount) => {
    setValidateAmountError(null);
    const Vamount = Number(amount);
    if (amount == "" || amount == 0) {
      setValidateAmountError("Enter Valid Amount");
    }

    if (isNaturalNumber(amount) === true) {
      if (Vamount < 10 || Vamount > 0) {
        if (Vamount > props.loreBalance) {
          setValidateAmountError("Insufficient Balance");
        }
      } else {
        setValidateAmountError("Amount should be in range 1-10");
      }
    } else {
      setValidateAmountError("Amount should be positive integer");
    }
  };

  return (
    <div className={"absolute p-10 w-3/6 z-10 text-left"}>
      <div className="bg-base-300 rounded p-8 shadow-lg">
        <div className="mb-2 w-full">
          <div className="flex">
            <div className="flex-1 font-bold">SUPPORT THIS PROJECT</div>
            <button
              className=""
              onClick={(e) => {
                props.setPopup(false);
              }}
            >
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.98058 1.31043C2.3948 0.724647 1.44505 0.724647 0.859262 1.31043C0.273475 1.89622 0.273475 2.84597 0.859262 3.43175L6.43322 9.00572L0.859262 14.5797C0.273476 15.1655 0.273476 16.1152 0.859262 16.701C1.44505 17.2868 2.3948 17.2868 2.98058 16.701L8.55455 11.127L14.1285 16.701C14.7143 17.2868 15.664 17.2868 16.2498 16.701C16.8356 16.1152 16.8356 15.1655 16.2498 14.5797L10.6759 9.00572L16.2498 3.43175C16.8356 2.84597 16.8356 1.89622 16.2498 1.31043C15.664 0.724647 14.7143 0.724647 14.1285 1.31043L8.55454 6.8844L2.98058 1.31043Z"
                  fill="#ADBECB"
                />
              </svg>
            </button>
          </div>
          <div className="text-xs mt-5">
            You can support this project by sending tore to its organization or
            creator.
          </div>
          <div className="text-xs">
            To do it you just need to send your funds to the address below.
          </div>
          <div className="mt-2 text-xs">
            This address only accepts TLORE, any other coin or token will be
            lost if sent to this address.
          </div>
        </div>
        <label className="label">
          <span className="label-text text-xs font-bold text-gray-400">
            ORGANISATION TREASURY ADDRESS
          </span>
        </label>
        <div class="flex border border-gray-700 rounded-lg p-3">
          <div className="flex-1 text-xs">{props.ownerId}</div>
          <button
            className=""
            onClick={(e) => {
              navigator.clipboard.writeText(props.ownerId);
              props.notify("Copied to clipboard", "info");
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="10"
                y="10"
                width="18"
                height="18"
                stroke="#ADBECB"
                stroke-width="2"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2 2H18.0769V8.92308H20.0769V2V0H18.0769H2H0V2V18.0769V20.0769H2H8.92308V18.0769H2V2Z"
                fill="#ADBECB"
              />
            </svg>
          </button>
        </div>
        <div>
          <label className="label">
            <span className="label-text text-xs font-bold text-gray-400">
              TOKEN AMOUNT
            </span>
          </label>
          <div>
            <input
              name="Amount"
              placeholder="Enter Amount"
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
              className="w-full h-12 input input-sm input-ghost input-bordered text-xs"
            />
          </div>
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
          <div className="w-9/12">
            <label className="label">
              <span className="label-text text-xs font-bold text-gray-400">
                AVAILABLE TOKENS
              </span>
            </label>
            <div className="flex">
              <svg
                width="22"
                height="22"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="13"
                  cy="13"
                  r="12.4167"
                  stroke="#883BE6"
                  stroke-width="1.16667"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.0006 12.5184C14.3352 12.5184 15.4171 11.4365 15.4171 10.1019C15.4171 8.7673 14.3352 7.68538 13.0006 7.68538C11.666 7.68538 10.5841 8.7673 10.5841 10.1019C10.5841 11.4365 11.666 12.5184 13.0006 12.5184ZM13.0006 14.2314C15.2813 14.2314 17.1301 12.3826 17.1301 10.1019C17.1301 7.82125 15.2813 5.9724 13.0006 5.9724C10.7199 5.9724 8.87109 7.82125 8.87109 10.1019C8.87109 12.3826 10.7199 14.2314 13.0006 14.2314Z"
                  fill="#883BE6"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.5841 15.1195C10.5841 15.7593 10.8406 16.3714 11.2947 16.8215C11.7485 17.2713 12.3623 17.5225 13.0006 17.5225C13.6389 17.5225 14.2527 17.2713 14.7065 16.8215C15.1606 16.3714 15.4171 15.7593 15.4171 15.1195H17.1301C17.1301 16.2004 16.697 17.2386 15.9234 18.0053C15.1496 18.7723 14.0984 19.2046 13.0006 19.2046C11.9028 19.2046 10.8516 18.7723 10.0778 18.0053C9.30425 17.2386 8.87109 16.2004 8.87109 15.1195H10.5841Z"
                  fill="#883BE6"
                />
                <path
                  d="M12.1973 4.74383H13.8455V6.39206H12.1973V4.74383Z"
                  fill="#883BE6"
                />
                <path
                  d="M12.1973 18.7537H13.8455V20.4019H12.1973V18.7537Z"
                  fill="#883BE6"
                />
              </svg>
              <div className="pl-3">
                <div className="text-sm h-3/4">
                  {props.loreBalance / 1000000} TLORES
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/12 mt-5 ml-7">
            <button
              className={"btn btn-sm btn-primary flex-1"}
              onClick={(e) => {
                props
                  .transferToWallet(
                    props.selectedAddress,
                    props.ownerId,
                    amount
                  )
                  .then((res) => props.getBalance());
                props.setPopup(false);
                props.notify("Transaction Succesful", "info");
              }}
              disabled={validateAmountError !== null}
            >
              CONTRIBUTE
            </button>
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
  };
};

export default connect(mapStateToProps, {
  getBalance,
  notify,
})(SupportProject);
