import { useEffect, useState } from "react";
import { ApolloProvider, useQuery, useLazyQuery, gql } from "@apollo/client";
import { updatedClient } from "../helpers/apolloClient";
import shrinkAddress from "../helpers/shrinkAddress";
import { useRouter } from "next/router";
import find from "lodash/find";

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const QUERY_TRANSACTIONS = gql`
    query SearchQuery($search: String = "") {
      explore_repo(text: $search) {
        id
        name
        description
        owner
        ownerType
        __typename
      }
      explore_user(text: $search) {
        username
        name
        creator
        avatarurl
      }
    }
  `;

  const QUERY_USERS = gql`
    query UsersQuery($creator_in: [String!] = "") {
      users(where: { creator_in: $creator_in }) {
        avatarurl
        name
        username
        creator
      }
    }
  `;

  const { loading, error, data } = useQuery(QUERY_TRANSACTIONS, {
    variables: { search: searchText },
    client: updatedClient,
  });

  const [getUserInfo, userInfo] = useLazyQuery(QUERY_USERS, {
    client: updatedClient,
  });

  const pickUsername = (address) => {
    let u = find(userInfo?.data?.users, {
      creator: address,
    });
    if (u) {
      console.log(u);
      return u.username ? u.username : shrinkAddress(address);
    }
    return shrinkAddress(address);
  };

  const actOnSuggestion = () => {
    let item = suggestions[selectedIndex];
    console.log(item);
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
    data?.explore_repo?.map((e) => {
      users.push(e.owner);
      newSuggestions.push(e);
    });
    data?.explore_user?.map((e) => newSuggestions.push(e));
    setSuggestions(newSuggestions);
    if (users.length) getUserInfo({ variables: { creator_in: users } });
  }, [data]);

  return (
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
            }}
            onKeyUp={(e) => {
              if (e.code === "ArrowDown") {
                setSelectedIndex(
                  selectedIndex === suggestions.length ? 0 : selectedIndex + 1
                );
              } else if (e.code === "ArrowUp") {
                setSelectedIndex(
                  selectedIndex === 0 ? suggestions.length : selectedIndex - 1
                );
              } else if (e.code === "Enter") {
                actOnSuggestion();
              }
            }}
            onFocus={() => {
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowSuggestions(false);
              }, 100);
            }}
          />
          <button
            className={
              "absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost" +
              (loading ? " loading" : "")
            }
            onClick={(e) => {
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
        <ul className="menu bg-base-300 rounded-md">
          {data?.explore_repo?.map((e, i) => {
            return (
              <li onClick={actOnSuggestion} key={"suggestion" + i}>
                <a className={i === selectedIndex ? "active" : ""}>
                  <div className="flex w-full">
                    <div className="flex-1">
                      <div>
                        {pickUsername(e.owner)}
                        {/* {e.ownerUsername
                          ? e.ownerUsername
                          : shrinkAddress(e.owner)} */}
                        /{e.name}
                      </div>
                      <div className="nowrap ellipsis text-type-secondary text-xs">
                        {e.description}
                      </div>
                    </div>
                    <div
                      className={
                        "text-right text-type-tertiary text-xs" +
                        (i === selectedIndex ? " text-green-300" : "")
                      }
                    >
                      {e.__typename}
                    </div>
                  </div>
                </a>
              </li>
            );
          })}

          {data?.explore_user?.map((e, i) => {
            return (
              <li
                onClick={actOnSuggestion}
                key={"suggestion" + ((data?.explore_repo?.length || 0) + i)}
              >
                <a
                  className={
                    i === selectedIndex + (data?.explore_repo?.length || 0)
                      ? "active"
                      : ""
                  }
                >
                  <div className="flex w-full">
                    <div className="flex-none mr-4">
                      <div className="avatar">
                        <div className="rounded-full w-10 h-10">
                          <img
                            src={
                              e.avatarUrl ||
                              "https://2.bp.blogspot.com/-v5XKcgrpJE0/UAV-gcZZaSI/AAAAAAAAB7o/-HhDZVVV_zo/s1600/gordan-ramsay.gif"
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div>{shrinkAddress(e.name)}</div>
                      <div className="text-xs">{e.username}</div>
                    </div>
                    <div
                      className={
                        "text-right text-type-tertiary text-xs" +
                        (i === selectedIndex ? " text-green-300" : "")
                      }
                    >
                      {e.__typename}
                    </div>
                  </div>
                </a>
              </li>
            );
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
  );
}
