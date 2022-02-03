import "regenerator-runtime/runtime.js";
import "../styles/globals.css";
import { wrapper } from "../store";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";
import AutoLogin from "../components/autoLogin";
import NotificationManager from "../components/notificationManager";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ErrorHandler from "../pages/errorHandler";
import { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { decodeTx } from "../helpers/blockParser";

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
  const ws = new W3CWebSocket("ws://localhost:26657/websocket");
  const [data, setData] = useState([]);

  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          params: ["tm.event='NewBlock'"],
          id: 1,
        })
      );
    };
    ws.onmessage = async (message) => {
      let evalData = JSON.parse(message.data);
      let jsonData = evalData.result.data;
      if (jsonData !== undefined) {
        for (let i = 0; i < jsonData.value.block.data.txs.length; i++) {
          let tx = await decodeTx(
            "http://localhost:1317/",
            "http://localhost:26657/",
            jsonData.value.block.data.txs[i]
          );
          console.log(tx);
        }
      }
    };

    ws.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };
  });
  return (
    <>
      <ErrorHandler>
        <Component {...pageProps} />
      </ErrorHandler>
      <AutoLogin />
      <NotificationManager />
    </>
  );
}

export default wrapper.withRedux(MyApp);
