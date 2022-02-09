import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import shrinkAddress from "../../helpers/shrinkAddress";

export default function CommitDetailRow({
  commitDetail,
  commitLink,
  maxMessageLength = 50,
}) {
  let [author, setAuthor] = useState({ name: "", initial: "", link: null });
  let [title, setTitle] = useState("");
  let [message, setMessage] = useState("");
  let [hasMore, setHasMore] = useState(false);
  let [fullMessageShown, setFullMessageShown] = useState(false);
  const validAddress = new RegExp("gitopia[a-z0-9]{39}");

  useEffect(() => {
    if (commitDetail && commitDetail.author) {
      let name = commitDetail.author.name || "";
      if (validAddress.test(name)) {
        setAuthor({
          name: shrinkAddress(name),
          initial: name.slice(-1),
          link: "/" + name,
        });
      } else {
        setAuthor({ name, initial: name.slice(0, 1), link: null });
      }
      // let newMessage = commitDetail.message || "";
      // if (commitDetail.message.length > maxMessageLength) {
      //   newMessage = commitDetail.message.slice(0, maxMessageLength) + "..";
      //   setHasMore(true);
      // } else {
      //   setHasMore(false);
      // }
      // setMessage(newMessage);
      let newTitle = commitDetail.title || "";
      if (commitDetail.title.length > maxMessageLength) {
        newTitle = commitDetail.title.slice(0, maxMessageLength) + "..";
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      setTitle(newTitle);
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
                  author.initial
                }
              />
            </div>
          </div>
          <span className="pr-4 border-r border-grey text-sm">
            {author.link ? (
              <a
                href={author.link}
                className="link no-underline hover:underline"
                target="_blank"
              >
                {author.name}
              </a>
            ) : (
              author.name
            )}
          </span>
          <span className="pl-4 text-sm">{title}</span>
          {hasMore ? (
            <button
              className="ml-1 btn btn-xs btn-ghost"
              onClick={() => {
                setFullMessageShown(!fullMessageShown);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
        {commitLink ? (
          <div className="mr-2 flex-none flex btn-group">
            <Link href={commitLink}>
              {
                //link link-primary text-sm no-underline hover:underline
              }
              <a className="btn btn-xs btn-ghost">
                {commitDetail.id.slice(0, 6)}
              </a>
            </Link>
            <button
              className="btn btn-xs btn-ghost"
              onClick={(e) => {
                navigator.clipboard.writeText(commitDetail.id);
              }}
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
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="flex-none text-type-secondary text-xs pt-0.5">
          {dayjs(commitDetail.author.date).fromNow()}
        </div>
      </div>
      {fullMessageShown ? (
        <div className="markdown-body p-2 bg-base-200 text-sm">
          <ReactMarkdown>{commitDetail.message}</ReactMarkdown>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
