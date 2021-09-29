import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notify } from "reapop";

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

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    defaultBranch: "master",
    branches: [],
    forks: [],
    stargazers: [],
  });

  const [entityList, setEntityList] = useState([]);
  const [readmeFile, setReadmeFile] = useState(null);
  const [commitDetail, setCommitDetail] = useState({
    commit: { author: {}, message: "" },
    oid: "",
  });
  const [selectedBranch, setSelectedBranch] = useState(
    repository.defaultBranch
  );
  const [currentUserEditPermission, setCurrentUserEditPermission] = useState(
    false
  );
  const remoteUrl = "gitopia://" + repository.owner.id + "/" + repository.name;

  useEffect(async () => {
    const r = await getUserRepository(repository.owner.id, repository.name);
    console.log("repository", r);
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
    if (r) setRepository(r);
    if (typeof window !== "undefined" && r.branches.length) {
      let branchSha = getBranchSha(r.defaultBranch, r.branches);
      if (!branchSha) {
        setSelectedBranch(r.branches[0].name);
        branchSha = r.branches[0].sha;
      }
      const res = await initRepository(
        r.id,
        branchSha,
        r.name,
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
        r.id,
        branchSha,
        r.name,
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
  }, [props.user]);

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
                    <div className="dropdown dropdown-end w-full max-w-screen-md">
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
                      <div className="shadow-lg dropdown-content bg-base-300 rounded mt-1 overflow-hidden w-full p-4 text-left">
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
                        <div className=" mt-4">
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
                    baseUrl={"/" + repository.owner.id + "/" + repository.name}
                    repoPath={[]}
                  />
                </div>

                {readmeFile ? (
                  <div className="border border-gray-700 rounded overflow-hidden p-4 markdown-body mt-8">
                    <ReactMarkdown>{readmeFile}</ReactMarkdown>
                  </div>
                ) : (
                  <div>No readme file</div>
                )}
              </div>
              <div className="flex-none w-64 pl-8 divide-y divide-grey">
                <div className="pb-8">
                  <div className="flex-1 text-left px-3 mb-1">About</div>

                  <div className="text-xs px-3">{repository.description}</div>
                </div>

                <div className="py-8">
                  <div className="flex-1 text-left px-3 mb-1">Releases</div>

                  <div className="text-xs px-3">None yet</div>
                </div>

                <div className="py-8">
                  <div className="flex-1 text-left  px-3 mb-1">Packages</div>

                  <div className="text-xs px-3">None yet</div>
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
    selectedAddress: state.wallet.selectedAddress,
    user: state.user,
  };
};

export default connect(mapStateToProps, { notify })(RepositoryView);
