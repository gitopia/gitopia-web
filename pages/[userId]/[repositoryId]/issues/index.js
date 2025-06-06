import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import dayjs from "dayjs";
import find from "lodash/find";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import getRepositoryIssueAll from "../../../../helpers/getRepositoryIssueAll";
import getIssueCommentAll from "../../../../helpers/getIssueCommentAll";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import Footer from "../../../../components/footer";
import AccountCard from "../../../../components/account/card";
import useRepository from "../../../../hooks/useRepository";
import parseFilters from "../../../../helpers/parseFilters";
import renderPagination from "../../../../helpers/renderPagination";
import Label from "../../../../components/repository/label";
import useWindowSize from "../../../../hooks/useWindowSize";
import { useApiClient } from "../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryIssueView(props) {
  const { repository } = useRepository();

  const [allIssues, setAllIssues] = useState([]);
  const [filterText, setFilterText] = useState("is:open");
  const [filters, setFilters] = useState([{ key: "is", value: "open" }]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    limit: 10,
    countTotal: true,
  });
  const { isMobile } = useWindowSize();
  const { apiClient } = useApiClient();

  const getAllIssues = async () => {
    if (repository) {
      const option = {};
      if (filters.length) {
        for (let i = 0; i < filters.length; i++) {
          const { key, value } = filters[i];
          switch (key) {
            case "is":
              option["state"] = value.toUpperCase();
              break;
            case "no":
              if (value === "label") {
                option["labels"] = "NONE";
                delete option["labelIds"];
              }
              break;
            case "label":
              let l = find(repository.labels, { name: value });
              if (l) {
                option["labelIds"] = l.id;
                delete option["labels"];
              }
              break;
            case "author":
              option["createdBy"] = value;
              break;
            case "assignee":
              option["assignee"] = value;
              break;
            case "sort":
              option["sort"] = value.toUpperCase();
              break;
            default:
              option[key] = value;
          }
        }
      }
      console.log(option);
      const data = await getRepositoryIssueAll(
        apiClient,
        repository.owner.id,
        repository.name,
        option,
        {
          ...pagination,
          offset: (page - 1) * pagination.limit,
        }
      );
      console.log(data);
      if (data) {
        if (data.Issue) {
          for (let i = 0; i < data.Issue.length; i++) {
            const c = await getIssueCommentAll(
              apiClient,
              repository.id,
              data.Issue[i].iid
            );
            if (c) {
              data.Issue[i].comments = c;
            } else {
              data.Issue[i].comments = [];
            }
          }
          setAllIssues(data.Issue);
          if (data.pagination)
            setPagination({ ...pagination, ...data.pagination });
        }
      }
    }
  };

  useEffect(() => {
    getAllIssues();
  }, [repository, filters, page]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="issues" />
          <div className="flex mt-8">
            <div className="form-control flex-1 mr-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pr-16 input input-ghost input-sm input-bordered"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.code === "Enter") {
                      setFilters(parseFilters(e.target.value));
                    }
                  }}
                />
                <button
                  className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost"
                  onClick={() => {
                    setFilters(parseFilters(filterText));
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-none w-36">
              <Link
                href={
                  "/" +
                  repository.owner.id +
                  "/" +
                  repository.name +
                  "/issues/new"
                }
                className="btn btn-primary btn-sm btn-block"
                data-test="new-issue"
              >
                New Issue
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <div className="sm:bg-base-200 px-2 sm:px-4 py-2 rounded">
              <div className="text-left sm:flex">
                <div className="tabs tabs-boxed flex-1">
                  <div
                    className={
                      "tab tab-xs" +
                      (filterText.match(/is:open/) ? " tab-active-alt" : "")
                    }
                  >
                    <button
                      className="focus:outline-none font-semibold"
                      onClick={() => {
                        let newFilterText = (
                          "is:open " +
                          filterText.replace(/is:open|is:closed/gi, "")
                        ).trim();
                        setFilterText(newFilterText);
                        setFilters(parseFilters(newFilterText));
                      }}
                      data-test="open_issues"
                    >
                      <span
                        className={
                          "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                        }
                      />
                      <span>Open</span>
                    </button>
                  </div>
                  <div
                    className={
                      "tab tab-xs " +
                      (filterText.match(/is:closed/) ? " tab-active-alt" : "")
                    }
                  >
                    <button
                      className="focus:outline-none font-semibold"
                      onClick={() => {
                        let newFilterText = (
                          "is:closed " +
                          filterText.replace(/is:closed|is:open/gi, "")
                        ).trim();
                        setFilterText(newFilterText);
                        setFilters(parseFilters(newFilterText));
                      }}
                      data-test="closed_issues"
                    >
                      <span
                        className={
                          "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
                        }
                      />
                      <span>Closed</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="btn btn-xs btn-ghost mr-0.5 sm:mr-2 my-px"
                    onClick={() => {
                      let newFilterText = filterText
                        .replace(
                          /author:\w+|no:\w+|assignee:\w+|label:\w+|sort:\w+/g,
                          ""
                        )
                        .trim();
                      setFilterText(newFilterText);
                      setFilters(parseFilters(newFilterText));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 mt-px"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Clear All</span>
                  </button>
                  <div
                    className="dropdown dropdown-end mr-0 sm:mr-2"
                    tabIndex="0"
                  >
                    <button className="btn btn-xs btn-ghost">
                      <span>Author</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-0 sm:ml-1 mt-px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="dropdown-content shadow-lg bg-base-300 rounded mt-1">
                      <ul className="menu compact rounded">
                        {[
                          { id: repository.owner.id, permission: "CREATOR" },
                          ...repository.collaborators,
                        ].map((c, i) => {
                          return (
                            <li
                              className="normal-case font-normal"
                              onClick={() => {
                                let labelText = "author:" + c.id;
                                let newFilterText = (
                                  filterText.replace(/author:\w+/g, "").trim() +
                                  " " +
                                  labelText
                                ).trim();
                                setFilterText(newFilterText);
                                setFilters(parseFilters(newFilterText));
                              }}
                              key={"author" + i}
                            >
                              <a>{shrinkAddress(c.id)}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div
                    className="dropdown dropdown-end mr-0 sm:mr-2"
                    tabIndex="0"
                  >
                    <button className="btn btn-xs btn-ghost">
                      <span>Label</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-0.5 sm:ml-1 mt-px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="dropdown-content shadow-lg bg-base-300 rounded mt-1">
                      <ul className="menu compact rounded">
                        <li>
                          <a
                            className="normal-case font-normal pl-4"
                            onClick={() => {
                              let labelText = "no:label";
                              let newFilterText = (
                                filterText
                                  .replace(/label:\w+|no:\w+/g, "")
                                  .trim() +
                                " " +
                                labelText
                              ).trim();
                              setFilterText(newFilterText);
                              setFilters(parseFilters(newFilterText));
                            }}
                          >
                            Unlabeled
                          </a>
                        </li>

                        {repository.labels.map((l, i) => {
                          return (
                            <li
                              className="normal-case font-normal"
                              key={"label" + i}
                            >
                              <a
                                onClick={() => {
                                  let labelText = "label:" + l.name;
                                  let newFilterText = (
                                    filterText
                                      .replace(/label:\w+|no:\w+/g, "")
                                      .trim() +
                                    " " +
                                    labelText
                                  ).trim();
                                  setFilterText(newFilterText);
                                  setFilters(parseFilters(newFilterText));
                                }}
                              >
                                <Label color={l.color} name={l.name}></Label>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div
                    className="dropdown dropdown-end mr-0 sm:mr-2"
                    tabIndex="0"
                  >
                    <button className="btn btn-xs btn-ghost">
                      <span>Assignee</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-0.5 sm:ml-1 mt-px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="dropdown-content shadow-lg bg-base-300 rounded mt-1">
                      <ul className="menu compact rounded">
                        {[
                          { id: repository.owner.id, permission: "CREATOR" },
                          ...repository.collaborators,
                        ].map((c, i) => {
                          return (
                            <li
                              className="normal-case font-normal"
                              onClick={() => {
                                let labelText = "assignee:" + c.id;
                                let newFilterText = (
                                  filterText
                                    .replace(/assignee:\w+/g, "")
                                    .trim() +
                                  " " +
                                  labelText
                                ).trim();
                                setFilterText(newFilterText);
                                setFilters(parseFilters(newFilterText));
                              }}
                              key={"assignee" + i}
                            >
                              <a>{shrinkAddress(c.id)}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div
                    className="dropdown dropdown-end mr-0 sm:mr-2"
                    tabIndex="0"
                  >
                    <button className="btn btn-xs btn-ghost">
                      <span>Sort</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-0.5 sm:ml-1 mt-px"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="dropdown-content shadow-lg bg-base-300 rounded mt-1">
                      <ul className="menu compact rounded">
                        <li
                          className="font-normal normal-case"
                          onClick={() => {
                            let labelText = "sort:asc";
                            let newFilterText = (
                              filterText.replace(/sort:\w+/g, "").trim() +
                              " " +
                              labelText
                            ).trim();
                            setFilterText(newFilterText);
                            setFilters(parseFilters(newFilterText));
                          }}
                        >
                          <a>Ascending</a>
                        </li>
                        <li
                          className="font-normal normal-case"
                          onClick={() => {
                            let labelText = "sort:desc";
                            let newFilterText = (
                              filterText.replace(/sort:\w+/g, "").trim() +
                              " " +
                              labelText
                            ).trim();
                            setFilterText(newFilterText);
                            setFilters(parseFilters(newFilterText));
                          }}
                        >
                          <a>Decending</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 divide-y divide-grey">
              {allIssues.map((i) => {
                return (
                  <div className="text-left flex pt-4 px-4" key={i.iid}>
                    <div className="flex flex-1">
                      <span
                        className={
                          "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                          (i.state === "OPEN" ? "bg-green-900" : "bg-red-900")
                        }
                      />
                      <div>
                        <div>
                          <Link
                            href={
                              "/" +
                              repository.owner.id +
                              "/" +
                              repository.name +
                              "/issues/" +
                              i.iid
                            }
                            className="btn-neutral"
                          >
                            {i.title}
                          </Link>
                        </div>
                        <div className="text-xs text-type-secondary">
                          #{i.iid}{" "}
                          {i.state === "OPEN"
                            ? "opened " +
                              dayjs(i.createdAt * 1000).fromNow() +
                              " by "
                            : "closed " +
                              dayjs(i.closedAt * 1000).fromNow() +
                              " by "}
                          {i.state === "OPEN" ? (
                            <AccountCard id={i.creator} />
                          ) : (
                            <AccountCard id={i.closedBy} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {i.bounties?.length > 0 ? (
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-2"
                        >
                          <rect
                            width="32"
                            height="32"
                            rx="16"
                            fill="url(#paint0_linear_2419_12505)"
                          />
                          <circle
                            cx="15.9993"
                            cy="16"
                            r="12.8333"
                            stroke="#13181E"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.9738 15.6158C17.2195 15.6158 18.2293 14.6093 18.2293 13.3677C18.2293 12.1262 17.2195 11.1197 15.9738 11.1197C14.7282 11.1197 13.7184 12.1262 13.7184 13.3677C13.7184 14.6093 14.7282 15.6158 15.9738 15.6158ZM15.9738 17.3286C18.1685 17.3286 19.9477 15.5553 19.9477 13.3677C19.9477 11.1802 18.1685 9.40686 15.9738 9.40686C13.7792 9.40686 12 11.1802 12 13.3677C12 15.5553 13.7792 17.3286 15.9738 17.3286Z"
                            fill="#13181E"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.0157 20.4984C16.6494 20.4984 17.2572 20.2475 17.7053 19.8008C18.1534 19.3542 18.4051 18.7483 18.4051 18.1167H19.9981C19.9981 19.1694 19.5785 20.1791 18.8317 20.9235C18.0849 21.6679 17.0719 22.0861 16.0157 22.0861C14.9595 22.0861 13.9465 21.6679 13.1996 20.9235C12.4528 20.1791 12.0332 19.1694 12.0332 18.1167H13.6262C13.6262 18.7483 13.8779 19.3542 14.3261 19.8008C14.7742 20.2475 15.3819 20.4984 16.0157 20.4984Z"
                            fill="#13181E"
                          />
                          <path
                            d="M15.0957 8H16.8904V10.064H15.0957V8Z"
                            fill="#13181E"
                          />
                          <path
                            d="M15.0957 21.6226H16.8904V23.5031H15.0957V21.6226Z"
                            fill="#13181E"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_2419_12505"
                              x1="27.3333"
                              y1="5.33333"
                              x2="3.33333"
                              y2="27.3333"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#AD731D" />
                              <stop offset="1" stopColor="#F2D56E" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : (
                        ""
                      )}
                      {!isMobile ? (
                        <div className={"mt-1 flex gap-1"}>
                          {i.assignees.map((a, i) => (
                            <div key={"assignee" + i}>
                              <AccountCard
                                id={a}
                                showAvatar={true}
                                showId={false}
                                avatarSize="sm"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="ml-4 flex text-type-secondary items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                        {i.comments.filter((c) => !c.system).length}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 flex btn-group justify-center">
            {renderPagination(pagination, setPage, page)}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(RepositoryIssueView);
