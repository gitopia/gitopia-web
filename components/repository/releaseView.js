import Link from "next/link";
import dayjs from "dayjs";
import shrinkAddress from "../../helpers/shrinkAddress";
import formatBytes from "../../helpers/formatBytes";
import shrinkSha from "../../helpers/shrinkSha";
import { useState } from "react";
import MarkdownWrapper from "../markdownWrapper";

export default function ReleaseView({
  release,
  repository,
  latest = false,
  showEditControls = false,
  onDelete = () => {},
  noLink = false,
  ...props
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="p-4">
      <div className="flex">
        <div className="flex items-center">
          {noLink ? (
            <div className="text-3xl text-type-secondary">
              {repository.name + " " + release.tagName}
            </div>
          ) : (
            <Link
              href={
                "/" +
                repository.owner.id +
                "/" +
                repository.name +
                "/releases/tag/" +
                release.tagName
              }
              className="text-3xl link link-primary no-underline hover:underline"
            >
              {repository.name + " " + release.tagName}
            </Link>
          )}
          {latest ? (
            <span className="ml-4 mt-1 badge badge-primary badge-outline">
              Latest
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="flex-none w-36 ml-auto">
          <Link
            href={
              "/" +
              repository.owner.id +
              "/" +
              repository.name +
              "/releases/new"
            }
            className="btn btn-primary btn-sm btn-block"
          >
            New Release
          </Link>
        </div>
      </div>
      <div className="flex items-center mt-4">
        <div className="avatar mr-1">
          <div className="w-5 h-5 rounded-full">
            <img
              src={
                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                release.creator.slice(-1)
              }
            />
          </div>
        </div>
        <Link
          href={"/" + release.creator}
          className="text-sm link no-underline hover:underline text-type-secondary"
        >
          {shrinkAddress(release.creator)}
        </Link>
        <div className="ml-1 text-sm text-type-secondary">
          {"released this on " +
            dayjs(release.publishedAt * 1000).format("DD-MM-YYYY")}
        </div>
        {showEditControls ? (
          <div className="dropdown dropdown-end">
            <div tabIndex="0" className="m-1 btn btn-square btn-xs btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <ul
              tabIndex="0"
              className="shadow menu compact dropdown-content bg-base-300 rounded-box w-32"
            >
              <li>
                <Link
                  href={
                    "/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/releases/edit/" +
                    release.tagName
                  }
                >
                  Edit
                </Link>
              </li>
              <li>
                <a
                  onClick={() => {
                    setConfirmDelete(true);
                  }}
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="text-xs mt-4 text-type-secondary">{release.name}</div>
      <div className="text-xs mt-2 text-type-secondary">
        <MarkdownWrapper>{release.description}</MarkdownWrapper>
      </div>
      <div className="text-sm mt-4">
        <span>Assets</span>
        <span className="badge badge-sm ml-2">
          {release.attachments.length}
        </span>
      </div>
      {release.attachments.length ? (
        <ul className="mt-2 menu compact border border-grey rounded">
          {release.attachments.map((a) => {
            return (
              <li key={a.sha}>
                <a
                  className="flex py-2 items-center"
                  target="_blank"
                  rel="noreferrer"
                  href={
                    process.env.NEXT_PUBLIC_OBJECTS_URL +
                    "/releases/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/" +
                    release.tagName +
                    "/" +
                    a.name
                  }
                >
                  <div className="flex-1 text-sm">{a.name}</div>
                  <div className="text-xs mr-2">{formatBytes(a.size)}</div>
                  <div className="">
                    <div
                      className="text-xs flex items-center tooltip"
                      data-tip={a.sha}
                    >
                      <button
                        className="btn btn-xs btn-ghost"
                        onClick={(e) => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(a.sha);
                          }
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        {shrinkSha(a.sha)}
                      </button>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        ""
      )}

      <input
        type="checkbox"
        checked={confirmDelete}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <p>Are you sure ?</p>
          <div className="modal-action">
            <label
              className="btn btn-sm"
              onClick={() => {
                setConfirmDelete(false);
              }}
            >
              Cancel
            </label>
            <label
              className={
                "btn btn-sm btn-primary " + (isDeleting ? "loading" : "")
              }
              onClick={async () => {
                setIsDeleting(true);
                if (onDelete) await onDelete(release.id);
                setConfirmDelete(false);
                setIsDeleting(false);
              }}
            >
              Delete
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
