import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notify } from "reapop";

import { initRepository } from "../../../store/actions/git";

import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import EmptyRepository from "../../../components/repository/emptyRepository";
import BranchSelector from "../../../components/repository/branchSelector";
import CommitDetailRow from "../../../components/repository/commitDetailRow";
import FileBrowser from "../../../components/repository/fileBrowser";
import Footer from "../../../components/footer";
import getBranchSha from "../../../helpers/getBranchSha";
import { isCurrentUserEligibleToUpdate } from "../../../store/actions/repository";
import AssigneeGroup from "../../../components/repository/assigneeGroup";
import useRepository from "../../../hooks/useRepository";
import CloneRepoInfo from "../../../components/repository/cloneRepoInfo";
import SupportOwner from "../../../components/repository/supportOwner";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryView(props) {
  const router = useRouter();
  const { repository } = useRepository();

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

  useEffect(async () => {
    console.log("repository", repository);
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

    setCurrentUserEditPermission(
      await props.isCurrentUserEligibleToUpdate(repository.owner.id)
    );
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
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            repoOwner={repository.owner.id}
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          {repository.branches.length ? (
            <div className="flex mt-8">
              <div className="flex-none w-64 pr-8 divide-y divide-grey">
                <div className="pb-8">
                  <div className="flex-1 text-left">About</div>

                  <div className="text-xs mt-3">{repository.description}</div>
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
                      <a className="mt-6 flex items-center text-xs text-type-secondary font-semibold hover:text-green">
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
                            stroke-width="2"
                          />
                          <rect
                            x="12"
                            y="5"
                            width="8"
                            height="14"
                            stroke="currentColor"
                            stroke-width="2"
                          />
                        </svg>

                        <span>README</span>
                      </a>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>

                <div className="py-8">
                  <Link
                    href={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/releases"
                    }
                  >
                    <a className="flex items-center">
                      <div className="flex-1 text-left">
                        <span>Releases</span>
                      </div>
                      <span className="ml-2 text-xs text-type-secondary font-semibold">
                        {repository.releases.length + " TAGS"}
                      </span>
                    </a>
                  </Link>
                  <div className="text-xs mt-3">
                    {repository.releases.length ? (
                      <div>
                        <Link
                          href={
                            "/" +
                            repository.owner.id +
                            "/" +
                            repository.name +
                            "/releases/tag/" +
                            repository.releases[repository.releases.length - 1]
                              .tagName
                          }
                        >
                          <a className="link link-primary no-underline hover:underline">
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
                        <a className="mt-6 flex items-center text-xs text-type-secondary font-semibold uppercase hover:text-green">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="transparent"
                            className="w-4 h-4 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 7V17"
                              stroke="currentColor"
                              stroke-width="2"
                            />
                            <path
                              d="M17 12H7"
                              stroke="currentColor"
                              stroke-width="2"
                            />
                            <circle
                              cx="12"
                              cy="12"
                              r="11"
                              stroke="currentColor"
                              stroke-width="2"
                            />
                          </svg>

                          <span>Create a release</span>
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
                    <a className="flex items-center">
                      <div className="flex-1 text-left">
                        <span>Collaborators</span>
                      </div>
                      <span className="ml-2 text-xs text-type-secondary font-semibold">
                        {repository.collaborators.length + " PEOPLE"}
                      </span>
                    </a>
                  </Link>

                  {repository.collaborators.length ? (
                    <div className="text-xs mt-3">
                      <AssigneeGroup
                        assignees={repository.collaborators.map((c) => c.id)}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="flex-1">
                <SupportOwner ownerAddress={repository.owner.id} />
                <div className="mt-8 flex justify-start">
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
                          stroke-width="2"
                        />
                        <path
                          d="M12.043 11.5293V9.5293"
                          stroke="currentColor"
                          stroke-width="2"
                        />
                      </svg>
                      {repository.tags.length} Tags
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <CloneRepoInfo
                      remoteUrl={
                        "gitopia://" +
                        repository.owner.id +
                        "/" +
                        repository.name
                      }
                    />
                  </div>
                </div>

                <div className="mt-4 border border-gray-700 rounded overflow-hidden max-w-3xl">
                  <CommitDetailRow
                    commitDetail={commitDetail}
                    commitLink={
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

export default connect(mapStateToProps, {
  notify,
  isCurrentUserEligibleToUpdate,
})(RepositoryView);
