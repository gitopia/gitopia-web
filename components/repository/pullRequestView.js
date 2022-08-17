import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getPullRequest from "../../helpers/getPullRequest";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
function IssuePullRequestView(props) {
  const [pulls, setPulls] = useState([]);
  useEffect(async () => {
    const array = [];
    for (var i = 0; i < props.pullRequests.length; i++) {
      const res = await getPullRequest(props.pullRequests[i].id);
      array.push(res);
    }
    console.log(array);
    setPulls(array);
  }, [props.pullRequests.length]);
  return (
    <div className="pt-8 mb-4 ml-2">
      <div className="text-xs font-bold text-type-tertiary uppercase mb-2">
        PULL REQUESTS
      </div>
      <div className="h-48 overflow-y-scroll">
        {pulls.map((p) => {
          return (
            <div
              tabIndex="0"
              className="collapse border rounded-lg border-grey mb-2"
              key={p.id}
            >
              <input type="checkbox" className="peer" />
              <div className="collapse-title flex text-sm text-type">
                {p.title}
              </div>
              <div className="collapse-content">
                <div className="flex">
                  <div className="mr-4">
                    <div className="text-type-secondary font-bold text-xs mb-0.5">
                      CREATOR
                    </div>
                    <div className="text-type text-xs">
                      {shrinkAddress(p.creator)}
                    </div>
                  </div>
                  <div>
                    <div className="text-type-secondary font-bold text-xs mb-0.5">
                      CREATION
                    </div>
                    <div className="text-type text-xs">
                      {" "}
                      {dayjs.unix(parseInt(p.createdAt)).fromNow()}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex">
                  {p.state == "OPEN" ? (
                    <div className=" bg-green-900 rounded-full p-0.5 pl-6 w-20 text-type text-xs uppercase font-bold">
                      {p.state}
                    </div>
                  ) : (
                    ""
                  )}
                  {p.state == "CLOSED" ? (
                    <div
                      className={
                        "bg-red-900 rounded-full p-0.5 pl-4 ml-0.5 w-20 text-type text-xs uppercase font-bold"
                      }
                    >
                      {" "}
                      {p.state}
                    </div>
                  ) : (
                    ""
                  )}
                  {p.state == "MERGED" ? (
                    <div
                      className={
                        "bg-purple-900 rounded-full p-0.5 pl-4 ml-0.5 w-20 text-type text-xs uppercase font-bold"
                      }
                    >
                      {" "}
                      {p.state}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="flex ml-auto">
                    <div className="text-sm mr-2 font-bold text-type-secondary">
                      {p.comments.length}
                    </div>
                    <svg
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-0.5"
                    >
                      <path
                        d="M8 13H1V1H18V13H15H14V14V16.2768L8.49614 13.1318L8.26556 13H8Z"
                        stroke="#ADBECB"
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                </div>
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

export default connect(mapStateToProps, {})(IssuePullRequestView);
