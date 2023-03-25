import { useEffect, useState, useCallback } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import client from "../helpers/apolloClient";
import shrinkAddress from "../helpers/shrinkAddress";
import { useRouter } from "next/router";
import find from "lodash/find";
import ClickAwayListener from "react-click-away-listener";
import debounce from "lodash/debounce";
import { validUserAddress, validDaoAddress } from "../helpers/validAddress";

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
        __typename
      }
      explore_dao(text: $search, first: 5) {
        name
        address
        description
        avatarUrl
        verified
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

  const QUERY_DAOS = gql`
    query DaosQuery($address_in: [String!] = "") {
      daos(where: { address_in: $address_in }) {
        avatarUrl
        name
        description
        address
        verified
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
  const [getDaoInfo, daoInfo] = useLazyQuery(QUERY_DAOS, {
    client: client,
  });

  const pickUsername = (address) => {
    if (validUserAddress.test(address)) {
      let u = find(userInfo?.data?.users, {
        creator: address,
      });
      if (u) {
        return u.username ? u.username : shrinkAddress(address);
      }
    } else if (validDaoAddress.test(address)) {
      let d = find(daoInfo?.data?.daos, {
        address: address,
      });
      if (d) {
        return d.name ? d.name : shrinkAddress(address);
      }
    }
    return shrinkAddress(address);
  };

  const actOnItem = (item) => {
    if (!item) return;
    if (item.__typename === "Repository") {
      let id = item.owner;
      if (validUserAddress.test(item.owner)) {
        let u = find(userInfo?.data?.users, {
          creator: item.owner,
        });
        if (u?.username) id = u.username;
      } else if (validDaoAddress.test(item.owner)) {
        let d = find(daoInfo?.data?.daos, {
          address: item.owner,
        });
        if (d?.name) id = d.name.toLowerCase();
      }
      router.push("/" + id + "/" + item.name);
      setShowSuggestions(false);
    } else if (item.__typename === "User") {
      router.push("/" + item.username);
      setShowSuggestions(false);
    } else if (item.__typename === "Dao") {
      router.push("/" + item.name.toLowerCase());
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    let newSuggestions = [],
      users = [],
      daos = [];
    newSuggestionsRes?.data?.explore_repo?.map((e) => {
      if (validUserAddress.test(e.owner)) users.push(e.owner);
      else if (validDaoAddress.test(e.owner)) daos.push(e.owner);
      newSuggestions.push(e);
    });
    newSuggestionsRes?.data?.explore_user?.map((e) => newSuggestions.push(e));
    newSuggestionsRes?.data?.explore_dao?.map((e) => newSuggestions.push(e));
    setSuggestions(newSuggestions);
    if (users.length) {
      getUserInfo({ variables: { creator_in: users } });
    }
    if (daos.length) {
      getDaoInfo({ variables: { address_in: daos } });
    }
  }, [newSuggestionsRes?.data]);

  useEffect(() => {
    if (searchText !== "")
      {getSuggestionsDebounced({ variables: { search: searchText } });}
    else {
      setSuggestions([]);
    }
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
                if (searchText !== "") {
                  setSearchText("");
                  setShowSuggestions(false);
                }
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

        <div className="shadow-xl dropdown-content bg-base-300 rounded mt-2 text-sm overflow-hidden">
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
                          <div className="flex items-center">
                            <div>
                              {shrinkAddress(e.name)}
                            </div>
                            {e.verified ? (
                              <svg
                                viewBox="0 0 23 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-2 w-4 h-4"
                              >
                                <mask
                                  id="path-1-outside-1_3204_13419"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="23"
                                  height="23"
                                  fill="black"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M13.6114 3.63007C14.2904 2.93966 15.3742 2.76597 16.2518 3.27266C17.1301 3.77977 17.5215 4.80641 17.2618 5.74031C18.1961 5.47986 19.2235 5.87118 19.7309 6.74996C20.2381 7.62846 20.0635 8.71348 19.3714 9.39241C20.3087 9.6354 21.0008 10.487 21.0008 11.5003C21.0008 12.5128 20.3096 13.3639 19.3734 13.6076C20.066 14.2865 20.2408 15.3719 19.7334 16.2506C19.2259 17.1297 18.1979 17.521 17.2634 17.26C17.5232 18.194 17.1318 19.2208 16.2534 19.7279C15.3753 20.2349 14.2907 20.0607 13.6118 19.3692C13.3695 20.3076 12.5174 21.0008 11.5033 21.0008C10.4887 21.0008 9.6362 20.3068 9.3945 19.3676C8.71563 20.0604 7.63018 20.2352 6.75139 19.7278C5.87332 19.2209 5.48192 18.1947 5.74111 17.261C4.80782 17.5194 3.78243 17.128 3.27573 16.2503C2.76887 15.3724 2.94284 14.2883 3.63382 13.6093C2.6943 13.3678 2 12.5151 2 11.5003C2 10.4847 2.69528 9.63151 3.6358 9.39075C2.9453 8.7117 2.77157 7.62791 3.27829 6.75025C3.78481 5.87294 4.80965 5.48146 5.74268 5.7393C5.48363 4.80571 5.87504 3.77968 6.75303 3.27277C7.63127 2.76572 8.71592 2.94002 9.39488 3.63166C9.63708 2.69324 10.4893 2 11.5033 2C12.5168 2 13.3686 2.69246 13.6114 3.63007Z"
                                  />
                                </mask>
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M13.6114 3.63007C14.2904 2.93966 15.3742 2.76597 16.2518 3.27266C17.1301 3.77977 17.5215 4.80641 17.2618 5.74031C18.1961 5.47986 19.2235 5.87118 19.7309 6.74996C20.2381 7.62846 20.0635 8.71348 19.3714 9.39241C20.3087 9.6354 21.0008 10.487 21.0008 11.5003C21.0008 12.5128 20.3096 13.3639 19.3734 13.6076C20.066 14.2865 20.2408 15.3719 19.7334 16.2506C19.2259 17.1297 18.1979 17.521 17.2634 17.26C17.5232 18.194 17.1318 19.2208 16.2534 19.7279C15.3753 20.2349 14.2907 20.0607 13.6118 19.3692C13.3695 20.3076 12.5174 21.0008 11.5033 21.0008C10.4887 21.0008 9.6362 20.3068 9.3945 19.3676C8.71563 20.0604 7.63018 20.2352 6.75139 19.7278C5.87332 19.2209 5.48192 18.1947 5.74111 17.261C4.80782 17.5194 3.78243 17.128 3.27573 16.2503C2.76887 15.3724 2.94284 14.2883 3.63382 13.6093C2.6943 13.3678 2 12.5151 2 11.5003C2 10.4847 2.69528 9.63151 3.6358 9.39075C2.9453 8.7117 2.77157 7.62791 3.27829 6.75025C3.78481 5.87294 4.80965 5.48146 5.74268 5.7393C5.48363 4.80571 5.87504 3.77968 6.75303 3.27277C7.63127 2.76572 8.71592 2.94002 9.39488 3.63166C9.63708 2.69324 10.4893 2 11.5033 2C12.5168 2 13.3686 2.69246 13.6114 3.63007Z"
                                  fill="#6487FF"
                                />
                                <path
                                  d="M16.2518 3.27266L16.9517 2.06036V2.06036L16.2518 3.27266ZM13.6114 3.63007L12.2562 3.98093L12.8758 6.37422L14.6094 4.61167L13.6114 3.63007ZM17.2618 5.74031L15.9131 5.36532L15.2488 7.75471L17.6377 7.08874L17.2618 5.74031ZM19.7309 6.74996L18.5186 7.44988V7.44988L19.7309 6.74996ZM19.3714 9.39241L18.3911 8.39306L16.6242 10.1263L19.0201 10.7475L19.3714 9.39241ZM19.3734 13.6076L19.0208 12.2529L16.627 12.8759L18.3935 14.6073L19.3734 13.6076ZM19.7334 16.2506L20.9457 16.9506L19.7334 16.2506ZM17.2634 17.26L17.6399 15.9118L15.2496 15.2442L15.9147 17.6352L17.2634 17.26ZM16.2534 19.7279L15.5535 18.5156L15.5535 18.5156L16.2534 19.7279ZM13.6118 19.3692L14.6106 18.3885L12.8754 16.6213L12.2563 19.0193L13.6118 19.3692ZM9.3945 19.3676L10.7502 19.0188L10.1317 16.6155L8.39473 18.3878L9.3945 19.3676ZM6.75139 19.7278L7.45131 18.5155H7.45131L6.75139 19.7278ZM5.74111 17.261L7.08995 17.6355L7.75165 15.2518L5.36759 15.9119L5.74111 17.261ZM3.27573 16.2503L2.06343 16.9503H2.06343L3.27573 16.2503ZM3.63382 13.6093L4.61498 14.6077L6.38288 12.8704L3.98225 12.2535L3.63382 13.6093ZM3.6358 9.39075L3.98295 10.7469L6.38576 10.1318L4.61733 8.39267L3.6358 9.39075ZM3.27829 6.75025L4.49059 7.45017L4.49059 7.45017L3.27829 6.75025ZM5.74268 5.7393L5.3698 7.08858L7.75249 7.74704L7.09156 5.36504L5.74268 5.7393ZM6.75303 3.27277L7.45295 4.48507L7.45295 4.48507L6.75303 3.27277ZM9.39488 3.63166L8.39593 4.6123L10.1313 6.38004L10.7503 3.98149L9.39488 3.63166ZM16.9517 2.06036C15.5082 1.22695 13.7287 1.51444 12.6134 2.64848L14.6094 4.61167C14.8521 4.36488 15.2401 4.30499 15.5519 4.48497L16.9517 2.06036ZM18.6105 6.11529C19.037 4.58131 18.3964 2.89444 16.9517 2.06036L15.5519 4.48497C15.8638 4.6651 16.0059 5.03151 15.9131 5.36532L18.6105 6.11529ZM20.9432 6.05003C20.1087 4.60463 18.4205 3.96406 16.8859 4.39188L17.6377 7.08874C17.9717 6.99565 18.3384 7.13772 18.5186 7.44988L20.9432 6.05003ZM20.3516 10.3917C21.4885 9.27657 21.7774 7.49498 20.9432 6.05003L18.5186 7.44988C18.6987 7.76193 18.6385 8.1504 18.3911 8.39306L20.3516 10.3917ZM22.4006 11.5003C22.4006 9.83366 21.2622 8.43648 19.7227 8.03736L19.0201 10.7475C19.3551 10.8343 19.6009 11.1404 19.6009 11.5003H22.4006ZM19.7259 14.9623C21.2638 14.5621 22.4006 13.1657 22.4006 11.5003H19.6009C19.6009 11.8599 19.3555 12.1658 19.0208 12.2529L19.7259 14.9623ZM20.9457 16.9506C21.7802 15.5052 21.4909 13.723 20.3532 12.6079L18.3935 14.6073C18.6411 14.85 18.7014 15.2386 18.5211 15.5507L20.9457 16.9506ZM16.8868 18.6083C18.4219 19.037 20.1109 18.3965 20.9457 16.9506L18.5211 15.5507C18.3409 15.863 17.9739 16.005 17.6399 15.9118L16.8868 18.6083ZM16.9533 20.9402C18.3982 20.1061 19.0388 18.419 18.612 16.8848L15.9147 17.6352C16.0076 17.969 15.8655 18.3355 15.5535 18.5156L16.9533 20.9402ZM12.6129 20.35C13.7282 21.4858 15.5089 21.7741 16.9533 20.9402L15.5535 18.5156C15.2416 18.6957 14.8533 18.6356 14.6106 18.3885L12.6129 20.35ZM12.2563 19.0193C12.1698 19.3547 11.8635 19.6009 11.5033 19.6009V22.4006C13.1712 22.4006 14.5693 21.2605 14.9672 19.7191L12.2563 19.0193ZM11.5033 19.6009C11.1429 19.6009 10.8366 19.3545 10.7502 19.0188L8.03883 19.7165C8.43583 21.2592 9.83452 22.4006 11.5033 22.4006V19.6009ZM6.05147 20.9401C7.49688 21.7746 9.27916 21.4853 10.3943 20.3475L8.39473 18.3878C8.15209 18.6354 7.76347 18.6957 7.45131 18.5155L6.05147 20.9401ZM4.39228 16.8866C3.96654 18.4202 4.60722 20.1063 6.05147 20.9401L7.45131 18.5155C7.13942 18.3354 6.99731 17.9692 7.08995 17.6355L4.39228 16.8866ZM2.06343 16.9503C2.89684 18.3938 4.58167 19.0345 6.11464 18.6101L5.36759 15.9119C5.03398 16.0043 4.66802 15.8622 4.48803 15.5504L2.06343 16.9503ZM2.65266 12.6108C1.5177 13.7261 1.22975 15.5063 2.06343 16.9503L4.48803 15.5504C4.30799 15.2386 4.36799 14.8504 4.61498 14.6077L2.65266 12.6108ZM0.600153 11.5003C0.600153 13.1695 1.74215 14.5685 3.28539 14.9651L3.98225 12.2535C3.64645 12.1672 3.39985 11.8608 3.39985 11.5003H0.600153ZM3.28865 8.03463C1.74375 8.43011 0.600153 9.82987 0.600153 11.5003H3.39985C3.39985 11.1395 3.6468 10.8329 3.98295 10.7469L3.28865 8.03463ZM2.06599 6.05033C1.23254 7.4939 1.5201 9.27346 2.65426 10.3888L4.61733 8.39267C4.37051 8.14994 4.3106 7.76192 4.49059 7.45017L2.06599 6.05033ZM6.11555 4.39003C4.58303 3.96651 2.8991 4.60732 2.06599 6.05033L4.49059 7.45017C4.67051 7.13855 5.03627 6.99641 5.3698 7.08858L6.11555 4.39003ZM6.0531 2.06047C4.609 2.89422 3.9683 4.58009 4.39379 6.11357L7.09156 5.36504C6.99897 5.03133 7.14108 4.66513 7.45295 4.48507L6.0531 2.06047ZM10.3938 2.65102C9.2786 1.51495 7.49763 1.22647 6.0531 2.06047L7.45295 4.48507C7.76491 4.30496 8.15324 4.36508 8.39593 4.6123L10.3938 2.65102ZM10.7503 3.98149C10.8369 3.64606 11.1431 3.39985 11.5033 3.39985V0.600153C9.83538 0.600153 8.43728 1.74041 8.03945 3.28183L10.7503 3.98149ZM11.5033 3.39985C11.8633 3.39985 12.1694 3.64578 12.2562 3.98093L14.9665 3.27921C14.5678 1.73914 13.1704 0.600153 11.5033 0.600153V3.39985Z"
                                  fill="#2A313B"
                                  mask="url(#path-1-outside-1_3204_13419)"
                                />
                                <path
                                  d="M8.32031 12.9518L9.22815 13.8676C9.49025 14.132 9.91765 14.132 10.1798 13.8676L14.6851 9.32275"
                                  stroke="white"
                                  stroke-width="1.67493"
                                  stroke-linecap="round"
                                />
                              </svg>
                            ) : (
                              ""
                            )}
                          </div>
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
                          <div className="flex items-center">
                            <div>{shrinkAddress(e.name)}</div>
                            {e.verified ? (
                              <svg
                                viewBox="0 0 23 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="ml-2 w-4 h-4"
                              >
                                <mask
                                  id="path-1-outside-1_3204_13419"
                                  maskUnits="userSpaceOnUse"
                                  x="0"
                                  y="0"
                                  width="23"
                                  height="23"
                                  fill="black"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M13.6114 3.63007C14.2904 2.93966 15.3742 2.76597 16.2518 3.27266C17.1301 3.77977 17.5215 4.80641 17.2618 5.74031C18.1961 5.47986 19.2235 5.87118 19.7309 6.74996C20.2381 7.62846 20.0635 8.71348 19.3714 9.39241C20.3087 9.6354 21.0008 10.487 21.0008 11.5003C21.0008 12.5128 20.3096 13.3639 19.3734 13.6076C20.066 14.2865 20.2408 15.3719 19.7334 16.2506C19.2259 17.1297 18.1979 17.521 17.2634 17.26C17.5232 18.194 17.1318 19.2208 16.2534 19.7279C15.3753 20.2349 14.2907 20.0607 13.6118 19.3692C13.3695 20.3076 12.5174 21.0008 11.5033 21.0008C10.4887 21.0008 9.6362 20.3068 9.3945 19.3676C8.71563 20.0604 7.63018 20.2352 6.75139 19.7278C5.87332 19.2209 5.48192 18.1947 5.74111 17.261C4.80782 17.5194 3.78243 17.128 3.27573 16.2503C2.76887 15.3724 2.94284 14.2883 3.63382 13.6093C2.6943 13.3678 2 12.5151 2 11.5003C2 10.4847 2.69528 9.63151 3.6358 9.39075C2.9453 8.7117 2.77157 7.62791 3.27829 6.75025C3.78481 5.87294 4.80965 5.48146 5.74268 5.7393C5.48363 4.80571 5.87504 3.77968 6.75303 3.27277C7.63127 2.76572 8.71592 2.94002 9.39488 3.63166C9.63708 2.69324 10.4893 2 11.5033 2C12.5168 2 13.3686 2.69246 13.6114 3.63007Z"
                                  />
                                </mask>
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M13.6114 3.63007C14.2904 2.93966 15.3742 2.76597 16.2518 3.27266C17.1301 3.77977 17.5215 4.80641 17.2618 5.74031C18.1961 5.47986 19.2235 5.87118 19.7309 6.74996C20.2381 7.62846 20.0635 8.71348 19.3714 9.39241C20.3087 9.6354 21.0008 10.487 21.0008 11.5003C21.0008 12.5128 20.3096 13.3639 19.3734 13.6076C20.066 14.2865 20.2408 15.3719 19.7334 16.2506C19.2259 17.1297 18.1979 17.521 17.2634 17.26C17.5232 18.194 17.1318 19.2208 16.2534 19.7279C15.3753 20.2349 14.2907 20.0607 13.6118 19.3692C13.3695 20.3076 12.5174 21.0008 11.5033 21.0008C10.4887 21.0008 9.6362 20.3068 9.3945 19.3676C8.71563 20.0604 7.63018 20.2352 6.75139 19.7278C5.87332 19.2209 5.48192 18.1947 5.74111 17.261C4.80782 17.5194 3.78243 17.128 3.27573 16.2503C2.76887 15.3724 2.94284 14.2883 3.63382 13.6093C2.6943 13.3678 2 12.5151 2 11.5003C2 10.4847 2.69528 9.63151 3.6358 9.39075C2.9453 8.7117 2.77157 7.62791 3.27829 6.75025C3.78481 5.87294 4.80965 5.48146 5.74268 5.7393C5.48363 4.80571 5.87504 3.77968 6.75303 3.27277C7.63127 2.76572 8.71592 2.94002 9.39488 3.63166C9.63708 2.69324 10.4893 2 11.5033 2C12.5168 2 13.3686 2.69246 13.6114 3.63007Z"
                                  fill="#6487FF"
                                />
                                <path
                                  d="M16.2518 3.27266L16.9517 2.06036V2.06036L16.2518 3.27266ZM13.6114 3.63007L12.2562 3.98093L12.8758 6.37422L14.6094 4.61167L13.6114 3.63007ZM17.2618 5.74031L15.9131 5.36532L15.2488 7.75471L17.6377 7.08874L17.2618 5.74031ZM19.7309 6.74996L18.5186 7.44988V7.44988L19.7309 6.74996ZM19.3714 9.39241L18.3911 8.39306L16.6242 10.1263L19.0201 10.7475L19.3714 9.39241ZM19.3734 13.6076L19.0208 12.2529L16.627 12.8759L18.3935 14.6073L19.3734 13.6076ZM19.7334 16.2506L20.9457 16.9506L19.7334 16.2506ZM17.2634 17.26L17.6399 15.9118L15.2496 15.2442L15.9147 17.6352L17.2634 17.26ZM16.2534 19.7279L15.5535 18.5156L15.5535 18.5156L16.2534 19.7279ZM13.6118 19.3692L14.6106 18.3885L12.8754 16.6213L12.2563 19.0193L13.6118 19.3692ZM9.3945 19.3676L10.7502 19.0188L10.1317 16.6155L8.39473 18.3878L9.3945 19.3676ZM6.75139 19.7278L7.45131 18.5155H7.45131L6.75139 19.7278ZM5.74111 17.261L7.08995 17.6355L7.75165 15.2518L5.36759 15.9119L5.74111 17.261ZM3.27573 16.2503L2.06343 16.9503H2.06343L3.27573 16.2503ZM3.63382 13.6093L4.61498 14.6077L6.38288 12.8704L3.98225 12.2535L3.63382 13.6093ZM3.6358 9.39075L3.98295 10.7469L6.38576 10.1318L4.61733 8.39267L3.6358 9.39075ZM3.27829 6.75025L4.49059 7.45017L4.49059 7.45017L3.27829 6.75025ZM5.74268 5.7393L5.3698 7.08858L7.75249 7.74704L7.09156 5.36504L5.74268 5.7393ZM6.75303 3.27277L7.45295 4.48507L7.45295 4.48507L6.75303 3.27277ZM9.39488 3.63166L8.39593 4.6123L10.1313 6.38004L10.7503 3.98149L9.39488 3.63166ZM16.9517 2.06036C15.5082 1.22695 13.7287 1.51444 12.6134 2.64848L14.6094 4.61167C14.8521 4.36488 15.2401 4.30499 15.5519 4.48497L16.9517 2.06036ZM18.6105 6.11529C19.037 4.58131 18.3964 2.89444 16.9517 2.06036L15.5519 4.48497C15.8638 4.6651 16.0059 5.03151 15.9131 5.36532L18.6105 6.11529ZM20.9432 6.05003C20.1087 4.60463 18.4205 3.96406 16.8859 4.39188L17.6377 7.08874C17.9717 6.99565 18.3384 7.13772 18.5186 7.44988L20.9432 6.05003ZM20.3516 10.3917C21.4885 9.27657 21.7774 7.49498 20.9432 6.05003L18.5186 7.44988C18.6987 7.76193 18.6385 8.1504 18.3911 8.39306L20.3516 10.3917ZM22.4006 11.5003C22.4006 9.83366 21.2622 8.43648 19.7227 8.03736L19.0201 10.7475C19.3551 10.8343 19.6009 11.1404 19.6009 11.5003H22.4006ZM19.7259 14.9623C21.2638 14.5621 22.4006 13.1657 22.4006 11.5003H19.6009C19.6009 11.8599 19.3555 12.1658 19.0208 12.2529L19.7259 14.9623ZM20.9457 16.9506C21.7802 15.5052 21.4909 13.723 20.3532 12.6079L18.3935 14.6073C18.6411 14.85 18.7014 15.2386 18.5211 15.5507L20.9457 16.9506ZM16.8868 18.6083C18.4219 19.037 20.1109 18.3965 20.9457 16.9506L18.5211 15.5507C18.3409 15.863 17.9739 16.005 17.6399 15.9118L16.8868 18.6083ZM16.9533 20.9402C18.3982 20.1061 19.0388 18.419 18.612 16.8848L15.9147 17.6352C16.0076 17.969 15.8655 18.3355 15.5535 18.5156L16.9533 20.9402ZM12.6129 20.35C13.7282 21.4858 15.5089 21.7741 16.9533 20.9402L15.5535 18.5156C15.2416 18.6957 14.8533 18.6356 14.6106 18.3885L12.6129 20.35ZM12.2563 19.0193C12.1698 19.3547 11.8635 19.6009 11.5033 19.6009V22.4006C13.1712 22.4006 14.5693 21.2605 14.9672 19.7191L12.2563 19.0193ZM11.5033 19.6009C11.1429 19.6009 10.8366 19.3545 10.7502 19.0188L8.03883 19.7165C8.43583 21.2592 9.83452 22.4006 11.5033 22.4006V19.6009ZM6.05147 20.9401C7.49688 21.7746 9.27916 21.4853 10.3943 20.3475L8.39473 18.3878C8.15209 18.6354 7.76347 18.6957 7.45131 18.5155L6.05147 20.9401ZM4.39228 16.8866C3.96654 18.4202 4.60722 20.1063 6.05147 20.9401L7.45131 18.5155C7.13942 18.3354 6.99731 17.9692 7.08995 17.6355L4.39228 16.8866ZM2.06343 16.9503C2.89684 18.3938 4.58167 19.0345 6.11464 18.6101L5.36759 15.9119C5.03398 16.0043 4.66802 15.8622 4.48803 15.5504L2.06343 16.9503ZM2.65266 12.6108C1.5177 13.7261 1.22975 15.5063 2.06343 16.9503L4.48803 15.5504C4.30799 15.2386 4.36799 14.8504 4.61498 14.6077L2.65266 12.6108ZM0.600153 11.5003C0.600153 13.1695 1.74215 14.5685 3.28539 14.9651L3.98225 12.2535C3.64645 12.1672 3.39985 11.8608 3.39985 11.5003H0.600153ZM3.28865 8.03463C1.74375 8.43011 0.600153 9.82987 0.600153 11.5003H3.39985C3.39985 11.1395 3.6468 10.8329 3.98295 10.7469L3.28865 8.03463ZM2.06599 6.05033C1.23254 7.4939 1.5201 9.27346 2.65426 10.3888L4.61733 8.39267C4.37051 8.14994 4.3106 7.76192 4.49059 7.45017L2.06599 6.05033ZM6.11555 4.39003C4.58303 3.96651 2.8991 4.60732 2.06599 6.05033L4.49059 7.45017C4.67051 7.13855 5.03627 6.99641 5.3698 7.08858L6.11555 4.39003ZM6.0531 2.06047C4.609 2.89422 3.9683 4.58009 4.39379 6.11357L7.09156 5.36504C6.99897 5.03133 7.14108 4.66513 7.45295 4.48507L6.0531 2.06047ZM10.3938 2.65102C9.2786 1.51495 7.49763 1.22647 6.0531 2.06047L7.45295 4.48507C7.76491 4.30496 8.15324 4.36508 8.39593 4.6123L10.3938 2.65102ZM10.7503 3.98149C10.8369 3.64606 11.1431 3.39985 11.5033 3.39985V0.600153C9.83538 0.600153 8.43728 1.74041 8.03945 3.28183L10.7503 3.98149ZM11.5033 3.39985C11.8633 3.39985 12.1694 3.64578 12.2562 3.98093L14.9665 3.27921C14.5678 1.73914 13.1704 0.600153 11.5033 0.600153V3.39985Z"
                                  fill="#2A313B"
                                  mask="url(#path-1-outside-1_3204_13419)"
                                />
                                <path
                                  d="M8.32031 12.9518L9.22815 13.8676C9.49025 14.132 9.91765 14.132 10.1798 13.8676L14.6851 9.32275"
                                  stroke="white"
                                  stroke-width="1.67493"
                                  stroke-linecap="round"
                                />
                              </svg>
                            ) : (
                              ""
                            )}
                          </div>
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
