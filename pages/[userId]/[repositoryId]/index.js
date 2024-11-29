import Head from "next/head";
import Header from "../../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import MarkdownWrapper from "../../../components/markdownWrapper";
import { notify } from "reapop";
import {
  BookOpenText,
  GitBranch,
  Tag,
  Plus,
  Shield,
  GitCommit,
} from "lucide-react";

import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import EmptyRepository from "../../../components/repository/emptyRepository";
import BranchSelector from "../../../components/repository/branchSelector";
import CommitDetailRow from "../../../components/repository/commitDetailRow";
import FileBrowser from "../../../components/repository/fileBrowser";
import Footer from "../../../components/footer";
import getBranchSha from "../../../helpers/getBranchSha";
import {
  isCurrentUserEligibleToUpdate,
  updateRepositoryDescription,
} from "../../../store/actions/repository";
import useRepository from "../../../hooks/useRepository";
import CloneRepoInfo from "../../../components/repository/cloneRepoInfo";
import SupportOwner from "../../../components/repository/supportOwner";
import getContent from "../../../helpers/getContent";
import getCommitHistory from "../../../helpers/getCommitHistory";
import pluralize from "../../../helpers/pluralize";
import useWindowSize from "../../../hooks/useWindowSize";
import getAnyRepository from "../../../helpers/getAnyRepository";
import getAllRepositoryBranch from "../../../helpers/getAllRepositoryBranch";
import getAllRepositoryTag from "../../../helpers/getAllRepositoryTag";
import getUser from "../../../helpers/getUser";
import getDao from "../../../helpers/getDao";
import validAddress from "../../../helpers/validAddress";
import TextInput from "../../../components/textInput";
import AccountCard from "../../../components/account/card";
import { useRef } from "react";
import atob from "../../../helpers/atob";
import { useApiClient } from "../../../context/ApiClientContext";

