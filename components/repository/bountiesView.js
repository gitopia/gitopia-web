import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getBounty from "../../helpers/getBounty";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import Link from "next/link";
import getDenomNameByHash from "../../helpers/getDenomNameByHash";
import { coingeckoId } from "../../ibc-assets-config";
import getTokenValueInDollars from "../../helpers/getTotalTokenValueInDollars";
import getBountyValueInDollars from "../../helpers/getBountyValueInDollars";
import { useApiClient } from "../../context/ApiClientContext";

function IssueBountyView(props) {
  const router = useRouter();
  const [bounties, setBounties] = useState([]);
  const [coins, setCoins] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const { apiClient } = useApiClient();

  useEffect(() => {
    async function fetchBountyArray() {
      const bountyArray = [];
      const coin = {};
      const coinArray = [];
      for (var i = 0; i < props.bounties.length; i++) {
        const res = await getBounty(apiClient, props.bounties[i]);
        if (
          res.state == "BOUNTY_STATE_SRCDEBITTED" &&
          res.expireAt > dayjs().unix()
        ) {
          if (res) {
            const bountyValueInDollars = await getBountyValueInDollars(res);
            res.bountyValueInDollars = bountyValueInDollars;
          }
          for (let i = 0; i < res.amount.length; i++) {
            if (res.amount[i].denom.includes("ibc")) {
              let denomName = await getDenomNameByHash(res.amount[i].denom);
              res.amount[i].showDenom = denomName;
            }
          }
          bountyArray.push(res);
          res.amount.map((a) => {
            coin[a.denom] !== undefined
              ? (coin[a.denom].amount =
                  coin[a.denom].amount + parseInt(a.amount))
              : (coin[a.denom] = {
                  amount: parseInt(a.amount),
                  denom: a.denom,
                });
          });
        }
      }
      for (const property in coin) {
        coinArray.push(coin[property]);
      }

      for (let i = 0; i < coinArray.length; i++) {
        if (coinArray[i].denom.includes("ibc")) {
          let denomName = await getDenomNameByHash(coinArray[i].denom);
          let dollarAmount = await getTokenValueInDollars(
            denomName,
            coinArray[i].amount
          );
          if (dollarAmount && denomName) {
            let standardDenomName = coingeckoId[denomName].coinDenom;
            coinArray[i].standardDenomName = standardDenomName;
            coinArray[i].denom = denomName;
            coinArray[i].amount =
              coinArray[i].amount /
              Math.pow(10, coingeckoId[denomName].coinDecimals);

            coinArray[i].dollarAmount = dollarAmount;
          }
        } else {
          let dollarAmount = await getTokenValueInDollars(
            coinArray[i].denom,
            coinArray[i].amount
          );
          let standardDenomName = coingeckoId[coinArray[i].denom].coinDenom;
          coinArray[i].standardDenomName = standardDenomName;
          coinArray[i].amount =
            coinArray[i].amount /
            Math.pow(10, coingeckoId[coinArray[i].denom].coinDecimals);
          coinArray[i].dollarAmount = dollarAmount;
        }
      }
      setCoins(coinArray);
      setBounties(bountyArray.slice(0, 4));
    }
    fetchBountyArray();
  }, [props.bounties.length]);
  return (
    <div
      className="pt-8 mb-4 ml-2"
      onMouseLeave={debounce(() => {
        setIsHovering(false);
      }, 100)}
    >
      <div className="ml-1 font-semibold mb-4" data-type="issue_bounty_view">
        Bounties
      </div>
      <div className="">
        {coins.map((c, index) => {
          return (
            <div
              className="mb-2"
              key={index}
              onMouseOver={debounce(() => {
                setIsHovering(true);
              }, 100)}
            >
              <div className="text-type-secondary">
                <div className="flex text-sm">
                  <div className="mr-1.5 mt-1">
                    <img
                      src={coingeckoId[c.denom].icon}
                      width={24}
                      height={24}
                    ></img>
                  </div>
                  <div
                    className={"flex uppercase ml-1 mr-3 pb-3 mt-1.5 text-xs"}
                  >
                    {c.standardDenomName}
                  </div>
                  <svg
                    width="1"
                    height="15"
                    viewBox="0 0 1 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2.5"
                  >
                    <rect width="1" height="12" fill="#404450" />
                  </svg>

                  <div className={"flex ml-3 pb-3 mt-1.5 text-xs"}>
                    {c.amount.toFixed(2)}
                  </div>
                  <div className="ml-2 font-bold text-xs text-type-tertiary mt-1.5">
                    {"≈$" + c.dollarAmount + "USD"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isHovering ? (
          <div className="flex card bg-[#28313C] w-72 h-fit p-3 z-10 absolute rounded-lg">
            {bounties.map((b, index) => {
              return (
                <div
                  className={
                    index === bounties.length - 1 || index === 3
                      ? ""
                      : "border-b border-grey"
                  }
                  key={index}
                >
                  <div className="ml-2 flex mb-2 mt-2 relative">
                    {b.amount.length > 1 ? (
                      <div className="flex mr-12">
                        {b.amount.map((a, index) => {
                          return (
                            <div key={index}>
                              <img
                                src={
                                  a.denom.includes("ibc")
                                    ? coingeckoId[a.showDenom].icon
                                    : coingeckoId[a.denom].icon
                                }
                                width={30}
                                height={30}
                                className={
                                  "absolute left-" +
                                  index * 4 +
                                  " -z-" +
                                  index * 10
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <img
                        src={
                          b.amount[0].denom.includes("ibc")
                            ? coingeckoId[b.amount[0].showDenom].icon
                            : coingeckoId[b.amount[0].denom].icon
                        }
                        width={33}
                        height={33}
                      />
                    )}

                    <div className={"text-type-primary text-sm ml-2 mt-2"}>
                      ${b.bountyValueInDollars}
                    </div>

                    <div className="text-type-primary text-xs ml-auto mr-2 mt-2">
                      {dayjs.unix(parseInt(b.createdAt)).format("MMM DD, YYYY")}
                    </div>
                  </div>
                </div>
              );
            })}

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
              className="btn btn-link font-bold mb-2 text-xs text-green text-center"
            >
              Go to Bounty Page
            </Link>
          </div>
        ) : (
          ""
        )}
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
