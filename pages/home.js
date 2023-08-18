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
import ActivityFeed from "../components/dashboard/activityFeed";

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
      <main className="container mx-auto py-4 sm:py-12">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-full max-w-md px-2 sm:px-0">
            <UserDashboard selectedAddress={props.selectedAddress} />
            <div>
              <div className="mt-12 py-6">
                <div className="flex text-xs text-type-secondary m-4">
                  {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ? (
                    <>
                      <Link
                        href={
                          "/" +
                          process.env.NEXT_PUBLIC_GITOPIA_ADDRESS +
                          "?tab=proposals"
                        }
                        className={"link no-underline hover:underline mr-4"}
                      >
                        Proposals
                      </Link>
                      <Link
                        href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
                        className={"link no-underline hover:underline"}
                      >
                        Source code
                      </Link>
                    </>
                  ) : (
                    ""
                  )}
                  <div className="flex-1 text-right text-type-tertiary">
                    &copy; Gitopia {new Date().getFullYear()}
                    {props.buildId ? (
                      <span className="ml-2">{"Build " + props.buildId}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="px-4 flex text-xs justify-between text-type-secondary flex-col sm:flex-row text-center">
                  <a
                    className="link no-underline hover:underline mt-3 sm:mt-0"
                    href="https://docs.gitopia.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Docs
                  </a>
                  <a
                    className="link no-underline hover:underline mt-3 sm:mt-0"
                    href="https://gitopia.com/whitepaper.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Whitepaper
                  </a>
                  <a
                    className="link no-underline hover:underline mt-3 sm:mt-0"
                    href="https://discord.gg/aqsKW3hUHD"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Discord
                  </a>
                  <a
                    className="link no-underline hover:underline mt-3 sm:mt-0"
                    href="https://twitter.com/gitopiadao"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Twitter
                  </a>
                  <a
                    className="link no-underline hover:underline mt-3 sm:mt-0"
                    href="https://t.me/Gitopia"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Telegram
                  </a>
                  <a
                    className="link no-underline hover:underline mt-3 sm:mt-0"
                    href="https://medium.com/gitopia"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Medium
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-14 px-2 sm:px-0 border-l border-grey-50">
            <ActivityFeed />
          </div>
        </div>
      </main>
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
