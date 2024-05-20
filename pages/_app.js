import "../styles/globals.css";
import { wrapper } from "../store";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import AutoLogin from "../components/autoLogin";
import NotificationManager from "../components/notificationManager";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import customParseFormat from "dayjs/plugin/customParseFormat";

import Notifications from "../components/notifications";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import ErrorHandler from "../hooks/errorHandler";
import { ApiClientProvider } from "../context/ApiClientContext";

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
      <ApiClientProvider>
        <Notifications />
        <ErrorHandler>
          <Component {...pageProps} />
        </ErrorHandler>
        <AutoLogin />
      </ApiClientProvider>
      <NotificationManager />
    </>
  );
}
// serviceWorkerRegistration.register();

export default wrapper.withRedux(MyApp);
