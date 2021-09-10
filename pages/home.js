import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../components/header";
import BackendStatus from "../components/backendStatus";
import FaucetReceiver from "../components/faucetReceiver";
import TopRepositories from "../components/topRepositories";
import UserDashboard from "../components/dashboard/user";
import Link from "next/link";
import { useRouter } from "next/router";

import DashboardSelector from "../components/dashboard/dashboardSelector";
import getHomeUrl from "../helpers/getHomeUrl";

function Home(props) {
  const router = useRouter();
  useEffect(() => {
    if (props.selectedAddress !== props.currentDashboard) {
      const newUrl = getHomeUrl(props.dashboards, props.currentDashboard);
      console.log(newUrl);
      router.push(newUrl);
    }
  }, [props.dashboards, props.currentDashboard]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 flex">
        <div className="w-64 border-r border-grey">
          <DashboardSelector />
          <TopRepositories
            repositories={props.repositories.map((r) => {
              return { owner: props.selectedAddress, ...r };
            })}
          />
          {/* <BackendStatus /> */}
          <FaucetReceiver />
        </div>
        <div className="flex-1 px-4">
          <UserDashboard />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
    selectedAddress: state.wallet.selectedAddress,
    repositories: state.user.repositories,
  };
};

export default connect(mapStateToProps, {})(Home);
