import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../../../components/header";
import DashboardSelector from "../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../components/topRepositories";
import getHomeUrl from "../../../helpers/getHomeUrl";
import { useRouter } from "next/router";
import { getOrganizationDetailsForDashboard } from "../../../store/actions/organization";
import Org from "../../../components/dashboard/org";
import Link from "next/link";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function OrgDashboard(props) {
  const hrefBase = "/daos/" + props.currentDashboard;
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.screen.width <= 760 ? setIsMobile(true) : setIsMobile(false);
    }
  }, [typeof window !== "undefined" ? window.screen.width : ""]);

  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setIsMobile(true) : setIsMobile(false);
    }
  }
  if (typeof window !== "undefined") {
    window.onresize = detectWindowSize;
  }
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
      <div className="sm:flex sm:flex-1">
        {!isMobile ? (
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
              <div className="bg-footer-grad py-6">
                <div className="text-xs text-type-secondary mx-8 mb-4">
                  &copy; Gitopia {new Date().getFullYear()}
                </div>
                <div className="mx-6">
                  {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ? (
                    <>
                      <Link
                        href={
                          "/" +
                          process.env.NEXT_PUBLIC_GITOPIA_ADDRESS +
                          "/proposals"
                        }
                      >
                        <a className={"btn btn-xs btn-link mt-2"}>Proposals</a>
                      </Link>
                      <Link
                        href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
                      >
                        <a className={"btn btn-xs btn-link mt-2"}>
                          Source code
                        </a>
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <DashboardSelector />
        )}
        <div className="flex-1 px-4">
          <Org
            organization={props.organization}
            currentDashboard={props.currentDashboard}
          />
        </div>
        {isMobile ? (
          <div className="border-t border-grey mt-4">
            <div className="py-6 w-1/2 m-auto">
              <div className="text-xs text-type-secondary text-center">
                &copy; Gitopia {new Date().getFullYear()}
              </div>
              <div className="mx-6 flex">
                {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ? (
                  <>
                    <Link
                      href={
                        "/" +
                        process.env.NEXT_PUBLIC_GITOPIA_ADDRESS +
                        "/proposals"
                      }
                    >
                      <a className={"btn btn-xs btn-link mt-1"}>Proposals</a>
                    </Link>
                    <Link href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}>
                      <a className={"btn btn-xs btn-link mt-1"} target="_blank">
                        Source code
                      </a>
                    </Link>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
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
