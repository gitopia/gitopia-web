import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import shrinkAddress from "../../helpers/shrinkAddress";
import validAddress from "../../helpers/validAddress";

export default function CommitDetailRow({
  commitDetail,
  commitLink,
  commitHistoryLink,
  commitsLength,
  maxMessageLength = 50,
  isMobile = false,
}) {
  let [author, setAuthor] = useState({ name: "", initial: "", link: null });
  let [title, setTitle] = useState("");
  let [hasMore, setHasMore] = useState(false);
  let [fullMessageShown, setFullMessageShown] = useState(false);

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
      let newTitle = commitDetail.title || "";
      if (
        commitDetail.title.length > maxMessageLength ||
        commitDetail.message
      ) {
        newTitle =
          commitDetail.title.slice(0, maxMessageLength) + maxMessageLength > 0
            ? ".."
            : "";
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
          <span className="pr-4 sm:border-r sm:border-grey text-sm">
            {author.link ? (
              <a
                href={author.link}
                className="link no-underline hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {author.name}
              </a>
            ) : (
              author.name
            )}
          </span>
          <span className="sm:pl-4 text-sm">{title}</span>
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
          !isMobile ? (
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
          )
        ) : (
          ""
        )}
        <div className="flex-none text-type-secondary text-xs pt-2 sm:pt-0.5">
          {dayjs(commitDetail.author.date).fromNow()}
        </div>
        {isMobile ? (
          <a className="btn btn-xs btn-ghost ml-4 mt-1 mb-1" href={commitLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
              className=""
            >
              {" "}
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>
          </a>
        ) : (
          ""
        )}
        {commitHistoryLink ? (
          <a className="ml-4 flex" href={commitHistoryLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="mt-1.5"
            >
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            <div className="ml-1 text-type-secondary text-xs pt-1">
              {commitsLength}
            </div>
            <div className="ml-1 text-type-secondary text-xs pt-1">commits</div>
          </a>
        ) : (
          ""
        )}
      </div>
      {fullMessageShown ? (
        <div className="markdown-body p-2 bg-base-200">
          <div className="mb-4">{commitDetail.title}</div>
          <ReactMarkdown>{commitDetail.message}</ReactMarkdown>
          {isMobile ? (
            <div className="flex">
              <a className="text-xs italic">{commitDetail.id.slice(0, 6)}</a>
              <button
                className="btn btn-xs btn-ghost"
                onClick={(e) => {
                  navigator.clipboard.writeText(commitDetail.id);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mb-5"
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
        </div>
      ) : (
        ""
      )}
    </>
  );
}
