import Head from "next/head";
import Header from "./landingPageHeader";
import Footer from "./landingPageFooter";
import styles from "../styles/landing.module.css";
export default function LoadingRewards() {
  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Gitopia - Code Collaboration for Web3</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="justify-center items-center">
        <div className="text-center text-xl text-green font-bold">
          The time is nigh!
        </div>
        <div className="mt-5 font-bold text-3xl text-center">
          Calculating your aidrop reward.
        </div>
        <div className="font-bold text-3xl text-center">
          This might take upto 15 minutes
        </div>
        <div className="mt-5 text-center">
          You only have to do this process once, afterwards
        </div>
        <div className="text-center">
          you’ll be redirected to your airdrop page.
        </div>
        <div className="mt-5 text-center text-xs opacity-50">
          This page will automatically refresh
        </div>
        <div className="flex justify-center mt-10">
          <a className="flex-none btn btn-primary btn-wide w-52" href={"/home"}>
            LEARN MORE
          </a>
        </div>
        <div className="relative flex items-center justify-center">
          <img src="/loading-rewards.svg"></img>
        </div>
      </div>
      <Footer />
    </div>
  );
}
