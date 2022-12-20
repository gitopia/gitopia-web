import { useState, useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../../../components/header";
import DashboardSelector from "../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../components/topRepositories";
import getHomeUrl from "../../../helpers/getHomeUrl";
import { useRouter } from "next/router";
import { getDaoDetailsForDashboard } from "../../../store/actions/dao";
import Dao from "../../../components/dashboard/dao";
import Link from "next/link";
import getAnyRepositoryAll from "../../../helpers/getAnyRepositoryAll";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function DaoDashboard(props) {
  const hrefBase = "/daos/" + props.currentDashboard;
  const router = useRouter();
  const [allRepository, setAllRepository] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setIsMobile(true) : setIsMobile(false);
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
    async function initDashboard() {
      if (router.query.daoId !== props.currentDashboard) {
        router.push(getHomeUrl(props.dashboards, props.currentDashboard));
      }
      const repos = await getAnyRepositoryAll(props.currentDashboard);
      setAllRepository(repos);
      props.getDaoDetailsForDashboard();
    }
    initDashboard();
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
              {allRepository?.length == 0 ? (
                ""
              ) : (
                <TopRepositories
                  repositories={allRepository.map((r) => {
                    return {
                      owner: props.currentDashboard,
                      username: props.username,
                      ...r,
                    };
                  })}
                />
              )}
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
                          "?tab=proposals"
                        }
                        className={"btn btn-xs btn-link mt-2"}
                      >
                        Proposals
                      </Link>
                      <Link
                        href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
                        className={"btn btn-xs btn-link mt-2"}
                      >
                        Source code
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
          <Dao dao={props.dao} currentDashboard={props.currentDashboard} />
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
                        "?tab=proposals"
                      }
                      className={"btn btn-xs btn-link mt-1"}
                    >
                      Proposals
                    </Link>
                    <Link
                      href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
                      className={"btn btn-xs btn-link mt-1"}
                    >
                      Source code
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
    dao: state.dao,
    username: state.dao.name,
  };
};

export default connect(mapStateToProps, { getDaoDetailsForDashboard })(
  DaoDashboard
);
