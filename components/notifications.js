import { w3cwebsocket as W3CWebSocket } from "websocket";
import { decodeTx } from "../helpers/blockParser";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import getRepository from "../helpers/getRepository";
import getIssue from "../helpers/getIssue";
import { notify } from "reapop";
import shrinkAddress from "../helpers/shrinkAddress";
import { isSourceFile } from "typescript";

function Notifications(props) {
  const ws = new W3CWebSocket("ws://localhost:26657/websocket");

  const parser = async (tx) => {
    if (tx.body != undefined) {
      for (let i = 0; i < tx.body.messages.length; i++) {
        let msg = tx.body.messages[i];
        if (msg["@type"] === "/gitopia.gitopia.gitopia.MsgCreateIssue") {
          let repo = await getRepository(tx.body.messages[i].repositoryId);
          console.log(tx);
          if (
            props.selectedAddress === repo.owner.id &&
            tx.body.messages[i].creator !== props.selectedAddress
          ) {
            let msg =
              shrinkAddress(tx.body.messages[i].creator) +
              ' created issue "' +
              tx.body.messages[i].title +
              '" in your repository "' +
              repo.name +
              '"';
            props.notify(msg, "info");
          }
        }
        if (msg["@type"] === "/gitopia.gitopia.gitopia.MsgCreateComment") {
          let issue = await getIssue(tx.body.messages[i].parentId);
          let repo = await getRepository(issue.repositoryId);
          if (
            (props.selectedAddress === repo.owner.id &&
              tx.body.messages[i].creator !== props.selectedAddress) ||
            (props.selectedAddress === issue.creator &&
              tx.body.messages[i].creator !== props.selectedAddress)
          ) {
            let msg =
              shrinkAddress(tx.body.messages[i].creator) +
              ' commented "' +
              tx.body.messages[i].body +
              '" on issue "' +
              issue.title +
              '" in repository "' +
              repo.name +
              '"';
            props.notify(msg, "info");
          }
        }
        if (msg["@type"] === "/gitopia.gitopia.gitopia.MsgAddIssueLabels") {
          let issue = await getIssue(tx.body.messages[i].issueId);
          let repo = await getRepository(issue.repositoryId);
          if (
            (props.selectedAddress === repo.owner.id &&
              tx.body.messages[i].creator !== props.selectedAddress) ||
            (props.selectedAddress === issue.creator &&
              tx.body.messages[i].creator !== props.selectedAddress)
          ) {
            let msg =
              shrinkAddress(tx.body.messages[i].creator) +
              ' added label on issue "' +
              issue.title +
              '" in repository "' +
              repo.name +
              '"';
            props.notify(msg, "info");
          }
        }
        if (msg["@type"] === "/gitopia.gitopia.gitopia.MsgAddIssueAssignees") {
          let issue = await getIssue(tx.body.messages[i].id);
          let repo = await getRepository(issue.repositoryId);
          console.log(tx);
          for (let j = 0; j < tx.body.messages[i].assignees.length; j++) {
            if (
              (repo.owner.id === props.selectedAddress &&
                props.selectedAddress !== tx.body.messages[i].creator) ||
              (props.selectedAddress !== tx.body.messages[i].creator &&
                props.selectedAddress === tx.body.messages[i].assignees[j] &&
                repo.owner.id !== props.selectedAddress)
            ) {
              let msg =
                shrinkAddress(tx.body.messages[i].creator) +
                " added assignees in issue " +
                issue.title +
                '" in repository "' +
                repo.name +
                '"';
              props.notify(msg, "info");
            }
          }
        }
      }
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
  return { selectedAddress: state.wallet.selectedAddress };
};

export default connect(mapStateToProps, { notify })(Notifications);
