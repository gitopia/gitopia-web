import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function CommitDetailRow({
  commitDetail,
  commitInBranchLink = "",
}) {
  let [authorName, setAuthorName] = useState("");
  let [message, setMessage] = useState("");
  let [hasMore, setHasMore] = useState(false);
  let [fullMessageShown, setFullMessageShown] = useState(false);
  const maxMessageLength = 60;

  useEffect(() => {
    if (commitDetail && commitDetail.commit && commitDetail.commit.author) {
      setAuthorName(commitDetail.commit.author.name || "");
      let newMessage = commitDetail.commit.message || "";
      if (commitDetail.commit.message.length > maxMessageLength) {
        newMessage =
          commitDetail.commit.message.slice(0, maxMessageLength) + "..";
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setMessage(newMessage);
      setFullMessageShown(false);
    }
  }, [commitDetail]);

  return (
    <>
      <div className="flex px-2 py-2 bg-base-200 items-top">
        <div className="flex-1 flex items-center">
          <div className="avatar">
            <div className="rounded-full w-6 h-6 mr-2">
              <img
                src={
                  "https://avatar.oxro.io/avatar.svg?length=1&height=40&width=40&fontSize=18&caps=1&name=" +
                  authorName.slice(0, 1)
                }
              />
            </div>
          </div>
          <span className="pr-4 border-r border-grey text-sm">
            {authorName}
          </span>
          <span className="pl-4 text-sm">{message}</span>
          {hasMore ? (
            <button
              className="ml-1 btn btn-xs btn-link"
              onClick={() => {
                setFullMessageShown(!fullMessageShown);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="mr-2 flex-none flex pt-0.5">
          <Link href={commitInBranchLink}>
            <a className="link link-primary text-sm no-underline hover:underline">
              {commitDetail.oid.slice(0, 6)}
            </a>
          </Link>
        </div>
        <div className="flex-none text-type-secondary text-sm pt-0.5">
          {dayjs(
            (commitDetail.commit.author.timestamp +
              commitDetail.commit.author.timezoneOffset) *
              1000
          ).format("DD MMM YY")}
        </div>
      </div>
      {fullMessageShown ? (
        <div className="markdown-body p-2 bg-base-200 text-sm">
          <ReactMarkdown>{commitDetail.commit.message}</ReactMarkdown>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
