import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getPullRequest from "../../helpers/getPullRequest";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { createComment } from "../../store/actions/repository";
import { notify } from "reapop";
import getRepositoryById from "../../helpers/getRepositoryById";

function IssuePullRequestView(props) {
  const [pulls, setPulls] = useState([]);
  const [isHovering, setIsHovering] = useState({ id: null });

  useEffect(() => {
    async function fetchPulls() {
      const array = [];
      let baseRepo, headRepo;
      for (var i = 0; i < props.pullRequests.length; i++) {
        const res = await getPullRequest(props.pullRequests[i].id);
        if (res) {
          baseRepo = await getRepositoryById(res.base.repositoryId);
          headRepo = await getRepositoryById(res.head.repositoryId);
        }
        res.baseRepo = baseRepo;
        res.headRepo = headRepo;
        array.push(res);
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
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                      stroke="#ADBECB"
                      strokeWidth="2"
                    />
                    <circle cx="8.5" cy="18.5" r="2.5" fill="#ADBECB" />
                    <circle cx="8.5" cy="5.5" r="2.5" fill="#ADBECB" />
                    <path
                      d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                      fill="#ADBECB"
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
                  <div className="flex card bg-[#28313c] w-72 h-auto p-3 z-10 absolute rounded-lg">
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

export default connect(mapStateToProps, { createComment, notify })(
  IssuePullRequestView
);
