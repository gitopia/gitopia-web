import { w3cwebsocket as W3CWebSocket } from "websocket";
import { decodeTx } from "../helpers/blockParser";
import { useState, useEffect } from "react";
import { connect } from "react-redux";
import getRepository from "../helpers/getRepository";
import getIssue from "../helpers/getIssue";
import getPullRequest from "../helpers/getPullRequest";
import { notify } from "reapop";
import shrinkAddress from "../helpers/shrinkAddress";
import { createNotification } from "../store/actions/userNotification";
import db from "../helpers/db";

function Notifications(props) {
  async function addNotification(type, msg, unread, formattedMsg) {
    try {
      const id = await db.notifications.add({
        type,
        msg,
        unread,
        formattedMsg,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const ws = new W3CWebSocket("ws://localhost:26657/websocket");

  const parser = async (tx) => {
    switch (tx.typeurl) {
      case "/gitopia.gitopia.gitopia.MsgCreateIssue":
        {
          let repo = await getRepository(tx.message.repositoryId);
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
            addNotification("issue", tx.message, true, msg);
            props.notify(msg, "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgCreateComment":
        {
          if (tx.message.commentType === "ISSUE") {
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
                " commented on issue id " +
                issue.iid +
                ' in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "issue");
              addNotification("issue", tx.message, true, msg);
              props.notify(msg, "info");
            }
          } else if (tx.message.commentType === "PULLREQUEST") {
            let pull = await getPullRequest(tx.message.parentId);
            let repo = await getRepository(pull.head.repositoryId);
            for (let j = 0; j < pull.reviewers.length; j++) {
              if (
                props.selectedAddress !== tx.message.creator &&
                props.selectedAddress !== repo.owner.id &&
                props.selectedAddress === pull.reviewers[j] &&
                pull.assignees.includes(pull.reviewers[j]) === false &&
                props.selectedAddress !== pull.creator
              ) {
                let msg =
                  shrinkAddress(tx.message.creator) +
                  " commented on pull request id " +
                  pull.iid +
                  'in repository "' +
                  repo.name +
                  '"';
                props.createNotification(tx.message, "pulls");
                addNotification("pulls", tx.message, true, msg);
                props.notify(msg, "info");
              }
            }

            for (let j = 0; j < pull.assignees.length; j++) {
              if (
                props.selectedAddress !== tx.message.creator &&
                props.selectedAddress !== repo.owner.id &&
                props.selectedAddress === pull.assignees[j] &&
                props.selectedAddress !== pull.creator
              ) {
                let msg =
                  shrinkAddress(tx.message.creator) +
                  " commented on pull request id " +
                  pull.iid +
                  'in repository "' +
                  repo.name +
                  '"';
                props.createNotification(tx.message, "pulls");
                addNotification("pulls", tx.message, true, msg);
                props.notify(msg, "info");
              }
            }

            if (
              props.selectedAddress === pull.creator &&
              tx.message.creator !== props.selectedAddress
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                " commented on pull request id " +
                pull.iid +
                'in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgAddIssueLabels":
      case "/gitopia.gitopia.gitopia.MsgRemoveIssueLabels":
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
              ' changed label on issue "' +
              issue.title +
              '" in repository "' +
              repo.name +
              '"';
            props.createNotification(tx.message, "issue");
            addNotification("issue", tx.message, true, msg);
            props.notify(msg, "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemoveIssueAssignees":
      case "/gitopia.gitopia.gitopia.MsgAddIssueAssignees":
        {
          let issue = await getIssue(tx.message.id);
          let repo = await getRepository(issue.repositoryId);

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
                " changed assignees in issue " +
                issue.title +
                '" in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "issue");
              addNotification("issue", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgCreatePullRequest":
        {
          let repo = await getRepository(tx.message.baseRepoId);
          for (let j = 0; j < tx.message.reviewers.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress !== repo.owner.id &&
              props.selectedAddress === tx.message.reviewers[j] &&
              tx.message.assignees.includes(tx.message.reviewers[j]) === false
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                ' created a pr "' +
                tx.message.title +
                '" in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }

          for (let j = 0; j < tx.message.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress !== repo.owner.id &&
              props.selectedAddress === tx.message.assignees[j]
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                ' created a pr "' +
                tx.message.title +
                '" in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }
          if (
            props.selectedAddress === repo.owner.id &&
            tx.message.creator !== props.selectedAddress
          ) {
            let msg =
              shrinkAddress(tx.message.creator) +
              ' created a pr "' +
              tx.message.title +
              '" in repository "' +
              repo.name +
              '"';
            props.createNotification(tx.message, "pulls");
            addNotification("pulls", tx.message, true, msg);
            props.notify(msg, "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemovePullRequestReviewers":
      case "/gitopia.gitopia.gitopia.MsgAddPullRequestReviewers":
        {
          for (let j = 0; j < tx.message.reviewers.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress === tx.message.reviewers[j]
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                " changed pull request reviewer";
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemovePullRequestAssignees":
      case "/gitopia.gitopia.gitopia.MsgAddPullRequestAssignees":
        {
          for (let j = 0; j < tx.message.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress === tx.message.assignees[j]
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                " changed pull request assignees";
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgSetPullRequestState":
        {
          let pull = await getPullRequest(tx.message.id);
          let repo = await getRepository(pull.head.repositoryId);
          for (let j = 0; j < pull.reviewers.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress !== repo.owner.id &&
              props.selectedAddress === pull.reviewers[j] &&
              pull.assignees.includes(pull.reviewers[j]) === false
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                ' closed a pr "' +
                pull.title +
                '" in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }

          for (let j = 0; j < pull.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress !== repo.owner.id &&
              props.selectedAddress === pull.assignees[j]
            ) {
              let msg =
                shrinkAddress(tx.message.creator) +
                ' closed a pr "' +
                pull.title +
                '" in repository "' +
                repo.name +
                '"';
              props.createNotification(tx.message, "pulls");
              addNotification("pulls", tx.message, true, msg);
              props.notify(msg, "info");
            }
          }

          if (
            props.selectedAddress === repo.owner.id &&
            tx.message.creator !== props.selectedAddress
          ) {
            let msg =
              shrinkAddress(tx.message.creator) +
              ' closed a pr "' +
              pull.title +
              '" in repository "' +
              repo.name +
              '"';
            props.createNotification(tx.message, "pulls");
            addNotification("pulls", tx.message, true, msg);
            props.notify(msg, "info");
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
      let jsonData;
      if (evalData !== undefined) {
        jsonData = evalData.result.data;
      }
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
    userNotification: state.userNotification,
  };
};

export default connect(mapStateToProps, { notify, createNotification })(
  Notifications
);
