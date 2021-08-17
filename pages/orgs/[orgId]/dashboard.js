import Head from "next/head";
import Header from "../../../components/header";
import BackendStatus from "../../../components/backendStatus";
import FaucetReceiver from "../../../components/faucetReceiver";
import DashboardSelector from "../../../components/dashboard/dashboardSelector";

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
          <BackendStatus />
          <FaucetReceiver />
        </div>
        <div className="flex-1 px-4"></div>
      </div>
    </div>
  );
}
