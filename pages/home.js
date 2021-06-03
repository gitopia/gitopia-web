import Head from "next/head";
import Header from "../components/header";
import CreateWallet from "../components/createWallet";
import CurrentWallet from "../components/currentWallet";
import CreateRepository from "../components/createRepository"
import BackendStatus from "../components/backendStatus";

export default function Home(props) {
  return (
    <div data-theme="dark">
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <main className="container mx-auto">
        <div>
          <CurrentWallet />
          <div className="divider" />
          <CreateWallet />
          <div className="divider" />
          <CreateRepository />
          <div className="divider" />
          <BackendStatus />
        </div>
      </main>
    </div>
  );
}
