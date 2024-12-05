import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { notify } from "reapop";
import styles from "../../styles/landing.module.css";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/landingPageFooter";
import showToken from "../../helpers/showToken";
import { signMessageForRewards } from "../../store/actions/user";
import axios from "../../helpers/axiosFetch";
import { getBalance } from "../../store/actions/wallet";
import { updateUserBalance } from "../../store/actions/wallet";
import { claimRewards } from "../../store/actions/user";
import { useApiClient } from "../../context/ApiClientContext";

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
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();

  const claimPlatformIncentives = async (id, split) => {
    if (claimTokensLoading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setClaimTokensLoading(true);
    const res = await props.signMessageForRewards(
      apiClient,
      cosmosBankApiClient,
      cosmosFeegrantApiClient,
      "platform incentives"
    );

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
        `Just claimed ${Math.floor(
          data["total_claimed_amount"] / 1e6
        ).toLocaleString()} $LORE for my #OpenSource contributions on @gitopiaDAO 🎉
You can earn rewards too for your projects 💰
Start building on #Gitopia today! 🚀
#GitopiaRewards | Learn more: `
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
      <section className={"relative mt-12 flex flex-col items-center lg:mt-16"}>
        <div className="w-full max-w-screen-lg items-center">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl lg:text-5xl font-bold tracking-tight lg:text-center">
              Rewards - Round 1
            </div>
          </div>
          <div className="border border-grey-50 rounded-xl bg-base-200/70 max-w-2xl text-sm relative mx-4 lg:mx-auto mt-12 lg:mt-16">
            <div className="font-bold text-xs uppercase bg-base-200 border border-grey-50 text-purple-50 rounded-full px-4 py-1 absolute -top-3 left-1/2 -ml-24">
              Platform Incentives
            </div>
            <div className="flex flex-col justify-evenly gap-8 px-8 pt-10 pb-4 lg:flex-row">
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
                      className="h-3.5 w-3.5"
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
                      className="h-3.5 w-3.5"
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
            <div className="flex my-4 mx-4 px-3 pb-4 w-full">
              <div className="flex mx-auto">
                <div className="text-xs opacity-60 font-bold mr-2">
                  {totalPlatformIncentivesToken != 0
                    ? (
                        (totalClaimedPlatformIncentivesToken /
                          totalPlatformIncentivesToken) *
                        100
                      ).toFixed(2)
                    : 0 + "%"}{" "}
                  Claimed
                </div>
                <progress
                  className="progress progress-primary w-56 sm:w-80 mt-1"
                  value={
                    totalPlatformIncentivesToken != 0
                      ? (totalClaimedPlatformIncentivesToken /
                          totalPlatformIncentivesToken) *
                        100
                      : 0
                  }
                  max="100"
                ></progress>
              </div>
            </div>
          </div>
        </div>

        {totalClaimedPlatformIncentivesToken > 0 && (
          <Link
            className="btn btn-primary btn-base  mx-4 my-8 lg:w-48"
            href={`https://twitter.com/intent/tweet?text=${xPost}&url=${encodeURI(
              "https://gitopia.com/rewards"
            )}`}
          >
            𝕏 Post
          </Link>
        )}

        <div className="flex flex-col bg-info/30 rounded-xl mx-4 p-6 my-8 text-xs sm:text-base w-full max-w-screen-lg">
          {totalPlatformIncentivesToken > 0 ? (
            <div>
              🎉 Congratulations! You have earned{" "}
              <span className="uppercase">
                {showToken(totalPlatformIncentivesToken, token)}
              </span>{" "}
              as platform incentives for your open source contributions. 🎉
            </div>
          ) : (
            <div>
              🌟 Hello! While you didn't qualify for platform incentives in this
              round, there are still many ways to earn rewards! Try these tips
              to increase your chances next time:
              <ul className="list-disc mx-4">
                <li>
                  Hunt Gitopia{" "}
                  <Link
                    href="https://gitopia.com/bounties"
                    className="text-xs link link-primary no-underline hover:underline"
                  >
                    Bounties
                  </Link>
                </li>
                <li>
                  Contribute to verified repositories in verified DAOs like{" "}
                  <Link
                    href="https://gitopia.com/Gitopia"
                    className="text-xs link link-primary no-underline hover:underline"
                  >
                    Gitopia
                  </Link>
                </li>
                <li>
                  Push your own repositories to Gitopia and make contributions
                </li>
              </ul>
            </div>
          )}
          <br />
          <ul className="list-disc mx-4">
            <li>Round 1 Total Distribution: 2,250,000 LORE</li>
            <li>
              Cutoff Date: Contributions up to Feb 9th 2024 are taken into
              account for this round of distribution
            </li>
          </ul>
        </div>

        {splits?.map((t, i = 0) => {
          return (
            <div
              className="bg-base-200/70 mx-4 mt-4 flex w-full max-w-screen-lg rounded-xl p-2 text-xs sm:text-base"
              key={i}
            >
              <div className="gap-4 lg:flex">
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
                    className="btn btn-primary btn-sm mx-4 ml-auto mr-3 sm:mt-2 px-12"
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
                    className="h-4 w-3"
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
            "pointer-events-none invisible absolute -top-20 left-1/3 -z-30 opacity-30 lg:visible lg:opacity-50"
          }
          src="/rewards/drop-mid.svg"
          width={"622"}
          height={"762"}
        />
        <img
          className={
            "pointer-events-none absolute -left-16 top-10 -z-10 opacity-50 sm:left-5 sm:top-28 lg:left-60 lg:top-44"
          }
          src="/rewards/drop-1.svg"
        />
        <img
          className={
            "pointer-events-none absolute right-0 top-36 -z-10 opacity-50 sm:right-16 sm:top-28 lg:right-36 lg:top-40"
          }
          src="/rewards/drop-2.svg"
        />
        <img
          className={
            "pointer-events-none absolute bottom-2/3 right-10 -z-10 w-3/4 opacity-50 sm:mb-14"
          }
          src="/rewards/objects.svg"
        />
        <img
          className={
            "pointer-events-none absolute bottom-1/3 -z-20 mb-96 w-full opacity-50 lg:mb-48 2xl:mb-10"
          }
          src="/rewards/ellipse.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-2/3 -z-20 w-full opacity-50 sm:visible lg:bottom-1/3 lg:mb-48"
          }
          src="/rewards/stars-3.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-3/4 left-5 -z-20 mt-20 opacity-30 lg:visible"
          }
          src="/rewards/coin-1.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute -top-36 right-0 -z-20 opacity-30 sm:visible lg:-top-20"
          }
          src="/rewards/coin-2.svg"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-2/3 left-36 -z-20 opacity-30 lg:visible"
          }
          src="/rewards/coin-3.png"
        />
        <img
          className={
            "pointer-events-none invisible absolute bottom-1/2 right-36 -z-20 mb-28 opacity-30 lg:visible"
          }
          src="/rewards/coin-4.svg"
        />
      </section>
      <img
        className={
          "pointer-events-none invisible absolute top-40 -z-20 w-full opacity-50 sm:visible lg:top-28"
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
