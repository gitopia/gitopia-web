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
import { tasksToMessage } from "../../helpers/tasksTypes";
import getTasks from "../../helpers/getTasks";
import getRewardToken from "../../helpers/getRewardTokens";
import showToken from "../../helpers/showToken";

const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(duration);
dayjs.extend(customParseFormat);

function Rewards(props) {
  const [calculatingRewardsLoading, setCalculatingRewardsLoading] =
    useState(false);
  const [getEcosystemRewardsLoading, setGetEcosystemRewardsLoading] =
    useState(false);
  const [claimTokensLoading, setClaimTokensLoading] = useState(false);
  const [githubCalculationStatus, setGithubCalculationStatus] = useState(0);
  const [code, setCode] = useState(null);
  const router = useRouter();
  const [token, setToken] = useState(process.env.NEXT_PUBLIC_CURRENCY_TOKEN);
  const [claimedGithubToken, setClaimedGithubToken] = useState(0);
  const [unclaimedGithubToken, setUnclaimedGithubToken] = useState(0);
  const [claimedEcosystemToken, setClaimedEcosystemToken] = useState(0);
  const [unclaimedEcosystemToken, setUnclaimedEcosystemToken] = useState(0);
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
  ] = useState(0);
  const [remainingClaimableGithubToken, setRemainingClaimableGithubToken] =
    useState(0);
  const [totalGithubToken, setTotalGithubToken] = useState(150000000);
  const [totalEcosystemToken, setTotalEcosystemToken] = useState(500000000);
  const [isEcosystemTokensLoaded, setIsEcosystemTokensLoaded] = useState(false);
  const [githubCalculationError, setGithubCalculationError] = useState(null);

  const deadlineUnix = process.env.NEXT_PUBLIC_REWARD_DEADLINE;
  let pollingIntervalId;

  const getTime = () => {
    const deadline = dayjs.unix(deadlineUnix);
    const start = dayjs.unix(process.env.NEXT_PUBLIC_REWARD_START);
    const now = dayjs();
    if (now.isAfter(start)) {
      const diff = dayjs.duration(deadline.diff(now));
      setDays(parseInt(diff.asDays()));
      setHours(diff.hours());
      setMinutes(diff.minutes());
    } else {
      setDays("-");
      setHours("-");
      setMinutes("-");
    }
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
    let i1, i2, i3;
    if (typeof window !== "undefined") {
      fetchTasks();
      getTime();
      getTokens();
      i1 = setInterval(getTime, 60000);
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
  }, [, props.selectedAddress]);

  async function getTokens() {
    let res = await getRewardToken(props.selectedAddress);
    if (res) {
      for (let i = 0; i < res.length; i++) {
        if (res[i].series === "ONE") {
          setTotalGithubToken(res[i].amount.amount);
          setClaimedGithubToken(res[i].claimed_amount?.amount || 0);
          setUnclaimedGithubToken(res[i].claimable_amount?.amount || 0);
          setRemainingClaimableGithubToken(
            res[i].remaining_claimable_amount?.amount || 0,
          );
        }
        if (res[i].series === "COSMOS") {
          setTotalEcosystemToken(res[i].amount.amount);
          setClaimedEcosystemToken(res[i].claimed_amount?.amount || 0);
          setUnclaimedEcosystemToken(res[i].claimable_amount?.amount || 0);
          setRemainingClaimableEcosystemToken(
            res[i].remaining_claimable_amount?.amount || 0,
          );
          setIsEcosystemTokensLoaded(true);
        }
      }
    }
  }
  const claimTokens = async () => {
    if (process.env.NEXT_PUBLIC_REWARD_DEADLINE < dayjs().unix()) {
      props.notify("Claim airdrop period ended", "error");
    } else if (
      parseInt(unclaimedGithubToken) + parseInt(unclaimedEcosystemToken) <=
      0
    ) {
      props.notify("You don't have any unclaimed tokens", "error");
    }
    if (claimTokensLoading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setClaimTokensLoading(true);
    const res = await props.claimRewards();
    if (res) {
      getTokens();
      props.notify("Reward claimed successfully", "info");
    }
    setClaimTokensLoading(false);
  };

  async function fetchStatus() {
    if (!props.selectedAddress) return;
    const githubData = await axios
      .get(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL +
          "/rewards?addr=" +
          props.selectedAddress +
          "&series=1",
      )
      .then(({ data }) => {
        consumeGithubRewardData(data);
      })
      .catch((e) => {
        setGithubCalculationStatus(0);
        setGithubCalculationError(null);
      });

    const ecosystemData = await axios
      .get(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL +
          "/rewards?addr=" +
          props.selectedAddress +
          "&series=8",
      )
      .then(({ data }) => {
        consumeEcosystemData(data);
      })
      .catch((e) => {
        setGithubCalculationStatus(0);
      });
  }

  useEffect(() => {
    fetchStatus();
  }, [, props.selectedAddress]);

  useEffect(() => {
    const query = window.location.search;
    const urlParameters = new URLSearchParams(query);
    const codeValue = urlParameters.get("code");
    if (codeValue) {
      setCode(codeValue);
      router.push("/rewards");
    }
  }, []);

  const getGithubRewards = async () => {
    if (calculatingRewardsLoading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setCalculatingRewardsLoading(true);
    const res = await props.signMessageForRewards(code);
    await axios
      .post(process.env.NEXT_PUBLIC_REWARD_SERVICE_URL + "/rewards", {
        series: 1,
        payload: res,
      })
      .then(({ data }) => {
        consumeGithubRewardData(data);
      })
      .catch(({ err }) => {
        setGithubCalculationStatus(0);
        setGithubCalculationError(null);
      });
    setCalculatingRewardsLoading(false);
  };

  const consumeGithubRewardData = (data) => {
    if (data?.error) {
      setCode(null);
      setGithubCalculationError(data.error);
    } else {
      setGithubCalculationError(null);
    }
    setGithubCalculationStatus(data.status);
    if (data.status == 1) {
      if (!pollingIntervalId)
        pollingIntervalId = setInterval(fetchStatus, 5000);
    } else {
      clearTimeout(pollingIntervalId);
    }
    if (data.status == 2) {
      setTotalGithubToken(data.total_amount);
      console.log("Getting final tally, consumeGithubRewardData");
      getTokens();
    }
  };

  const consumeEcosystemData = (data) => {
    setTotalEcosystemToken(data.total_amount);
    setIsEcosystemTokensLoaded(data.status == 2 ? true : false);
    if (data.status == 2) {
      console.log("Getting final tally, consumeEcosystemData");
      getTokens();
    }
  };

  const getEcosystemRewards = async () => {
    if (getEcosystemRewardsLoading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setGetEcosystemRewardsLoading(true);
    await axios
      .post(process.env.NEXT_PUBLIC_REWARD_SERVICE_URL + "/rewards", {
        series: 8,
        payload: props.selectedAddress,
      })
      .then(({ data }) => {
        consumeEcosystemData(data);
      })
      .catch(({ err }) => {
        console.error(err);
      });
    setGetEcosystemRewardsLoading(false);
  };

  function githubLogin() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID,
    );
  }

  let totalEcosystemDecayedAmount =
      parseFloat(unclaimedEcosystemToken) +
      parseFloat(claimedEcosystemToken) +
      parseFloat(remainingClaimableEcosystemToken),
    totalGithubDecayedAmount =
      parseFloat(unclaimedGithubToken) +
      parseFloat(claimedGithubToken) +
      parseFloat(remainingClaimableGithubToken);

  return (
    <>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={"relative mt-12 flex flex-col items-center lg:mt-16"}>
        <div className="w-full max-w-screen-lg items-center">
          <div className="p-4 pt-8 lg:p-0">
            <div className="text-4xl font-bold tracking-tight lg:text-center lg:text-7xl">
              Claim Airdrop
            </div>
            <div className="text-type-tertiary mt-4 text-xl font-bold lg:text-center lg:text-3xl">
              {`${days} Days ${hours} Hours ${minutes} Minutes Left`}
            </div>
          </div>
          <div className="border-grey-50 bg-base-200/70 relative mx-4 mt-12 max-w-2xl rounded-xl border text-sm lg:mx-auto lg:mt-16">
            <div className="bg-base-200 border-grey-50 absolute -top-3 left-1/2 -ml-36 rounded-full border px-4 py-1 text-xs font-bold uppercase text-purple-50">
              Available Rewards (Reduces 1% every day)
            </div>
            <div className="flex flex-col justify-evenly gap-8 p-8 pt-10 lg:flex-row">
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
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
                      className="h-3.5 w-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                <div className="my-2">
                  {isEcosystemTokensLoaded ? (
                    <span className="text-4xl uppercase">
                      {showToken(totalEcosystemDecayedAmount, token)}
                    </span>
                  ) : (
                    <>
                      <span className="text-type-tertiary mr-2 text-4xl">
                        ~
                      </span>
                      <span className="text-4xl uppercase">
                        {showToken(totalEcosystemToken, token)}
                      </span>
                    </>
                  )}
                </div>
                {props.selectedAddress ? (
                  !isEcosystemTokensLoaded ? (
                    <button
                      className={
                        "btn btn-secondary btn-sm mt-2 " +
                        (getEcosystemRewardsLoading ? "loading" : "")
                      }
                      onClick={() => {
                        if (!props.selectedAddress) {
                          props.notify("Please login first", "error");
                        } else if (
                          process.env.NEXT_PUBLIC_REWARD_DEADLINE <
                          dayjs().unix()
                        ) {
                          props.notify("Claim airdrop period ended", "error");
                        } else {
                          getEcosystemRewards();
                        }
                      }}
                    >
                      Calculate Reward
                    </button>
                  ) : (
                    ""
                  )
                ) : (
                  <Link
                    className={
                      "btn btn-secondary btn-sm mt-2 " +
                      (getEcosystemRewardsLoading ? "loading" : "")
                    }
                    disabled={getEcosystemRewardsLoading}
                    href="/login"
                  >
                    Login with staking wallet
                  </Link>
                )}
              </div>
              <div className="lg:text-center">
                <div className="-mr-2 inline-flex items-center">
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
                      className="h-3.5 w-3.5"
                    >
                      <circle cx="8" cy="8" r="7.5" stroke="#8D97A7" />
                      <path d="M8 3L8 5" stroke="#8D97A7" strokeWidth="2" />
                      <path d="M8 7L8 13" stroke="#8D97A7" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
                {githubCalculationStatus === 1 ? (
                  <div className="mt-4 flex justify-center ">
                    <div className="mr-2 text-2xl text-base font-bold">
                      Calculating
                    </div>
                    <div
                      class="mt-2 inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    >
                      <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-2 py-1">
                    {githubCalculationStatus === 2 ? (
                      <span className="text-4xl uppercase">
                        {showToken(totalGithubDecayedAmount, token)}
                      </span>
                    ) : (
                      <>
                        <span className="text-type-tertiary mr-2 text-2xl">
                          Coming Soon
                        </span>

                        {/* <span className="text-4xl mr-2 text-type-tertiary">
                          ~
                        </span>
                        <span className="text-4xl uppercase">
                          {showToken(totalGithubToken, token)}
                        </span> */}
                      </>
                    )}
                  </div>
                )}

                {githubCalculationStatus === 0 ? (
                  code === null ? (
                    <button
                      className={
                        "btn btn-secondary btn-sm mt-2 " +
                        (calculatingRewardsLoading ? "loading" : "")
                      }
                      onClick={() => {
                        if (!props.selectedAddress) {
                          props.notify("Please login first", "error");
                        } else if (
                          process.env.NEXT_PUBLIC_REWARD_DEADLINE <
                          dayjs().unix()
                        ) {
                          props.notify("Claim airdrop period ended", "error");
                        } else {
                          githubLogin();
                        }
                      }}
                      disabled={true}
                    >
                      Connect with Github profile
                    </button>
                  ) : (
                    <button
                      className={
                        "btn btn-secondary btn-sm mt-2 " +
                        (calculatingRewardsLoading ? "loading" : "")
                      }
                      onClick={() => {
                        if (!props.selectedAddress) {
                          props.notify("Please login first", "error");
                        } else if (
                          process.env.NEXT_PUBLIC_REWARD_DEADLINE <
                          dayjs().unix()
                        ) {
                          props.notify("Claim airdrop period ended", "error");
                        } else {
                          getGithubRewards();
                        }
                      }}
                      disabled={true}
                    >
                      Calculate Reward
                    </button>
                  )
                ) : (
                  ""
                )}
                {githubCalculationError ? (
                  <div className="text-error mt-2 flex text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 mt-px h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    {githubCalculationError}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center lg:mt-16">
            {parseInt(unclaimedGithubToken) +
              parseInt(unclaimedEcosystemToken) >
            0 ? (
              <button
                className="btn btn-primary btn-lg mx-4 lg:w-96"
                onClick={claimTokens}
              >
                <span>Claim</span>
                <span className="ml-1 uppercase">
                  {showToken(
                    parseInt(unclaimedGithubToken) +
                      parseInt(unclaimedEcosystemToken),
                    token,
                  )}
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

            {parseInt(claimedGithubToken) + parseInt(claimedEcosystemToken) >
            0 ? (
              <div className="text-type-secondary mt-4 text-xs">
                <span>Already claimed</span>
                <span className="ml-1 uppercase">
                  {showToken(
                    parseInt(claimedGithubToken) +
                      parseInt(claimedEcosystemToken),
                    token,
                  )}
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="mx-4 my-8 flex w-full max-w-screen-lg px-6 lg:mt-16">
          <div id="missions" className="text-4xl">
            Missions
          </div>
          <div className="ml-auto flex">
            <div className="mr-2 mt-4 text-xs font-bold opacity-60">
              {tasksCompleted + "%"} Complete
            </div>
            <progress
              className="progress progress-primary mt-5 w-56 sm:w-80"
              value={tasksCompleted}
              max="100"
            ></progress>
          </div>
        </div>
        {tasks?.map((t, i = 0) => {
          // if (t.isComplete) {
          //   if (isEcosystemTokensLoaded) {
          //     claimedEcosystemTokenCounter -=
          //       (t.weight / tasksTotal) * totalEcosystemToken;
          //   }
          // }
          return (
            <div
              className="bg-base-200/70 mx-4 mt-4 flex w-full max-w-screen-lg rounded-xl p-2 text-xs sm:text-base"
              key={i}
            >
              <div className="gap-4 lg:flex">
                <div
                  className={"my-3 ml-4 " + (t.isComplete ? "text-green" : "")}
                >
                  {tasksToMessage[t.type]}
                </div>
                <div
                  className={
                    "tooltip mt-3.5 h-5 cursor-default rounded-full border px-2 py-px text-xs" +
                    (isEcosystemTokensLoaded
                      ? " border-transparent bg-purple-900 text-purple-50"
                      : " border-purple-900 text-purple-50")
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
                      (t.weight / tasksTotal) * totalEcosystemDecayedAmount,
                      token,
                    )}
                  </span>
                </div>
                {/* <div
                  className={
                    "rounded-full px-2 py-px text-xs h-5 mt-3.5 tooltip cursor-default border" +
                    (githubCalculationStatus === 2
                      ? " bg-purple-900 text-purple-50 border-transparent"
                      : " text-purple-50 border-purple-900")
                  }
                  data-tip={
                    githubCalculationStatus === 2
                      ? "Open source contribution rewards"
                      : "Estimated open source contribution rewards - connect Github to calculate exact amount"
                  }
                >
                  <span>{githubCalculationStatus === 2 ? "" : "~"}</span>
                  <span className="uppercase">
                    {showToken(
                      (t.weight / tasksTotal) * totalGithubDecayedAmount,
                      token
                    )}
                  </span>
                </div> */}
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

        <div className="mt-12 flex flex-col items-center">
          {parseInt(unclaimedGithubToken) + parseInt(unclaimedEcosystemToken) >
          0 ? (
            <button
              className={
                "btn btn-primary btn-lg mx-4 lg:w-96" +
                (claimTokensLoading ? " loading" : "")
              }
              onClick={claimTokens}
            >
              <span>Claim</span>
              <span className="ml-1 uppercase">
                {showToken(
                  parseInt(unclaimedGithubToken) +
                    parseInt(unclaimedEcosystemToken),
                  token,
                )}
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
          <div className="text-type-secondary mt-4 text-xs">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
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
