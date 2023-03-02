import shrinkAddress from "../../helpers/shrinkAddress";
import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { notify } from "reapop";
import pluralize from "../../helpers/pluralize";
import useWindowSize from "../../hooks/useWindowSize";

function RepositoryHeader({ repository, ...props }) {
  const [forkTargetShown, setForkTargetShown] = useState(false);

  const { isMobile } = useWindowSize();
  const [branchCount, setBranchCount] = useState(0);
  const [tagCount, setTagCount] = useState(0);
  const router = useRouter();

  const avatarLink =
    repository.owner.avatarUrl !== ""
      ? repository.owner.avatarUrl
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        repository.owner?.id?.slice(-1);

  const setCounts = () => {
    if (repository.id) {
      setBranchCount(repository.branches.length);
      setTagCount(repository.tags.length);
    }
  };
  useEffect(setCounts, [repository.id]);

  return (
    <div className="mb-1 sm:mb-8">
      <div className="flex flex-1 mb-4 sm:mb-0">
        <div className="avatar flex-none mr-1 sm:mr-8 items-center">
          <div
            className={
              "w-14 h-14 " +
              (repository.owner.type === "DAO" ? "rounded" : "rounded-full")
            }
          >
            <img src={avatarLink} />
          </div>
        </div>
        <div className="flex flex-1 text-primary text-md items-center">
          <div>
            <div className="flex">
              <div className="mr-2">
                <Link href={"/" + repository.owner.id} className="btn-link">
                  {shrinkAddress(repository.owner.id)}
                </Link>
              </div>
              <div className="mr-2 text-type-tertiary">/</div>
              <Link
                href={"/" + repository.owner.id + "/" + repository.name}
                className="btn-link"
                data-test="repo_name"
              >
                {repository.name}
              </Link>
              {repository.fork ? (
                <div className="badge badge-outline ml-2 mt-1 text-type-tertiary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    stroke="currentColor"
                  >
                    <path
                      d="M11.9998 12.5L6.49982 12.5L6.49982 5.5M11.9998 12.5L17.4998 12.5L17.4998 5.5M11.9998 12.5L11.9998 17.5"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path d="M14.4998 19.5C14.4998 20.8807 13.3805 22 11.9998 22C10.6191 22 9.49982 20.8807 9.49982 19.5C9.49982 18.1193 10.6191 17 11.9998 17C13.3805 17 14.4998 18.1193 14.4998 19.5Z" />
                    <circle cx="6.49982" cy="5.5" r="2.5" />
                    <circle cx="17.4998" cy="5.5" r="2.5" />
                  </svg>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex mt-2">
              <div className="text-type-secondary text-xs font-semibold uppercase flex">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                >
                  <g transform="scale(0.8)">
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
                  </g>
                </svg>
                {branchCount}
                <span className="ml-1 uppercase">
                  {pluralize("branch", branchCount)}
                </span>
              </div>
              <div className="ml-6 text-type-secondary text-xs font-semibold uppercase flex">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                >
                  <path
                    d="M7.04297 19.0293V9.36084L12.043 4.4333L17.043 9.36084V19.0293H7.04297Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12.043 11.5293V9.5293"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {tagCount}
                <span className="ml-1 uppercase">
                  {pluralize("tag", tagCount)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-sm divide-x divide-grey">
          {/*
        <div className="flex items-center text-xs uppercase text-type-secondary font-bold pr-8">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <circle cx="12" cy="8" r="4" strokeWidth="2" />
            <path
              d="M5.93782 19.5C6.5522 18.4359 7.43587 17.5522 8.5 16.9378C9.56413 16.3234 10.7712 16 12 16C13.2288 16 14.4359 16.3234 15.5 16.9378C16.5641 17.5522 17.4478 18.4359 18.0622 19.5"
              strokeWidth="2"
            />
          </svg>

          <span>Watchers - {repository.stargazers.length}</span>
        </div>
        <div className="flex items-center text-xs uppercase text-type-secondary font-bold px-8">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <g transform="scale(1.5,1.5) translate(2,2)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9011 5.95056C9.1074 5.00429 6.89683 2.79373 5.95056 0C5.00429 2.79373 2.79373 5.00429 0 5.95056C2.79373 6.89683 5.00429 9.1074 5.95056 11.9011C6.89683 9.1074 9.1074 6.89683 11.9011 5.95056Z"
              />
            </g>
          </svg>

          <span>Score - 0</span>
        </div>
        */}
          <div className="btn-group">
            <button
              className="btn btn-xs btn-ghost border-grey-50"
              data-test="fork-repo"
              onClick={() => {
                if (props.selectedAddress && repository?.allowForking) {
                  router.push(
                    ["", repository.owner.id, repository.name, "fork"].join("/")
                  );
                } else {
                  setForkTargetShown(true);
                }
              }}
              disabled={!branchCount}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-2"
                stroke="currentColor"
              >
                <path
                  d="M11.9998 12.5L6.49982 12.5L6.49982 5.5M11.9998 12.5L17.4998 12.5L17.4998 5.5M11.9998 12.5L11.9998 17.5"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M14.4998 19.5C14.4998 20.8807 13.3805 22 11.9998 22C10.6191 22 9.49982 20.8807 9.49982 19.5C9.49982 18.1193 10.6191 17 11.9998 17C13.3805 17 14.4998 18.1193 14.4998 19.5Z" />
                <circle cx="6.49982" cy="5.5" r="2.5" />
                <circle cx="17.4998" cy="5.5" r="2.5" />
              </svg>

              <span>FORKS</span>
            </button>
            <button
              className="btn btn-xs btn-ghost border-grey-50"
              onClick={() => {
                router.push(
                  "/" +
                    repository.owner.id +
                    "/" +
                    repository.name +
                    "/insights"
                );
              }}
              disabled={!branchCount}
            >
              {repository.forks.length}
            </button>
          </div>
          {/* <div className="flex items-center text-xs uppercase text-type-secondary font-bold pl-8">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            stroke="currentColor"
          >
            <path
              d="M11.9998 12.5L6.49982 12.5L6.49982 5.5M11.9998 12.5L17.4998 12.5L17.4998 5.5M11.9998 12.5L11.9998 17.5"
              strokeWidth="2"
              fill="none"
            />
            <path d="M14.4998 19.5C14.4998 20.8807 13.3805 22 11.9998 22C10.6191 22 9.49982 20.8807 9.49982 19.5C9.49982 18.1193 10.6191 17 11.9998 17C13.3805 17 14.4998 18.1193 14.4998 19.5Z" />
            <circle cx="6.49982" cy="5.5" r="2.5" />
            <circle cx="17.4998" cy="5.5" r="2.5" />
          </svg>

          <span>Forks - {repository.forks.length}</span>
        </div> */}
        </div>
        <input
          type="checkbox"
          checked={forkTargetShown}
          readOnly
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box max-w-sm">
            {repository.allowForking ? (
              <>
                {!props.selectedAddress ? (
                  <>
                    <p>Please login to fork repository</p>
                    <div className="modal-action">
                      <label
                        className="btn btn-sm"
                        onClick={() => {
                          setForkTargetShown(false);
                        }}
                      >
                        Ok
                      </label>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </>
            ) : repository?.owner?.address === props.selectedAddress ? (
              <>
                <p>
                  Forking is disabled on this repository, please allow in
                  settings -&gt; permisssions
                </p>
                <div className="modal-action mt-8">
                  <label
                    className="btn btn-sm"
                    onClick={() => {
                      setForkTargetShown(false);
                    }}
                  >
                    Cancel
                  </label>
                  <Link
                    className="btn btn-sm btn-primary"
                    href={[
                      "",
                      repository.owner.id,
                      repository.name,
                      "settings#permissions",
                    ].join("/")}
                  >
                    Goto Settings
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p data-test="forking_disabled">
                  Forking is disabled on this repository, please contact the
                  owner to allow forking.
                </p>
                <div className="modal-action mt-8">
                  <label
                    className="btn btn-sm"
                    onClick={() => {
                      setForkTargetShown(false);
                    }}
                  >
                    Ok
                  </label>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isMobile ? (
        <div className="text-xs m-4">{repository.description}</div>
      ) : (
        ""
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    dashboards: state.user.dashboards,
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  notify,
})(RepositoryHeader);
