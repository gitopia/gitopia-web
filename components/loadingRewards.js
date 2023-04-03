import Head from "next/head";
import Header from "./landingPageHeader";
import Footer from "./landingPageFooter";
import styles from "../styles/landing.module.css";
import { connect } from "react-redux";
import { useEffect } from "react";
import axios from "../helpers/axiosFetch";
import { useRouter } from "next/router";
function LoadingRewards(props) {
  const router = useRouter();
  async function fetchStatus() {
    await axios
      .get(
        process.env.NEXT_PUBLIC_REWARD_SERVICE_URL +
          "/rewards?addr=" +
          props.selectedAddress
      )
      .then(({ data }) => {
        props.setStatus(data.status);
      })
      .catch(({ err }) => {
        console.error(err);
      });
  }
  useEffect(() => {
    const id = setInterval(fetchStatus, 60000);
    if (props.status === 2) {
      clearInterval(id);
      router.push("/rewards");
    }
    return () => {
      clearInterval(id);
    };
  });
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
        <div className="mt-5 font-bold text-xl sm:text-3xl text-center">
          Calculating your aidrop reward.
        </div>
        <div className="font-bold text-xl sm:text-3xl text-center">
          This might take upto 15 minutes
        </div>
        <div className="relative flex items-center justify-center pointer-events-none">
          <img src="/rewards/loading-rewards.png"></img>
        </div>
        <div className="text-center">
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
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(LoadingRewards);
