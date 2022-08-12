import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getIssue from "../../helpers/getIssue";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
function PullRequestIssueView(props) {
  const [issues, setIssues] = useState([]);
  useEffect(async () => {
    const array = [];
    for (var i = 0; i < props.issues.length; i++) {
      const res = await getIssue(props.issues[i].id);
      array.push(res);
    }
    console.log(array);
    setIssues(array);
  }, [props.issues.length]);
  return (
    <div className="pt-8 mb-4 ml-2">
      <div className="text-xs font-bold text-type-tertiary uppercase mb-2">
        ISSUES
      </div>
      <div className="h-48 overflow-y-scroll">
        {issues.map((i) => {
          return (
            <div
              tabIndex="0"
              className="collapse collapse-arrow border rounded-lg border-grey mb-2"
              key={i.id}
            >
              <input type="checkbox" className="peer" />
              <div className="collapse-title flex text-sm text-type">
                {i.title}
              </div>
              <div className="collapse-content">
                <div className="flex">
                  <div className="text-type-secondary font-bold text-xs mb-0.5">
                    OPENED ON{" "}
                    {dayjs.unix(parseInt(i.createdAt)).format("DD/MM/YYYY")} BY{" "}
                    {shrinkAddress(i.creator)}
                  </div>
                </div>
                <div className="mt-8 flex">
                  <div
                    className={
                      i.state == "OPEN"
                        ? " bg-green-900 rounded-full p-0.5 pl-6 w-20 text-type text-xs uppercase font-bold"
                        : " bg-red-900 rounded-full p-0.5 pl-4 ml-0.5 w-20 text-type text-xs uppercase font-bold"
                    }
                  >
                    {i.state}
                  </div>
                  <div className="flex ml-auto">
                    <div className="text-sm mr-2 font-bold text-type-secondary">
                      {i.comments.length}
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

export default connect(mapStateToProps, {})(PullRequestIssueView);
