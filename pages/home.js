import Head from "next/head";
import Header from "../components/header";
import BackendStatus from "../components/backendStatus";
import FaucetReceiver from "../components/faucetReceiver";
import TopRepositories from "../components/topRepositories";
import UserDashboard from "../components/dashboard/user";
import Link from "next/link";

import DashboardSelector from "../components/dashboard/dashboardSelector";

export default function Home(props) {
  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex">
        <div className="w-64 border-r border-grey">
          <DashboardSelector />
          {/* <TopRepositories /> */}
          <div className="my-8">
            <div className="text-md mx-8 border-b border-grey py-2 mb-4">
              Top Repositories
            </div>
            <ul className="menu compact mx-4">
              <li className="mb-2">
                <Link href={"/bitcoin/bitcoin/"}>
                  <a className="rounded">Bitcoin</a>
                </Link>
              </li>
            </ul>
          </div>
          <BackendStatus />
          <FaucetReceiver />
        </div>
        <div className="flex-1 px-4">
          <UserDashboard />
        </div>
      </div>
    </div>
  );
}
