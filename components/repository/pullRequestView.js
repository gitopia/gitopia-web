import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getPullRequest from "../../helpers/getPullRequest";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { notify } from "reapop";
import getRepositoryById from "../../helpers/getRepositoryById";
import { useRouter } from "next/router";

function IssuePullRequestView(props) {
  const [pulls, setPulls] = useState([]);
  const [isHovering, setIsHovering] = useState({ id: null });
  const router = useRouter();

  useEffect(() => {
    async function fetchPulls() {
      const array = [];
      let baseRepo, headRepo;
      for (var i = 0; i < props.pullRequests.length; i++) {
        const res = await getPullRequest(
          props.selectedAddress,
          props.repositoryName,
          props.pullRequests[i].iid
        );
        if (res) {
          baseRepo = await getRepositoryById(res.base.repositoryId);
          headRepo = await getRepositoryById(res.head.repositoryId);
          res.baseRepo = baseRepo;
          res.headRepo = headRepo;
          array.push(res);
        }
      }

      setPulls(array);
    }
    fetchPulls();
  }, [props.pullRequests.length]);

  return (
    <div
      className="pt-8 mb-4 ml-2"
      onMouseLeave={debounce(() => {
        setIsHovering({ id: null });
      }, 100)}
    >
      <div className="font-semibold mb-2 text-sm">Pull Requests</div>
      <div className="">
        {pulls.map((p, index) => {
          return (
            <div className="mb-2" key={index}>
              <div className="stroke-type-secondary hover:stroke-teal text-type-secondary hover:text-teal">
                <div className="flex">
                  <svg
                    width="12"
                    height="18"
                    viewBox="0 0 12 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M2.5 15.5V9M2.5 2.5V9M2.5 9H7C8.10457 9 9 9.89543 9 11V15.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="2.5" cy="15.5" r="2.5" fill="currentColor" />
                    <circle cx="2.5" cy="2.5" r="2.5" fill="currentColor" />
                    <path
                      d="M11.5 15.5C11.5 16.8807 10.3807 18 9 18C7.61929 18 6.5 16.8807 6.5 15.5C6.5 14.1193 7.61929 13 9 13C10.3807 13 11.5 14.1193 11.5 15.5Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div>
                    <div
                      className={"flex text-xs pb-3"}
                      onMouseOver={debounce(() => {
                        setIsHovering(p);
                      }, 500)}
                    >
                      {p.title}
                    </div>
                  </div>
                </div>
                {isHovering.id == p.id ? (
                  <div
                    className="flex card bg-[#28313C] w-72 h-auto p-3 z-10 absolute rounded-lg hover:cursor-pointer"
                    onClick={() => {
                      if (window) {
                        window.open(
                          "/" +
                            router.query.userId +
                            "/" +
                            router.query.repositoryId +
                            "/pulls/" +
                            p.iid
                        );
                      }
                    }}
                  >
                    <div className="flex">
                      <div className="avatar flex-none items-center w-1/6">
                        <div className={"w-7 h-7 rounded-full"}>
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                              p.creator.slice(-1)
                            }
                          />
                        </div>
                      </div>
                      <div className="text-xs text-type mt-1 w-5/6">
                        {shrinkAddress(p.creator)} on{" "}
                        {dayjs
                          .unix(parseInt(p.createdAt))
                          .format("MMM DD, YYYY")}{" "}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="text-teal text-xs font-semibold w-1/6">
                        #{p.iid}
                      </div>
                      <div className="w-5/6">
                        <div className="text-type text-xs font-semibold">
                          {p.title}
                        </div>
                        <div className="text-type-secondary text-xs mt-1">
                          {p.description.split(" ").length > 15
                            ? p.description.split(" ").splice(0, 15).join(" ") +
                              "..."
                            : p.description}
                        </div>
                        <div className="flex mt-4">
                          <div
                            className={
                              "flex text-xs box-border bg-white/10 h-6 p-0.5 rounded-md px-1.5"
                            }
                          >
                            <div className="text-type-secondary">
                              {p.baseRepo.name} :
                            </div>
                            <div className="ml-1 text-teal">
                              {p.base.branch}
                            </div>
                          </div>
                          <svg
                            width="12"
                            height="10"
                            viewBox="0 0 12 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="m-1.5"
                          >
                            <path
                              d="M11 5H1M1 5L5 1M1 5L5 9"
                              stroke="#ADBECB"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div
                            className={
                              "flex text-xs box-border bg-white/10 h-6 p-0.5 rounded-md px-1.5"
                            }
                          >
                            <div className="text-type-secondary">
                              {p.headRepo.name} :
                            </div>
                            <div className="ml-1 text-teal">
                              {p.head.branch}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === pulls.length - 1 ? (
                  ""
                ) : (
                  <svg
                    width="22"
                    height="2"
                    viewBox="0 0 22 2"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-6 mb-1"
                  >
                    <path d="M0 1L22 0.999998" stroke="#3E4051" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, { notify })(IssuePullRequestView);
