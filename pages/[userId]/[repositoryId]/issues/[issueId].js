import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";

import getUserRepository from "../../../../helpers/getUserRepository";
import getIssue from "../../../../helpers/getIssue";
import getComment from "../../../../helpers/getComment";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import MarkdownEditor from "../../../../components/markdownEditor";

import { createComment } from "../../../../store/actions/repository";

function RepositoryIssueView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { ID: router.query.userId },
  });
  const [issue, setIssue] = useState({
    id: router.query.issueId,
    comments: [],
  });
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(async () => {
    const [r, i] = await Promise.all([
      getUserRepository(repository.owner.ID, repository.name),
      getIssue(issue.id),
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
      });
      if (res && res.code === 0) {
        setComment("");
        const i = await getIssue(issue.id);
        setIssue(i);
      }
    }
    setPostingComment(false);
  };

  return (
    <div data-theme="dark" className="bg-base-100 text-base-content">
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
                <span className="text-xl">{issue.title}</span>{" "}
                <span className="text-xl text-neutral">#{issue.iid}</span>
              </div>
              <div className="mt-4 flex items-center">
                <span
                  className={
                    "badge badge-lg capitalize mr-4 " +
                    (issue.state === "open" ? "badge-primary" : "badge-error")
                  }
                >
                  {issue.state === "open" ? (
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
                        <img src="https://i.pravatar.cc/500?img=0" />
                      </div>
                    </div>
                  </div>
                  <div className="border border-grey rounded flex-1">
                    <div className="text-xs px-4 py-2 bg-neutral">
                      {shrinkAddress(issue.creator) +
                        " commented on " +
                        dayjs(issue.createdAt * 1000).format("DD MMM")}
                    </div>
                    <div className="p-4">{issue.description}</div>
                  </div>
                </div>
                {allComments.map((c) => {
                  return (
                    <div className="flex w-full mt-8">
                      <div className="flex-none mr-4">
                        <div className="avatar">
                          <div className="mb-8 rounded-full w-14 h-14">
                            <img src="https://i.pravatar.cc/500?img=0" />
                          </div>
                        </div>
                      </div>
                      <div className="border border-grey rounded flex-1">
                        <div className="text-xs px-4 py-2 bg-neutral">
                          {shrinkAddress(c.creator) +
                            " commented on " +
                            dayjs(c.createdAt * 1000).format("DD MMM")}
                        </div>
                        <div className="p-4">{c.body}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex w-full mt-8">
                  <div className="flex-none mr-4">
                    <div className="avatar">
                      <div className="mb-8 rounded-full w-14 h-14">
                        <img src="https://i.pravatar.cc/500?img=0" />
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
  };
};

export default connect(mapStateToProps, { createComment })(RepositoryIssueView);
