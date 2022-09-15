import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getBounty from "../../helpers/getBounty";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import { debounce } from "lodash";

function IssueBountyView(props) {
  const [bounties, setBounties] = useState([]);
  const [isHovering, setIsHovering] = useState({ id: null });
  useEffect(async () => {
    const array = [];
    for (var i = 0; i < props.bounties.length; i++) {
      const res = await getBounty(props.bounties[i]);
      array.push(res);
    }

    setBounties(array);
  }, [props.bounties.length]);
  return (
    <div
      className="pt-8 mb-4 ml-2"
      onMouseLeave={debounce(() => {
        setIsHovering({ id: null });
      }, 100)}
    >
      <div className="font-semibold mb-2 text-sm">Bounties</div>
      <div className="">
        {bounties.map((b, index) => {
          return (
            <div className="mb-2" key={index}>
              <div className="stroke-type-secondary hover:stroke-teal text-type-secondary hover:text-teal">
                <div className="flex">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-1"
                  >
                    <path
                      d="M1.93782 12.5L8 2L14.0622 12.5L1.93782 12.5Z"
                      stroke-width="2"
                    />
                  </svg>
                  <div>
                    <div
                      className={"flex text-xs ml-2 pb-3"}
                      onMouseOver={debounce(() => {
                        setIsHovering(b);
                      }, 500)}
                    >
                      {b.id}
                    </div>
                  </div>
                </div>
                {isHovering.id == b.id ? (
                  <div className="flex card bg-grey-500 w-64 h-24 p-3">
                    <div className="flex">
                      <div className="avatar flex-none items-center w-1/6">
                        <div className={"w-7 h-7 rounded-full"}>
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                              b.creator.slice(-1)
                            }
                          />
                        </div>
                      </div>
                      <div className="text-xs text-type mt-1 w-5/6">
                        {shrinkAddress(b.creator)} created bounty on{" "}
                        {dayjs.unix(parseInt(b.createdAt)).format("DD/MM/YYYY")}{" "}
                      </div>
                    </div>

                    <div className="flex mt-auto mb-2">
                      <div className="text-type text-xs font-semibold">
                        EXPIRY DATE
                      </div>
                      <div className="text-type text-xs ml-auto">
                        {" "}
                        {dayjs.unix(parseInt(b.createdAt)).fromNow()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <svg
                    width="22"
                    height="2"
                    viewBox="0 0 22 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-6 mb-1"
                  >
                    <path d="M0 1L22 0.999998" stroke="#3E4051" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(IssueBountyView);
