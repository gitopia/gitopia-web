import { useEffect, useState, useCallback } from "react";
import { ApolloProvider, useQuery, useLazyQuery, gql } from "@apollo/client";
import client from "../helpers/apolloClient";
import shrinkAddress from "../helpers/shrinkAddress";
import { useRouter } from "next/router";
import find from "lodash/find";
import ClickAwayListener from "react-click-away-listener";
import debounce from "lodash/debounce";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const QUERY_TRANSACTIONS = gql`
    query SearchQuery($search: String = "") {
      explore_repo(text: $search, first: 5) {
        id
        name
        description
        owner
        ownerType
        __typename
      }
      explore_user(text: $search, first: 5) {
        username
        name
        creator
        avatarUrl
        bio
        __typename
      }
      explore_dao(text: $search, first: 5) {
        name
        address
        description
        location
        website
        avatarUrl
        __typename
      }
    }
  `;

  const QUERY_USERS = gql`
    query UsersQuery($creator_in: [String!] = "") {
      users(where: { creator_in: $creator_in }) {
        avatarUrl
        name
        username
        creator
      }
    }
  `;

  const [getSuggestions, newSuggestionsRes] = useLazyQuery(QUERY_TRANSACTIONS, {
    client: client,
  });

  const getSuggestionsDebounced = useCallback(
    debounce(getSuggestions, 400),
    []
  );

  const [getUserInfo, userInfo] = useLazyQuery(QUERY_USERS, {
    client: client,
  });

  const pickUsername = (address) => {
    let u = find(userInfo?.data?.users, {
      creator: address,
    });
    if (u) {
      return u.username ? u.username : shrinkAddress(address);
    }
    return shrinkAddress(address);
  };

  const actOnItem = (item) => {
    if (!item) return;
    if (item.__typename === "Repository") {
      let u = find(userInfo?.data?.users, {
        creator: item.owner,
      });
      router.push(
        "/" + (u.username ? u.username : item.owner) + "/" + item.name
      );
    } else if (item.__typename === "User") {
      router.push("/" + item.username);
    }
  };

  useEffect(() => {
    let newSuggestions = [],
      users = [];
    newSuggestionsRes?.data?.explore_repo?.map((e) => {
      users.push(e.owner);
      newSuggestions.push(e);
    });
    newSuggestionsRes?.data?.explore_user?.map((e) => newSuggestions.push(e));
    newSuggestionsRes?.data?.explore_dao?.map((e) => newSuggestions.push(e));
    setSuggestions(newSuggestions);
    if (users.length) getUserInfo({ variables: { creator_in: users } });
  }, [newSuggestionsRes?.data]);

  useEffect(() => {
    if (searchText && searchText !== "")
      getSuggestionsDebounced({ variables: { search: searchText } });
  }, [searchText]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShowSuggestions(false);
      }}
    >
      <div
        className={
          "flex-none mr-2 dropdown" + (showSuggestions ? " dropdown-open" : "")
        }
      >
        <div className="form-control">
          <div className="relative">
            <input
              name="search"
              type="text"
              placeholder="Search"
              autoComplete="off"
              className={
                "w-64 pr-16 input input-sm input-ghost input-bordered transition-[width]" +
                (showSuggestions ? " w-96" : "")
              }
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyUp={(e) => {
                if (e.code === "ArrowDown") {
                  setSelectedIndex(
                    selectedIndex === suggestions.length - 1
                      ? 0
                      : selectedIndex + 1
                  );
                } else if (e.code === "ArrowUp") {
                  setSelectedIndex(
                    selectedIndex === 0
                      ? suggestions.length - 1
                      : selectedIndex - 1
                  );
                } else if (e.code === "Enter") {
                  actOnItem(suggestions[selectedIndex]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                setShowSuggestions(true);
              }}
            />
            <button
              className={
                "absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost" +
                (newSuggestionsRes?.loading ? " loading" : "")
              }
              onClick={() => {
                setSearchText("");
              }}
            >
              {searchText === "" ? (
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="shadow-xl dropdown-content bg-base-300 rounded w-full mt-2 text-sm">
          <ul className="menu menu-compact bg-base-300 rounded-md">
            {suggestions?.map((e, i) => {
              if (e.__typename === "Repository") {
                return (
                  <li
                    key={"suggestion" + i}
                    onClick={() => {
                      actOnItem(e);
                    }}
                  >
                    <a className={i === selectedIndex ? "active" : ""}>
                      <div className="flex w-full items-center">
                        <div className="flex-none mr-2 flex items-center justify-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            stroke="currentColor"
                          >
                            <path d="M9.5 7L4.5 12L9.5 17" strokeWidth="2" />
                            <path d="M14.5 7L19.5 12L14.5 17" strokeWidth="2" />
                          </svg>
                        </div>
                        <div className="flex-1 break-all pr-4">
                          <div>
                            {pickUsername(e.owner)}/{e.name}
                          </div>
                          <div className="nowrap ellipsis text-type-secondary text-xs">
                            {e.description}
                          </div>
                        </div>
                        <div className={"text-right text-xs text-green-400"}>
                          {e.__typename}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              } else if (e.__typename === "User") {
                return (
                  <li
                    key={"suggestion" + i}
                    onClick={() => {
                      actOnItem(e);
                    }}
                  >
                    <a className={i === selectedIndex ? "active" : ""}>
                      <div className="flex w-full items-center">
                        <div className="flex-none mr-2 flex items-center justify-center">
                          {e.avatarUrl ? (
                            <div className="avatar">
                              <div className="rounded-full w-10 h-10">
                                <img src={e.avatarUrl} />
                              </div>
                            </div>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 break-all pr-4">
                          <div>{shrinkAddress(e.name)}</div>
                          <div className="text-xs">{e.username}</div>
                        </div>
                        <div className={"text-right text-xs text-green-400"}>
                          {e.__typename}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              } else if (e.__typename === "Dao") {
                return (
                  <li
                    key={"suggestion" + i}
                    onClick={() => {
                      actOnItem(e);
                    }}
                  >
                    <a className={i === selectedIndex ? "active" : ""}>
                      <div className="flex w-full items-center">
                        <div className="flex-none mr-2 flex items-center justify-center">
                          {e.avatarUrl ? (
                            <div className="avatar">
                              <div className="rounded-full w-10 h-10">
                                <img src={e.avatarUrl} />
                              </div>
                            </div>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 break-all pr-4">
                          <div>{shrinkAddress(e.name)}</div>
                          <div className="text-xs">{e.description}</div>
                        </div>
                        <div className={"text-right text-xs text-green-400"}>
                          {e.__typename}
                        </div>
                      </div>
                    </a>
                  </li>
                );
              }
            })}

            {!suggestions.length ? (
              <li key="no-suggestion">
                <span className="text-type-tertiary">
                  {searchText === ""
                    ? "Search something like a user or repository"
                    : "No Results"}
                </span>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  );
}
