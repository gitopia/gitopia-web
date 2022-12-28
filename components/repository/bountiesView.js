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
            >
              <div className="text-type-secondary">
                <div className="flex text-sm">
                  <div className="mr-2">
                    <img src={coingeckoId[c.denom].icon}></img>
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
          <div className="flex card bg-grey-500 w-72 h-fit p-3 z-10 absolute">
            {bounties.map((b, index) => {
              return (
                <div
                  className={index == 3 ? "" : "border-b" + " border-grey"}
                  key={index}
                >
                  <div className="ml-2 flex mb-2 mt-2">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <rect
                        width="32"
                        height="32"
                        rx="16"
                        fill="url(#paint0_linear_2419_12505)"
                      />
                      <circle
                        cx="15.9993"
                        cy="16"
                        r="12.8333"
                        stroke="#13181E"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.9738 15.6158C17.2195 15.6158 18.2293 14.6093 18.2293 13.3677C18.2293 12.1262 17.2195 11.1197 15.9738 11.1197C14.7282 11.1197 13.7184 12.1262 13.7184 13.3677C13.7184 14.6093 14.7282 15.6158 15.9738 15.6158ZM15.9738 17.3286C18.1685 17.3286 19.9477 15.5553 19.9477 13.3677C19.9477 11.1802 18.1685 9.40686 15.9738 9.40686C13.7792 9.40686 12 11.1802 12 13.3677C12 15.5553 13.7792 17.3286 15.9738 17.3286Z"
                        fill="#13181E"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.0157 20.4984C16.6494 20.4984 17.2572 20.2475 17.7053 19.8008C18.1534 19.3542 18.4051 18.7483 18.4051 18.1167H19.9981C19.9981 19.1694 19.5785 20.1791 18.8317 20.9235C18.0849 21.6679 17.0719 22.0861 16.0157 22.0861C14.9595 22.0861 13.9465 21.6679 13.1996 20.9235C12.4528 20.1791 12.0332 19.1694 12.0332 18.1167H13.6262C13.6262 18.7483 13.8779 19.3542 14.3261 19.8008C14.7742 20.2475 15.3819 20.4984 16.0157 20.4984Z"
                        fill="#13181E"
                      />
                      <path
                        d="M15.0957 8H16.8904V10.064H15.0957V8Z"
                        fill="#13181E"
                      />
                      <path
                        d="M15.0957 21.6226H16.8904V23.5031H15.0957V21.6226Z"
                        fill="#13181E"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2419_12505"
                          x1="27.3333"
                          y1="5.33333"
                          x2="3.33333"
                          y2="27.3333"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#AD731D" />
                          <stop offset="1" stopColor="#F2D56E" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="text-type text-xs ml-2 mt-2">
                      {b.amount.length +
                        (b.amount.length > 1 ? " tokens" : " token")}
                    </div>

                    <div className="text-type text-xs ml-auto mr-2 mt-2">
                      {dayjs.unix(parseInt(b.createdAt)).format("MMM DD, YYYY")}
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
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(IssueBountyView);
