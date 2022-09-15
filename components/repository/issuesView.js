import { connect } from "react-redux";
import { useState, useEffect } from "react";
import getIssue from "../../helpers/getIssue";
import shrinkAddress from "../../helpers/shrinkAddress";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { createComment } from "../../store/actions/repository";
import { notify } from "reapop";

function PullRequestIssueView(props) {
  const [issues, setIssues] = useState([]);
  const [isHovering, setIsHovering] = useState({ id: null });
  const [comment, setComment] = useState("");
  const [validateCommentError, setValidateCommentError] = useState("");

  const validateComment = async (comment) => {
    setValidateCommentError(null);
    if (comment.trim().length === 0) {
      setValidateCommentError("Comment cannot be empty");
    }
  };

  const createComment = async (id) => {
    const res = await props.createComment({
      parentId: id,
      body: comment,
      commentType: "ISSUE",
    });
    if (res && res.code === 0) {
      setComment("");
      props.notify("Comment added to issue #" + id, "info");
    }
  };

  useEffect(async () => {
    const array = [];
    for (var i = 0; i < props.issues.length; i++) {
      const res = await getIssue(props.issues[i].id);
      array.push(res);
    }
    setIssues(array);
  }, [props.issues.length]);
  return (
    <div
      className="pt-8 mb-4 ml-2"
      onMouseLeave={debounce(() => {
        setIsHovering({ id: null });
        setComment("");
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
                      stroke-width="2"
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
                  <div className="flex card bg-grey-500 w-52 h-48 p-3">
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
                        {dayjs.unix(parseInt(i.createdAt)).format("DD/MM/YYYY")}{" "}
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <div className="text-teal text-xs font-semibold w-1/6 leading-4">
                        #{i.iid}
                      </div>
                      <div className="text-type text-xs font-semibold w-5/6 leading-3">
                        {i.title}
                      </div>
                    </div>

                    <div className="ml-8 text-type-secondary text-xs mt-1 leading-4">
                      {i.description.split(" ").length > 15
                        ? i.description.split(" ").splice(0, 15).join(" ") +
                          "..."
                        : i.description}
                    </div>
                    <div className="relative mt-auto">
                      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none my-2">
                        <div className="avatar flex-none items-center">
                          <div className={"w-6 h-6 rounded-full"}>
                            <img
                              src={
                                "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                                props.selectedAddress.slice(-1)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Leave a comment"
                        className="input input-bordered input-sm w-full max-w-xs text-xs pl-10 h-10 leading-3"
                        onKeyUp={async (e) => {
                          if (e.code === "Enter" || e.code === "NumpadEnter") {
                            createComment(isHovering.id);
                            setIsHovering({ id: null });
                            setComment("");
                          } else {
                            await validateComment(e.target.value);
                          }
                        }}
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                        }}
                      />
                    </div>
                    {validateCommentError ? (
                      <label className="label">
                        <span className="label-text-alt text-error">
                          {validateCommentError}
                        </span>
                      </label>
                    ) : (
                      ""
                    )}
                  </div>
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
  PullRequestIssueView
);
