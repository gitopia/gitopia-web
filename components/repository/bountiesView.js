import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getBounty from "../../helpers/getBounty";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { debounce } from "lodash";
import Link from "next/link";
import getDenomNameByHash from "../../helpers/getDenomNameByHash";
import { coingeckoId } from "../../ibc-assets-config";
import getTokenValueInDollars from "../../helpers/getTotalTokenValueInDollars";
import getBountyValueInDollars from "../../helpers/getBountyValueInDollars";

function IssueBountyView(props) {
  const router = useRouter();
  const [bounties, setBounties] = useState([]);
  const [coins, setCoins] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    async function fetchBountyArray() {
      const bountyArray = [];
      const coin = {};
      const coinArray = [];
      for (var i = 0; i < props.bounties.length; i++) {
        const res = await getBounty(props.bounties[i]);
        if (res) {
          const bountyValueInDollars = await getBountyValueInDollars(res);
          res.bountyValueInDollars = bountyValueInDollars;
        }
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

      for (let i = 0; i < coinArray.length; i++) {
        if (coinArray[i].denom.includes("ibc")) {
          let denomName = await getDenomNameByHash(coinArray[i].denom);
          coinArray[i].denom = denomName;
          let dollarAmount = await getTokenValueInDollars(
            coinArray[i].denom,
            coinArray[i].amount
          );
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
      <div className="ml-1 font-semibold mb-4">Bounties</div>
      <div className="">
        {coins.map((c, index) => {
          return (
            <div
              className="mb-2"
              key={index}
              onMouseOver={debounce(() => {
                setIsHovering(true);
              }, 500)}
              onMouseLeave={debounce(() => {
                setIsHovering(false);
              }, 100)}
            >
              <div className="text-type-secondary">
                <div className="flex text-sm">
                  <div className="mr-2">
                    <img
                      src={coingeckoId[c.denom].icon}
                      width={28}
                      height={28}
                    ></img>
                  </div>
                  <div className={"flex uppercase ml-2 mr-4 pb-3 mt-1.5"}>
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

                  <div className={"flex ml-4 pb-3 mt-1.5"}>{c.amount}</div>
                  <div className="ml-3 font-bold text-xs text-type-tertiary mt-2">
                    {c.denom !== "utlore" ? "≈$" + c.dollarAmount + "USD" : ""}
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
                  <div className="ml-2 flex mb-2 mt-2">
                    {b.amount.length === 1 ? (
                      <img src={""} className="mr-2" />
                    ) : (
                      <div className="mr-2" />
                    )}

                    <div className="text-type-primary text-sm ml-2 mt-2">
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
