import { connect } from "react-redux";
import Link from "next/link";
import { useState, useEffect } from "react";
import RepositoryHeader from "../components/repository/header";
import RepositoryMainTabs from "../components/repository/mainTabs";
import pluralize from "./pluralize";
import AccountCard from "../components/account/card";
import SupportOwner from "../components/repository/supportOwner";
import BranchSelector from "../components/repository/branchSelector";
import CloneRepoInfo from "../components/repository/cloneRepoInfo";
import CommitDetailRow from "../components/repository/commitDetailRow";
import FileBrowser from "../components/repository/fileBrowser";

function GitopiaLive(props) {
  const [isMobile, setIsMobile] = useState(false);

  function detectWindowSize() {
    if (typeof window !== "undefined") {
      window.innerWidth <= 760 ? setIsMobile(true) : setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", detectWindowSize);
    }
    detectWindowSize();
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", detectWindowSize);
      }
    };
  });
  return (
    <div className="z-5 text-left bg-base-100 bg-repo-grad-v p-4 sm:p-12 rounded-md border border-grey container mx-auto max-w-screen-lg">
      <RepositoryHeader repository={props.repository} />
      <RepositoryMainTabs repository={props.repository} active="code" />

      <div className="flex mt-8 flex-col sm:flex-row">
        <div className="flex-none sm:w-64 sm:pr-8 divide-y divide-grey order-2 sm:order-1 mt-4 sm:mt-0">
          {!isMobile ? (
            <div className="pb-8">
              <div className="flex-1 text-left">About</div>

              <div className="text-xs mt-3">{props.repository.description}</div>

              <Link
                href={
                  "/" +
                  props.repository.owner.id +
                  "/" +
                  props.repository.name +
                  "#readme"
                }
                className="mt-6 flex items-center text-xs text-type-secondary font-semibold hover:text-green"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                >
                  <rect
                    x="4"
                    y="5"
                    width="8"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="12"
                    y="5"
                    width="8"
                    height="14"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span>README</span>
              </Link>
            </div>
          ) : (
            ""
          )}

          <div className="py-8">
            <div className="flex items-center">
              <a
                className="flex-1 text-left"
                href={
                  "/" +
                  props.repository.owner.id +
                  "/" +
                  props.repository.name +
                  "/releases"
                }
              >
                <span>Releases</span>
              </a>
              <a
                href={
                  "/" +
                  props.repository.owner.id +
                  "/" +
                  props.repository.name +
                  "/releases/tags"
                }
              >
                <span className="ml-2 text-xs text-type-secondary font-semibold">
                  {props.repository.tags.length}
                  <span className="ml-1 uppercase">
                    {pluralize("tag", props.repository.tags.length)}
                  </span>
                </span>
              </a>
            </div>
            <div className="text-xs mt-3">
              {props.repository.releases.length ? (
                <div>
                  <Link
                    href={
                      "/" +
                      props.repository.owner.id +
                      "/" +
                      props.repository.name +
                      "/releases/tag/" +
                      props.repository.releases[
                        props.repository.releases.length - 1
                      ].tagName
                    }
                    className="link link-primary no-underline hover:underline"
                  >
                    {props.repository.name +
                      " " +
                      props.repository.releases[
                        props.repository.releases.length - 1
                      ].tagName}
                  </Link>
                </div>
              ) : (
                <Link
                  href={
                    "/" +
                    props.repository.owner.id +
                    "/" +
                    props.repository.name +
                    "/releases/new"
                  }
                  className="mt-6 flex items-center text-xs text-type-secondary font-semibold uppercase hover:text-green"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="transparent"
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 7V17" stroke="currentColor" strokeWidth="2" />
                    <path d="M17 12H7" stroke="currentColor" strokeWidth="2" />
                    <circle
                      cx="12"
                      cy="12"
                      r="11"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span>Create a release</span>
                </Link>
              )}
            </div>
          </div>
          <div className="py-8">
            <div className="flex items-center pb-2">
              <div className="flex-1 text-left">
                <span>Collaborators</span>
              </div>
              <span className="ml-2 text-xs text-type-secondary font-semibold">
                {props.repository.collaborators.length + 1}
                <span className="ml-1 uppercase">
                  {pluralize(
                    "person",
                    props.repository.collaborators.length + 1
                  )}
                </span>
              </span>
            </div>

            <div className="text-xs mt-3 flex gap-2">
              {[
                props.repository.owner.id,
                ...props.repository.collaborators.map((c) => c.id),
              ].map((a, i) => (
                <div key={"assignee" + i}>
                  <AccountCard id={a} showAvatar={true} showId={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 order-1 sm:order-2 mt-4 max-w-3xl">
          <SupportOwner
            ownerAddress={props.repository.owner.address}
            repository={props.repository}
            isMobile={isMobile}
          />
          <div className="mt-8 flex justify-start">
            <div className="">
              <BranchSelector
                branches={props.repository.branches}
                tags={props.repository.tags}
                baseUrl={
                  "/" +
                  props.repository.owner.id +
                  "/" +
                  props.repository.name +
                  "/tree"
                }
                branchName={props.demoRepoBranch}
              />
            </div>
            <div className="ml-4">
              <div className="p-2 text-type-secondary text-xs font-semibold uppercase flex">
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
                {props.repository.branches.length}
                <span className="ml-1 uppercase">
                  {pluralize("branch", props.repository.branches.length)}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <div className="p-2 text-type-secondary text-xs font-semibold uppercase flex">
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
                {props.repository.tags.length}
                <span className="ml-1 uppercase">
                  {pluralize("tag", props.repository.tags.length)}
                </span>
              </div>
            </div>
            {!isMobile ? (
              <div className="flex-1 text-right">
                <CloneRepoInfo
                  remoteUrl={
                    "gitopia://" +
                    props.repository.owner.id +
                    "/" +
                    props.repository.name
                  }
                  repositoryId={props.repository.id}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="mt-4 border border-gray-700 rounded overflow-hidden">
            <CommitDetailRow
              commitDetail={props.commitDetail}
              commitLink={
                "/" +
                props.demoAddress +
                "/" +
                props.demoRepoName +
                "/commits/" +
                props.demoRepoBranch
              }
              maxMessageLength={isMobile ? 0 : 50}
              isMobile={isMobile}
            />
            <FileBrowser
              entityList={props.entityList}
              branchName={props.demoRepoBranch}
              baseUrl={"/" + props.demoAddress + "/" + props.demoRepoName}
              repoPath={[]}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(GitopiaLive);
