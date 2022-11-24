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
import LoadingRewards from "../../components/loadingRewards";
function Rewards(props) {
  const [mobile, setMobile] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [code, setCode] = useState(null);
  const CLIENT_ID = "b4ca5c703ee899b26505";
  const router = useRouter();
  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setMobile(true) : setMobile(false);
    }
  }
  useEffect(() => {
    console.log(code, activeWallet);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", detectWindowSize);
    }
    detectWindowSize();
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", detectWindowSize);
      }
    };
  });

  useEffect(() => {
    const query = window.location.search;
    const urlParameters = new URLSearchParams(query);
    const codeValue = urlParameters.get("code");
    setCode(codeValue);
    router.push("/rewards");
  }, []);

  useEffect(async () => {
    const data = await getWhois(props.activeWallet?.name);
    if (props.activeWallet !== null && data !== null && data !== undefined) {
      setActiveWallet(props.activeWallet);
    }
  }, [props.activeWallet]);

  function githubLogin() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID
    );
  }
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <section className={"flex flex-col items-center mt-40 relative"}>
        <div className="flex flex-col ml-10">
          <div className=" text-6xl font-bold w-1/2 tracking-tight leading-[4rem]">
            Check if you’re eligble to join the Airdrop.
          </div>
          <div className="flex">
            <div>
              <div className="w-80 mt-10 tracking-tight">
                You can join the airdrop at any time as long as there are still
                tokens available. All you need to do is to create a Gitopia
                account, and connect your Github account.
              </div>
              <Link href="/home">
                <div className="btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md mt-10">
                  Read How to Join
                </div>
              </Link>
            </div>
            <div className="self-center ml-auto mr-10">
              <div className="opacity-50 font-bold">Total Token Available</div>
              <div className="text-4xl">184,500 tLore</div>
            </div>
          </div>
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-32">
          <div className="my-3 ml-4">Create a Gitopia Account</div>
          {activeWallet === null ? (
            <Link href="/login">
              <div className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md">
                Create Account
              </div>
            </Link>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-auto mr-3 mt-2"
            >
              <path
                d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z"
                fill="#66CE67"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.1348 10.9804L14.6906 23.0737L8.5625 18.1713L10.4366 15.8287L14.3085 18.9262L22.8643 9.01953L25.1348 10.9804Z"
                fill="white"
              />
            </svg>
          )}
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className="my-3 ml-4">Connect your Github Account</div>
          {code === null ? (
            <div
              className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md"
              onClick={() => {
                githubLogin();
              }}
            >
              Connect Github
            </div>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-auto mr-3 mt-2"
            >
              <path
                d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z"
                fill="#66CE67"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M25.1348 10.9804L14.6906 23.0737L8.5625 18.1713L10.4366 15.8287L14.3085 18.9262L22.8643 9.01953L25.1348 10.9804Z"
                fill="white"
              />
            </svg>
          )}
        </div>
        <div className="flex flex-col items-center mt-12">
          <Link href="/login">
            <button
              className="ml-auto btn btn-primary bg-green h-14 py-3 w-80 rounded-md"
              disabled={code === null || activeWallet === null}
            >
              Check Eligibility
            </button>
          </Link>
          <div className="text-xs opacity-50 text-white mt-4">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
        <img
          className={"absolute pointer-events-none -z-10 left-1/3 -top-36"}
          src="./rewards/drop-mid.svg"
          width={"622"}
          height={"762"}
        />
        <img
          className={"absolute pointer-events-none z-1 left-5 "}
          src="./rewards/drop-1.svg"
        />
        <img
          className={"absolute pointer-events-none z-1 right-16 top-28 "}
          src="./rewards/drop-2.svg"
        />
        <img
          className={
            "absolute pointer-events-none -z-10 w-3/4 right-5 top-1/3 mt-10 "
          }
          src="./rewards/objects.svg"
        />
        <img
          className={"absolute pointer-events-none z-10 w-full top-1/4 mt-10 "}
          src="./rewards/ellipse.svg"
        />
      </section>
      <img
        className={"absolute pointer-events-none -z-20 w-full top-24"}
        src="./rewards/stars-1.svg"
      />
      <img
        className={"absolute pointer-events-none -z-20 w-full top-1/3"}
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
  };
};

export default connect(mapStateToProps, {
  notify,
})(Rewards);
