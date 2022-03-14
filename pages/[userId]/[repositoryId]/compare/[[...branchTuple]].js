import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import find from "lodash/find";

import getUserRepository from "../../../../helpers/getUserRepository";
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
import LabelSelector from "../../../../components/repository/labelSelector";
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";
import getPullDiff from "../../../../helpers/getPullDiff";
import getRepository from "../../../../helpers/getRepository";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import useRepository from "../../../../hooks/useRepository";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryCompareView(props) {
  const router = useRouter();
  const { repository } = useRepository();
  const [viewType, setViewType] = useState("unified");
  const [stats, setStats] = useState({ stat: {} });
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

  const refreshRepositoryForks = async () => {
    const r = repository;
    if (r.id) {
      if (r.forks.length) {
        const pr = r.forks.map((r) => getRepository(r));
        const repos = await Promise.all(pr);
        setForkedRepos(repos);
        console.log("forked repos", repos);
      }
      if (r.parent !== "0") {
        const repo = await getRepository(r.parent);
        if (repo) {
          setParentRepo(repo);
        }
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
          sourceRepo = await getUserRepository(ownerslug[0], ownerslug[1]);
        } else {
          sourceRepo = await getUserRepository(
            reposlug[0],
            router.query.repositoryId
          );
        }
        if (!sourceRepo) {
          sourceRepo = r;
        }
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

  useEffect(refreshRepositoryForks, [repository]);
  useEffect(updateBranches, [repository, router.query.branchTuple]);

  useEffect(async () => {
    const diff = await getPullDiff(
      compare.target.repository.id,
      compare.source.repository.id,
      compare.target.sha,
      compare.source.sha,
      null,
      true
    );
    console.log("diffStat", diff);
    setStats(diff);
    setStartCreatingPull(false);
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

      <div className="flex flex-1 bg-repo-grad-v">
        <main
          className={
            "py-12 px-4 " +
            (viewType === "unified" ? "container mx-auto max-w-screen-lg" : "")
          }
        >
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="pulls" />
          <div className="mt-8">
            <div className="text-lg">Compare revisions</div>
            <div className="mt-2 text-sm text-type-secondary">
              Choose a branch/tag (e.g. master ) to see what's changed or to
              create a pull request.
            </div>
            <div className="text-sm text-type-secondary">
              Changes are shown as if the source revision was being merged into
              the target revision.
            </div>
          </div>
          <div className="mt-8 flex items-center">
            <div className="flex-1 mr-2 border border-grey p-4 rounded-lg">
              <div className="text-xs font-bold uppercase text-type-secondary">
                Source
              </div>
              <div className="mt-4 flex items-center">
                <RepositorySelector
                  repositories={[repository, ...forkedRepos]}
                  currentRepo={
                    forkedRepos.length ? compare.source.repository : repository
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
                />
              </div>
            </div>
            <div className="text-type-quaternary">
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <div className="flex-1 ml-2 border border-grey p-4 rounded-lg">
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
                />
              </div>
            </div>
          </div>
          <div className="my-8">
            {startCreatingPull ? (
              <div>
                <div className="flex">
                  <div className="flex flex-1">
                    <div className="flex-none mr-4">
                      <div className="avatar">
                        <div className="mb-8 rounded-full w-10 h-10">
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                              username
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border border-grey rounded flex-1 p-4">
                      <div className="form-control mb-4">
                        <input
                          type="text"
                          placeholder="Pull Request Title"
                          className="input input-md input-bordered"
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
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
                              const res = await props.createPullRequest({
                                title,
                                description,
                                baseRepoId: compare.target.repository.id,
                                baseBranch: compare.target.name,
                                headRepoId: compare.source.repository.id,
                                headBranch: compare.source.name,
                                reviewers: reviewers,
                                assignees: assignees,
                                labelIds: labels,
                              });
                              console.log(res);
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
                          >
                            Create Pull Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-none w-64 pl-8 divide-y divide-grey">
                    <div className="w-full pb-8">
                      <AssigneeSelector
                        assignees={reviewers}
                        collaborators={[
                          { id: repository.owner.id, permission: "CREATOR" },
                          ...repository.collaborators,
                        ]}
                        onChange={async (list) => {
                          setReviewers(list);
                        }}
                        title="Reviewers"
                      />
                      <div className="text-xs px-3 mt-2">
                        {reviewers.length ? (
                          <AssigneeGroup assignees={reviewers} />
                        ) : (
                          "No one"
                        )}
                      </div>
                    </div>
                    <div className="w-full py-8">
                      <AssigneeSelector
                        assignees={assignees}
                        collaborators={[
                          { id: repository.owner.id, permission: "CREATOR" },
                          ...repository.collaborators,
                        ]}
                        onChange={async (list) => {
                          setAssignees(list);
                        }}
                      />
                      <div className="text-xs px-3 mt-2">
                        {assignees.length ? (
                          <AssigneeGroup assignees={assignees} />
                        ) : (
                          "No one"
                        )}
                      </div>
                    </div>
                    <div className="py-8">
                      <LabelSelector
                        labels={labels}
                        repoLabels={repository.labels}
                        editLabels={
                          "/" +
                          repository.owner.id +
                          "/" +
                          repository.name +
                          "/issues/labels"
                        }
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
                  disabled={!stats.files_changed}
                >
                  Create Pull Request
                </button>
              </div>
            )}
          </div>
          {stats.files_changed ? (
            <DiffView
              stats={stats}
              repoId={compare.source.repository.id}
              baseRepoId={compare.target.repository.id}
              currentSha={compare.source.sha}
              previousSha={compare.target.sha}
              onViewTypeChange={(v) => setViewType(v)}
            />
          ) : (
            <div className="alert alert-info">
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
                  {compare.source.repository.id === compare.target.repository.id
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
