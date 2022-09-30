import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isCurrentUserEligibleToUpdate } from "../../store/actions/repository";

function RepositoryMainTabs({ repository, active, ...props }) {
  const [currentUserEditPermission, setCurrentUserEditPermission] = useState(
    false
  );

  const [hrefBase, setHrefBase] = useState(
    "/" + repository.owner.id + "/" + repository.name
  );

  useEffect(async () => {
    setCurrentUserEditPermission(
      await props.isCurrentUserEligibleToUpdate(repository)
    );
    setHrefBase("/" + repository.owner.id + "/" + repository.name);
  }, [repository, props.user]);

  return (
    <div className="">
      <div className="tabs relative z-10 whitespace-nowrap flex-nowrap overflow-x-auto overflow-y-hidden">
        <Link href={hrefBase}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "code" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
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
            </span>
            <span>Code</span>
          </a>
        </Link>
        <Link href={hrefBase + "/issues"}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "issues" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
              >
                <path
                  transform="translate(0,2)"
                  d="M5.93782 16.5L12 6L18.0622 16.5H5.93782Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                />
              </svg>
            </span>
            <span>Issues</span>
          </a>
        </Link>
        <Link href={hrefBase + "/pulls"}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "pulls" ? " tab-active" : "")
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
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

            <span>Pull Requests</span>
          </a>
        </Link>
        <Link href={hrefBase + "/insights"}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "insights" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  d="M5 7V20H10V7H5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M14 4V20H19V4H14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span>Insights</span>
          </a>
        </Link>
        {currentUserEditPermission ? (
          <Link href={hrefBase + "/settings"}>
            <a
              className={
                "tab tab-md tab-bordered" +
                (active === "settings" ? " tab-active" : "")
              }
            >
              <span className="icon mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>Settings</span>
            </a>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="border-b border-grey relative -top-px z-0" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  isCurrentUserEligibleToUpdate,
})(RepositoryMainTabs);
