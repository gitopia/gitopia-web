import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { notify } from "reapop";
import styles from "../../styles/landing.module.css";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/landingPageHeader";
import Footer from "../../components/landingPageFooter";
import getWhois from "../../helpers/getWhois";
import { calculateGithubRewards } from "../../store/actions/user";
import axios from "../../helpers/axiosFetch";
import LoadingRewards from "../../components/loadingRewards";
import ClaimRewards from "../../components/claimRewards";
import { getBalance } from "../../store/actions/wallet";
import { updateUserBalance } from "../../store/actions/wallet";
import { claimRewards } from "../../store/actions/user";
import { tasksToMessage } from "../../helpers/tasksTypes";
import getTasks from "../../helpers/getTasks";
import getRewardToken from "../../helpers/getRewardTokens";

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function showToken(value, denom) {
  if (denom === process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN) {
    return value + " " + denom;
  } else {
    let roundOff = Math.floor(value / 10000) / 100;
    return roundOff + " " + denom;
  }
}

function Rewards(props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [mobile, setMobile] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [code, setCode] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const router = useRouter();
  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setMobile(true) : setMobile(false);
    }
  }
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_CURRENCY_TOKEN);
  const [claimedToken, setClaimedToken] = useState(500000);
  const [unclaimedToken, setUnclaimedToken] = useState(100000);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [tasks, setTasks] = useState([
    {
      type: "CREATE_USER",
      isComplete: false,
      weight: 5,
    },
    {
      type: "CREATE_NON_EMPTY_REPO",
      isComplete: false,
      weight: 10,
    },
    {
      type: "CREATE_ISSUE",
      isComplete: false,
      weight: 5,
    },
    {
      type: "CREATE_ISSUE_WITH_BOUNTY",
      isComplete: false,
      weight: 10,
    },
    {
      type: "CREATE_ISSUE_WITH_BOUNTY_VERIFIED",
      isComplete: false,
      weight: 10,
    },
    {
      type: "PR_TO_REPO_MERGED",
      isComplete: false,
      weight: 20,
    },
    {
      type: "PR_TO_VERIFIED_REPO_MERGED",
      isComplete: false,
      weight: 10,
    },
    {
      type: "PR_TO_VERIFIED_REPO_MERGED_WITH_BOUNTY",
      isComplete: false,
      weight: 10,
    },
    {
      type: "LORE_STAKED",
      isComplete: false,
      weight: 10,
    },
    {
      type: "VOTE_PROPOSAL",
      isComplete: false,
      weight: 10,
    },
  ]);
  const [tasksTotal, setTasksTotal] = useState(100);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [
    remainingClaimableEcosystemToken,
    setRemainingClaimableEcosystemToken,
  ] = useState(250000000);
  const [remainingClaimableGithubToken, setRemainingClaimableGithubToken] =
    useState(250000000);
  const [isEcosystemTokensLoaded, setIsEcosystemTokensLoaded] = useState(true);
  const [isGithubTokensLoaded, setIsGithubTokensLoaded] = useState(false);

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
    let i1, i2, i3;
    if (typeof window !== "undefined") {
      i1 = setInterval(() => getTime(deadlineUnix), 60000);
      i2 = setInterval(getTokens, 60000);
      i3 = setInterval(fetchTasks, 60000);
    }
    return () => {
      if (typeof window !== "undefined") {
        clearInterval(i1);
        clearInterval(i2);
        clearInterval(i3);
      }
    };
  });

  async function fetchTasks() {
    const t = await getTasks(props.selectedAddress);
    if (Array.isArray(t)) {
      setTasks(t);
      const percentage = await calculateTasksPercentage(t);
      setTasksCompleted(percentage);
    } else {
      let newTasks = tasks.map((t) => {
        return {
          ...t,
          isComplete: false,
        };
      });
      setTasks(newTasks);
      const percentage = await calculateTasksPercentage(newTasks);
      setTasksCompleted(percentage);
    }
  }

  useEffect(() => {
    fetchTasks();
    getTime(deadlineUnix);
    getTokens();
  }, [props.selectedAddress]);

  async function getTokens() {
    let res = await getRewardToken(props.selectedAddress);
    console.log(res);
    if (res) {
      res.claimed_amount?.amount +
        res.claimable_amount?.amount +
        res.remaining_claimable_amount?.amount <
      1000000
        ? setToken(process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN)
        : setToken(process.env.NEXT_PUBLIC_CURRENCY_TOKEN);

      setClaimedToken(res.claimed_amount?.amount || 0);
      setUnclaimedToken(res.claimable_amount?.amount || 0);
      setRemainingClaimableEcosystemToken(
        res.remaining_claimable_amount?.amount || 0
      );
      // set github tokens
      // setRemainingClaimableGithubToken();
      // setIsGithubTokensLoaded(true);
      setIsEcosystemTokensLoaded(true);
    }
  }

  const claimTokens = async () => {
    if (process.env.NEXT_PUBLIC_REWARD_DEADLINE < dayjs().unix()) {
      props.notify("Claim airdrop period ended", "error");
    } else if (unclaimedToken <= 0) {
      props.notify("You don't have any unclaimed tokens", "error");
    }
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
  useEffect(() => {
    async function initBalance() {
      const balance = await props.getBalance(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_WALLET_ADDRESS
      );
      setWalletBalance(
        props.advanceUser === true
          ? balance + " " + process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
          : balance / 1000000 + " " + process.env.NEXT_PUBLIC_CURRENCY_TOKEN
      );
    }
    if (typeof window !== "undefined") {
      window.addEventListener("resize", detectWindowSize);
    }
    detectWindowSize();
    initBalance();
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", detectWindowSize);
      }
    };
  });

  async function fetchStatus() {
    const res = await axios
      .get(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL +
          "/rewards?addr=" +
          props.selectedAddress
      )
      .then(({ data }) => {
       // setStatus(data.status);
       setStatus(null)
      })
      .catch((e) => {
        setStatus(404);
      });
  }
  useEffect(() => {
    const id = setInterval(fetchStatus, 1000);
    return () => {
      clearInterval(id);
    };
  });

  useEffect(() => {
    const query = window.location.search;
    const urlParameters = new URLSearchParams(query);
    const codeValue = urlParameters.get("code");
    setCode(codeValue);
    router.push("/rewards");
  }, []);

  useEffect(() => {
    async function fetchName() {
      const data = await getWhois(props.activeWallet?.name);
      if (props.activeWallet !== null && data !== null && data !== undefined) {
        setActiveWallet(props.activeWallet);
      }
    }
    fetchName();
  }, [props.activeWallet]);

  const getRewards = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    console.log(code);
    const res = await props.calculateGithubRewards(code);
    console.log(res);
    await axios
      .post(process.env.NEXT_PUBLIC_REWARD_SERVICE_URL + "/rewards", {
        payload: res,
      })
      .then(({ data }) => {
        setStatus(data.status);
      })
      .catch(({ err }) => {
        console.error(err);
      });
    setLoading(false);
  };

  function githubLogin() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID
    );
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={"flex flex-col items-center mt-12 lg:mt-16 relative"}>
        <div className="items-center max-w-screen-lg w-full">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl lg:text-7xl font-bold tracking-tight lg:text-center">
              Claim Airdrop
            </div>
            <div className="text-xl lg:text-3xl font-bold text-type-tertiary mt-4 lg:text-center">
              {`${days} Days ${hours} Hours ${minutes} Minutes Left`}
            </div>
          </div>
          <div className="border border-grey-50 rounded-xl bg-base-200/70 max-w-2xl text-sm relative mx-4 lg:mx-auto mt-12 lg:mt-16">
            <div className="font-bold text-xs uppercase bg-base-200 border border-grey-50 text-purple-50 rounded-full px-4 py-1 absolute -top-3 left-1/2 -ml-20">
              Available Rewards
            </div>
            <div className="flex flex-col lg:flex-row gap-8 justify-evenly p-8">
              <div className="lg:text-center">
                <div className="inline-flex items-center">
                  <span className="text-type-secondary font-bold">
                    Ecosystem Staking
                  </span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Based on staking on Cosmos, Osmosis and Akash chain spanshots on 14th April 2023"
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
                  <span className="text-4xl mr-2 text-type-tertiary">
                    {!isEcosystemTokensLoaded ? "~" : ""}
                  </span>
                  <span className="text-4xl uppercase">
                    {showToken(remainingClaimableEcosystemToken, token)}
                  </span>
                </div>
                <Link
                  className={
                    "btn btn-secondary btn-sm mt-2 " +
                    (loading ? "loading" : "")
                  }
                  disabled={props.selectedAddress}
                  href="/login"
                >
                  Login with staking wallet
                </Link>
              </div>
              <div className="lg:text-center">
                <div className="inline-flex items-center">
                  <span className="text-type-secondary font-bold">
                    Open Source Contribution
                  </span>
                  <span
                    className="tooltip ml-2 mt-px"
                    data-tip="Based on contributions to open source repositories on Github till 14th April 2023"
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
                {status === 1 ? (
                  <div className="flex justify-center mt-4 ">
                    <div className="mr-2 text-2xl font-bold text-base">
                      Calculating
                    </div>
                    <div
                      class="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-2">
                    <span className="text-4xl mr-2 text-type-tertiary">
                      {status === 2 ? "" : "~"}
                    </span>
                    <span className="text-4xl uppercase">
                      {showToken(remainingClaimableGithubToken, token)}
                    </span>
                  </div>
                )}

                {status !== 1 && status !== 2 ? (
                  code === null ? (
                    <button
                      className={
                        "btn btn-secondary btn-sm mt-2 " +
                        (loading ? "loading" : "")
                      }
                      onClick={() => {
                        if (!props.selectedAddress) {
                          props.notify("Please login first", "error");
                        } else if (
                          process.env.NEXT_PUBLIC_REWARD_DEADLINE <
                          dayjs().unix()
                        ) {
                          props.notify("Claim airdrop period ended", "error");
                        } else if (unclaimedToken <= 0) {
                          props.notify(
                            "You don't have any unclaimed tokens",
                            "error"
                          );
                        } else {
                          githubLogin();
                        }
                      }}
                    >
                      Connect with Github profile
                    </button>
                  ) : (
                    <button
                      className={
                        "btn btn-secondary btn-sm mt-2 " +
                        (loading ? "loading" : "")
                      }
                      onClick={() => {
                        if (!props.selectedAddress) {
                          props.notify("Please login first", "error");
                        } else if (
                          process.env.NEXT_PUBLIC_REWARD_DEADLINE <
                          dayjs().unix()
                        ) {
                          props.notify("Claim airdrop period ended", "error");
                        } else if (unclaimedToken <= 0) {
                          props.notify(
                            "You don't have any unclaimed tokens",
                            "error"
                          );
                        } else {
                          getRewards();
                        }
                      }}
                    >
                      Calculate Reward
                    </button>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-12 lg:mt-16">
            {unclaimedToken ? (
              <button
                className="btn btn-primary btn-lg mx-4 lg:w-96"
                onClick={claimTokens}
              >
                <span>Claim</span>
                <span className="ml-1 uppercase">
                  {showToken(unclaimedToken, token)}
                </span>
              </button>
            ) : (
              <Link
                className="btn btn-primary btn-lg  mx-4 lg:w-96"
                href="#missions"
              >
                Complete missions to unlock more
              </Link>
            )}

            {claimedToken ? (
              <div className="text-xs text-type-secondary mt-4">
                <span>Already claimed</span>
                <span className="ml-1 uppercase">
                  {showToken(claimedToken, token)}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="flex my-8 mx-4 px-6 max-w-screen-lg w-full lg:mt-16">
          <div id="missions" className="text-4xl">
            Missions
          </div>
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
              className="flex bg-base-200/70 rounded-xl mt-4 mx-4 p-2 text-xs sm:text-base w-full max-w-screen-lg"
              key={i}
            >
              <div className="lg:flex gap-4">
                <div
                  className={"my-3 ml-4 " + (t.isComplete ? "text-green" : "")}
                >
                  {tasksToMessage[t.type]}
                </div>
                <div
                  className={
                    "rounded-full px-2 py-px text-xs h-5 mt-3.5 tooltip cursor-default border" +
                    (isEcosystemTokensLoaded
                      ? " bg-purple-900 text-purple-50 border-transparent"
                      : " text-purple-50 border-purple-900")
                  }
                  data-tip={
                    isEcosystemTokensLoaded
                      ? "Ecosystem staking rewards"
                      : "Estimated staking rewards - login to calculate exact amount"
                  }
                >
                  <span>{isEcosystemTokensLoaded ? "" : "~"}</span>
                  <span className="uppercase">
                    {showToken(
                      (t.weight / tasksTotal) *
                        remainingClaimableEcosystemToken,
                      token
                    )}
                  </span>
                </div>
                <div
                  className={
                    "rounded-full px-2 py-px text-xs h-5 mt-3.5 tooltip cursor-default border" +
                    (isGithubTokensLoaded
                      ? " bg-purple-900 text-purple-50 border-transparent"
                      : " text-purple-50 border-purple-900")
                  }
                  data-tip={
                    isGithubTokensLoaded
                      ? "Open source contribution rewards"
                      : "Estimated open source contribution rewards - connect Github to calculate exact amount"
                  }
                >
                  <span>{isGithubTokensLoaded ? "" : "~"}</span>
                  <span className="uppercase">
                    {showToken(
                      (t.weight / tasksTotal) * remainingClaimableGithubToken,
                      token
                    )}
                  </span>
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
          {unclaimedToken ? (
            <button
              className={
                "btn btn-primary btn-lg mx-4 lg:w-96" +
                (loading ? " loading" : "")
              }
              onClick={claimTokens}
            >
              <span>Claim</span>
              <span className="ml-1 uppercase">
                {showToken(unclaimedToken, token)}
              </span>
            </button>
          ) : (
            <Link
              className="btn btn-primary btn-lg  mx-4 lg:w-96"
              href="#missions"
            >
              Complete missions to unlock more
            </Link>
          )}
          <div className="text-xs text-type-secondary mt-4">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
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
  getBalance,
  updateUserBalance,
  claimRewards,
})(Rewards);
