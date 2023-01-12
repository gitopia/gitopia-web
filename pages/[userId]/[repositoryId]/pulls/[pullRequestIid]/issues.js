import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import {
  linkPullIssuebyIid,
  unlinkPullIssuebyIid,
} from "../../../../../store/actions/bounties";
import getIssue from "../../../../../helpers/getIssue";
import PullRequestTabs from "../../../../../components/repository/pullRequestTabs";
import PullRequestHeader from "../../../../../components/repository/pullRequestHeader";
import useRepository from "../../../../../hooks/useRepository";
import usePullRequest from "../../../../../hooks/usePullRequest";
import shrinkAddress from "../../../../../helpers/shrinkAddress";
import dayjs from "dayjs";
import { ApolloProvider } from "@apollo/client";
import { updatedClient } from "../../../../../helpers/apolloClient";
import QueryIssues from "../../../../../helpers/queryIssuesByTitleGql";
import getIssueCommentAll from "../../../../../helpers/getIssueCommentAll";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryPullIssuesView(props) {
  const { repository } = useRepository();
  const { pullRequest } = usePullRequest(repository);
  const [issues, setIssues] = useState([]);
  const [issue, setIssue] = useState({ title: "", iid: "" });
  const [textEntered, setEnteredText] = useState("");
  const [issueList, setIssueList] = useState([]);

  useEffect(() => {
    async function fetchIssues() {
      const array = [];
      for (var i = 0; i < pullRequest.issues.length; i++) {
        const res = await getIssue(
          repository.owner.id,
          repository.name,
          pullRequest.issues[i].iid
        );
        array.push(res);
      }
      setIssues(array);
    }
    fetchIssues();
  }, [pullRequest.issues.length]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1 bg-repo-grad-v">
        <main className={"py-12 px-4 container mx-auto max-w-screen-lg"}>
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="pulls" />
          <div className="mt-8">
            <PullRequestHeader
              pullRequest={pullRequest}
              repository={repository}
            />
          </div>
          <div className="mt-8">
            <PullRequestTabs
              hrefBase={[
                "",
                repository.owner.id,
                repository.name,
                "pulls",
                pullRequest.iid,
              ].join("/")}
              active="issues"
            />
          </div>
          <div className="flex mt-4">
            {issue.title != "" ? (
              <div className="flex text-sm box-border bg-grey-500 mr-2 h-11 p-3 rounded-lg uppercase mt-2">
                {issue.title}
                <div
                  className="link ml-4 mt-1 no-underline"
                  onClick={() => {
                    setIssue({ title: "", iid: "" });
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.5303 1.5304C13.8231 1.23751 13.8231 0.762637 13.5303 0.469744C13.2374 0.176851 12.7625 0.176851 12.4696 0.469744L13.5303 1.5304ZM0.46967 12.4697C0.176777 12.7626 0.176777 13.2374 0.46967 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L0.46967 12.4697ZM12.4696 13.5303C12.7625 13.8231 13.2374 13.8231 13.5303 13.5303C13.8231 13.2374 13.8231 12.7625 13.5303 12.4696L12.4696 13.5303ZM1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM12.4696 0.469744L0.46967 12.4697L1.53033 13.5303L13.5303 1.5304L12.4696 0.469744ZM13.5303 12.4696L1.53033 0.46967L0.46967 1.53033L12.4696 13.5303L13.5303 12.4696Z"
                      fill="#E5EDF5"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="form-control flex-1 mr-8 mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full pr-16 input input-ghost input-sm input-bordered"
                    value={textEntered}
                    onChange={(e) => {
                      setEnteredText(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.code === "Enter") {
                        setEnteredText(e.target.value);
                      }
                    }}
                  />

                  <ApolloProvider client={updatedClient}>
                    <QueryIssues
                      substr={textEntered}
                      repoId={Number(repository.id)}
                      setIssueList={setIssueList}
                    />
                  </ApolloProvider>

                  <button
                    className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost"
                    onClick={() => {}}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                  {issueList.length > 0 && issue.title == "" ? (
                    <div className="card bg-grey-500 p-4">
                      {issueList.map((i, key) => {
                        return i.state === "OPEN" ? (
                          <div
                            onClick={() => {
                              setIssue(i);
                              setEnteredText("");
                            }}
                            key={key}
                          >
                            <div
                              className={
                                "flex border-grey-300 pb-3 pt-3 hover:cursor-pointer " +
                                (key < issueList.length - 1 ? "border-b" : "")
                              }
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 20L5 4L19 4L19 20L5 20Z"
                                  stroke="#ADBECB"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M8 15L16 15M8 9L16 9"
                                  stroke="#ADBECB"
                                  strokeWidth="2"
                                />
                              </svg>

                              <div className="text-type-secondary ml-4 text-sm mt-0.5">
                                {i.title}
                              </div>
                              <div className="font-bold text-xs text-type-secondary ml-auto uppercase mt-1">
                                opened by {shrinkAddress(i.creator)}
                              </div>
                            </div>
                          </div>
                        ) : (
                          ""
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            <button
              className="ml-auto btn btn-primary text-xs btn-sm mt-4"
              onClick={() => {
                props
                  .linkPullIssuebyIid(repository.id, pullRequest.iid, issue.iid)
                  .then(() => {
                    setIssue({ title: "", iid: "" });
                  });
              }}
              disabled={issue.iid === ""}
            >
              Link Issue
            </button>
          </div>
          {issues.length > 0 ? (
            <div className="border border-gray-700 rounded-lg mt-4 text-justify divide-y divide-gray-700">
              <div className="flex mt-4 mb-4">
                <div className="w-3/5 flex">
                  <div className="text-type-secondary text-sm ml-4">Issue</div>
                  <svg
                    width="8"
                    height="4"
                    viewBox="0 0 8 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2.5 ml-2"
                  >
                    <path
                      d="M0 -0.000106812H8L4 3.99989L0 -0.000106812Z"
                      fill="#ADBECB"
                    />
                  </svg>
                </div>

                <div className="w-1/12 flex ml-4 mr-4">
                  <div className="text-type-secondary text-sm">Assigne</div>
                  <svg
                    width="8"
                    height="4"
                    viewBox="0 0 8 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2.5 ml-2"
                  >
                    <path
                      d="M0 -0.000106812H8L4 3.99989L0 -0.000106812Z"
                      fill="#ADBECB"
                    />
                  </svg>
                </div>
                <div className="w-1/12 flex mr-4">
                  <div className="text-type-secondary text-sm ml-2">
                    Replies
                  </div>
                  <svg
                    width="8"
                    height="4"
                    viewBox="0 0 8 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2.5 ml-2"
                  >
                    <path
                      d="M0 -0.000106812H8L4 3.99989L0 -0.000106812Z"
                      fill="#ADBECB"
                    />
                  </svg>
                </div>
                <div className="w-1/6 flex">
                  <div className="text-type-secondary text-sm ml-3">
                    Creation
                  </div>
                  <svg
                    width="8"
                    height="4"
                    viewBox="0 0 8 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-2.5 ml-2"
                  >
                    <path
                      d="M0 -0.000106812H8L4 3.99989L0 -0.000106812Z"
                      fill="#ADBECB"
                    />
                  </svg>
                </div>
                <div className="w-1/12 flex"></div>
              </div>
              {issues.map((i, k) => {
                return (
                  <div
                    className="link flex mt-3 mb-4 pt-3 no-underline"
                    key={k}
                  >
                    <div
                      className="w-3/5"
                      onClick={() => {
                        if (window) {
                          window.open(
                            "/" +
                              repository.creator +
                              "/" +
                              repository.name +
                              "/issues/" +
                              i.iid
                          );
                        }
                      }}
                    >
                      {
                        <div className="flex">
                          <span
                            className={
                              "mr-3 ml-4 mt-2 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                              (i.state === "OPEN"
                                ? "bg-green-900"
                                : "bg-red-900")
                            }
                          />
                          <div className="text-sm mt-1">{i.title}</div>
                        </div>
                      }
                    </div>

                    <div
                      className={
                        "w-1/12 flex " +
                        (i.assignees.length > 1 ? "mr-7 ml-0" : "mr-4 ml-3")
                      }
                    >
                      {i.assignees.length > 1 ? (
                        <div className="dropdown">
                          <div className="">
                            <div className="text-xs">1+ assignees</div>
                            <div
                              className={
                                "link link-primary no-underline uppercase text-xs"
                              }
                              tabIndex="0"
                            >
                              See All
                            </div>
                          </div>
                          <div
                            tabIndex="0"
                            className="dropdown-content p-4 bg-base-100 rounded-box w-48 grid grid-cols-1 gap-4 bg-grey-500 max-h-40 overflow-y-scroll"
                          >
                            {i.assignees.map((a, key) => {
                              return (
                                <div className="flex" key={key}>
                                  <div
                                    className={"avatar flex-none items-center "}
                                    key={key}
                                  >
                                    <div className={"w-8 h-8 rounded-full"}>
                                      <img
                                        src={
                                          "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                                          a.slice(-1)
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="ml-4 mt-0.5">
                                    {shrinkAddress(a)}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        i.assignees.map((a, key) => {
                          return (
                            <div
                              className={" avatar flex-none items-center "}
                              key={key}
                            >
                              <div className={"w-8 h-8 rounded-full"}>
                                <img
                                  src={
                                    "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                                    a.slice(-1)
                                  }
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="w-1/12 flex mr-4 mt-1">
                      <div className="text-sm mr-3 font-bold text-type-secondary">
                        {i.commentsCount}
                      </div>
                      <svg
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-0.5"
                      >
                        <path
                          d="M8 13H1V1H18V13H15H14V14V16.2768L8.49614 13.1318L8.26556 13H8Z"
                          stroke="#ADBECB"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="w-1/6 text-sm font-bold text-type-secondary mt-1.5">
                      {dayjs.unix(parseInt(i.createdAt)).fromNow()}
                    </div>
                    <div className="text-sm font-bold text-type-secondary mr-4 ml-auto mt-1.5">
                      <button
                        className="link link-primary text-xs uppercase no-underline"
                        onClick={() => {
                          props.unlinkPullIssuebyIid(
                            repository.id,
                            pullRequest.iid,
                            i.iid
                          );
                        }}
                      >
                        Unlink
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  linkPullIssuebyIid,
  unlinkPullIssuebyIid,
})(RepositoryPullIssuesView);
