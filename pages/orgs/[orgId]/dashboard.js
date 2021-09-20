import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../../../components/header";
import BackendStatus from "../../../components/backendStatus";
import FaucetReceiver from "../../../components/faucetReceiver";
import DashboardSelector from "../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../components/topRepositories";
import getHomeUrl from "../../../helpers/getHomeUrl";
import { useRouter } from "next/router";
import { getOrganizationDetailsForDashboard } from "../../../store/actions/organization";
import Org from "../../../components/dashboard/org";

function OrgDashboard(props) {
  const router = useRouter();
  useEffect(() => {
    console.log("org dashboard", router.query.orgId, props.currentDashboard);
    if (router.query.orgId !== props.currentDashboard) {
      router.push(getHomeUrl(props.dashboards, props.currentDashboard));
    }
    props.getOrganizationDetailsForDashboard();
  }, [props.currentDashboard]);

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
      <div className="flex flex-1">
        <div className="w-64 border-r border-grey flex flex-col">
          <div className="flex-1">
            <DashboardSelector />
            <TopRepositories
              repositories={props.repositories.map((r) => {
                return { owner: props.currentDashboard, ...r };
              })}
            />
          </div>
          <div>
            {/* <BackendStatus /> */}
            <FaucetReceiver />
          </div>
        </div>
        <div className="flex-1 px-4">
          <Org organization={props.organization} />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
    repositories: state.organization.repositories,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, { getOrganizationDetailsForDashboard })(
  OrgDashboard
);
