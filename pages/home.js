import { useEffect } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/header";
import TopRepositories from "../components/topRepositories";
import UserDashboard from "../components/dashboard/user";
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
      <div className="flex-1 flex">
        <div className="w-64 border-r border-grey flex flex-col">
          <div className="flex-1">
            <DashboardSelector />
            <TopRepositories
              repositories={props.repositories.map((r) => {
                return { owner: props.selectedAddress, ...r };
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
                    <Link href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}>
                      <a className={"btn btn-xs btn-link mt-2"} target="_blank">
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
