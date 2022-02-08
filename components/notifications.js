import { w3cwebsocket as W3CWebSocket } from "websocket";
import { decodeTx } from "../helpers/blockParser";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import getRepository from "../helpers/getRepository";
import getIssue from "../helpers/getIssue";
import { notify } from "reapop";
import shrinkAddress from "../helpers/shrinkAddress";
import { createNotification } from "../store/actions/userNotification";

function Notifications(props) {
  const ws = new W3CWebSocket("ws://localhost:26657/websocket");

  const parser = async (tx) => {
    switch (tx.typeurl) {
      case "/gitopia.gitopia.gitopia.MsgCreateIssue":
        {
          let repo = await getRepository(tx.message.repositoryId);
          console.log(tx);
          if (
            props.selectedAddress === repo.owner.id &&
            tx.message.creator !== props.selectedAddress
          ) {
            let msg =
              shrinkAddress(tx.message.creator) +
              ' created issue "' +
              tx.message.title +
              '" in your repository "' +
              repo.name +
              '"';
            props.createNotification(tx.message, "issue");
            props.notify(msg, "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgCreateComment":
        {
          let issue = await getIssue(tx.message.parentId);
          let repo = await getRepository(issue.repositoryId);
          if (
            (props.selectedAddress === repo.owner.id &&
              tx.message.creator !== props.selectedAddress) ||
            (props.selectedAddress === issue.creator &&
              tx.message.creator !== props.selectedAddress)
          ) {
            let msg =
              shrinkAddress(tx.message.creator) +
              ' commented "' +
              tx.message.body +
              '" on issue "' +
              issue.title +
              '" in repository "' +
              repo.name +
              '"';
            props.createNotification(tx.message, "issue");
            props.notify(msg, "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgAddIssueLabels":
        {
          let issue = await getIssue(tx.message.issueId);
          let repo = await getRepository(issue.repositoryId);
          if (
            (props.selectedAddress === repo.owner.id &&
              tx.message.creator !== props.selectedAddress) ||
            (props.selectedAddress === issue.creator &&
              tx.message.creator !== props.selectedAddress)
          ) {
            let msg =
              shrinkAddress(tx.message.creator) +
              ' added label on issue "' +
              issue.title +
              '" in repository "' +
              repo.name +
              '"';
            props.createNotification(tx.message, "issue");
            props.notify(msg, "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgAddIssueAssignees":
        {
          let issue = await getIssue(tx.message.id);
          let repo = await getRepository(issue.repositoryId);
          console.log(tx);
          for (let j = 0; j < tx.message.assignees.length; j++) {
            if (
              (repo.owner.id === props.selectedAddress &&
                props.selectedAddress !== tx.message.creator) ||
              (props.selectedAddress !== tx.message.creator &&
                props.selectedAddress === tx.message.assignees[j] &&
                repo.owner.id !== props.selectedAddress)
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                " added assignees in issue " +
                issue.title +
                '" in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "issue");
              props.notify(msg, "info");
            }
          }
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          method: "subscribe",
          params: ["tm.event='Tx'"],
          id: 1,
        })
      );
    };
    ws.onmessage = async (message) => {
      let evalData = JSON.parse(message.data);
      let jsonData = evalData.result.data;
      if (jsonData) {
        await parser(decodeTx(jsonData.value.TxResult.tx));
      }
    };

    ws.onerror = (error) => {
      console.log(`WebSocket error: ${error}`);
    };
  });

  return null;
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, { notify, createNotification })(
  Notifications
);
