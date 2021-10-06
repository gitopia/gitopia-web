import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import TextInput from "../../../../components/textInput";
import RenameRepository from "../../../../components/repository/renameRepository";
import CollaboratorsList from "../../../../components/repository/collaboratorsList";
import TransferOwnership from "../../../../components/repository/transferOwnership";
import BranchSelector from "../../../../components/repository/branchSelector";
import RepositorySelector from "../../../../components/repository/repositorySelector";
import getBranchSha from "../../../../helpers/getBranchSha";
import Link from "next/link";
import getDiff from "../../../../helpers/getDiff";
import DiffView from "../../../../components/repository/diffView";
import { createPullRequest } from "../../../../store/actions/repository";
import MarkdownEditor from "../../../../components/markdownEditor";
import AssigneeSelector from "../../../../components/repository/assigneeSelector";
import LabelSelector from "../../../../components/repository/labelSelector";
import Label from "../../../../components/repository/label";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryCompareView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    collaborators: [],
    forks: [],
    stargazers: [],
    branches: [],
    labels: [],
    tags: [],
  });
  const [viewType, setViewType] = useState("unified");
  const [stats, setStats] = useState({ stat: {} });
  const [compare, setCompare] = useState({
    source: { name: "", sha: "" },
    target: { name: "", sha: "" },
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startCreatingPull, setStartCreatingPull] = useState(false);
  const [creatingPull, setCreatingPull] = useState(false);
  const [reviewers, setReviewers] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [labels, setLabels] = useState([]);

  const setDefaultBranches = (r) => {
    if (r.branches.length) {
      let defaultSha = getBranchSha(r.defaultBranch, r.branches, r.tags);
      if (defaultSha) {
        setCompare({
          source: { name: r.defaultBranch, sha: defaultSha },
          target: { name: r.defaultBranch, sha: defaultSha },
        });
      } else {
        setCompare({
          source: r.branches[0],
          target: r.branches[0],
        });
      }
    } else {
      // TODO: handle empty repo
    }
  };

  const refreshRepository = async () => {
    const r = await getUserRepository(
      router.query.userId,
      router.query.repositoryId
    );
    if (r) {
      setRepository(r);
      if (router.query.branchTuple) {
        const slug = router.query.branchTuple.join("/").split("...");
        console.log("branchTuple", slug);
        const targetSha = getBranchSha(slug[0], r.branches, r.tags);
        const sourceSha = getBranchSha(slug[1], r.branches, r.tags);
        if (sourceSha && targetSha) {
          console.log("Found the branches");
          setCompare({
            source: { name: slug[1], sha: sourceSha },
            target: { name: slug[0], sha: targetSha },
          });
        } else {
          setDefaultBranches(r);
        }
      } else {
        setDefaultBranches(r);
      }
    }
  };

  useEffect(refreshRepository, [router.query]);
  useEffect(async () => {
    const diff = await getDiff(
      repository.id,
      compare.source.sha,
      null,
      compare.target.sha,
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
      <Header />
      <div className="flex flex-1">
        <main
          className={
            "py-12 px-4 " +
            (viewType === "unified" ? "container mx-auto max-w-screen-lg" : "")
          }
        >
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="pulls"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
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
                  repositories={props.user.repositories}
                  currentRepo={{ name: repository.name, id: repository.id }}
                />
                <div className="px-2"></div>
                <BranchSelector
                  branches={repository.branches}
                  tags={repository.tags}
                  branchName={compare.source.name}
                  showIcon={false}
                  onChange={(branch) => {
                    router.push(
                      [
                        "",
                        router.query.userId,
                        router.query.repositoryId,
                        "compare",
                        compare.target.name + "..." + branch.name,
                      ].join("/")
                    );
                  }}
                />
              </div>
            </div>
            <div className="flex-1 ml-2 border border-grey p-4 rounded-lg">
              <div className="text-xs font-bold uppercase text-type-secondary">
                Target
              </div>
              <div className="mt-4 flex items-center">
                <RepositorySelector
                  repositories={props.user.repositories}
                  currentRepo={{ name: repository.name, id: repository.id }}
                />
                <div className="px-2"></div>
                <BranchSelector
                  branches={repository.branches}
                  tags={repository.tags}
                  branchName={compare.target.name}
                  showIcon={false}
                  onChange={(branch) => {
                    router.push(
                      [
                        "",
                        router.query.userId,
                        router.query.repositoryId,
                        "compare",
                        branch.name + "..." + compare.source.name,
                      ].join("/")
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
                                baseRepoId: repository.id,
                                baseBranch: compare.target.name,
                                headRepoId: repository.id,
                                headBranch: compare.source.name,
                              });
                              console.log(res);
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
                        collaborators={repository.collaborators}
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
                        collaborators={repository.collaborators}
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
                              let label = _.find(repository.labels, {
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
              repoId={repository.id}
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
                  {"There isn't anything to compare. " +
                    compare.source.name +
                    " and " +
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
