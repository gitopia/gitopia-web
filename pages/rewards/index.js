import styles from "../../styles/landing.module.css";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/landingPageHeader";
import Footer from "../../components/landingPageFooter";
export default function Rewards() {
  const [mobile, setMobile] = useState(false);
  const CLIENT_ID = "b4ca5c703ee899b26505";
  const router = useRouter();
  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setMobile(true) : setMobile(false);
    }
  }
  useEffect(() => {
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
    const code = urlParameters.get("code");
    console.log(code);
    router.push("/rewards");
  }, []);

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
          <Link href="/login">
            <div className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md">
              Create Account
            </div>
          </Link>
        </div>
        <div className="flex p-4 box-border bg-[#222932] w-3/4 rounded-xl mt-4">
          <div className="my-3 ml-4">Connect your Github Account</div>
          <div
            className="ml-auto btn btn-primary bg-green hover:bg-green-400 h-12 py-3 w-52 rounded-md"
            onClick={() => {
              githubLogin();
            }}
          >
            Connect Github
          </div>
        </div>
        <div className="flex flex-col items-center mt-12">
          <Link href="/login">
            <div className="ml-auto btn btn-tertiary bg-[#404957] h-14 py-3 w-80 rounded-md">
              Check Eligibility
            </div>
          </Link>
          <div className="text-xs opacity-50 text-white mt-4">
            If you have any issues, contact us at contact@gitopia.com
          </div>
        </div>
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
