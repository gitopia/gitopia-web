import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import MarkdownEditor from "../../../../components/markdownEditor";

import {
  createRelease,
  createReleaseForDao,
  createTag,
} from "../../../../store/actions/repository";
import BranchSelector from "../../../../components/repository/branchSelector";
import AccountCard from "../../../../components/account/card";
import formatBytes from "../../../../helpers/formatBytes";
import shrinkSha from "../../../../helpers/shrinkSha";
import { Info } from "lucide-react";
import getDao from "../../../../helpers/getDao";

import Uploady, {
  useItemProgressListener,
  useItemStartListener,
  useItemFinishListener,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import UploadDropZone from "@rpldy/upload-drop-zone";
import getBranchSha from "../../../../helpers/getBranchSha";
import useRepository from "../../../../hooks/useRepository";
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

const RepositoryReleaseView = ({
  selectedAddress,
  createRelease,
  createReleaseForDao,
  createTag,
}) => {
  const router = useRouter();
  const { repository, refreshRepository } = useRepository();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagName, setTagName] = useState("");
  const [target, setTarget] = useState({ name: "", sha: null });
  const [attachments, setAttachments] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState({ file: {} });
  const [newTagOptionShown, setNewTagOptionShown] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const { apiClient } = useApiClient();
  const [isDao, setIsDao] = useState(false);
  const [daoInfo, setDaoInfo] = useState(null);
  const [requiresProposal, setRequiresProposal] = useState(false);
  const [postingRelease, setPostingRelease] = useState(false);

  useEffect(() => {
    const checkDaoStatus = async () => {
      if (repository?.owner?.type === "DAO") {
        const dao = await getDao(apiClient, repository.owner.id);
        setIsDao(true);
        setDaoInfo(dao);
        setRequiresProposal(dao?.config?.require_release_proposal || false);
      }
    };

    if (repository) {
      checkDaoStatus();
    }
  }, [repository]);

  const handleCreateRelease = async () => {
    setPostingRelease(true);

    try {
      const releaseData = {
        name: title,
        description,
        repoOwner: repository.owner.id,
        repoName: repository.name,
        tagName,
        target: target.name,
        isTag: true,
        attachments: attachments.map((a) => ({
          name: a.file.name,
          size: a.uploadResponse.data.size,
          sha: a.uploadResponse.data.sha,
          uploader: selectedAddress,
        })),
      };

      let result;
      if (requiresProposal) {
        result = await createReleaseForDao(apiClient, {
          ...releaseData,
          groupId: daoInfo.group_id,
        });
      } else {
        result = await createRelease(apiClient, releaseData);
      }

      if (result) {
        if (requiresProposal) {
          router.push(`/daos/${daoInfo.name}/dashboard?tab=proposals`);
        } else {
          router.push(
            `/${repository.owner.id}/${repository.name}/releases/tag/${tagName}`
          );
        }
      }
    } finally {
      setPostingRelease(false);
    }
  };

  const updateTags = () => {
    if (repository) {
      if (!getBranchSha(tagName, [], repository.tags)) {
        setTagName(
          repository.tags.length
            ? repository.tags[repository.tags.length - 1].name
            : ""
        );
      }
      let targetSha = getBranchSha(
        target.name,
        repository.branches,
        repository.tags
      );
      if (targetSha) {
        setTarget({
          name: target.name,
          sha: targetSha,
        });
      } else {
        setTarget({
          name: repository.defaultBranch,
          sha: getBranchSha(
            repository.defaultBranch,
            repository.branches,
            repository.tags
          ),
        });
      }
    }
  };
  useEffect(updateTags, [repository]);

  const LogProgress = () => {
    useItemStartListener((item) => {
      console.log("started", item);
      setUploadingAttachment(item);
    });

    useItemProgressListener((item) => {
      console.log(
        `>>>>> (hook) File ${item.file.name} completed: ${item.completed}`
      );
      setUploadingAttachment(item);
    });

    useItemFinishListener((item) => {
      console.log("finished", item);
      let a = [...attachments];
      a.push(item);
      setAttachments(a);
      setUploadingAttachment({ file: {} });
    });

    return null;
  };

  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-base-100 text-base-content"
    >
      <Head>
        <title>{repository.name} - New Release</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Header />

      <div className="flex bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg px-4 py-8">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="code" />

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mt-8 text-sm text-gray-500">
            <span>Releases</span>
            <span>/</span>
            <span className="font-medium">New Release</span>
          </div>

          {/* Main Content */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {requiresProposal && (
                <div className="alert alert-info">
                  <Info className="w-4 h-4" />
                  <span>
                    This repository requires DAO approval for releases. Your
                    release will be submitted as a proposal.
                  </span>
                </div>
              )}
              {/* Tag Selection Section */}
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                <h2 className="text-lg font-medium mb-4">Choose a tag</h2>
                <div className="space-y-4">
                  {newTagOptionShown ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          New Tag Name
                        </label>
                        <input
                          type="text"
                          placeholder="v1.0.0"
                          data-test="tag-name"
                          className={`w-full input input-sm input-bordered focus:outline-none ${
                            tagName.length > 0
                              ? "border-green-500"
                              : "border-pink-500"
                          }`}
                          value={tagName}
                          onChange={(e) => setTagName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Target Branch
                        </label>
                        <BranchSelector
                          branchName={target.name}
                          branches={repository.branches}
                          showBranchesOnly={true}
                          onChange={(branch) => setTarget(branch)}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          className={`btn btn-primary btn-sm ${
                            creatingTag ? "loading" : ""
                          }`}
                          onClick={async () => {
                            setCreatingTag(true);
                            const res = await createTag(apiClient, {
                              repoOwnerId: repository.owner.id,
                              repositoryName: repository.name,
                              name: tagName,
                              sha: target.sha,
                            });
                            if (res && res.code === 0) {
                              setNewTagOptionShown(false);
                              refreshRepository();
                            }
                            setCreatingTag(false);
                          }}
                          data-test="create-tag"
                        >
                          Create Tag
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setTagName(
                              repository.tags.length
                                ? repository.tags[repository.tags.length - 1]
                                    .name
                                : ""
                            );
                            setNewTagOptionShown(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <BranchSelector
                      branchName={tagName}
                      tags={repository.tags}
                      showTagsOnly={true}
                      isTag={true}
                      onChange={(tag) => setTagName(tag.name)}
                      onCreateTag={(name) => {
                        setTagName(name);
                        setNewTagOptionShown(true);
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Release Information */}
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                <h2 className="text-lg font-medium mb-4">
                  Release Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      data-test="release-title"
                      placeholder="Release Title"
                      className="input input-bordered w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <MarkdownEditor
                      value={description}
                      setValue={setDescription}
                    />
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6">
                <h2 className="text-lg font-medium mb-4">Attachments</h2>
                <div className="space-y-4">
                  {attachments.length > 0 && (
                    <div className="divide-y divide-gray-700">
                      {attachments.map((a, i) => (
                        <div
                          className="flex items-center py-3"
                          key={`attachment-${i}`}
                        >
                          <div className="flex-1 text-sm truncate">
                            {a.file.name}
                          </div>
                          <div className="text-xs text-gray-400 mx-4">
                            {formatBytes(a.file.size)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="btn btn-ghost btn-xs tooltip"
                              data-tip={a.uploadResponse.data.sha}
                              onClick={(e) => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(
                                    a.uploadResponse.data.sha
                                  );
                                }
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              {shrinkSha(a.uploadResponse.data.sha)}
                            </button>
                            <button
                              className="btn btn-ghost btn-xs text-red-400 hover:text-red-300"
                              onClick={() => {
                                let updatedAttachments = [...attachments];
                                updatedAttachments.splice(i, 1);
                                setAttachments(updatedAttachments);
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadingAttachment.file.name && (
                    <div className="py-3">
                      <div className="text-sm text-gray-400 mb-2">
                        Uploading {uploadingAttachment.file.name}...{" "}
                        {parseFloat(uploadingAttachment.completed).toFixed(2)}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadingAttachment.completed}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Uploady
                    destination={{
                      url: process.env.NEXT_PUBLIC_OBJECTS_URL + "/upload",
                    }}
                  >
                    <UploadDropZone className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors duration-200">
                      <UploadButton className="btn btn-ghost btn-sm">
                        <span>Choose files or drag & drop here</span>
                      </UploadButton>
                    </UploadDropZone>
                    <LogProgress />
                  </Uploady>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  className={`btn btn-primary ${
                    postingRelease ? "loading" : ""
                  }`}
                  disabled={!title.trim() || postingRelease}
                  onClick={handleCreateRelease}
                  data-test="create-release"
                >
                  {requiresProposal
                    ? "Create Release Proposal"
                    : "Create Release"}
                </button>
              </div>
            </div>

            {/* Right Column - Help & Suggestions */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 sticky top-6">
                <h2 className="text-lg font-medium mb-4">
                  Tagging Suggestions
                </h2>
                <div className="space-y-4 text-sm text-gray-400">
                  <p>
                    It's common practice to prefix your version names with the
                    letter v. Some good tag names might be v1.0 or v2.3.4.
                  </p>
                  <p>
                    If the tag isn't meant for production use, add a pre-release
                    version. Examples: v0.2-alpha or v5.9-beta.3.
                  </p>
                  <p>
                    New to releasing software? Read about{" "}
                    <a
                      href="https://semver.org"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      semantic versioning
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default connect(
  (state) => ({
    selectedAddress: state.wallet.selectedAddress,
  }),
  { createRelease, createReleaseForDao, createTag }
)(RepositoryReleaseView);
