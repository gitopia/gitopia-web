import "../styles/globals.css";
import { wrapper } from "../store";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import AutoLogin from "../components/autoLogin";
import NotificationManager from "../components/notificationManager";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ErrorHandler from "../hooks/errorHandler";
import { ApiClientProvider } from "../context/ApiClientContext";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrExtension } from "@cosmos-kit/keplr-extension";
import { wallets as leapExtension } from "@cosmos-kit/leap-extension";
import { wallets as leapMetamaskCosmosSnap } from "@cosmos-kit/leap-metamask-cosmos-snap";
import { wallets as ledgerUSB } from "@cosmos-kit/ledger";

import "@interchain-ui/react/styles";

const wallets = [
  ...keplrExtension,
  ...leapExtension,
  ...leapMetamaskCosmosSnap,
  ...ledgerUSB,
];

import { assets, chain } from "chain-registry/mainnet/gitopia";

const assetLists = [assets];
const mainnetChains = [chain];

const progress = new ProgressBar({
  size: 2,
  color: "#66ce67",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ChainProvider
        chains={mainnetChains}
        assetLists={assetLists}
        wallets={wallets}
        walletConnectOptions={{
          signClient: {
            projectId: "5119b59ac94a652914d913f156b7ff46", // You'll need this for WalletConnect
            relayUrl: "wss://relay.walletconnect.org",
            metadata: {
              name: "Gitopia",
              description: "Your app description",
              url: "https://gitopia.com",
              icons: ["https://yourapp.com/icon.png"],
            },
          },
        }}
      >
        <ApiClientProvider>
          <ErrorHandler>
            <Component {...pageProps} />
          </ErrorHandler>
          <AutoLogin />
        </ApiClientProvider>
      </ChainProvider>
      <NotificationManager />
    </>
  );
}
// serviceWorkerRegistration.register();

export default wrapper.withRedux(MyApp);
