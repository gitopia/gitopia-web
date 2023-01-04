import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import dayjs from "dayjs";

import getRepositoryIssue from "../../../../../helpers/getRepositoryIssue";
import shrinkAddress from "../../../../../helpers/shrinkAddress";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import useRepository from "../../../../../hooks/useRepository";
import IssuePullTitle from "../../../../../components/repository/issuePullTitle";
import { useErrorStatus } from "../../../../../hooks/errorHandler";
import pluralize from "../../../../../helpers/pluralize";
import IssueTabs from "../../../../../components/repository/issueTabs";
import getPullRequest from "../../../../../helpers/getPullRequest";
import pullRequestStateClass from "../../../../../helpers/pullRequestStateClass";
import getIssueCommentAll from "../../../../../helpers/getIssueCommentAll";
import getPullRequestCommentAll from "../../../../../helpers/getPullRequestCommentAll";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryIssueLinkedPullsView(props) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const { repository } = useRepository();
  const [pulls, setPulls] = useState([]);
  const [issue, setIssue] = useState({
    iid: router.query.issueIid,
    creator: "",
    description: "",
    comments: [],
    pullRequests: [],
  });

  useEffect(() => {
    async function fetchIssue() {
      const [i, c] = await Promise.all([
        getRepositoryIssue(
          router.query.userId,
          router.query.repositoryId,
          router.query.issueIid
        ),
        getIssueCommentAll(repository.id, router.query.issueIid),
      ]);
      if (i) {
        i.comments = c;
        setIssue(i);
      } else {
        setErrorStatusCode(404);
      }
    }
    fetchIssue();
  }, [router.query.issueIid, repository.id]);

  useEffect(() => {
    async function fetchPulls() {
      const array = [];
      for (var i = 0; i < issue.pullRequests.length; i++) {
        const res = await getPullRequest(issue.pullRequests[i].id);
        const comment = await getPullRequestCommentAll(repository.id, res.iid);
        res.comments = comment;
        array.push(res);
      }
      setPulls(array);
    }
    fetchPulls();
  }, [issue.pullRequests.length]);

  const refreshIssue = async () => {
    const [i, c] = await Promise.all([
      getRepositoryIssue(
        router.query.userId,
        router.query.repositoryId,
        router.query.issueIid
      ),
      getIssueCommentAll(repository.id, router.query.issueIid),
    ]);
    if (i) {
      i.comments = c;
      setIssue(i);
    }
  };

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
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="mt-8">
            <IssuePullTitle
              issuePullObj={issue}
              repository={repository}
              onUpdate={refreshIssue}
            />
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={
                "flex items-center rounded-full border pl-4 pr-6 py-1 mr-4 " +
                (issue.state === "OPEN" ? "border-green-900" : "border-red-900")
              }
            >
              <span
                className={
                  "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                  (issue.state === "OPEN" ? "bg-green-900" : "bg-red-900")
                }
              />
              <span className="text-type text-sm uppercase">{issue.state}</span>
            </span>
            <span className="text-xs mr-2 text-type-secondary">
              {shrinkAddress(issue.creator) +
                " opened this issue " +
                dayjs(issue.createdAt * 1000).fromNow()}
            </span>
            <span className="text-xl mr-2 text-type-secondary">&middot;</span>
            <span className="text-xs text-type-secondary">
              {issue.comments.length}
              <span className="ml-1">
                {pluralize("comment", issue.comments.length)}
              </span>
            </span>
          </div>
          <IssueTabs
            repository={repository}
            issueId={issue.iid}
            active="linked-pulls"
          />
          {pulls.length > 0 ? (
            <div className="border border-gray-700 rounded-lg mt-4 text-justify divide-y divide-gray-700">
              <div className="flex mt-4 mb-4">
                <div className="w-2/3 flex">
                  <div className="text-type-secondary text-sm ml-4">
                    Pull Requests
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

                <div className="w-1/12 flex mr-4">
                  <div className="text-type-secondary text-sm">Creator</div>
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
                  <div className="text-type-secondary text-sm">Replies</div>
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
                <div className="w-1/12 flex ml-auto mr-2">
                  <div className="text-type-secondary text-sm">Creation</div>
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
              </div>
              {pulls.map((p, k) => {
                return (
                  <div
                    className="flex mt-3 mb-3 pt-3 hover:cursor-pointer"
                    key={k}
                    onClick={() => {
                      if (window) {
                        window.open(
                          "/" +
                            repository.creator +
                            "/" +
                            repository.name +
                            "/pulls/" +
                            p.iid
                        );
                      }
                    }}
                  >
                    <div className="w-2/3">
                      {
                        <div className="flex">
                          <span
                            className={
                              "mr-3 mt-2 ml-4 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-" +
                              pullRequestStateClass(p.state)
                            }
                          />

                          <div className="text-sm mt-1">{p.title}</div>
                        </div>
                      }
                    </div>
                    <div className="w-1/12 flex ml-3">
                      <div className="avatar flex-none items-center">
                        <div className={"w-8 h-8 rounded-full"}>
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                              p.creator.slice(-1)
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/12 flex mr-8 mt-1.5 ml-2">
                      <div className="text-sm mr-3 font-bold text-type-secondary">
                        {p.comments.length}
                      </div>
                      <svg
                        width="19"
                        height="18"
                        viewBox="0 0 19 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-1"
                      >
                        <path
                          d="M8 13H1V1H18V13H15H14V14V16.2768L8.49614 13.1318L8.26556 13H8Z"
                          stroke="#ADBECB"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-sm font-bold text-type-secondary mr-5 ml-auto mt-1.5">
                      {dayjs.unix(parseInt(p.createdAt)).fromNow()}
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

export default connect(mapStateToProps, {})(RepositoryIssueLinkedPullsView);
