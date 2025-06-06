import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import dayjs from "dayjs";
import find from "lodash/find";
import Head from "next/head";

import Header from "../../../../components/header";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import getRepositoryPullAll from "../../../../helpers/getRepositoryPullAll";
import AccountCard from "../../../../components/account/card";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import useRepository from "../../../../hooks/useRepository";
import renderPagination from "../../../../helpers/renderPagination";
import Label from "../../../../components/repository/label";
import parseFilters from "../../../../helpers/parseFilters";
import pullRequestStateClass from "../../../../helpers/pullRequestStateClass";
import useWindowSize from "../../../../hooks/useWindowSize";
import getPullRequestCommentAll from "../../../../helpers/getPullRequestCommentAll";
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

function RepositoryPullsView(props) {
  const { repository } = useRepository();
  const [allPulls, setAllPulls] = useState([]);
  const [filterText, setFilterText] = useState("is:open");
  const [filters, setFilters] = useState([{ key: "is", value: "open" }]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    limit: 10,
    countTotal: true,
  });
  const { isMobile } = useWindowSize();
  const { apiClient } = useApiClient();

  const getAllPulls = async () => {
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
      const data = await getRepositoryPullAll(
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
        if (data.PullRequest) {
          for (let i = 0; i < data.PullRequest.length; i++) {
            const c = await getPullRequestCommentAll(
              apiClient,
              repository.id,
              data.PullRequest[i].iid
            );
            if (c) {
              data.PullRequest[i].comments = c;
            } else {
              data.PullRequest[i].comments = [];
            }
          }
        }
        setAllPulls(data.PullRequest);
        if (data.pagination)
          setPagination({ ...pagination, ...data.pagination });
      }
    }
  };

  useEffect(() => {
    getAllPulls();
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
          <RepositoryMainTabs repository={repository} active="pulls" />
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
                  "/" + repository.owner.id + "/" + repository.name + "/compare"
                }
                className="btn btn-primary btn-sm btn-block"
                data-test="new-pull-request"
              >
                New Pull Request
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <div className="sm:bg-base-200 px-2 sm:px-4  py-2 rounded">
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
                          filterText.replace(
                            /is:open|is:closed|is:merged/gi,
                            ""
                          )
                        ).trim();
                        setFilterText(newFilterText);
                        setFilters(parseFilters(newFilterText));
                      }}
                    >
                      <span
                        className={
                          "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-" +
                          pullRequestStateClass("OPEN")
                        }
                      />
                      <span>Open</span>
                    </button>
                  </div>
                  <div
                    className={
                      "tab tab-xs" +
                      (filterText.match(/is:merged/) ? " tab-active-alt" : "")
                    }
                  >
                    <button
                      className="focus:outline-none font-semibold"
                      onClick={() => {
                        let newFilterText = (
                          "is:merged " +
                          filterText.replace(
                            /is:closed|is:open|is:merged/gi,
                            ""
                          )
                        ).trim();
                        setFilterText(newFilterText);
                        setFilters(parseFilters(newFilterText));
                      }}
                    >
                      <span
                        className={
                          "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-" +
                          pullRequestStateClass("MERGED")
                        }
                      />
                      <span>Merged</span>
                    </button>
                  </div>
                  <div
                    className={
                      "tab tab-xs" +
                      (filterText.match(/is:closed/) ? " tab-active-alt" : "")
                    }
                  >
                    <button
                      className="focus:outline-none font-semibold"
                      onClick={() => {
                        let newFilterText = (
                          "is:closed " +
                          filterText.replace(
                            /is:closed|is:open|is:merged/gi,
                            ""
                          )
                        ).trim();
                        setFilterText(newFilterText);
                        setFilters(parseFilters(newFilterText));
                      }}
                    >
                      <span
                        className={
                          "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-" +
                          pullRequestStateClass("CLOSED")
                        }
                      />
                      <span>Closed</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    className="btn btn-xs btn-ghost mr-2 my-px"
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
                  <div className="dropdown dropdown-end mr-2" tabIndex="0">
                    <button className="btn btn-xs btn-ghost">
                      <span>Author</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 mt-px"
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
                  <div className="dropdown dropdown-end mr-2" tabIndex="0">
                    <button className="btn btn-xs btn-ghost">
                      <span>Label</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 mt-px"
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
                                key={"label" + i}
                              >
                                <Label color={l.color} name={l.name}></Label>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                  <div className="dropdown dropdown-end mr-2" tabIndex="0">
                    <button className="btn btn-xs btn-ghost">
                      <span>Assignee</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 mt-px"
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
                  <div className="dropdown dropdown-end -mr-2" tabIndex="0">
                    <button className="btn btn-xs btn-ghost">
                      <span>Sort</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1 mt-px"
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
              {allPulls.map((i) => {
                let message = "",
                  link = "";
                switch (i.state) {
                  case "OPEN":
                    message =
                      "opened " + dayjs(i.createdAt * 1000).fromNow() + " by ";
                    link = <AccountCard id={i.creator} />;
                    break;
                  case "MERGED":
                    message =
                      "merged " + dayjs(i.mergedAt * 1000).fromNow() + " by ";
                    link = <AccountCard id={i.mergedBy} />;
                    break;

                  case "CLOSED":
                    message =
                      "closed " + dayjs(i.closedAt * 1000).fromNow() + " by ";
                    link = (
                      <a
                        className="link no-underline hover:underline"
                        href={"/" + i.closedBy}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shrinkAddress(i.closedBy)}
                      </a>
                    );
                }
                return (
                  <div className="text-left flex pt-4 px-4" key={i.iid}>
                    <div className="flex flex-1">
                      <span
                        className={
                          "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-" +
                          pullRequestStateClass(i.state)
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
                              "/pulls/" +
                              i.iid
                            }
                            className="btn-neutral"
                            data-test="select-open-pr"
                          >
                            {i.title}
                          </Link>
                        </div>
                        <div className="text-xs text-type-secondary">
                          #{i.iid} {message}
                          {link}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {!isMobile ? (
                        <div className="mt-1 flex gap-1">
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
                        {i.comments.length}
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

export default connect(mapStateToProps, {})(RepositoryPullsView);
