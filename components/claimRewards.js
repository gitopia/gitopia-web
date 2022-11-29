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
import { getTasks } from "../store/actions/wallet";
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

  const deadline = "December, 31, 2022";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
  };

  const calculateTasksPercentage = () => {
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].isComplete === true) {
        count++;
      }
    }
    setTasksCompleted(count / 6);
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 60000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    async function getTokens() {
      await axios
        .get("/rewards?addr=" + props.selectedAddress)
        .then(({ data }) => {
          setTotalToken(data.total_amount);
          setClaimedToken(data.claimed_amount);
          setUnclaimedToken(data.claimable_amount);
        })
        .catch(({ err }) => {
          console.error(err);
        });
    }
    async function getTasks() {
      const tasks = await props.getTasks(props.selectedAddress);
      setTasks(tasks);
      calculateTasksPercentage();
    }
    getTasks();
    getTokens();
  }, [props.selectedAddress]);

  const claimTokens = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    const res = await props.calculateGithubRewards("ASDASDASD");
    console.log(res);
    await axios
      .post("http://localhost:3001/claim", {
        payload: res,
      })
      .then((res) => {
        updateUserBalance();
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
      <section className={"flex flex-col items-center mt-40 relative"}>
        <div className="flex flex-col ml-10 w-2/3">
          <div className="text-7xl font-bold w-96 tracking-tight leading-[4rem]">
            Claim Airdrop
          </div>
          <div className="flex">
            <div>
              <Link href="/login">
                <div className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md mt-10">
                  Connect Wallet
                </div>
              </Link>
            </div>
          </div>
          <div className="self-center ml-auto">
            <div className="opacity-50 font-bold">Total Token Available</div>
            <div className="text-4xl">{totalToken}</div>
            <div className="opacity-50 font-bold mt-8">Unclaimed</div>
            <div className="text-4xl">{claimedToken}</div>
            <div className="opacity-50 font-bold mt-8">Claimed Airdrop</div>
            <div className="text-4xl">{unclaimedToken}</div>
          </div>
        </div>

        <div className="flex p-4 box-border bg-[#222932] w-2/3 rounded-3xl mt-4 h-44 mt-24 flex flex-col items-center">
          <div className="font-bold text-[#4C6784] text-sm uppercase">
            TIME LEFT
          </div>
          <div className="flex flex-row justify-between w-full px-16">
            <div className="font-bold text-4xl py-8">{days + " "} DAYS</div>
            <div className="border-l border-base-100 h-28"></div>
            <div className="font-bold text-4xl py-8">{hours + " "} HOURS</div>
            <div className="border-l border-base-100 h-28"></div>
            <div className="font-bold text-4xl py-8">{minutes + " "}MIN</div>
          </div>
        </div>
        <div className="flex mt-24 w-2/3">
          <div className="text-4xl">Mission</div>
          <div className="flex ml-auto">
            <div className="text-xs opacity-60 mt-4 font-bold mr-2">
              {tasksCompleted + " "} Complete
            </div>
            <progress
              className="progress progress-primary w-80 mt-5"
              value={tasksCompleted}
              max="100"
            ></progress>
          </div>
        </div>
        {tasks.map((t, i = 0) => {
          return (
            <div
              className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4"
              key={i}
            >
              <div
                className={"my-3 ml-4 " + (t.isComplete ? "text-green" : "")}
              >
                {t.type}
              </div>
              {t.isComplete ? (
                <img
                  className="ml-auto mr-3 mt-2"
                  src="/rewards/checkmark.svg"
                />
              ) : (
                <img
                  className="ml-auto mr-3 mt-2"
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
          className={"absolute pointer-events-none -z-10 left-1/3 -top-32"}
          src="/rewards/drop-mid.svg"
          width={"622"}
          height={"762"}
        />
        <img
          className={"absolute pointer-events-none z-1 left-5 "}
          src="/rewards/drop-1.svg"
        />
        <img
          className={"absolute pointer-events-none z-1 right-16 top-28 "}
          src="/rewards/drop-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 w-3/4 right-10 top-1/4 mt-10 "
          }
          src="/rewards/objects.svg"
        />
        <img
          className={"absolute pointer-events-none -z-20 w-full top-1/4 "}
          src="/rewards/ellipse.svg"
        />
        <img
          className={"absolute pointer-events-none -z-20 w-full bottom-1/2"}
          src="/rewards/stars-3.svg"
        />
        <img
          className={"absolute pointer-events-none -z-20 left-5 top-1/4"}
          src="/rewards/coin-1.svg"
        />
        <img
          className={"absolute pointer-events-none -z-20 right-0 -top-44"}
          src="/rewards/coin-2.svg"
        />
      </section>
      <img
        className={"absolute pointer-events-none -z-20 w-full top-24"}
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
  getTasks,
})(ClaimRewards);
