import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getBounty from "../../helpers/getBounty";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { debounce } from "lodash";
import Link from "next/link";

function IssueBountyView(props) {
  const router = useRouter();
  const [bounties, setBounties] = useState([]);
  const [coins, setCoins] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  useEffect(async () => {
    const bountyArray = [];
    const coin = {};
    const coinArray = [];
    for (var i = 0; i < props.bounties.length; i++) {
      const res = await getBounty(props.bounties[i]);
      bountyArray.push(res);
      res.amount.map((a) => {
        coin[a.denom] !== undefined
          ? (coin[a.denom].amount = coin[a.denom].amount + parseInt(a.amount))
          : (coin[a.denom] = { amount: parseInt(a.amount), denom: a.denom });
      });
    }
    for (const property in coin) {
      coinArray.push(coin[property]);
    }
    setCoins(coinArray);
    console.log(coins);
    setBounties(bountyArray.slice(0, 4));
    console.log(bounties);
  }, [props.bounties.length]);
  return (
    <div
      className="pt-8 mb-4 ml-2"
      onMouseLeave={debounce(() => {
        setIsHovering(false);
      }, 100)}
    >
      <div className="font-semibold mb-2 text-sm">Bounties</div>
      <div className="">
        {coins.map((c, index) => {
          return (
            <div className="mb-2" key={index}>
              <div className="text-type-secondary">
                <div className="flex">
                  <div className="mr-2">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="16" cy="16" r="16" fill="#569E34" />
                    </svg>
                  </div>
                  <div
                    className={"flex uppercase ml-2 mr-4 pb-3 mt-1"}
                    onMouseOver={debounce(() => {
                      setIsHovering(true);
                    }, 500)}
                  >
                    {c.denom}
                  </div>
                  <svg
                    width="1"
                    height="15"
                    viewBox="0 0 1 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2.5"
                  >
                    <rect width="1" height="15" fill="#404450" />
                  </svg>

                  <div
                    className={"flex ml-4 pb-3 mt-1"}
                    onMouseOver={debounce(() => {
                      setIsHovering(true);
                    }, 500)}
                  >
                    {c.amount}
                  </div>
                </div>
                {isHovering ? (
                  <div className="flex card bg-grey-500 w-72 h-fit p-3">
                    {bounties.map((b, index) => {
                      return (
                        <div
                          className={
                            index == 3 ? "" : "border-b" + " border-grey"
                          }
                        >
                          <div className="ml-6 flex mb-2 mt-2">
                            <div className="stack stroke-type-secondary rotate-90">
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="16" cy="16" r="16" fill="#569E34" />
                              </svg>
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="16" cy="16" r="16" fill="#505D7D" />
                              </svg>
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle cx="16" cy="16" r="16" fill="#ED7061" />
                              </svg>
                            </div>

                            <div className="text-type text-xs ml-2 mt-2">
                              $12.42310
                            </div>

                            <div className="text-type text-xs ml-auto mr-2 mt-2">
                              {dayjs
                                .unix(parseInt(b.createdAt))
                                .format("DD/MM/YYYY")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {props.bounties.length > 4 ? (
                      <Link
                        href={
                          "/" +
                          router.query.userId +
                          "/" +
                          router.query.repositoryId +
                          "/issues/" +
                          router.query.issueIid +
                          "/bounties"
                        }
                      >
                        <a className="btn btn-link font-bold mb-2 text-xs text-green text-center">
                          Go to Bounty Page
                        </a>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
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
