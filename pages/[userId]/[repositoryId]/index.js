import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notify } from "reapop";
import ClickAwayListener from "react-click-away-listener";
import { initRepository } from "../../../store/actions/git";

import getUserRepository from "../../../helpers/getUserRepository";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import EmptyRepository from "../../../components/repository/emptyRepository";
import BranchSelector from "../../../components/repository/branchSelector";
import Breadcrumbs from "../../../components/repository/breadcrumbs";
import CommitDetailRow from "../../../components/repository/commitDetailRow";
import FileBrowser from "../../../components/repository/fileBrowser";
import Footer from "../../../components/footer";
import getBranchSha from "../../../helpers/getBranchSha";
import { isCurrentUserEligibleToUpdate } from "../../../store/actions/repository";
import AssigneeGroup from "../../../components/repository/assigneeGroup";
import useRepository from "../../../hooks/useRepository";
import SupportProject from "../../../components/repository/supportProject";
import { transferToWallet } from "../../../store/actions/wallet";
import shrinkAddress from "../../../helpers/shrinkAddress";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryView(props) {
  const router = useRouter();
  const repository = useRepository();

  const [entityList, setEntityList] = useState([]);
  const [popup, setPopup] = useState(false);
  const [readmeFile, setReadmeFile] = useState(null);
  const [commitDetail, setCommitDetail] = useState({
    commit: { author: {}, message: "" },
    oid: "",
  });
  const [selectedBranch, setSelectedBranch] = useState(
    repository.defaultBranch
  );
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);
  const remoteUrl = "gitopia://" + repository.owner.id + "/" + repository.name;

  useEffect(async () => {
    console.log("repository", repository);
    let userPermission = false;
    if (props.selectedAddress === router.query.userId) {
      userPermission = true;
    } else if (props.user) {
      props.user.organizations.every((o) => {
        if (o.id === router.query.userId) {
          userPermission = true;
          return false;
        }
        return true;
      });
    }
    setCurrentUserEditPermission(userPermission);
    if (typeof window !== "undefined" && repository.branches.length) {
      let branchSha = getBranchSha(
        repository.defaultBranch,
        repository.branches
      );
      if (!branchSha) {
        setSelectedBranch(repository.branches[0].name);
        branchSha = repository.branches[0].sha;
      }
      const res = await initRepository(
        repository.id,
        branchSha,
        repository.name,
        router.query.userId,
        []
      );
      if (res) {
        if (res.commit) {
          setCommitDetail(res.commit);
        }
        if (res.entity) {
          if (res.entity.tree) {
            setEntityList(res.entity.tree);
          }
        } else {
          console.log("Entity Not found");
        }
      } else {
        console.log("Repo Not found");
      }
      const readme = await initRepository(
        repository.id,
        branchSha,
        repository.name,
        router.query.userId,
        ["README.md"]
      );

      if (readme) {
        if (readme.entity) {
          if (readme.entity.blob) {
            try {
              let decodedFile = new TextDecoder().decode(readme.entity.blob);
              setReadmeFile(decodedFile);
            } catch (e) {
              console.error(e);
              setReadmeFile(null);
            }
          }
        } else {
          console.log("Entity Not found");
        }
      }
    }
  }, [props.user, repository.id]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
            showSettings={currentUserEditPermission}
          />

          {repository.branches.length ? (
            <div>
              <div className="border border-gray-700 rounded p-3 mt-8">
                <div className="flex">
                  <div className="self-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.9991 14.9935C15.306 14.9935 17.176 13.2085 17.176 11.0065C17.176 8.80454 15.306 7.01949 12.9991 7.01949C10.6923 7.01949 8.82227 8.80454 8.82227 11.0065C8.82227 13.2085 10.6923 14.9935 12.9991 14.9935Z"
                        stroke="#66CE67"
                        stroke-width="1.5"
                      />
                      <path
                        d="M17.178 18.9806C17.178 16.7786 15.3079 14.9936 13.0011 14.9936C10.6943 14.9936 8.82422 16.7786 8.82422 18.9806"
                        stroke="#66CE67"
                        stroke-width="1.5"
                      />
                      <circle cx="13" cy="13" r="12.5" stroke="#66CE67" />
                    </svg>
                  </div>
                  <div className="pl-3 self-center">
                    <div className="text-xs text-gray-400 font-bold h-1/4">
                      REPOSITORY OWNER
                    </div>
                    <div className="text-base mr-14 h-3/4">
                      {shrinkAddress(repository.owner.id)}
                    </div>
                  </div>
                  <div className="self-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="13"
                        cy="13"
                        r="12.4167"
                        stroke="#883BE6"
                        stroke-width="1.16667"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M13.0006 12.5184C14.3352 12.5184 15.4171 11.4365 15.4171 10.1019C15.4171 8.7673 14.3352 7.68538 13.0006 7.68538C11.666 7.68538 10.5841 8.7673 10.5841 10.1019C10.5841 11.4365 11.666 12.5184 13.0006 12.5184ZM13.0006 14.2314C15.2813 14.2314 17.1301 12.3826 17.1301 10.1019C17.1301 7.82125 15.2813 5.9724 13.0006 5.9724C10.7199 5.9724 8.87109 7.82125 8.87109 10.1019C8.87109 12.3826 10.7199 14.2314 13.0006 14.2314Z"
                        fill="#883BE6"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.5841 15.1195C10.5841 15.7593 10.8406 16.3714 11.2947 16.8215C11.7485 17.2713 12.3623 17.5225 13.0006 17.5225C13.6389 17.5225 14.2527 17.2713 14.7065 16.8215C15.1606 16.3714 15.4171 15.7593 15.4171 15.1195H17.1301C17.1301 16.2004 16.697 17.2386 15.9234 18.0053C15.1496 18.7723 14.0984 19.2046 13.0006 19.2046C11.9028 19.2046 10.8516 18.7723 10.0778 18.0053C9.30425 17.2386 8.87109 16.2004 8.87109 15.1195H10.5841Z"
                        fill="#883BE6"
                      />
                      <path
                        d="M12.1973 4.74383H13.8455V6.39206H12.1973V4.74383Z"
                        fill="#883BE6"
                      />
                      <path
                        d="M12.1973 18.7537H13.8455V20.4019H12.1973V18.7537Z"
                        fill="#883BE6"
                      />
                    </svg>
                  </div>
                  <div className="pl-3 self-center">
                    <div className="text-xs text-gray-400 font-bold h-1/4">
                      LORE IN PROJECTS
                    </div>
                    <div className="text-base h-3/4">
                      {props.loreBalance / 1000000}
                    </div>
                  </div>
                  <div className="ml-auto self-center pr-5">
                    <button
                      class="text-green-900 font-bold"
                      onClick={() => setPopup(true)}
                    >
                      SUPPORT PROJECT
                    </button>
                  </div>
                </div>
                {popup && (
                  <ClickAwayListener onClickAway={() => setPopup(false)}>
                    <div className={"popup"}>
                      <SupportProject
                        setPopup={setPopup}
                        transferToWallet={props.transferToWallet}
                        ownerId={repository.owner.id}
                      />
                    </div>
                  </ClickAwayListener>
                )}
              </div>
              <div className="flex mt-8">
                <div className="flex-1">
                  <div className="flex justify-start">
                    <div className="">
                      <BranchSelector
                        branches={repository.branches}
                        tags={repository.tags}
                        baseUrl={
                          "/" +
                          repository.owner.id +
                          "/" +
                          repository.name +
                          "/tree"
                        }
                        branchName={selectedBranch}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="p-2 text-type-secondary text-xs font-bold uppercase flex">
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
                            <circle
                              cx="8.5"
                              cy="18.5"
                              r="2.5"
                              fill="currentColor"
                            />
                            <circle
                              cx="8.5"
                              cy="5.5"
                              r="2.5"
                              fill="currentColor"
                            />
                            <path
                              d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                              fill="currentColor"
                            />
                          </g>
                        </svg>
                        {repository.branches.length} Branches
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="p-2 text-type-secondary text-xs font-bold uppercase flex">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            transform="scale(0.8)
                          translate(0, 1)"
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        {repository.tags.length} Tags
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <div
                        className="dropdown dropdown-end outline-none"
                        tabIndex="0"
                      >
                        <button
                          className="btn btn-sm btn-primary w-26"
                          tabIndex="0"
                        >
                          <div className="flex-1 text-left px-2">Clone</div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div className="shadow-lg dropdown-content bg-base-300 rounded mt-1 overflow-hidden w-max p-4 text-left">
                          <div className="flex items-center p-2 rounded text-sm alert-warning">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="mr-2">
                              Install gitopia remote helper first.
                            </span>
                            <a
                              href="https://docs.gitopia.com/git-remote-gitopia"
                              target="_blank"
                              className="link link-primary no-underline hover:underline"
                            >
                              Learn more
                            </a>
                          </div>
                          <div className="mt-4">
                            <div className="relative w-full mt-4">
                              <input
                                rows={2}
                                cols={120}
                                name="repository-url"
                                type="text"
                                value={"git clone " + remoteUrl}
                                readOnly={true}
                                className="w-full input input-ghost input-sm input-bordered py-2 pr-12"
                              />
                              <button
                                className="absolute right-0 top-0 btn btn-ghost btn-sm"
                                onClick={(e) => {
                                  navigator.clipboard.writeText(
                                    "git clone " + remoteUrl
                                  );
                                  props.notify("Copied to clipboard", "info");
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 border border-gray-700 rounded overflow-hidden max-w-3xl">
                    <CommitDetailRow
                      commitDetail={commitDetail}
                      commitInBranchLink={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/commits/" +
                        selectedBranch
                      }
                    />
                    <FileBrowser
                      entityList={entityList}
                      branchName={selectedBranch}
                      baseUrl={
                        "/" + repository.owner.id + "/" + repository.name
                      }
                      repoPath={[]}
                    />
                  </div>

                  {readmeFile ? (
                    <div
                      id="readme"
                      className="border border-gray-700 rounded overflow-hidden p-4 markdown-body mt-8"
                    >
                      <ReactMarkdown>{readmeFile}</ReactMarkdown>
                    </div>
                  ) : (
                    <div>No readme file</div>
                  )}
                </div>
                <div className="flex-none w-64 pl-8 divide-y divide-grey">
                  <div className="pb-8">
                    <div className="flex-1 text-sm font-semibold leading-8 text-left px-3">
                      About
                    </div>

                    <div className="text-xs px-3 mt-3">
                      {repository.description}
                    </div>
                    {readmeFile ? (
                      <Link
                        href={
                          "/" +
                          repository.owner.id +
                          "/" +
                          repository.name +
                          "#readme"
                        }
                      >
                        <a className="link px-3 mt-3 flex items-center text-xs no-underline hover:text-green">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1 mt-px"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          <span>Readme</span>
                        </a>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="py-8">
                    {/* <div className="flex-1 text-sm font-semibold leading-8 text-left px-3">
                    Releases
                  </div> */}
                    <Link
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/releases"
                      }
                    >
                      <a className={"btn btn-sm btn-block btn-ghost"}>
                        <div className="flex-1 text-left">
                          <span>Releases</span>
                          <span className="ml-2 badge badge-sm">
                            {repository.releases.length}
                          </span>
                        </div>
                      </a>
                    </Link>
                    <div className="text-xs px-3 mt-3">
                      {repository.releases.length ? (
                        <div>
                          <Link
                            href={
                              "/" +
                              repository.owner.id +
                              "/" +
                              repository.name +
                              "/releases/tag/" +
                              repository.releases[
                                repository.releases.length - 1
                              ].tagName
                            }
                          >
                            <a className="link link-accent no-underline hover:underline">
                              {repository.name +
                                " " +
                                repository.releases[
                                  repository.releases.length - 1
                                ].tagName}
                            </a>
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={
                            "/" +
                            repository.owner.id +
                            "/" +
                            repository.name +
                            "/releases/new"
                          }
                        >
                          <a className="link mt-3 flex items-center text-xs no-underline hover:text-green">
                            Create a release
                          </a>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="py-8">
                    <Link
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/settings#collaborators"
                      }
                    >
                      <a className={"btn btn-sm btn-block btn-ghost"}>
                        <div className="flex-1 text-left">
                          <span>Collaborators</span>
                          <span className="ml-2 badge badge-sm">
                            {repository.collaborators.length}
                          </span>
                        </div>
                      </a>
                    </Link>

                    <div className="text-xs px-3 mt-3">
                      {repository.collaborators.length ? (
                        <AssigneeGroup
                          assignees={repository.collaborators.map((c) => c.id)}
                        />
                      ) : (
                        "None yet"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentUserEditPermission ? (
            <EmptyRepository repository={repository} />
          ) : (
            <div className="pt-8 text-type-secondary">Empty repository</div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    wallets: state.wallet.wallets,
    activeWallet: state.wallet.activeWallet,
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
    loreBalance: state.wallet.loreBalance,
  };
};

export default connect(mapStateToProps, {
  notify,
  transferToWallet,
})(RepositoryView);
