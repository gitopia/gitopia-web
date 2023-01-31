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

export async function getStaticProps() {
  const fs = await import("fs");
  const buildId = fs.readFileSync("./seo/build-id").toString();
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
      <div className="sm:flex-1 sm:flex">
        {!isMobile ? (
          <div className="w-64 border-r border-grey flex flex-col">
            <div className="flex-1">
              <DashboardSelector />
              {allRepository.length == 0 ? (
                ""
              ) : (
                <TopRepositories
                  repositories={allRepository.map((r) => {
                    return {
                      owner: props.selectedAddress,
                      username: props.username,
                      ...r,
                    };
                  })}
                />
              )}
            </div>
            <div>
              <div className="bg-footer-grad py-6">
                <div className="text-xs text-type-secondary mx-8 mb-2">
                  &copy; Gitopia {new Date().getFullYear()}
                </div>
                <div className="text-xs text-type-tertiary mx-8 mb-4">
                  Build {props.buildId}
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
          <>
            <DashboardSelector />
            {allRepository.length == 0 ? (
              ""
            ) : (
              <TopRepositories
                repositories={allRepository.map((r) => {
                  return {
                    owner: props.selectedAddress,
                    username: props.username,
                    ...r,
                  };
                })}
              />
            )}
          </>
        )}
        <div className="flex-1 px-4">
          <UserDashboard />
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
    selectedAddress: state.wallet.selectedAddress,
    username: state.user.username,
  };
};

export default connect(mapStateToProps, {})(Home);
