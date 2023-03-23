import { useState, useEffect } from "react";
import axios from "../helpers/axiosFetch";
import Head from "next/head";
import Header from "./landingPageHeader";
import Footer from "./landingPageFooter";
import styles from "../styles/landing.module.css";
import Link from "next/link";
import { connect } from "react-redux";
import { notify } from "reapop";
import { calculateGithubRewards } from "../store/actions/user";
import { updateUserBalance } from "../store/actions/wallet";
import getTasks from "../helpers/getTasks";
import { error } from "daisyui/src/colors";

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");

// add plugins to dayjs
dayjs.extend(duration);
dayjs.extend(customParseFormat);

function ClaimRewards(props) {
  const [loading, setLoading] = useState(false);
  const [totalToken, setTotalToken] = useState(false);
  const [claimedToken, setClaimedToken] = useState(null);
  const [unclaimedToken, setUnclaimedToken] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const deadlineUnix = process.env.NEXT_PUBLIC_REWARD_DEADLINE;

  const getTime = () => {
    const deadline = dayjs.unix(deadlineUnix);
    const now = dayjs();
    const diff = dayjs.duration(deadline.diff(now));
    setDays(diff.days());
    setHours(diff.hours());
    setMinutes(diff.minutes());
  };

  const calculateTasksPercentage = () => {
    let count = 0;
    for (let i = 0; i < tasks?.length; i++) {
      if (tasks[i].isComplete === true) {
        count++;
      }
    }
    setTasksCompleted(count / 6);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadlineUnix), 1000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    async function fetchTasks() {
      const tasks = await getTasks(props.selectedAddress);
      if (tasks !== undefined) {
        setTasks(tasks);
      }
      calculateTasksPercentage();
    }
    fetchTasks();
  }, [props.selectedAddress]);

  async function getTokens() {
    await axios
      .get(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL +
          "/rewards?addr=" +
          props.selectedAddress
      )
      .then(({ data }) => {
        setTotalToken(data.total_amount);
        setClaimedToken(data.claimed_amount);
        setUnclaimedToken(data.claimable_amount);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  setInterval(getTokens, 120000);

  const claimTokens = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    const res = await props.calculateGithubRewards("ASDASDASD");
    await axios
      .post(process.env.NEXT_PUBLIC_REWARD_SERVICE_URL + "/claim", {
        payload: res,
      })
      .then((res) => {
        updateUserBalance();
        getTokens();
        notify("Reward Claimed", info);
      })
      .catch(({ err }) => {
        console.error(err);
      });
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
            <div>
              <Link
                className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-60 rounded-md mt-10"
                href="/login"
              >
                Connect Wallet
              </Link>
            </div>
          </div>
          <div className="sm:ml-auto w-60 mt-10">
            <div className="opacity-50 font-bold">Total Token Available</div>
            <div className="text-4xl">{totalToken} tLore</div>
            <div className="opacity-50 font-bold mt-8">Unclaimed</div>
            <div className="text-4xl">
              {
                //claimedToken
              }{" "}
              tLore
            </div>
            <div className="opacity-50 font-bold mt-8">Claimed Airdrop</div>
            <div className="text-4xl">
              {
                //unclaimedToken
              }{" "}
              tLore
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
              <div
                className={"my-3 ml-4 " + (t.isComplete ? "text-green" : "")}
              >
                {t.type}
              </div>
              {t.isComplete ? (
                <img
                  className="ml-auto mr-3 sm:mt-2"
                  src="/rewards/checkmark.svg"
                />
              ) : (
                <img
                  className="ml-auto mr-3 sm:mt-2"
                  src="/rewards/unchecked-mark.svg"
                />
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
            disabled={""}
            onClick={() => {
              claimTokens();
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
            "absolute pointer-events-none -z-10 left-1/3 -top-20 opacity-30 lg:opacity-100 invisible lg:visible"
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
})(ClaimRewards);
