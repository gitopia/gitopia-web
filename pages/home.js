import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/header";
import TopRepositories from "../components/topRepositories";
import UserDashboard from "../components/dashboard/user";
import { useRouter } from "next/router";
import DashboardSelector from "../components/dashboard/dashboardSelector";
import getHomeUrl from "../helpers/getHomeUrl";
import useWindowSize from "../hooks/useWindowSize";
import getAnyRepositoryAll from "../helpers/getAnyRepositoryAll";
import Footer from "../components/footer";

export async function getStaticProps() {
  const fs = await import("fs");
  let buildId = "";
  try {
    buildId = fs.readFileSync("./seo/build-id").toString();
  } catch (e) {
    console.error(e);
  }
  return {
    props: {
      buildId,
    },
  };
}

function Home(props) {
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [allRepository, setAllRepository] = useState([]);
  useEffect(() => {
    async function setRepos() {
      if (props.selectedAddress) {
        if (props.selectedAddress !== props.currentDashboard) {
          const newUrl = getHomeUrl(props.dashboards, props.currentDashboard);
          router.push(newUrl);
        } else {
          const repos = await getAnyRepositoryAll(props.currentDashboard);
          if (repos) {
            setAllRepository(repos);
          } else {
            setAllRepository([]);
          }
        }
      } else {
        setAllRepository([]);
      }
    }
    setRepos();
  }, [props.dashboards, props.currentDashboard, props.selectedAddress]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="A new age decentralized code collaboration platform for developers
          to collaborate, BUIDL, and get rewarded."
        />
        <meta
          name="keywords"
          content="code, collaboration, decentralized, git, web3, crypto"
        />
        <meta
          property="og:title"
          content="Gitopia - Code Collaboration for Web3"
        />
        <meta
          property="og:description"
          content="A new age decentralized code collaboration platform for developers
            to collaborate, BUIDL, and get rewarded."
        />
        <meta
          property="og:image"
          content="https://testnet.gitopia.com/og-gitopia.jpg"
        />
      </Head>
      <Header />
      <UserDashboard />
      <Footer buildId={props.buildId} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
    selectedAddress: state.wallet.selectedAddress,
    username: state.user.username,
  };
};

export default connect(mapStateToProps, {})(Home);
