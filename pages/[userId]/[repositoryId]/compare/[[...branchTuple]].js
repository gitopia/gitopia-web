import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import find from "lodash/find";

import getAnyRepository from "../../../../helpers/getAnyRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import BranchSelector from "../../../../components/repository/branchSelector";
import RepositorySelector from "../../../../components/repository/repositorySelector";
import getBranchSha from "../../../../helpers/getBranchSha";
import DiffView from "../../../../components/repository/diffView";
import { createPullRequest } from "../../../../store/actions/repository";
import MarkdownEditor from "../../../../components/markdownEditor";
import AssigneeSelector from "../../../../components/repository/assigneeSelector";
import ReviewerSelector from "../../../../components/repository/reviewerSelector";
import LabelSelector from "../../../../components/repository/labelSelector";
import Label from "../../../../components/repository/label";
import AccountCard from "../../../../components/account/card";
import getPullDiffStats from "../../../../helpers/getPullDiffStats";
import getRepository from "../../../../helpers/getRepository";
import getUser from "../../../../helpers/getUser";
import getDao from "../../../../helpers/getDao";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import useRepository from "../../../../hooks/useRepository";
import getAllRepositoryBranch from "../../../../helpers/getAllRepositoryBranch";
import getAllRepositoryTag from "../../../../helpers/getAllRepositoryTag";
import getPullRequestCommits from "../../../../helpers/getPullRequestCommits";
import { ApolloProvider } from "@apollo/client";
import QueryIssues from "../../../../helpers/gql/queryIssuesByTitleGql";
import client from "../../../../helpers/apolloClient";
import { notify } from "reapop";
import { useApiClient } from "../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryCompareView(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { repository, refreshRepository } = useRepository();
  const [viewType, setViewType] = useState("unified");
  const [stats, setStats] = useState({ stat: {} });
  const [commits, setCommits] = useState([]);
  const [compare, setCompare] = useState({
    source: { repository: {}, name: "", sha: "" },
    target: { repository: {}, name: "", sha: "" },
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startCreatingPull, setStartCreatingPull] = useState(false);
  const [creatingPull, setCreatingPull] = useState(false);
  const [reviewers, setReviewers] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [labels, setLabels] = useState([]);
  const [forkedRepos, setForkedRepos] = useState([]);
  const [parentRepo, setParentRepo] = useState(null);
  const [textEntered, setEnteredText] = useState("");
  const [issueList, setIssueList] = useState([]);
  const [issueArray, setIssueArray] = useState([]);
  const { apiClient } = useApiClient();

  const setDefaultBranches = (r) => {
    if (r.branches.length) {
      let defaultSha = getBranchSha(r.defaultBranch, r.branches, r.tags);
      if (defaultSha) {
        setCompare({
          source: {
            repository: r,
            name: r.defaultBranch,
            sha: defaultSha,
          },
          target: {
            repository: r,
            name: r.defaultBranch,
            sha: defaultSha,
          },
        });
      } else {
        setCompare({
          source: { ...r.branches[0], repository: r },
          target: { ...r.branches[0], repository: r },
        });
      }
    } else {
      // TODO: handle empty repo
    }
  };

  const getOwnerDetails = async (repo) => {
    if (repo) {
      if (repo.owner.type === "USER") {
        let ownerDetails = await getUser(apiClient, repo.owner.id);
        if (ownerDetails)
          return {
            type: repo.owner.type,
            id:
              ownerDetails.username !== ""
                ? ownerDetails.username
                : repo.owner.id,
            address: repo.owner.id,
            username: ownerDetails.username,
            avatarUrl: ownerDetails.avatarUrl,
          };
        else return repo.owner;
      } else {
        let ownerDetails = await getDao(apiClient, repo.owner.id);
        if (ownerDetails)
          return {
            type: repo.owner.type,
            id: ownerDetails.name,
            address: repo.owner.id,
            username: ownerDetails.name,
            avatarUrl: ownerDetails.avatarUrl,
          };
        else return repo.owner;
      }
    }
  };

  const refreshRepositoryForks = async () => {
    const r = repository;
    if (r.id) {
      if (r.forks.length) {
        const pr = r.forks.map((r) => getRepository(r));
        const repos = await Promise.all(pr);
        for (let i = 0; i < repos.length; i++) {
          repos[i].owner = await getOwnerDetails(repos[i]);
        }
        console.log("forked repos", repos);
        setForkedRepos(repos);
      }
      if (r.parent && r.parent !== "0") {
        const repo = await getRepository(r.parent);
        const ownerDetails = await getOwnerDetails(repo);
        setParentRepo({
          ...repo,
          owner: ownerDetails,
        });
      }
    }
  };

  const updateBranches = async () => {
    let r = repository;
    if (router.query.branchTuple) {
      const slug = router.query.branchTuple.join("/").split("...");
      console.log("branchTuple", slug);
      let sourceRepo,
        targetRepo,
        sourceSha,
        targetSha,
        sourceBranch,
        targetBranch;

      targetRepo = r;
      targetSha = getBranchSha(slug[0], r.branches, r.tags);
      targetBranch = slug[0];

      if (slug[1].includes(":")) {
        // forked repository
        const reposlug = slug[1].split(":");
        if (reposlug[0].includes("/")) {
          // forked repo name also given
          const ownerslug = reposlug[0].split("/");
          sourceRepo = await getAnyRepository(
            apiClient,
            ownerslug[0],
            ownerslug[1]
          );
        } else {
          sourceRepo = await getAnyRepository(
            apiClient,
            reposlug[0],
            router.query.repositoryId
          );
        }
        if (!sourceRepo) {
          sourceRepo = r;
        }
        const [branches, tags] = await Promise.all([
          getAllRepositoryBranch(
            apiClient,
            sourceRepo.owner.id,
            sourceRepo.name
          ),
          getAllRepositoryTag(apiClient, sourceRepo.owner.id, sourceRepo.name),
        ]);
        if (branches) sourceRepo.branches = branches;
        if (tags) sourceRepo.tags = tags;

        sourceBranch = reposlug[1];
      } else {
        sourceRepo = r;
        sourceBranch = slug[1];
      }

      sourceSha = getBranchSha(
        sourceBranch,
        sourceRepo.branches,
        sourceRepo.tags
      );

      sourceRepo.owner = await getOwnerDetails(sourceRepo);

      if (sourceSha && targetSha) {
        console.log(
          "Found the branches",
          sourceRepo,
          sourceBranch,
          targetRepo,
          targetBranch
        );
        setCompare({
          source: {
            repository: sourceRepo,
            name: sourceBranch,
            sha: sourceSha,
          },
          target: {
            repository: targetRepo,
            name: targetBranch,
            sha: targetSha,
          },
        });
      } else {
        setDefaultBranches(r);
      }
    } else {
      setDefaultBranches(r);
    }
  };

  const getNewUrl = (baseRepo, baseBranch, headRepo, headBranch) => {
    const baseOwner = baseRepo.owner.id;
    const baseRepoName = baseRepo.name;
    const baseRepoId = baseRepo.id;
    const headOwner = headRepo.owner.id;
    const headRepoName = headRepo.name;
    const headRepoId = headRepo.id;
    if (headOwner === baseOwner) {
      return `/${baseOwner}/${baseRepoName}/compare/${baseBranch}...${headBranch}`;
    } else {
      if (headRepoName === baseRepoName) {
        return `/${baseOwner}/${baseRepoName}/compare/${baseBranch}...${headOwner}:${headBranch}`;
      } else {
        return `/${baseOwner}/${baseRepoName}/compare/${baseBranch}...${headOwner}/${headRepoName}:${headBranch}`;
      }
    }
  };

  const handleAddIssue = (i) => {
    let obj = issueArray.find((issue) => issue.iid === i.iid);
    if (obj === undefined) {
      let arr = issueArray.slice();
      arr.push(i);
      setIssueArray(arr);
    } else {
      dispatch(notify("Issue already attached", "error"));
    }
  };

  const handleDeleteIssue = (index) => {
    let arr = issueArray;
    arr.splice(index, 1);
    setIssueArray([...arr]);
  };

  useEffect(() => {
    refreshRepositoryForks();
  }, [repository]);
  useEffect(() => {
    updateBranches();
  }, [repository, router.query.branchTuple]);

  useEffect(() => {
    async function initStats() {
      const [diff, commits] = await Promise.all([
        getPullDiffStats(
          compare.target.repository.id,
          compare.source.repository.id,
          compare.target.sha,
          compare.source.sha
        ),
        await getPullRequestCommits(
          compare.target.repository.id,
          compare.source.repository.id,
          compare.target.name,
          compare.source.name,
          compare.target.sha,
          compare.source.sha
        ),
      ]);
      setStats(diff);
      setCommits(commits);
      setStartCreatingPull(false);
    }
    initStats();
  }, [compare]);

  const username = props.selectedAddress ? props.selectedAddress.slice(-1) : "";

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
      <div className="flex flex-1 bg-repo-grad-v">
        <main
          className={
            "py-12 px-4 " +
            (viewType === "unified" ? "container mx-auto max-w-screen-lg" : "")
          }
        >
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="pulls" />
          {repository.branches.length ? (
            <div>
              <div className="mt-8">
                <div className="text-lg">Compare revisions</div>
                <div className="mt-2 text-sm text-type-secondary">
                  Choose a branch/tag (e.g. master) to see what&apos;s changed
                  or to create a pull request.
                </div>
                <div className="text-sm text-type-secondary">
                  Changes are shown as if the source revision was being merged
                  into the target revision.
                </div>
              </div>
              <div className="mt-8 sm:flex items-center">
                <div
                  className="flex-1 sm:mr-2 border border-grey p-4 rounded-lg"
                  data-test="source_branch"
                >
                  <div className="text-xs font-bold uppercase text-type-secondary">
                    Source
                  </div>
                  <div className="mt-4 flex items-center">
                    <RepositorySelector
                      repositories={[repository, ...forkedRepos]}
                      currentRepo={
                        forkedRepos.length
                          ? compare.source.repository
                          : repository
                      }
                      onClick={(repo) => {
                        router.push(
                          getNewUrl(
                            repository,
                            compare.target.name,
                            repo,
                            compare.source.name
                          )
                        );
                      }}
                    />
                    <div className="px-2"></div>
                    <BranchSelector
                      branches={compare.source.repository.branches}
                      tags={compare.source.repository.tags}
                      branchName={compare.source.name}
                      showIcon={false}
                      onChange={(branch) => {
                        router.push(
                          getNewUrl(
                            compare.target.repository,
                            compare.target.name,
                            compare.source.repository,
                            branch.name
                          )
                        );
                      }}
                      isRight={false}
                    />
                  </div>
                </div>
                <div className="text-type-quaternary flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 rotate-90 sm:rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
                <div
                  className="flex-1 sm:ml-2 border border-grey p-4 rounded-lg"
                  data-test="target_branch"
                >
                  <div className="text-xs font-bold uppercase text-type-secondary">
                    Target
                  </div>
                  <div className="mt-4 flex items-center">
                    <RepositorySelector
                      repositories={
                        parentRepo ? [repository, parentRepo] : [repository]
                      }
                      currentRepo={repository}
                      disabled={!parentRepo}
                      onClick={(repo) => {
                        router.push(
                          getNewUrl(
                            repo,
                            compare.target.name,
                            compare.source.repository,
                            compare.source.name
                          )
                        );
                      }}
                    />
                    <div className="px-2"></div>
                    <BranchSelector
                      branches={repository.branches}
                      tags={repository.tags}
                      branchName={compare.target.name}
                      showIcon={false}
                      onChange={(branch) => {
                        router.push(
                          getNewUrl(
                            compare.target.repository,
                            branch.name,
                            compare.source.repository,
                            compare.source.name
                          )
                        );
                      }}
                      isRight={false}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-base">Link Issue</div>
                <div className="form-control flex-1 mt-3">
                  <div className="relative">
                    <ApolloProvider client={client}>
                      <QueryIssues
                        substr={textEntered}
                        repoId={repository.id}
                        setIssueList={setIssueList}
                      />
                    </ApolloProvider>

                    <button className="absolute right-0 top-2 rounded-l-none btn btn-sm btn-ghost">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full input input-ghost input-bordered"
                      value={textEntered}
                      onChange={(e) => {
                        setEnteredText(e.target.value);
                      }}
                      onKeyUp={(e) => {
                        if (e.code === "Enter") {
                          setEnteredText(e.target.value);
                        }
                      }}
                    />
                    {issueList.length > 0 ? (
                      <div className="card bg-grey-500 p-4">
                        {issueList.map((i, key) => {
                          return (
                            <div
                              onClick={() => {
                                handleAddIssue(i);
                                setEnteredText("");
                              }}
                              key={key}
                            >
                              <div
                                className={
                                  "flex border-grey-300 pb-3 pt-3 hover:cursor-pointer " +
                                  (key < issueList.length - 1 ? "border-b" : "")
                                }
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5 20L5 4L19 4L19 20L5 20Z"
                                    stroke="#ADBECB"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M8 15L16 15M8 9L16 9"
                                    stroke="#ADBECB"
                                    strokeWidth="2"
                                  />
                                </svg>

                                <div className="text-type-secondary ml-4 text-sm mt-0.5">
                                  {i.title}
                                </div>
                                <div className="font-bold text-xs text-type-secondary ml-auto uppercase mt-1">
                                  opened by {shrinkAddress(i.creator)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {issueArray.length > 0 ? (
                  <div className="flex mt-2">
                    {issueArray.map((issue, index) => {
                      return (
                        <div
                          className="flex text-sm box-border bg-grey-500 mr-2 h-11 p-3 rounded-lg mt-2"
                          key={index}
                        >
                          {issue.title.split(" ").length > 4
                            ? issue.title.split(" ").splice(0, 4).join(" ") +
                              "..."
                            : issue.title}
                          <div
                            className="link ml-4 mt-1 no-underline"
                            onClick={() => {
                              handleDeleteIssue(index);
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M13.5303 1.5304C13.8231 1.23751 13.8231 0.762637 13.5303 0.469744C13.2374 0.176851 12.7625 0.176851 12.4696 0.469744L13.5303 1.5304ZM0.46967 12.4697C0.176777 12.7626 0.176777 13.2374 0.46967 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L0.46967 12.4697ZM12.4696 13.5303C12.7625 13.8231 13.2374 13.8231 13.5303 13.5303C13.8231 13.2374 13.8231 12.7625 13.5303 12.4696L12.4696 13.5303ZM1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L1.53033 0.46967ZM12.4696 0.469744L0.46967 12.4697L1.53033 13.5303L13.5303 1.5304L12.4696 0.469744ZM13.5303 12.4696L1.53033 0.46967L0.46967 1.53033L12.4696 13.5303L13.5303 12.4696Z"
                                fill="#E5EDF5"
                              />
                            </svg>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="my-8">
                {startCreatingPull ? (
                  <div>
                    <div className="sm:flex">
                      <div className="flex flex-1">
                        <div className="flex-none mr-4">
                          <AccountCard
                            id={props.selectedAddress}
                            showAvatar={true}
                            showId={false}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="form-control mb-4">
                            <input
                              type="text"
                              placeholder="Pull Request Title"
                              className="input input-md input-bordered"
                              value={title}
                              onChange={(e) => {
                                setTitle(e.target.value);
                              }}
                              data-test="pr-title"
                            />
                          </div>
                          <MarkdownEditor
                            value={description}
                            setValue={setDescription}
                          />
                          <div className="flex justify-end">
                            <div className="mt-4 w-48">
                              <button
                                className={
                                  "btn btn-sm btn-primary btn-block " +
                                  (creatingPull ? "loading" : "")
                                }
                                onClick={async () => {
                                  setCreatingPull(true);
                                  const res = await props.createPullRequest(
                                    apiClient,
                                    {
                                      title,
                                      description,
                                      baseRepoOwner:
                                        compare.target.repository.owner.address,
                                      baseRepoName:
                                        compare.target.repository.name,
                                      baseBranch: compare.target.name,
                                      headRepoOwner:
                                        compare.source.repository.owner.address,
                                      headRepoName:
                                        compare.source.repository.name,
                                      headBranch: compare.source.name,
                                      reviewers: reviewers,
                                      assignees: assignees,
                                      labelIds: labels,
                                      issues: issueArray.map(
                                        (issue) => issue.iid
                                      ),
                                    }
                                  );
                                  if (res && res.code === 0) {
                                    router.push(
                                      "/" +
                                        repository.owner.id +
                                        "/" +
                                        repository.name +
                                        "/pulls/" +
                                        (Number(repository.pullsCount) + 1)
                                    );
                                  }
                                  setCreatingPull(false);
                                }}
                                disabled={creatingPull || !title.trim().length}
                                data-test="create-pr"
                              >
                                Create Pull Request
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-none sm:w-64 sm:pl-8 divide-y divide-grey mt-8 sm:mt-0">
                        <div className="w-full pb-8">
                          <ReviewerSelector
                            reviewers={reviewers}
                            collaborators={[
                              ...(() =>
                                repository.owner.type === "USER"
                                  ? [
                                      {
                                        id: repository.owner.address,
                                        permission: "CREATOR",
                                      },
                                    ]
                                  : [])(),
                              ...repository.collaborators,
                            ]}
                            onChange={async (list) => {
                              setReviewers(list);
                            }}
                          />
                          <div className="text-xs px-3 mt-2 flex gap-2">
                            {reviewers.length
                              ? reviewers.map((a, i) => (
                                  <div key={"reviewers" + i}>
                                    <AccountCard
                                      id={a}
                                      showAvatar={true}
                                      showId={false}
                                    />
                                  </div>
                                ))
                              : "No one"}
                          </div>
                        </div>
                        <div className="w-full py-8">
                          <AssigneeSelector
                            assignees={assignees}
                            collaborators={[
                              ...(() =>
                                repository.owner.type === "USER"
                                  ? [
                                      {
                                        id: repository.owner.address,
                                        permission: "CREATOR",
                                      },
                                    ]
                                  : [])(),
                              ...repository.collaborators,
                            ]}
                            onChange={async (list) => {
                              setAssignees(list);
                            }}
                          />
                          <div className="text-xs px-3 mt-2 flex gap-2">
                            {assignees.length
                              ? assignees.map((a, i) => (
                                  <div key={"assignee" + i}>
                                    <AccountCard
                                      id={a}
                                      showAvatar={true}
                                      showId={false}
                                    />
                                  </div>
                                ))
                              : "No one"}
                          </div>
                        </div>
                        <div className="py-8">
                          <LabelSelector
                            labels={labels}
                            repository={repository}
                            refreshRepository={refreshRepository}
                            onChange={async (list) => {
                              console.log(list);
                              setLabels(list);
                            }}
                          />
                          <div className="text-xs px-3 mt-2 flex flex-wrap">
                            {labels.length
                              ? labels.map((l, i) => {
                                  let label = find(repository.labels, {
                                    id: l,
                                  }) || {
                                    name: "",
                                    color: "",
                                  };
                                  return (
                                    <span
                                      className="pr-2 pb-2 whitespace-nowrap"
                                      key={"label" + i}
                                    >
                                      <Label
                                        color={label.color}
                                        name={label.name}
                                      />
                                    </span>
                                  );
                                })
                              : "None yet"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 mr-4">
                    <button
                      className="btn btn-sm btn-primary btn-block"
                      onClick={() => setStartCreatingPull(true)}
                      disabled={!commits.length}
                      data-test="create-pr"
                    >
                      Create Pull Request
                    </button>
                  </div>
                )}
              </div>
              {stats.files_changed ? (
                commits.length ? (
                  <DiffView
                    stats={stats}
                    repoId={compare.source.repository.id}
                    baseRepoId={compare.target.repository.id}
                    currentSha={compare.source.sha}
                    previousSha={compare.target.sha}
                    onViewTypeChange={(v) => setViewType(v)}
                    commentsAllowed={false}
                    isPullDiff={true}
                  />
                ) : (
                  <div className="alert alert-warning">
                    <div className="flex-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {compare.source.repository.id ===
                        compare.target.repository.id
                          ? compare.target.name +
                            " is ahead of  " +
                            compare.source.name
                          : shrinkAddress(compare.target.repository.owner.id) +
                            "/" +
                            compare.target.name +
                            " is ahead of " +
                            shrinkAddress(compare.source.repository.owner.id) +
                            "/" +
                            compare.source.name}
                      </span>
                    </div>
                  </div>
                )
              ) : (
                <div className="alert alert-warning">
                  <div className="flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {compare.source.repository.id ===
                      compare.target.repository.id
                        ? "There isn't anything to compare. " +
                          compare.source.name +
                          " and " +
                          compare.target.name +
                          " are the same."
                        : "There isn't anything to compare. " +
                          shrinkAddress(compare.source.repository.owner.id) +
                          "/" +
                          compare.source.name +
                          " and " +
                          shrinkAddress(compare.target.repository.owner.id) +
                          "/" +
                          compare.target.name +
                          " are the same."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-8 text-type-secondary">
              Repository has no branches
            </div>
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

export default connect(mapStateToProps, { createPullRequest })(
  RepositoryCompareView
);
