import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { notify } from "reapop";
import styles from "../../styles/landing.module.css";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/landingPageFooter";
import getWhois from "../../helpers/getWhois";
import { signMessageForRewards } from "../../store/actions/user";
import axios from "../../helpers/axiosFetch";
import { getBalance } from "../../store/actions/wallet";
import { updateUserBalance } from "../../store/actions/wallet";
import { claimRewards } from "../../store/actions/user";

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const isRewardActive = (reward) => {
  const today = new Date();

  const startDate = new Date(reward["start_date"]);
  const endDate = new Date(reward["end_date"]);
  return today >= startDate && today <= endDate;
};

function showToken(value, denom) {
  if (denom === process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN) {
    return value.toLocaleString() + " " + denom;
  } else {
    let roundOff = Math.floor(value / 10000) / 100;
    return roundOff.toLocaleString() + " " + denom;
  }
}

function Rewards(props) {
  const [claimTokensLoading, setClaimTokensLoading] = useState(false);
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_CURRENCY_TOKEN);
  const [totalPlatformIncentivesToken, setTotalPlatformIncentivesToken] =
    useState(0);
  const [
    totalClaimedPlatformIncentivesToken,
    setTotalClaimedPlatformIncentivesToken,
  ] = useState(0);
  const [
    isPlatformIncentivesTokensLoaded,
    setIsPlatformIncentivesTokensLoaded,
  ] = useState(false);
  const [xPost, setXPost] = useState("");
  const [splits, setSplits] = useState([]);

  const claimPlatformIncentives = async (id, split) => {
    if (claimTokensLoading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setClaimTokensLoading(true);
    const res = await props.signMessageForRewards("platform incentives");
    await axios
      .post(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL + "/platform-incentives",
        {
          id,
          split,
          payload: res,
        }
      )
      .then(({ data }) => {
        consumePlatformIncentivesData(data);
        props.notify("Reward claimed successfully", "info");
      })
      .catch(({ err }) => {});

    setClaimTokensLoading(false);
  };

  async function fetchStatus() {
    if (!props.selectedAddress) return;
    const platformIncentivesData = await axios
      .get(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL +
          "/platform-incentives?addr=" +
          props.selectedAddress
      )
      .then(({ data }) => {
        consumePlatformIncentivesData(data);
      })
      .catch((e) => {});
  }

  useEffect(() => {
    fetchStatus();
  }, [, props.selectedAddress]);

  const consumePlatformIncentivesData = (data) => {
    setTotalPlatformIncentivesToken(data["total_amount"]);
    setTotalClaimedPlatformIncentivesToken(data["total_claimed_amount"]);
    setSplits(data.splits);
    setXPost(
      encodeURIComponent(
        `🎉 Excited to share that I earned ${Math.floor(
          data["total_claimed_amount"] / 1e6
        ).toLocaleString()} $LORE tokens by contributing to open source projects on Gitopia! 🌟

Switch to Gitopia and earn rewards for your open source contributions! 💰
#Gitopia #OpenSource

`
      )
    );
    setIsPlatformIncentivesTokensLoaded(true);
  };

  return (
    <>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </Head>
      <Header />
      <section className={"flex flex-col items-center mt-12 lg:mt-16 relative"}>
        <div className="items-center max-w-screen-lg w-full">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl lg:text-5xl font-bold tracking-tight lg:text-center">
              Rewards
            </div>
          </div>
          <div className="border border-grey-50 rounded-xl bg-base-200/70 max-w-2xl text-sm relative mx-4 lg:mx-auto mt-12 lg:mt-16">
            <div className="font-bold text-xs uppercase bg-base-200 border border-grey-50 text-purple-50 rounded-full px-4 py-1 absolute -top-3 left-1/2 -ml-24">
              Platform Incentives
            </div>
            <div className="flex flex-col lg:flex-row gap-8 justify-evenly p-8 pt-10">
              <div className="lg:text-center">
                <div className="inline-flex items-center -mr-2">
                  <span className="text-type-secondary font-bold">Total</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Based on Gitopia platfrom activity til Feb 9th"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  {isPlatformIncentivesTokensLoaded ? (
                    <span className="text-4xl uppercase">
                      {showToken(totalPlatformIncentivesToken, token)}
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl uppercase">-</span>
                    </>
                  )}
                </div>
              </div>
              <div className="lg:text-center">
                <div className="inline-flex items-center -mr-2">
                  <span className="text-type-secondary font-bold">Claimed</span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Based on Gitopia platfrom activity til Feb 9th"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  {isPlatformIncentivesTokensLoaded ? (
                    <span className="text-4xl uppercase">
                      {showToken(totalClaimedPlatformIncentivesToken, token)}
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl uppercase">-</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {totalClaimedPlatformIncentivesToken > 0 && (
          <Link
            className="btn btn-primary btn-base  mx-4 my-8 lg:w-48"
            href={`https://twitter.com/intent/tweet?text=${xPost}`}
          >
            𝕏 Post
          </Link>
        )}

        <div className="flex my-4 mx-4 px-3 max-w-screen-lg w-full lg:mt-4">
          <div id="missions" className="text-4xl">
            Distribution Round 1
          </div>
          <div className="flex ml-auto">
            <div className="text-xs opacity-60 mt-4 font-bold mr-2">
              {(
                (totalClaimedPlatformIncentivesToken /
                  totalPlatformIncentivesToken) *
                100
              ).toFixed(2) + "%"}{" "}
              Claimed
            </div>
            <progress
              className="progress progress-primary w-56 sm:w-80 mt-5"
              value={
                (totalClaimedPlatformIncentivesToken /
                  totalPlatformIncentivesToken) *
                100
              }
              max="100"
            ></progress>
          </div>
        </div>

        <div className="flex flex-col bg-base-200/70 rounded-xl mx-4 p-2 text-xs sm:text-base w-full max-w-screen-lg">
          {totalClaimedPlatformIncentivesToken > 0 && (
            <div>
              🎉 Congratulations! You have earned{" "}
              <span className="uppercase">
                {showToken(totalPlatformIncentivesToken, token)}
              </span>{" "}
              as a reward for your contributions. 🎉
            </div>
          )}
          <br />
          Distribution Details:
          <ul className="list-disc mx-4">
            <li>Total Distribution: 2,250,000 LORE</li>
            <li>
              Your reward:{" "}
              <span className="uppercase">{`${showToken(
                totalPlatformIncentivesToken,
                token
              )}`}</span>
            </li>
            <li>
              Cutoff Date: Contributions up to Feb 9th 2024 are taken into
              account for this round of distribution
            </li>
          </ul>
        </div>

        {splits?.map((t, i = 0) => {
          return (
            <div
              className="flex bg-base-200/70 rounded-xl mt-4 mx-4 p-2 text-xs sm:text-base w-full max-w-screen-lg"
              key={i}
            >
              <div className="lg:flex gap-4">
                <div
                  className={
                    "my-3 ml-4 " + (isRewardActive(t) ? "text-green" : "")
                  }
                >
                  {t["start_date"]} - {t["end_date"]}
                </div>
                <div
                  className={
                    "rounded-full px-2 py-px text-xs h-5 mt-3.5 tooltip cursor-default border" +
                    (isPlatformIncentivesTokensLoaded
                      ? " bg-purple-900 text-purple-50 border-transparent"
                      : " text-purple-50 border-purple-900")
                  }
                  data-tip="Platform incentives"
                >
                  <span className="uppercase">
                    {showToken(t["amount"], token)}
                  </span>
                </div>
              </div>
              {isRewardActive(t) ? (
                t["claimed"] ? (
                  <img
                    className="ml-auto mr-3 sm:mt-2"
                    src="/rewards/checkmark.svg"
                  />
                ) : (
                  <button
                    className="btn btn-primary btn-sm mx-4 ml-auto mr-3 sm:mt-2"
                    onClick={() => claimPlatformIncentives(1, i)}
                  >
                    <span>Claim</span>
                  </button>
                )
              ) : (
                <div className="ml-auto mr-6 sm:mt-4">
                  <svg
                    viewBox="0 0 12 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4 6H8V4C8 2.89539 7.10461 2 6 2C4.89539 2 4 2.89539 4 4V6ZM10 6H11C11.5522 6 12 6.44775 12 7V15C12 15.5522 11.5522 16 11 16H1C0.447754 16 0 15.5522 0 15V7C0 6.44775 0.447754 6 1 6H2V4C2 1.79089 3.79089 0 6 0C8.20911 0 10 1.79089 10 4V6ZM6 9C4.89539 9 4 9.89539 4 11C4 12.1046 4.89539 13 6 13C7.10461 13 8 12.1046 8 11C8 9.89539 7.10461 9 6 9Z"
                      fill="#36404C"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        <img
          className={
            "absolute pointer-events-none -z-30 left-1/3 -top-20 opacity-30 lg:opacity-50 invisible lg:visible"
          }
          src="/rewards/drop-mid.svg"
          width={"622"}
          height={"762"}
        />
        <img
          className={
            "absolute pointer-events-none -z-10 -left-16 sm:left-5 lg:left-60 top-10 sm:top-28 lg:top-44 opacity-50"
          }
          src="/rewards/drop-1.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 right-0 sm:right-16 lg:right-36 top-36 sm:top-28 lg:top-40 opacity-50"
          }
          src="/rewards/drop-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 w-3/4 right-10 bottom-2/3 sm:mb-14 opacity-50"
          }
          src="/rewards/objects.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 w-full bottom-1/3 mb-96 lg:mb-48 2xl:mb-10 opacity-50"
          }
          src="/rewards/ellipse.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 w-full bottom-2/3 lg:bottom-1/3 lg:mb-48 invisible sm:visible opacity-50"
          }
          src="/rewards/stars-3.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 left-5 bottom-3/4 mt-20 invisible lg:visible opacity-30"
          }
          src="/rewards/coin-1.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 right-0 -top-36 lg:-top-20 invisible sm:visible opacity-30"
          }
          src="/rewards/coin-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 bottom-2/3 left-36 invisible lg:visible opacity-30"
          }
          src="/rewards/coin-3.png"
        />
        <img
          className={
            "absolute pointer-events-none bottom-1/2 mb-28 right-36 -z-20 invisible lg:visible opacity-30"
          }
          src="/rewards/coin-4.svg"
        />
      </section>
      <img
        className={
          "absolute pointer-events-none -z-20 w-full top-40 lg:top-28 invisible sm:visible opacity-50"
        }
        src="/rewards/stars-1.svg"
      />

      <Footer />
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    activeWallet: state.wallet.activeWallet,
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  notify,
  signMessageForRewards,
  getBalance,
  updateUserBalance,
  claimRewards,
})(Rewards);