export async function getStaticProps({ params }) {
  try {
    const db = (await import("../../../helpers/getSeoDatabase")).default;
    let r;
    if (validAddress.test(params.userId)) {
      r = JSON.parse(
        (
          await db
            .first("*")
            .from("Repositories")
            .where({ name: params.repositoryId, ownerAddress: params.userId })
        ).data
      );
    } else {
      r = JSON.parse(
        (
          await db
            .first("*")
            .from("Repositories")
            .where({ name: params.repositoryId, ownerUsername: params.userId })
        ).data
      );
    }

    if (r) {
      // let branchSha = getBranchSha(r.defaultBranch, r.branches, r.tags);

      // const entitiesRes = await getContent(r.id, branchSha, null, null);

      // const commitHistory = await getCommitHistory(r.id, branchSha, null, 1);

      // const readmeRegex = new RegExp(/^README/gi);
      // let readmeFile = null;
      // for (let i = 0; i < entitiesRes?.content?.length; i++) {
      //   if (readmeRegex.test(entitiesRes.content[i].name)) {
      //     const readme = await getContent(
      //       r.id,
      //       branchSha,
      //       entitiesRes.content[i].name
      //     );
      //     if (readme?.content[0]) {
      //       readmeFile = atob(readme.content[0].content);
      //     }
      //   }
      // }
      return {
        props: {
          repository: r,
          // entitiesRes,
          // commitHistory: { commits: [{}], ...commitHistory },
          // readmeFile,
        },
        revalidate: 1,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    props: {},
  };
}

// export async function getServerSideProps({ params }) {
//   try {
//     let r = await getAnyRepository(params.userId, params.repositoryId);

//     let ownerDetails = {};

//     const [branches, tags] = await Promise.all([
//       getAllRepositoryBranch(r.owner.id, r.name),
//       getAllRepositoryTag(r.owner.id, r.name),
//     ]);
//     if (r.owner.type === "USER") {
//       ownerDetails = await getUser(r.owner.id);
//       r = {
//         ...r,
//         owner: {
//           type: r.owner.type,
//           id: ownerDetails.username !== "" ? ownerDetails.username : r.owner.id,
//           address: r.owner.id,
//           username: ownerDetails.username,
//           avatarUrl: ownerDetails.avatarUrl,
//         },
//         branches: branches,
//         tags: tags,
//       };
//     } else if (r.owner.type === "DAO") {
//       ownerDetails = await getDao(r.owner.id);
//       r = {
//         ...r,
//         owner: {
//           type: r.owner.type,
//           id: ownerDetails.name,
//           address: r.owner.id,
//           username: ownerDetails.name,
//           avatarUrl: ownerDetails.avatarUrl,
//         },
//         branches: branches,
//         tags: tags,
//       };
//     }

//     if (r) {
//       let branchSha = getBranchSha(r.defaultBranch, r.branches, r.tags);

//       const entitiesRes = await getContent(r.id, branchSha, null, null);

//       const commitHistory = await getCommitHistory(r.id, branchSha, null, 1);

//       const readmeRegex = new RegExp(/^README/gi);
//       let readmeFile = null;
//       for (let i = 0; i < entitiesRes?.content?.length; i++) {
//         if (readmeRegex.test(entitiesRes.content[i].name)) {
//           const readme = await getContent(
//             r.id,
//             branchSha,
//             entitiesRes.content[i].name
//           );
//           if (readme?.content[0]) {
//             readmeFile = atob(readme.content[0].content);
//           }
//         }
//       }
//       return {
//         props: {
//           repository: r,
//           entitiesRes,
//           commitHistory: { commits: [{}], ...commitHistory },
//           readmeFile,
//         },
//       };
//     }
//   } catch (e) {}
//   return {
//     props: {},
//   };
// }

export async function getStaticPaths() {
  let paths = [];
  if (process.env.GENERATE_SEO_PAGES) {
    try {
      const fs = (await import("fs")).default;
      paths = JSON.parse(fs.readFileSync("./seo/paths-repositories.json"));
    } catch (e) {
      console.error(e);
    }
  }
  return {
    paths,
    fallback: "blocking",
  };
}

function RepositoryView(props) {
  const { repository, refreshRepository, firstFetchLoading } = useRepository(
    props.repository
  );

  const [entityList, setEntityList] = useState(
    props.entitiesRes?.content || []
  );
  const [hasMoreEntities, setHasMoreEntities] = useState(
    props.entitiesRes?.pagination?.next_key
  );
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newDescriptionHint, setNewDescriptionHint] = useState({
    shown: false,
    type: "info",
    message: "",
  });
  const [savingDescription, setSavingDescription] = useState(false);
  const input = useRef();

  const [readmeFile, setReadmeFile] = useState(props.readmeFile);
  const [commitDetail, setCommitDetail] = useState({
    author: {},
    message: "",
    title: "",
    id: "",
    ...props.commitHistory?.commits[0],
  });
  const [commitsLength, setCommitsLength] = useState(
    props.commitHistory?.pagination?.total
  );
  const [selectedBranch, setSelectedBranch] = useState(
    repository.defaultBranch
  );
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);
  const { isMobile } = useWindowSize();
  const { apiClient, cosmosBankApiClient, cosmosFeegrantApiClient } =
    useApiClient();
  const [daoData, setDaoData] = useState(null);

  useEffect(() => {
    const fetchDaoData = async () => {
      if (repository?.owner?.type === "DAO") {
        try {
          const daoData = await getDao(apiClient, repository.owner.id);
          setDaoData(daoData);
        } catch (error) {
          console.error("Error fetching DAO:", error);
        }
      }
    };

    fetchDaoData();
  }, [repository?.owner]);

  const loadEntities = async (
    currentEntities = [],
    firstTime = false,
    branchSha = null
  ) => {
    setLoadingEntities(true);
    if (!branchSha) {
      branchSha = getBranchSha(
        selectedBranch,
        repository.branches,
        repository.tags
      );
    }
    const res = await getContent(
      repository.id,
      branchSha,
      null,
      firstTime ? null : hasMoreEntities
    );
    if (res) {
      if (res.content) {
        firstTime
          ? setEntityList(res.content)
          : setEntityList([...currentEntities, ...res.content]);

        const readmeRegex = new RegExp(/^README/gi);
        for (let i = 0; i < res.content.length; i++) {
          if (readmeRegex.test(res.content[i].name)) {
            const readme = await getContent(
              repository.id,
              branchSha,
              res.content[i].name
            );

            if (readme) {
              if (readme.content && readme.content[0]) {
                try {
                  let file = atob(readme.content[0].content);
                  setReadmeFile(file);
                } catch (e) {
                  console.error(e);
                  setReadmeFile(null);
                }
              } else {
                console.log("Entity Not found");
              }
            }
          }
        }
      }
      if (res.pagination && res.pagination.next_key) {
        setHasMoreEntities(res.pagination.next_key);
      } else {
        setHasMoreEntities(null);
      }
    }
    setLoadingEntities(false);
  };

  useEffect(() => {
    async function initCommitHistory() {
      if (typeof window !== "undefined" && repository.branches.length) {
        let branchSha = getBranchSha(
          repository.defaultBranch,
          repository.branches,
          repository.tags
        );
        if (!branchSha) {
          setSelectedBranch(repository.branches[0].name);
          branchSha = repository.branches[0].sha;
        } else {
          setSelectedBranch(repository.defaultBranch);
        }
        loadEntities([], true, branchSha);
        const commitHistory = await getCommitHistory(
          repository.id,
          branchSha,
          null,
          1
        );

        if (commitHistory?.commits?.length) {
          setCommitDetail(commitHistory.commits[0]);
          setCommitsLength(commitHistory.pagination.total);
        }
      }
    }
    initCommitHistory();
  }, [repository.id]);

  useEffect(() => {
    async function updatePermissions() {
      setCurrentUserEditPermission(
        await props.isCurrentUserEligibleToUpdate(repository)
      );
    }
    updatePermissions();
  }, [props.user, repository]);

  const validateDescription = (description) => {
    setNewDescriptionHint({
      ...newDescriptionHint,
      shown: false,
    });

    if (description === repository.description) {
      setNewDescriptionHint({
        shown: true,
        type: "error",
        message: "Description is same as earlier",
      });
      return false;
    }
    return true;
  };

  const updateDescription = async () => {
    setSavingDescription(true);
    if (validateDescription(newDescription)) {
      console.log(repository);
      const res = await props.updateRepositoryDescription(
        apiClient,
        cosmosBankApiClient,
        cosmosFeegrantApiClient,
        {
          name: repository.name,
          ownerId: repository.owner.id,
          description: newDescription,
        }
      );

      if (res && res.code === 0) {
        props.notify("Repository description updated");
        if (refreshRepository) await refreshRepository();
        setEditDescription(false);
      } else {
      }
    }
    setSavingDescription(false);
  };

  useEffect(() => {
    setNewDescription(repository.description);
    setNewDescriptionHint({ shown: false });
  }, [repository]);

  useEffect(() => {
    if (editDescription && input?.current) {
      input.current.focus();
    }
  }, [editDescription]);

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
          <RepositoryHeader repository={repository} daoData={daoData} />
          <RepositoryMainTabs
            repository={repository}
            active="code"
            daoData={daoData}
          />
          {firstFetchLoading ? (
            <div className="flex mt-8 items-center justify-center">
              <button className="btn btn-square btn-ghost loading" />
            </div>
          ) : repository.branches.length ? (
            <div className="flex mt-8 flex-col sm:flex-row">
              <div className="flex-none sm:w-64 sm:pr-8 divide-y divide-grey order-2 sm:order-1 mt-4 sm:mt-0">
                {!isMobile ? (
                  <div className="pb-8">
                    <div className="flex">
                      <div className="flex-1 text-left">About</div>
                      {!editDescription && currentUserEditPermission ? (
                        <div
                          className="flex-1 text-left mt-1 text-xs link link-primary uppercase no-underline text-right"
                          onClick={() => {
                            setEditDescription(true);
                          }}
                        >
                          Edit
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {editDescription ? (
                      <div className="py-1">
                        <TextInput
                          type="text"
                          name="Description"
                          placeholder="Description"
                          multiline={true}
                          value={newDescription}
                          setValue={setNewDescription}
                          hint={newDescriptionHint}
                          size="xs"
                          className="text-xs"
                          ref={input}
                        />
                        <div className="flex flex-none w-56 btn-group mt-2">
                          <button
                            className="flex-1 btn btn-sm text-xs "
                            onClick={() => {
                              setEditDescription(false);
                              setNewDescription(repository.description);
                              setNewDescriptionHint({ shown: false });
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className={
                              "flex-1 btn btn-sm btn-primary text-xs " +
                              (savingDescription ? "loading" : "")
                            }
                            onClick={updateDescription}
                            disabled={savingDescription}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs mt-3">
                        {repository.description}
                      </div>
                    )}
                    {readmeFile ? (
                      <Link
                        href={
                          "/" +
                          repository.owner.id +
                          "/" +
                          repository.name +
                          "#readme"
                        }
                        legacyBehavior
                      >
                        <a className="mt-6 flex items-center text-xs text-type-secondary font-semibold hover:text-green">
                          <BookOpenText className="h-4 w-4 mr-2" />
                          <span>README</span>
                        </a>
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}

                <div className="py-8">
                  <div className="flex items-center">
                    <a
                      className="flex-1 text-left flex items-center gap-2"
                      data-test="releases"
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/releases"
                      }
                    >
                      <span>Releases</span>
                      {daoData?.config?.require_release_proposal &&
                        repository.owner.type === "DAO" && (
                          <div className="group relative">
                            <Shield
                              size={14}
                              className="text-green-400 fill-green-400/10 cursor-help"
                            />
                            <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-xs text-white rounded whitespace-nowrap z-50">
                              Creating releases requires DAO approval
                              <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                            </div>
                          </div>
                        )}
                    </a>
                    <a
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/releases/tags"
                      }
                    >
                      <span className="ml-2 text-xs text-type-secondary font-semibold">
                        {repository.tags.length}
                        <span className="ml-1 uppercase">
                          {pluralize("tag", repository.tags.length)}
                        </span>
                      </span>
                    </a>
                  </div>
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
                          className="link link-primary no-underline hover:underline"
                        >
                          {repository.name +
                            " " +
                            repository.releases[repository.releases.length - 1]
                              .tagName}
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
                        legacyBehavior
                      >
                        <a className="mt-6 flex items-center text-xs text-type-secondary font-semibold uppercase hover:text-green">
                          <Plus className="w-4 h-4 mr-2" />
                          <span>Create a release</span>
                        </a>
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
                      {repository.collaborators.length +
                        (repository.owner.type === "USER" ? 1 : 0)}
                      <span className="ml-1 uppercase">
                        {pluralize(
                          "person",
                          repository.collaborators.length +
                            (repository.owner.type === "USER" ? 1 : 0)
                        )}
                      </span>
                    </span>
                  </div>

                  <div className="text-xs mt-3 flex gap-1">
                    {[
                      ...(() =>
                        repository.owner.type === "USER"
                          ? [repository.owner.address]
                          : [])(),
                      ...repository.collaborators.map((c) => c.id),
                    ].map((a, i) => (
                      <div key={"collaborator" + i}>
                        <AccountCard
                          id={a}
                          showAvatar={true}
                          showId={false}
                          avatarSize="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="flex-1 order-1 sm:order-2"
                style={{ maxWidth: "calc(1024px - 18rem)" }}
              >
                <SupportOwner
                  ownerAddress={repository.owner.address}
                  repository={repository}
                  isMobile={isMobile}
                />
                <div className="mt-8 sm:flex justify-start">
                  <div className="flex mb-2 sm:mb-0">
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
                  <div className="flex">
                    <a
                      className="sm:ml-4"
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/branches"
                      }
                    >
                      <div className="p-2 text-type-secondary text-xs font-semibold uppercase flex">
                        <GitBranch className="h-5 w-5 mr-1" />
                        {repository.branches.length}
                        <span className="ml-1 uppercase">
                          {pluralize("branch", repository.branches.length)}
                        </span>
                      </div>
                    </a>
                    <a
                      className="sm:ml-4"
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/tags"
                      }
                    >
                      <div className="p-2 text-type-secondary text-xs font-semibold uppercase flex">
                        <Tag className="h-4 w-4 mr-2" />
                        {repository.tags.length}
                        <span className="ml-1 uppercase">
                          {pluralize("tag", repository.tags.length)}
                        </span>
                      </div>
                    </a>

                    <a
                      className="sm:ml-4"
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/commits/" +
                        selectedBranch
                      }
                    >
                      <div className="p-2 text-type-secondary text-xs font-semibold uppercase flex">
                        <GitCommit className="w-4 h-4 mr-2" />
                        {commitsLength}
                        <span className="ml-1 uppercase">
                          {pluralize("commit", commitsLength)}
                        </span>
                      </div>
                    </a>
                  </div>
                  {!isMobile ? (
                    <div className="flex-1 text-right">
                      <CloneRepoInfo
                        remoteUrl={
                          "gitopia://" +
                          repository.owner.id +
                          "/" +
                          repository.name
                        }
                        backups={repository.backups}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="mt-4 border border-gray-700 rounded overflow-hidden max-w-3xl">
                  <CommitDetailRow
                    commitDetail={commitDetail}
                    commitLink={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/commit/" +
                      commitDetail.id
                    }
                    commitHistoryLink={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/commits/" +
                      selectedBranch
                    }
                    commitHistoryLength={commitsLength}
                    maxMessageLength={isMobile ? 0 : 50}
                    isMobile={isMobile}
                  />
                  <FileBrowser
                    entityList={entityList}
                    branchName={selectedBranch}
                    baseUrl={"/" + repository.owner.id + "/" + repository.name}
                    repoPath={[]}
                    isMobile={isMobile}
                  />
                  {hasMoreEntities ? (
                    <div className="pb-2">
                      <button
                        className={
                          "btn btn-sm btn-block btn-link justify-start no-animation" +
                          (loadingEntities ? "loading" : "")
                        }
                        onClick={() => {
                          loadEntities(entityList);
                        }}
                      >
                        Load more files..
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {readmeFile ? (
                  <div
                    id="readme"
                    className="border border-gray-700 rounded overflow-hidden p-4 markdown-body mt-8"
                  >
                    <MarkdownWrapper
                      hrefBase={[
                        "",
                        repository.owner.id,
                        repository.name,
                        "tree",
                        selectedBranch,
                      ].join("/")}
                    >
                      {readmeFile}
                    </MarkdownWrapper>
                  </div>
                ) : (
                  <div className="mt-8">No readme file</div>
                )}
              </div>
            </div>
          ) : currentUserEditPermission ? (
            <EmptyRepository
              repository={repository}
              refreshRepository={refreshRepository}
            />
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
  updateRepositoryDescription,
})(RepositoryView);
