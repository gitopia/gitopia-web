import { updateBountyExpiry } from "../../store/actions/bounties";
import { connect } from "react-redux";
import { useRef } from "react";
import dayjs from "dayjs";
function ExtendExpiry(props) {
  const ref1 = useRef("dd/mm/yyyy");
  return (
    <div>
      <input type="checkbox" id="my-modal-2" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="my-modal-2"
            className="absolute right-4"
            onClick={() => {
              props.setUpdatedExpiry("dd/mm/yyyy");
              ref1.current.value = "";
            }}
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
          </label>
          <h3 className="text-lg">Enter Extended Expiry Date</h3>
          <input
            type="date"
            placeholder="Enter Date"
            className="appearance-none bg-transparent border-none leading-tight focus:outline-none ml-auto text-grey-200 text-md mt-2"
            ref={ref1}
            data-test="extend_expiry_date"
            onChange={(e) => {
              props.setUpdatedExpiry(e.target.value);
            }}
          ></input>
          <div className="modal-action">
            <label
              htmlFor="my-modal-2"
              className="btn btn-primary btn-sm"
              onClick={() => {
                props
                  .updateBountyExpiry(
                    props.bountyId,
                    dayjs(props.updatedExpiry.toString()).unix()
                  )
                  .then((res) => {
                    props.setUpdatedExpiry("dd/mm/yyyy");
                    ref1.current.value = "";
                    if (res && res.code === 0) {
                      props.onUpdate() ? props.onUpdate() : "";
                    }
                  });
              }}
              data-test="extend_bounty"
            >
              Extend
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    advanceUser: state.user.advanceUser,
    loreBalance: state.wallet.loreBalance,
  };
};

export default connect(mapStateToProps, {
  updateBountyExpiry,
})(ExtendExpiry);
