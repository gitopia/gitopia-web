import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

export default function BranchSelector({
  branches = [],
  branchName = "master",
  tags = [],
  baseUrl,
  showIcon = true,
  showTagsOnly = false,
  showBranchesOnly = false,
  isTag = false,
  onCreateTag = null,
  onChange = () => {},
  ...props
}) {
  const [tab, setTab] = useState(showTagsOnly ? "tags" : "branches");
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef();

  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    let list = tab === "tags" ? tags : branches;
    list = list.filter((l) => l.name.includes(searchText));
    setFilteredList(list);
  }, [searchText, tab]);

  useEffect(() => {
    console.log("tab changed");
    if (searchInput) searchInput.current.focus();
  }, [tab]);

  useEffect(() => {
    console.log("tags changed");
    if (tab === "tags") {
      setFilteredList(tags);
      setSearchText("");
    }
  }, [tags]);

  useEffect(() => {
    console.log("branches changed");
    if (tab === "branches") {
      setFilteredList(branches);
      setSearchText("");
    }
  }, [branches]);

  return (
    <div className={"dropdown"} tabIndex="0">
      <div
        className="btn btn-sm btn-outline items-center"
        onClick={() => {
          if (searchInput) searchInput.current.focus();
        }}
      >
        {showIcon ? (
          isTag ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <g transform="scale(0.9)">
                <path
                  d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="8.5" cy="18.5" r="2.5" fill="currentColor" />
                <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
                <path
                  d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                  fill="currentColor"
                />
              </g>
            </svg>
          )
        ) : (
          ""
        )}
        <div className="flex-1 text-left px-2">{branchName}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="shadow-lg dropdown-content bg-base-300 rounded mt-1 overflow-hidden w-64">
        {!(showTagsOnly || showBranchesOnly) ? (
          <div className="tabs px-6 pt-4">
            <a
              className={
                "tab tab-sm tab-bordered " +
                (tab === "branches" ? "tab-active" : "")
              }
              onClick={() => {
                setTab("branches");
              }}
            >
              Branches
            </a>
            <a
              className={
                "tab tab-sm tab-bordered " +
                (tab === "tags" ? "tab-active" : "")
              }
              onClick={() => {
                setTab("tags");
              }}
            >
              Tags
            </a>
          </div>
        ) : (
          ""
        )}
        <div className="mx-4 mt-4">
          <div className="form-control">
            <div className="relative">
              <input
                name={tab + "search"}
                type="text"
                placeholder={"Search " + tab}
                className="w-full pr-16 input input-sm input-ghost input-bordered"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyUp={(e) => {
                  if (e.code === "Escape") {
                    setSearchText("");
                  }
                  if (e.code === "Enter") {
                    if (filteredList.length) {
                      onChange(filteredList[0]);
                    }
                  }
                }}
                ref={searchInput}
              />
              <button className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
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
            </div>
          </div>
        </div>

        {filteredList.length ? (
          <ul className="menu text-xs mt-2">
            {filteredList.map((b, i) => {
              return (
                <li key={"branch-selector" + i}>
                  <Link href={baseUrl + "/" + b.name}>
                    <a className="whitespace-nowrap">{b.name}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-xs p-5 text-type-secondary">{"No " + tab}</div>
        )}

        {showTagsOnly && onCreateTag ? (
          <div className="mb-2 mx-4">
            <button
              className="btn btn-xs btn-block btn-ghost"
              onClick={() => {
                onCreateTag(searchText);
              }}
            >
              Create Tag
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
