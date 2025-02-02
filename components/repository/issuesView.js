import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getIssue from "../../helpers/getIssue";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import debounce from "lodash/debounce";
import { notify } from "reapop";
import { useRouter } from "next/router";
import { useApiClient } from "../../context/ApiClientContext";

function PullRequestIssueView(props) {
  const [issues, setIssues] = useState([]);
  const [isHovering, setIsHovering] = useState({ id: null });
  const router = useRouter();
  const { apiClient } = useApiClient();

  useEffect(() => {
    async function fetchIssues() {
      const array = [];
      for (var i = 0; i < props.issues.length; i++) {
        const res = await getIssue(
          apiClient,
          props.repoOwner,
          props.repositoryName,
          props.issues[i].iid
        );
        array.push(res);
      }
      setIssues(array);
    }
    fetchIssues();
  }, [props.issues.length]);
  return (
    <div
      className="pt-8 mb-4 ml-2"
      onMouseLeave={debounce(() => {
        setIsHovering({ id: null });
      }, 100)}
    >
      <div className="font-semibold mb-2 text-sm">Issues</div>
      <div className="">
        {issues.map((i, index) => {
          return (
            <div className="mb-2" key={index}>
              <div className="stroke-type-secondary hover:stroke-teal text-type-secondary hover:text-teal">
                <div className="flex">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-1"
                  >
                    <path
                      d="M1.93782 12.5L8 2L14.0622 12.5L1.93782 12.5Z"
                      strokeWidth="2"
                    />
                  </svg>
                  <div>
                    <div
                      className={"flex text-xs ml-2 pb-3"}
                      onMouseOver={debounce(() => {
                        setIsHovering(i);
                      }, 500)}
                    >
                      {i.title}
                    </div>
                  </div>
                </div>
                {isHovering.id == i.id ? (
                  <div
                    className="flex card bg-[#28313C] w-60 h-auto p-3 z-10 absolute rounded-lg hover:cursor-pointer"
                    onClick={() => {
                      if (window) {
                        window.open(
                          "/" +
                            router.query.userId +
                            "/" +
                            router.query.repositoryId +
                            "/issues/" +
                            i.iid
                        );
                      }
                    }}
                  >
                    <div className="flex">
                      <div className="avatar flex-none items-center w-1/6">
                        <div className={"w-6 h-6  rounded-full"}>
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                              i.creator.slice(-1)
                            }
                          />
                        </div>
                      </div>
                      <div className="text-xs text-type mt-0.5 w-5/6 leading-3">
                        {shrinkAddress(i.creator)} on{" "}
                        {dayjs
                          .unix(parseInt(i.createdAt))
                          .format("MMM DD, YYYY")}{" "}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="text-teal text-xs font-semibold w-1/6 leading-4">
                        #{i.iid}
                      </div>
                      <div className="w-5/6">
                        <div className="text-type text-xs font-semibold leading-3">
                          {i.title}
                        </div>
                        <div className="text-type-secondary text-xs mt-1 leading-4">
                          {i.description.split(" ").length > 15
                            ? i.description.split(" ").splice(0, 15).join(" ") +
                              "..."
                            : i.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : index === issues.length - 1 ? (
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

export default connect(mapStateToProps, { notify })(PullRequestIssueView);
