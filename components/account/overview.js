import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { ApolloProvider } from "@apollo/client";
import QueryTransaction from "../../helpers/queryTransaction";
import client from "../../helpers/apolloClient";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import ReactTooltip from "react-tooltip";
import dayjs from "dayjs";
import getRepository from "../../helpers/getRepository";
import getAnyRepositoryAll from "../../helpers/getAnyRepositoryAll";

function AccountOverview(props) {
  const [allRepos, setAllRepos] = useState([]);
  const [contributions, setContributions] = useState([{}]);
  const [totalContributions, setTotalContributions] = useState(0);

  const getAllRepos = async () => {
    let letter = "x";
    const pr = await getAnyRepositoryAll(props.userId);
    pr.sort((a, b) => a.updatedAt - b.updatedAt).reverse();
    const repos = pr.slice(0, 4);
    setAllRepos(repos);
    if (props.org.id) {
      letter = props.org.name.slice(0, 1);
    }
    // const link =
    //   process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === props.org.address
    //     ? "/logo-g.svg"
    //     : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
    //       letter;
    // setAvatarLink(link);
  };

  useEffect(getAllRepos, [props.user.creator, props.org.name]);

  const hrefBase = "/" + props.userId;

  return (
    <>
      <div className="mt-8 text-lg">Latest repositories</div>
      <div className="mt-4 mb-8 grid gap-4 grid-cols-2">
        {allRepos !== null
          ? allRepos.map((r) => {
              return (
                <div
                  className="flex border border-grey rounded-md p-4"
                  key={r.id}
                >
                  <div className="flex-1">
                    <Link href={hrefBase + "/" + r.name}>
                      <a className="text-base btn-link">{r.name}</a>
                    </Link>
                    <div
                      className={
                        "mt-2 text-sm mr-4" +
                        (r.description === ""
                          ? " italic text-type-secondary"
                          : "")
                      }
                    >
                      {r.description || "No Description"}
                    </div>
                  </div>
                  <div className="flex items-end text-type-secondary text-sm mr-4">
                    <svg
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                    >
                      <path
                        transform="translate(0,2)"
                        d="M5.93782 16.5L12 6L18.0622 16.5H5.93782Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                      />
                    </svg>

                    <span>{r.issuesCount}</span>
                  </div>
                  <div className="flex items-end text-type-secondary text-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                    >
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
                    </svg>

                    <span>{r.pullsCount}</span>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
      {!props.org.address ? (
        <div className="">
          <ApolloProvider client={client}>
            <QueryTransaction
              setContributions={setContributions}
              setTotalContributions={setTotalContributions}
            />
          </ApolloProvider>
          <div className="my-8">
            <div className="flex mb-5">
              <div className="text-sm text-type-secondary">
                {totalContributions}{" "}
                {totalContributions < 2 ? "contribution" : "contributions"} in
                the past year.
              </div>
              <div className="flex ml-auto text-xs text-grey-300 font-bold mr-1">
                <div>LESS</div>
                <div className="mt-1 bg-type-quaternary w-2.5 h-2.5 mr-1 ml-1"></div>
                <div className="mt-1 bg-teal w-2.5 h-2.5"></div>
                <div className="mt-1 bg-green w-2.5 h-2.5 mr-1 ml-1"></div>
                <div>MORE</div>
              </div>
            </div>
            <CalendarHeatmap
              startDate={new Date().setFullYear(new Date().getFullYear() - 1)}
              endDate={new Date()}
              values={contributions}
              gutterSize={5}
              showWeekdayLabels={true}
              classForValue={(value) => {
                if (!value) {
                  return `color-gitopia-empty`;
                }
                if (value.count > 1) {
                  return "color-gitopia-high";
                } else if (value.count == 1) {
                  return `color-gitopia-low`;
                }
                return `color-gitopia-empty`;
              }}
              tooltipDataAttrs={(value) => {
                if (!value.count) {
                  return {
                    "data-tip": `No contributions`,
                  };
                }
                return {
                  "data-tip": `${value.count} ${
                    value.count == 1 ? "contribution" : "contributions"
                  } on ${dayjs(value.date).format("DD MMM YYYY")}`,
                };
              }}
              //onClick={(value) => alert(`Clicked on value with count`)}
            />
            <ReactTooltip backgroundColor={"#6a737d"} />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    currentDashboard: state.user.currentDashboard,
  };
};

export default connect(mapStateToProps, {})(AccountOverview);
