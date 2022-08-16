import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getBounty from "../../helpers/getBounty";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
function IssueBountyView(props) {
  const [bounties, setBounties] = useState([]);
  useEffect(async () => {
    const array = [];
    for (var i = 0; i < props.bounties.length; i++) {
      const res = await getBounty(props.bounties[i]);
      array.push(res);
    }
    console.log(array);
    setBounties(array);
  }, [props.bounties.length]);
  return (
    <div className="pt-8 mb-4 ml-2">
      <div className="text-xs font-bold text-type-tertiary uppercase mb-2">
        BOUNTIES
      </div>
      <div className="h-48 overflow-y-scroll">
        {bounties.map((b) => {
          return (
            <div
              tabIndex="0"
              className="collapse border rounded-lg border-grey mb-2"
              key={b.id}
            >
              <input type="checkbox" class="peer" />
              <div className="collapse-title flex text-sm text-type">
                <div> Bounty</div>
                <div className="ml-16">
                  {b.state == "BOUNTY_STATE_SRCDEBITTED" &&
                  b.expireAt > dayjs().unix() ? (
                    <div>
                      <div className="flex items-center rounded-full px-6 w-20 py-0.5 bg-purple text-xs uppercase mt-0.5">
                        Open
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {b.state == "BOUNTY_STATE_DESTCREDITED" ? (
                    <div className="flex items-center rounded-full px-4 w-24 py-0.5 bg-teal text-xs uppercase mt-0.5">
                      Rewarded
                    </div>
                  ) : (
                    ""
                  )}
                  {b.expireAt < dayjs().unix() &&
                  b.state != "BOUNTY_STATE_REVERTEDBACK" ? (
                    <div className="flex items-center rounded-full px-7 w-24 py-0.5 bg-pink text-xs uppercase mt-0.5 ml-1">
                      Expired
                    </div>
                  ) : (
                    ""
                  )}
                  {b.state == "BOUNTY_STATE_REVERTEDBACK" ? (
                    <div className="flex items-center rounded-full px-5 w-24 py-0.5 bg-grey text-xs uppercase mt-0.5">
                      Reverted
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="collapse-content">
                {b.amount.length > 0 ? (
                  <div className="grid grid-cols-2">
                    {b.amount.map((a, i) => {
                      return (
                        <div
                          className={
                            "flex text-sm box-border bg-grey-500 mr-2 h-11 p-3 rounded-lg uppercase"
                          }
                        >
                          <div className="mr-2">{a.denom}</div>
                          <div>{a.amount}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
                <div className="flex mt-4">
                  <div className="mr-2">
                    <div className="text-type-secondary font-bold text-xs mb-0.5">
                      WALLET ADDRESS
                    </div>
                    <div className="text-type text-xs">
                      {shrinkAddress(b.creator)}
                    </div>
                  </div>
                  <div>
                    <div className="text-type-secondary font-bold text-xs mb-0.5">
                      EXPIRY DATE
                    </div>
                    <div className="text-type text-xs">
                      {" "}
                      {dayjs.unix(parseInt(b.createdAt)).fromNow()}
                    </div>
                  </div>
                </div>
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
