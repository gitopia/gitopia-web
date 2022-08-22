// import "regenerator-runtime/runtime.js";
import "../styles/globals.css";
import { wrapper } from "../store";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import AutoLogin from "../components/autoLogin";
import NotificationManager from "../components/notificationManager";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Notifications from "../components/notifications";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import ErrorHandler from "../hooks/errorHandler";
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

function MyApp({ Component, pageProps }) {
  return (
    <>
      {
        //uncomment this component for implementing notifications
        /*  
      <Notifications /> 
      */
      }
      <ErrorHandler>
        <Component {...pageProps} />
      </ErrorHandler>
      <AutoLogin />
      <NotificationManager />
    </>
  );
}
// serviceWorkerRegistration.register();
export default wrapper.withRedux(MyApp);
