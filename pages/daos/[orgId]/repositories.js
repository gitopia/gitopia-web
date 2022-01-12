import Head from "next/head";
import Header from "../../../components/header";

import DashboardSelector from "../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../components/topRepositories";
import OrgViewTabs from "../../../components/dashboard/orgViewTabs";
import { connect } from "react-redux";
import getHomeUrl from "../../../helpers/getHomeUrl";
import { getOrganizationDetailsForDashboard } from "../../../store/actions/organization";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function GitopiaRepositoryView(props) {
  const hrefBase = "/daos/" + props.currentDashboard;
  const router = useRouter();

  useEffect(() => {
    console.log(router);
    console.log("org dashboard", router.query.orgId, props.currentDashboard);
    if (
      router.query.orgId !== props.currentDashboard &&
      router.query.orgId !== undefined
    ) {
      const newUrl = getHomeUrl(props.dashboards, props.currentDashboard);
      router.push(newUrl);
    }
    props.getOrganizationDetailsForDashboard();
  }, [props.currentDashboard, router]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia Proposals</title>
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
            <button className="text-sm text-type-secondary text-left mx-8 border-b border-grey py-2 mb-4 w-48">
              Gitopia
            </button>
          </div>
          <div>
            {/* <BackendStatus /> */}
            <div className="bg-footer-grad py-6">
              <div className="text-xs text-type-secondary mx-8 mb-4">
                &copy; Gitopia {new Date().getFullYear()}
              </div>
              <div className="mx-6">
                {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ? (
                  <a
                    className={"btn btn-xs btn-link mt-2"}
                    href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
                    target="_blank"
                  >
                    View source code
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 px-4">
          <div className="container mx-auto max-w-screen-lg py-12">
            <div className="flex border-b border-grey">
              <div className="text-base text-type-secondarypy-2">Gitopia</div>
              <div className="ml-auto">
                <OrgViewTabs active="repositories" hrefBase={hrefBase} />
              </div>
            </div>
          </div>
          <main className="container mx-auto max-w-screen-lg">
            <div className="text-left px-5 pt-10 font-style: italic text-base">
              <h2>Not Yet Implemented</h2>
            </div>
          </main>
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
  GitopiaRepositoryView
);
