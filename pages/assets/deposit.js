import { connect } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ibcDeposit } from "../../store/actions/wallet";
import { useRouter } from "next/router";
import getChainInfo from "../../helpers/getChainInfo";

function DepositIbcAsset(props) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [counterPartyChainInfo, setCounterPartyChainInfo] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (
      props.activeWallet?.counterPartyAddress === undefined ||
      props.activeWallet.counterPartyChain === null
    ) {
      router.push("/home");
    }
    document.getElementById("my-modal-2").checked = true;
  }, []);

  useEffect(() => {
    async function getChain() {
      let info = await getChainInfo(props.activeWallet?.counterPartyChain);
      setCounterPartyChainInfo(info);
    }
    getChain();
  }, [props.activeWallet]);

  return (
    <div>
      <label htmlFor="my-modal-2" className="btn modal-button hidden">
        Deposit
      </label>

      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div
        className="modal modal-bottom sm:modal-middle cursor-pointer"
        htmlFor="my-modal-2"
      >
        <div className="modal-box relative bg-grey-500">
          <div className="flex mb-4">
            <div className="w-11/12 font-bold text-sm text-type">
              Deposit IBC Asset
            </div>
            <Link
              htmlFor="my-modal-2"
              className="ml-auto hover:opacity-25"
              href="/home"
            >
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5303 2.0304C13.8231 1.73751 13.8231 1.26264 13.5303 0.969744C13.2374 0.676851 12.7625 0.676851 12.4696 0.969744L13.5303 2.0304ZM0.46967 12.9697C0.176777 13.2626 0.176777 13.7374 0.46967 14.0303C0.762563 14.3232 1.23744 14.3232 1.53033 14.0303L0.46967 12.9697ZM12.4696 14.0303C12.7625 14.3231 13.2374 14.3231 13.5303 14.0303C13.8231 13.7374 13.8231 13.2625 13.5303 12.9696L12.4696 14.0303ZM1.53033 0.96967C1.23744 0.676777 0.762563 0.676777 0.46967 0.96967C0.176777 1.26256 0.176777 1.73744 0.46967 2.03033L1.53033 0.96967ZM12.4696 0.969744L0.46967 12.9697L1.53033 14.0303L13.5303 2.0304L12.4696 0.969744ZM13.5303 12.9696L1.53033 0.96967L0.46967 2.03033L12.4696 14.0303L13.5303 12.9696Z"
                  fill="#E5EDF5"
                />
              </svg>
            </Link>
          </div>
          <div className="text-white">IBC Transfer</div>
          <div className="border border-gray-700 rounded-xl p-3 text-xs mt-3">
            <div className="font-bold">FROM</div>
            <div className="text-type-secondary">
              {props.activeWallet?.counterPartyAddress}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-9 border border-gray-700 p-1.5 rounded-lg mt-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 3.33334L10 16.6667"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M15.8332 10.8333L9.99984 16.6667L4.1665 10.8333"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </div>
          <div className="border border-gray-700 rounded-xl p-3 text-xs mt-2">
            <div className="font-bold">TO</div>
            <div className="text-type-secondary">{props.selectedAddress}</div>
          </div>
          <div className="text-white mt-5">Amount to Deposit</div>
          <div className="border border-gray-700 rounded-xl p-3 text-xs mt-2">
            <div className="font-bold">Available Balance : 0 ATOM</div>
            <div className="border border-gray-700 rounded-xl p-3 bg-grey-900 mt-2">
              <div className="flex">
                <input
                  className="appearance-none bg-transparent border-none  focus:outline-none "
                  type="text"
                  placeholder="Enter Amount"
                  aria-label="Amount"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                ></input>
                <div
                  className="link link-primary text-xs text-primary font-bold no-underline ml-auto"
                  onClick={(e) => {}}
                >
                  Max
                </div>
              </div>
            </div>
          </div>

          <div className="flex ml-auto self-center">
            <div className="modal-action">
              <label
                htmlFor="my-modal-2"
                className={
                  "btn w-96 px-56 flex-1 bg-green-900 text-xs ml-1 " + loading
                }
                onClick={(e) => {
                  setLoading(true);
                  props.ibcDeposit(
                    counterPartyChainInfo.port_id,
                    counterPartyChainInfo.channel_id,
                    amount,
                    counterPartyChainInfo.coin_minimal_denom,
                    props.selectedAddress,
                    props.activeWallet.counterPartyAddress,
                    1,
                    100345,
                    0
                  );
                  setLoading(false);
                }}
                disabled={false}
              >
                DEPOSIT
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, {
  ibcDeposit,
})(DepositIbcAsset);
