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
import { addCompletedTask } from "../store/actions/taskQueue";
import db from "../helpers/db";

function Notifications(props) {
  async function addNotification(
    type,
    msg,
    unread,
    formattedMsg,
    pathToRedirect
  ) {
    try {
      const id = await db.notifications.add({
        type,
        msg,
        unread,
        formattedMsg,
        pathToRedirect,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const parseTx = async (tx) => {
    if (!tx) return null;
    switch (tx.typeurl) {
      case "/gitopia.gitopia.gitopia.MsgCreateIssue":
        {
          let repo = await getRepository(tx.message.repositoryId);
          if (
            props.selectedAddress === repo.owner.id &&
            tx.message.creator !== props.selectedAddress
          ) {
            let formattedMsg = [
              shrinkAddress(tx.message.creator),
              "",
              "",
              "created issue",
              tx.message.title,
              "in repository",
              repo.name,
            ];
            props.createNotification(tx.message, "issue");
            addNotification(
              "issue",
              tx.message,
              true,
              formattedMsg,
              repo.owner.id + "/" + repo.name + "/issues/" + tx.message.iid
            );
            props.notify(formattedMsg.join(" "), "info");
          }
        }
        if (tx.message.assignees.includes(props.selectedAddress)) {
          let formattedMsg = [
            shrinkAddress(tx.message.creator),
            "",
            "",
            "created issue",
            tx.message.title,
            "in repository",
            repo.name,
            "and assigned it to you",
          ];
          props.createNotification(tx.message, "issue");
          addNotification(
            "issue",
            tx.message,
            true,
            formattedMsg,
            repo.owner.id + "/" + repo.name + "/issues/" + tx.message.iid
          );
          props.notify(formattedMsg.join(" "), "info");
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
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "commented",
                tx.message.body.length > 64
                  ? tx.message.body.slice(0, 64) + "..."
                  : tx.message.body,
                "on issue",
                issue.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "issue");
              addNotification(
                "issue",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/issues/" + issue.iid
              );
              props.notify(formattedMsg.join(" "), "info");
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
                let formattedMsg = [
                  shrinkAddress(tx.message.creator),
                  "commented",
                  tx.message.body.length > 64
                    ? tx.message.body.slice(0, 64) + "..."
                    : tx.message.body,
                  "on pull request",
                  pull.title,
                  "in repository",
                  repo.name,
                ];
                props.createNotification(tx.message, "pulls");
                addNotification(
                  "pulls",
                  tx.message,
                  true,
                  formattedMsg,
                  repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
                );
                props.notify(formattedMsg.join(" "), "info");
              }
            }

            for (let j = 0; j < pull.assignees.length; j++) {
              if (
                props.selectedAddress !== tx.message.creator &&
                props.selectedAddress !== repo.owner.id &&
                props.selectedAddress === pull.assignees[j] &&
                props.selectedAddress !== pull.creator
              ) {
                let formattedMsg = [
                  shrinkAddress(tx.message.creator),
                  "commented",
                  tx.message.body.length > 64
                    ? tx.message.body.slice(0, 64) + "..."
                    : tx.message.body,
                  "on pull request",
                  pull.title,
                  "in repository",
                  repo.name,
                ];
                props.createNotification(tx.message, "pulls");
                addNotification(
                  "pulls",
                  tx.message,
                  true,
                  formattedMsg,
                  repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
                );
                props.notify(formattedMsg.join(" "), "info");
              }
            }

            if (
              props.selectedAddress === pull.creator &&
              tx.message.creator !== props.selectedAddress
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "commented",
                tx.message.body.length > 64
                  ? tx.message.body.slice(0, 64) + "..."
                  : tx.message.body,
                "on pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgAddIssueLabels":
        {
          console.log(tx.message);
          let issue = await getIssue(tx.message.issueId);
          let repo = await getRepository(issue.repositoryId);
          let labels = [];
          tx.message.labelIds.map((lid, _) => {
            for (let i = 0; i < repo.labels.length; i++) {
              if (repo.labels[i].id == lid) {
                labels.push(repo.labels[i].name);
              }
            }
          });
          if (
            (props.selectedAddress === repo.owner.id &&
              tx.message.creator !== props.selectedAddress) ||
            (props.selectedAddress === issue.creator &&
              tx.message.creator !== props.selectedAddress)
          ) {
            let formattedMsg = [
              shrinkAddress(tx.message.creator),
              "added label",
              labels.join(", "),
              "to issue",
              issue.title,
              "in repository",
              repo.name,
            ];
            props.createNotification(tx.message, "issue");
            addNotification(
              "issue",
              tx.message,
              true,
              formattedMsg,
              repo.owner.id + "/" + repo.name + "/issues/" + issue.iid
            );
            props.notify(formattedMsg.join(" "), "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemoveIssueLabels":
        {
          console.log(tx.message);
          let issue = await getIssue(tx.message.issueId);
          let repo = await getRepository(issue.repositoryId);
          let labels = [];
          tx.message.labelIds.map((lid, _) => {
            for (let i = 0; i < repo.labels.length; i++) {
              if (repo.labels[i].id == lid) {
                labels.push(repo.labels[i].name);
              }
            }
          });
          if (
            (props.selectedAddress === repo.owner.id &&
              tx.message.creator !== props.selectedAddress) ||
            (props.selectedAddress === issue.creator &&
              tx.message.creator !== props.selectedAddress)
          ) {
            let formattedMsg = [
              shrinkAddress(tx.message.creator),
              "removed label",
              labels.join(", "),
              "from issue",
              issue.title,
              "in repository",
              repo.name,
            ];
            props.createNotification(tx.message, "issue");
            addNotification(
              "issue",
              tx.message,
              true,
              formattedMsg,
              repo.owner.id + "/" + repo.name + "/issues/" + issue.iid
            );
            props.notify(formattedMsg.join(" "), "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemoveIssueAssignees":
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
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "removed assignee",
                tx.message.assignees.join(", "),
                "from issue",
                issue.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "issue");
              addNotification(
                "issue",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/issues/" + issue.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }
        }
        break;
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
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "added assignee",
                tx.message.assignees.join(", "),
                "to issue",
                issue.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "issue");
              addNotification(
                "issue",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/issues/" + issue.iid
              );
              props.notify(formattedMsg.join(" "), "info");
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
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "",
                "",
                "created pull request",
                tx.message.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }

          for (let j = 0; j < tx.message.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress !== repo.owner.id &&
              props.selectedAddress === tx.message.assignees[j]
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "",
                "",
                "created pull request",
                tx.message.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }
          if (
            props.selectedAddress === repo.owner.id &&
            tx.message.creator !== props.selectedAddress
          ) {
            let formattedMsg = [
              shrinkAddress(tx.message.creator),
              "",
              "",
              "created pull request",
              tx.message.title,
              "in repository",
              repo.name,
            ];
            props.createNotification(tx.message, "pulls");
            addNotification(
              "pulls",
              tx.message,
              true,
              formattedMsg,
              repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
            );
            props.notify(formattedMsg.join(" "), "info");
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemovePullRequestReviewers":
        {
          let pull = await getPullRequest(tx.message.id);
          let repo = await getRepository(pull.head.repositoryId);
          for (let j = 0; j < tx.message.reviewers.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress === tx.message.reviewers[j]
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "removed reviewer",
                tx.message.reviewers.join(", "),
                "to pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }
        }
        break;
      case "/gitopia.gitopia.gitopia.MsgAddPullRequestReviewers":
        {
          let pull = await getPullRequest(tx.message.id);
          let repo = await getRepository(pull.head.repositoryId);
          for (let j = 0; j < tx.message.reviewers.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress === tx.message.reviewers[j]
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "added reviewer",
                tx.message.reviewers.join(", "),
                "to pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }
        }
        break;

      case "/gitopia.gitopia.gitopia.MsgRemovePullRequestAssignees":
        {
          let pull = await getPullRequest(tx.message.id);
          let repo = await getRepository(pull.head.repositoryId);
          for (let j = 0; j < tx.message.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress === tx.message.assignees[j]
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "removed assignee",
                tx.message.assignees.join(", "),
                "from pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }
        }
        break;
      case "/gitopia.gitopia.gitopia.MsgAddPullRequestAssignees":
        {
          let pull = await getPullRequest(tx.message.id);
          let repo = await getRepository(pull.head.repositoryId);
          for (let j = 0; j < tx.message.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress === tx.message.assignees[j]
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "added assignee",
                tx.message.assignees.join(", "),
                "to pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
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
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "",
                tx.message.state,
                "pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }

          for (let j = 0; j < pull.assignees.length; j++) {
            if (
              props.selectedAddress !== tx.message.creator &&
              props.selectedAddress !== repo.owner.id &&
              props.selectedAddress === pull.assignees[j]
            ) {
              let formattedMsg = [
                shrinkAddress(tx.message.creator),
                "",
                tx.message.state,
                "pull request",
                pull.title,
                "in repository",
                repo.name,
              ];
              props.createNotification(tx.message, "pulls");
              addNotification(
                "pulls",
                tx.message,
                true,
                formattedMsg,
                repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
              );
              props.notify(formattedMsg.join(" "), "info");
            }
          }

          if (
            props.selectedAddress === repo.owner.id &&
            tx.message.creator !== props.selectedAddress
          ) {
            let formattedMsg = [
              shrinkAddress(tx.message.creator),
              "",
              tx.message.state,
              "pull request",
              pull.title,
              "in repository",
              repo.name,
            ];
            props.createNotification(tx.message, "pulls");
            addNotification(
              "pulls",
              tx.message,
              true,
              formattedMsg,
              repo.owner.id + "/" + repo.name + "/pulls/" + pull.iid
            );
            props.notify(formattedMsg.join(" "), "info");
          }
        }
        break;

      default:
        console.log("Unhandled", tx.typeurl, tx.message);
        break;
    }
  };

  const parseLog = async (log) => {
    let logData;
    try {
      logData = JSON.parse(log);
      console.log("logs", logData);
    } catch (e) {
      console.error(e);
    }
  };

  const parseEvents = async (events) => {
    for (let i = 0; i < events.length; i++) {
      if (events[i].type === "message") {
        let isTask = false,
          taskId,
          taskState,
          taskMesssage;
        let task = {};
        for (let j = 0; j < events[i].attributes.length; j++) {
          let key = atob(events[i].attributes[j].key),
            value = atob(events[i].attributes[j].value);
          if (key === "action") {
            if (
              [
                // "InvokeForkRepository",
                "ForkRepository",
                // "InvokeMergePullRequest",
                "SetPullRequestState",
              ].includes(value)
            )
              isTask = true;
          }
          if (key === "TaskId") {
            taskId = Number(value);
          }

          if (key === "TaskState") {
            taskState = value;
          }
          task[key] = value;
          console.log(key, value);
        }
        if (isTask && taskId) {
          console.log(taskId, taskState, taskMesssage);
          let searchIndex = props.taskQueue.findIndex((x) => x.id === taskId);
          console.log(searchIndex, props.taskQueue);
          if (searchIndex > -1) {
            let queuedTask = props.taskQueue[searchIndex];
            console.log(
              "queuedTask",
              queuedTask,
              taskState === "TASK_STATE_FAILURE" && queuedTask.reject
            );
            if (taskState === "TASK_STATE_SUCCESS" && queuedTask.resolve) {
              console.log("Resolving");
              queuedTask.resolve(task);
            } else if (
              taskState === "TASK_STATE_FAILURE" &&
              queuedTask.reject
            ) {
              console.log("Rejecting");
              queuedTask.reject(task);
            }
            return;
          }
          console.log("Task limit", props.env.recordingTasks);
          // if (props.env.recordingTasks) {
          // if ([].includes(task.action))
          console.log("Recording task..", task);
          props.addCompletedTask(task);
          // }
        }
      }
    }
  };

  const wsMessage = async (message) => {
    let jsonData;
    try {
      let evalData = JSON.parse(message.data);
      if (evalData !== undefined) {
        jsonData = evalData.result.data;
      }
    } catch (e) {
      console.error(e);
    }
    if (jsonData) {
      console.log("Data", jsonData);
      const fullTx = decodeTx(jsonData.value.TxResult.tx);
      console.log("Tx", fullTx);
      parseTx(fullTx);
      parseEvents(jsonData.value.TxResult.result.events);
    }
  };

  let ws;

  useEffect(() => {
    if (!ws) {
      ws = new W3CWebSocket("ws://localhost:26657/websocket");
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

      ws.onerror = (error) => {
        console.log(`WebSocket error: ${error}`);
      };
    }
    ws.addEventListener("message", wsMessage);

    return () => {
      ws.removeEventListener("message", wsMessage);
    };
  }, []);

  return null;
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    userNotification: state.userNotification,
    env: state.env,
    taskQueue: state.taskQueue,
  };
};

export default connect(mapStateToProps, {
  notify,
  createNotification,
  addCompletedTask,
})(Notifications);
