import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import ReactMarkdown from "react-markdown";

import getUserRepository from "../../../../helpers/getUserRepository";
import getRepositoryIssue from "../../../../helpers/getRepositoryIssue";
import getComment from "../../../../helpers/getComment";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import MarkdownEditor from "../../../../components/markdownEditor";

import { createComment } from "../../../../store/actions/repository";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { ID: router.query.userId },
  });
  const [issue, setIssue] = useState({
    iid: router.query.issueIid,
    creator: "",
    comments: [],
  });
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(async () => {
    const [r, i] = await Promise.all([
      getUserRepository(repository.owner.ID, repository.name),
      getRepositoryIssue(repository.owner.ID, repository.name, issue.iid),
    ]);
    if (r) setRepository(r);
    if (i) setIssue(i);
  }, []);

  const getAllComments = async () => {
    const pr = issue.comments.map((c) => getComment(c));
    const comments = await Promise.all(pr);
    setAllComments(comments);
  };

  useEffect(getAllComments, [issue]);

  const validateComment = () => {
    return true;
  };

  const createComment = async () => {
    setPostingComment(true);
    if (validateComment()) {
      const res = await props.createComment({
        parentId: issue.id,
        body: comment,
        commentType: "Issue",
      });
      if (res && res.code === 0) {
        setComment("");
        const i = await getRepositoryIssue(
          repository.owner.ID,
          repository.name,
          issue.iid
        );
        setIssue(i);
      }
    }
    setPostingComment(false);
  };

  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex">
        <main className="container mx-auto max-w-screen-lg py-12">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="issues"
            hrefBase={repository.owner.ID + "/" + repository.name}
          />
          <div className="flex mt-8">
            <div className="flex-1">
              <div>
                <span className="text-3xl mr-2">{issue.title}</span>
                <span className="text-3xl text-neutral">#{issue.iid}</span>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={
                    "badge badge-lg capitalize mr-4 " +
                    (issue.state === "Open" ? "badge-primary" : "badge-error")
                  }
                >
                  {issue.state === "Open" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {issue.state}
                </span>
                <span className="text-xs mr-2">
                  {shrinkAddress(issue.creator) +
                    " opened this issue on " +
                    dayjs(issue.createdAt * 1000).format("DD MMM")}
                </span>
                <span className="text-xs mr-2">&middot;</span>
                <span className="text-xs">
                  {issue.comments.length + " comments"}
                </span>
              </div>
            </div>
            <div>
              <Link
                href={
                  "/" +
                  repository.owner.ID +
                  "/" +
                  repository.name +
                  "/issues/new"
                }
              >
                <button className="btn btn-primary btn-sm">New Issue</button>
              </Link>
            </div>
          </div>
          <div className="flex mt-8">
            <div className="flex flex-1">
              <div className="flex flex-col w-full">
                <div className="flex w-full">
                  <div className="flex-none mr-4">
                    <div className="avatar">
                      <div className="mb-8 rounded-full w-14 h-14">
                        <img
                          src={
                            "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                            issue.creator.slice(-1)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-grey rounded flex-1">
                    <div className="text-xs px-4 py-2 bg-neutral">
                      {shrinkAddress(issue.creator) +
                        " commented on " +
                        dayjs(issue.createdAt * 1000).format("DD MMM")}
                    </div>
                    <div className="p-4">
                      <ReactMarkdown>{issue.description}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                {allComments.map((c) => {
                  return (
                    <div className="flex w-full mt-8" key={c.id}>
                      <div className="flex-none mr-4">
                        <div className="avatar">
                          <div className="mb-8 rounded-full w-14 h-14">
                            <img
                              src={
                                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                                c.creator.slice(-1)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="border border-grey rounded flex-1">
                        <div className="text-xs px-4 py-2 bg-neutral">
                          {shrinkAddress(c.creator) +
                            " commented on " +
                            dayjs(c.createdAt * 1000).format("DD MMM")}
                        </div>
                        <div className="p-4">
                          <ReactMarkdown>{c.body}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex w-full mt-8">
                  <div className="flex-none mr-4">
                    <div className="avatar">
                      <div className="mb-8 rounded-full w-14 h-14">
                        <img
                          src={
                            "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                            (props.activeWallet ? props.activeWallet.name : "")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border border-grey rounded flex-1 p-4">
                    <MarkdownEditor value={comment} setValue={setComment} />
                    <div className="text-right mt-4">
                      <button
                        className={
                          "btn btn-sm btn-primary " +
                          (postingComment ? "loading" : "")
                        }
                        disabled={comment.trim().length === 0}
                        onClick={createComment}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-none w-64 pl-8">
              <div>
                <div className="flex-1 text-left px-3 mb-1">Assignees</div>

                <div className="text-xs px-3">No one</div>
              </div>
              <div className="divider"></div>
              <div>
                <div className="flex-1 text-left px-3 mb-1">Labels</div>

                <div className="text-xs px-3">None yet</div>
              </div>
              <div className="divider"></div>
              <div>
                <div className="flex-1 text-left  px-3 mb-1">
                  Linked Pull Requests
                </div>

                <div className="text-xs px-3">None yet</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, { createComment })(RepositoryIssueView);