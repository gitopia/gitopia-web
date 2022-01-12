import Head from "next/head";
import Header from "../../../../components/header";

import DashboardSelector from "../../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../../components/topRepositories";
import OrgViewTabs from "../../../../components/dashboard/orgViewTabs";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { getOrganizationDetailsForDashboard } from "../../../../store/actions/organization";
import { useRouter } from "next/router";
import getHomeUrl from "../../../../helpers/getHomeUrl";
import Link from "next/link";

function GitopiaProposalsView(props) {
  const hrefBase = "/daos/" + props.currentDashboard;
  const router = useRouter();

  useEffect(() => {
    if (
      router.query.orgId !== props.currentDashboard &&
      router.query.orgId !== undefined
    ) {
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
                <OrgViewTabs active="proposals" hrefBase={hrefBase} />
              </div>
            </div>
          </div>
          <main className="container mx-auto max-w-screen-lg">
            <div className="flex">
              <div className="text-type-primary text-left items-center">
                Proposal List
              </div>
              <div className="flex-none w-42 ml-auto">
                <Link href={hrefBase + "/proposals/new"}>
                  <button className="btn btn-primary btn-sm btn-block text-xs">
                    CREATE NEW PROPOSAL
                  </button>
                </Link>
              </div>
            </div>
            <div className="border-b border-grey w-1/2">
              <div className="form-control flex-1 mt-5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Proposal"
                    className="w-full input input-ghost input-sm"
                  />
                  <button className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="text-left px-5 pt-10 font-style: italic text-base">
              <h2>No Proposals to Show</h2>
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
  GitopiaProposalsView
);
