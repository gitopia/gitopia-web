import { useState, useEffect } from "react";
import axios from "../helpers/axiosFetch";
import Head from "next/head";
import Header from "./landingPageHeader";
import Footer from "./landingPageFooter";
import styles from "../styles/landing.module.css";
import Link from "next/link";
import { connect } from "react-redux";
import { notify } from "reapop";
import { calculateGithubRewards, claimRewards } from "../store/actions/user";
import { updateUserBalance } from "../store/actions/wallet";
import getTasks from "../helpers/getTasks";
import { tasksToMessage } from "../helpers/tasksTypes";
import { useRouter } from "next/router";
import getRewardToken from "../helpers/getRewardTokens";

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function ClaimRewards(props) {
  const [loading, setLoading] = useState(false);
  const [totalToken, setTotalToken] = useState(null);
  const [claimedToken, setClaimedToken] = useState(null);
  const [unclaimedToken, setUnclaimedToken] = useState(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [tasksTotal, setTasksTotal] = useState(1);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [remainingClaimableToken, setRemainingClaimableToken] = useState(0);

  const router = useRouter();
  const deadlineUnix = process.env.NEXT_PUBLIC_REWARD_DEADLINE;

  const getTime = () => {
    const deadline = dayjs.unix(deadlineUnix);
    const now = dayjs();
    const diff = dayjs.duration(deadline.diff(now));
    setDays(diff.days());
    setHours(diff.hours());
    setMinutes(diff.minutes());
  };

  const calculateTasksPercentage = (t) => {
    let count = 0;
    let total = 0;
    if (t.length > 0) {
      for (let i = 0; i < t?.length; i++) {
        total = total + t[i].weight;
        if (t[i].isComplete) {
          count = count + t[i].weight;
        }
      }
    }
    setTasksTotal(total);
    return count;
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadlineUnix), 60000);
    return () => clearInterval(interval);
  });
  async function fetchTasks() {
    const t = await getTasks(props.selectedAddress);
    if (t !== undefined) {
      setTasks(t);
      if (tasks) {
        const percentage = await calculateTasksPercentage(t);
        setTasksCompleted(percentage);
      }
    }
  }

  useEffect(() => {
    fetchTasks();
    getTime(deadlineUnix);
    getTokens();
  }, [props.selectedAddress]);

  async function getTokens() {
    let res = await getRewardToken(props.selectedAddress);
    if (res) {
      setTotalToken(res.amount.amount);
      setClaimedToken(res.claimed_amount.amount);
      setUnclaimedToken(res.claimable_amount.amount);
      setRemainingClaimableToken(res.remaining_claimable_amount.amount);
    }
  }
  setInterval(getTokens, 60000);
  setInterval(fetchTasks, 60000);

  const claimTokens = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    const res = await props.claimRewards();
    if (res) {
      getTokens();
      props.notify("reward claimed", "info");
    }
    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={"flex flex-col items-center sm:mt-20 relative"}>
        <div className="items-center w-1/2 sm:w-3/4 lg:w-2/3">
          <div>
            <div className="text-4xl lg:text-7xl font-bold w-96 tracking-tight lg:leading-[4rem]">
              Claim Airdrop
            </div>
            {props.activeWallet === null ? (
              <div>
                <Link
                  className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-60 rounded-md mt-10"
                  href="/login"
                >
                  Connect Wallet
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="sm:ml-auto w-80 mt-10">
            <div className="mt-8">
              <div className="flex">
                <div className="opacity-70 font-bold">Unlocked Rewards</div>
                <button
                  className={
                    "btn btn-primary btn-xs bg-green w-24 rounded-md ml-2 " +
                    (loading ? "loading" : "")
                  }
                  disabled={unclaimedToken <= 0}
                  onClick={() => {
                    if (
                      process.env.NEXT_PUBLIC_REWARD_DEADLINE < dayjs().unix()
                    ) {
                      props.notify("Claim airdrop period ended", "error");
                    } else if (unclaimedToken <= 0) {
                      props.notify(
                        "You don't have any unclaimed tokens",
                        "error"
                      );
                    } else {
                      claimTokens();
                    }
                  }}
                >
                  Claim Now
                </button>
                <div className="tooltip" data-tip="Decays by 1% everyday">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 mt-1"
                  >
                    <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                    <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                    <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl uppercase">
                {unclaimedToken +
                  " " +
                  process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN}
              </div>
            </div>
            <div className="flex mt-8">
              <div className="opacity-70 font-bold">Locked Rewards</div>
              <div className="tooltip" data-tip="Decays by 1% everyday">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 mt-1"
                >
                  <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                  <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                  <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <div className="text-4xl uppercase">
              {remainingClaimableToken +
                " " +
                process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN}
            </div>

            <div className="opacity-70 font-bold mt-8">Claimed</div>
            <div className="text-4xl uppercase">
              {claimedToken +
                " " +
                process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN}
            </div>
          </div>
        </div>

        <div className="flex p-4 box-border bg-[#222932] w-80 sm:w-3/4 lg:w-2/3 rounded-3xl mt-4 h-36 sm:h-44 mt-24 flex flex-col items-center">
          <div className="font-bold text-[#4C6784] text-sm uppercase">
            TIME LEFT
          </div>
          <div className="flex flex-row justify-between w-full px-3 sm:px-5 lg:px-16 2xl:px-32">
            <div className="font-bold sm:text-4xl py-8">{days + " "} DAYS</div>
            <div className="border-l border-base-100 h-20 sm:h-28"></div>
            <div className="font-bold sm:text-4xl py-8">
              {hours + " "} HOURS
            </div>
            <div className="border-l border-base-100 h-20 sm:h-28"></div>
            <div className="font-bold sm:text-4xl py-8">{minutes + " "}MIN</div>
          </div>
        </div>
        <div className="sm:flex mt-24 w-80 sm:w-3/4">
          <div className="text-4xl">Mission</div>
          <div className="flex ml-auto">
            <div className="text-xs opacity-60 mt-4 font-bold mr-2">
              {tasksCompleted + "%"} Complete
            </div>
            <progress
              className="progress progress-primary w-56 sm:w-80 mt-5"
              value={tasksCompleted}
              max="100"
            ></progress>
          </div>
        </div>
        {tasks?.map((t, i = 0) => {
          return (
            <div
              className="flex p-2 sm:p-4 box-border bg-[#222932] w-80 sm:w-3/4 rounded-xl mt-4 text-xs sm:text-base"
              key={i}
            >
              <div className="lg:flex">
                <div
                  className={"my-3 ml-4 " + (t.isComplete ? "text-green" : "")}
                >
                  {tasksToMessage[t.type]}
                </div>
                <div
                  className={
                    "ml-4 lg:ml-2 flex items-center rounded-full px-4 py-0.5 bg-purple text-xs mt-3 h-6 w-28 mb-4 sm:mb-0 " +
                    (t.isComplete ? "hidden" : "")
                  }
                >
                  {(t.weight / tasksTotal) * remainingClaimableToken +
                    " " +
                    process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN}
                </div>
              </div>
              {t.isComplete ? (
                <img
                  className="ml-auto mr-3 sm:mt-2"
                  src="/rewards/checkmark.svg"
                />
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

        <div className="flex flex-col items-center mt-12">
          <button
            className={
              "btn btn-primary bg-green h-14 py-3 w-72 rounded-md " +
              (loading ? "loading" : "")
            }
            onClick={() => {
              if (process.env.NEXT_PUBLIC_REWARD_DEADLINE < dayjs().unix()) {
                props.notify("Claim airdrop period ended", "error");
              } else if (unclaimedToken <= 0) {
                props.notify("You don't have any unclaimed tokens", "error");
              } else {
                claimTokens();
              }
            }}
          >
            Claim Now
          </button>
          <div className="text-xs opacity-50 text-white mt-4">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
        <img
          className={
            "absolute pointer-events-none -z-30 left-1/3 -top-20 opacity-30 lg:opacity-100 invisible lg:visible"
          }
          src="/rewards/drop-mid.svg"
          width={"622"}
          height={"762"}
        />
        <img
          className={
            "absolute pointer-events-none -z-10 -left-16 sm:left-5 lg:left-60 top-10 sm:top-28 lg:top-44"
          }
          src="/rewards/drop-1.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 right-0 sm:right-16 lg:right-36 top-36 sm:top-28 lg:top-40 "
          }
          src="/rewards/drop-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 w-3/4 right-10 bottom-2/3 sm:mb-14 "
          }
          src="/rewards/objects.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 w-full bottom-1/3 mb-96 lg:mb-48 2xl:mb-10 "
          }
          src="/rewards/ellipse.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 w-full bottom-2/3 lg:bottom-1/3 lg:mb-48 invisible sm:visible"
          }
          src="/rewards/stars-3.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 left-5 bottom-3/4 mt-20 invisible lg:visible"
          }
          src="/rewards/coin-1.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 right-0 -top-36 lg:-top-20 invisible sm:visible"
          }
          src="/rewards/coin-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 bottom-2/3 left-36 invisible lg:visible"
          }
          src="/rewards/coin-3.png"
        />
        <img
          className={
            "absolute pointer-events-none bottom-1/2 mb-28 right-36 -z-20 invisible lg:visible"
          }
          src="/rewards/coin-4.svg"
        />
      </section>
      <img
        className={
          "absolute pointer-events-none -z-20 w-full top-40 lg:top-28 invisible sm:visible"
        }
        src="/rewards/stars-1.svg"
      />

      <Footer />
    </div>
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
  calculateGithubRewards,
  updateUserBalance,
  claimRewards,
})(ClaimRewards);
