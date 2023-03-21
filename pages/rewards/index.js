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
function Rewards(props) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(404);
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
        setStatus(data.status);
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

  const getTokens = async () => {
    if (loading) return;
    if (!props.selectedAddress) {
      props.notify("Please sign in before claiming tokens", "error");
      return;
    }
    setLoading(true);
    const res = await props.calculateGithubRewards(code);
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
  if (status === 0) {
    return <LoadingRewards setStatus={setStatus} status={status} />;
  } else if (status === 1) {
    return <ClaimRewards />;
  } else
    return (
      <div className={styles.wrapper}>
        <Head>
          <title>Gitopia - Code Collaboration for Web3</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <Header />
        <section
          className={"flex flex-col items-center mt-20 sm:mt-40 relative"}
        >
          <div className="sm:flex items-center sm:w-3/4 lg:w-2/3">
            <div>
              <div className="text-4xl lg:text-6xl font-bold sm:w-2/3 tracking-tight lg:leading-[4rem]">
                Check if you’re eligble to join
                <br /> the Airdrop.
              </div>
              <div>
                <div className="w-60 sm:w-80 mt-10 tracking-tight">
                  You can join the airdrop at any time as long as there are
                  still tokens available. All you need to do is to create a
                  Gitopia account, and connect your Github account.
                </div>

                <Link
                  className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md mt-10"
                  href="/home"
                >
                  Read How to Join
                </Link>
              </div>
            </div>
            <div className="ml-auto w-60 mt-10 sm:mt-20 lg:mt-32">
              <div className="opacity-50 font-bold">Total Token Available</div>
              <div className="text-4xl">{walletBalance}</div>
            </div>
          </div>
          <div
            className={
              (activeWallet === null ? "sm:flex " : " flex") +
              " p-4 box-border bg-[#222932] w-3/4 lg:w-2/3 rounded-xl mt-10 sm:mt-20 lg:mt-32"
            }
          >
            <div
              className={
                "my-3 ml-4 " + (activeWallet === null ? "" : "text-green")
              }
            >
              Create a Gitopia Account
            </div>
            {activeWallet === null ? (
              <Link
                className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md"
                href="/home"
              >
                Create Account
              </Link>
            ) : (
              <img
                className="ml-auto mr-3 mt-2"
                src="./rewards/checkmark.svg"
              />
            )}
          </div>
          <div
            className={
              (code === null ? "sm:flex " : " flex") +
              " sm:flex p-4 box-border bg-[#222932] w-3/4 lg:w-2/3 rounded-xl mt-4"
            }
          >
            <div className={"my-3 ml-4 " + (code === null ? "" : "text-green")}>
              Connect your Github Account
            </div>
            {code === null ? (
              <div
                className="ml-4 sm:ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md"
                onClick={() => {
                  githubLogin();
                }}
              >
                Connect Github
              </div>
            ) : (
              <img
                className="ml-auto mr-3 mt-2"
                src="./rewards/checkmark.svg"
              />
            )}
          </div>
          <div className="flex flex-col items-center mt-12">
            <button
              className={
                "ml-auto btn btn-primary bg-green h-14 py-3 w-80 rounded-md " +
                (loading ? "loading" : "")
              }
              disabled={code === null || activeWallet === null}
              onClick={getTokens}
            >
              Check Eligibility
            </button>
            <div className="text-xs opacity-50 text-white mt-4">
              If you have any issues, contact us at contact@gitopia.com
            </div>
          </div>
          <img
            className={
              "absolute pointer-events-none -z-10 left-1/3 -top-36 invisible lg:visible"
            }
            src="./rewards/drop-mid.svg"
            width={"622"}
            height={"762"}
          />

          <img
            className={
              "absolute pointer-events-none -z-10 left-0 sm:-left-5 lg:left-5 lg:top-20 opacity-30 sm:opacity-100  "
            }
            src="./rewards/drop-1.svg"
          />

          <img
            className={
              "absolute pointer-events-none -z-10 left-3/4 ml-20 top-20 opacity-30 sm:opacity-100"
            }
            src="./rewards/drop-2.svg"
          />

          <img
            className={
              "absolute pointer-events-none -z-10 w-3/4 right-5 top-1/3 mt-10 "
            }
            src="./rewards/objects.svg"
          />
          <img
            className={
              "absolute pointer-events-none -z-20 w-full top-80 sm:top-60 lg:top-1/4 mt-10 "
            }
            src="./rewards/ellipse.svg"
          />
        </section>
        <img
          className={
            "absolute pointer-events-none -z-20 w-full top-36 sm:top-24 invisible sm:visible"
          }
          src="./rewards/stars-1.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-20 w-full top-72 sm:top-1/4 mt-10 invisible sm:visible"
          }
          src="./rewards/stars-2.svg"
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
})(Rewards);
