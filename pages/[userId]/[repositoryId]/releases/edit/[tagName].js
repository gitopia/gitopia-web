import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import MarkdownEditor from "../../../../../components/markdownEditor";

import {
  createRelease,
  createTag,
} from "../../../../../store/actions/repository";
import BranchSelector from "../../../../../components/repository/branchSelector";
import formatBytes from "../../../../../helpers/formatBytes";
import shrinkSha from "../../../../../helpers/shrinkSha";

import Uploady, {
  useItemProgressListener,
  useItemStartListener,
  useItemFinishListener,
} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import UploadDropZone from "@rpldy/upload-drop-zone";
import getBranchSha from "../../../../../helpers/getBranchSha";
import getRepositoryRelease from "../../../../../helpers/getRepositoryRelease";
import useRepository from "../../../../../hooks/useRepository";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryReleaseEditView(props) {
  const router = useRouter();
  const { repository, refreshRepository } = useRepository();

  const [release, setRelease] = useState({
    creator: "",
    attachments: [],
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagName, setTagName] = useState("");
  const [target, setTarget] = useState({ name: "", sha: null });
  const [postingIssue, setPostingIssue] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploadingAttachment, setUploadingAttachment] = useState({ file: {} });
  const [newTagOptionShown, setNewTagOptionShown] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);

  const validateIssue = () => {
    return true;
  };

  const createIssue = async () => {
    setPostingIssue(true);
    if (validateIssue()) {
      const issue = {
        name: title,
        description,
        repoOwner: repository.owner.id,
        repoName: repository.name,
        tagName,
        target: target.name,
        isTag: true,
        attachments: attachments.map((a) => {
          return {
            name: a.file ? a.file.name : a.name,
            size: a.uploadResponse
              ? a.uploadResponse.data.size
              : Number(a.size),
            sha: a.uploadResponse ? a.uploadResponse.data.sha : a.sha,
            uploader: props.selectedAddress,
          };
        }),
        releaseId: parseInt(release.id),
      };
      console.log("before call", issue);
      const res = await props.createRelease(issue, true);
      if (res && res.code === 0) {
        router.push(
          "/" +
            repository.owner.id +
            "/" +
            repository.name +
            "/releases/tag/" +
            tagName
        );
      }
    }
    setPostingIssue(false);
  };

  const getRelease = async () => {
    if (repository) {
      const rel = await getRepositoryRelease(
        repository.owner.id,
        repository.name,
        router.query.tagName
      );
      console.log(rel);
      if (rel) {
        setRelease(rel);

        setTitle(rel.name);
        setDescription(rel.description);
        if (!getBranchSha(tagName, [], repository.tags)) {
          setTagName(rel.tagName);
        }
        if (!getBranchSha(target.name, repository.branches, repository.tags)) {
          setTarget({
            name: rel.target,
            sha: getBranchSha(rel.target, repository.branches, repository.tags),
          });
        }
        setAttachments(rel.attachments);
      }
    }
  };

  useEffect(() => {
    getRelease();
  }, [repository]);

  const username = props.selectedAddress ? props.selectedAddress.slice(-1) : "";

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
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="code" />
          <div className="mt-8">
            {/* <div className="btn-group">
              <button className="btn btn-sm btn-active">Releases</button>
              <button className="btn btn-sm">Tags</button>
            </div> */}
            <div className="sm:flex mt-4 items-end">
              {newTagOptionShown ? (
                <div className="form-control mr-4">
                  <label className="label">
                    <span className="label-text">New Tag Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tag Name"
                    className="input input-sm input-bordered"
                    value={tagName}
                    onChange={(e) => {
                      setTagName(e.target.value);
                    }}
                  />
                </div>
              ) : (
                <div className="form-control mr-4">
                  <label className="label">
                    <span className="label-text">Tag Name</span>
                  </label>
                  <BranchSelector
                    branchName={tagName}
                    tags={repository.tags}
                    showTagsOnly={true}
                    isTag={true}
                    onChange={(tag) => {
                      console.log(tag);
                      setTagName(tag.name);
                    }}
                    onCreateTag={(name) => {
                      setTagName(name);
                      setNewTagOptionShown(true);
                    }}
                  />
                </div>
              )}
              {newTagOptionShown ? (
                <>
                  <div className="form-control mr-4">
                    <label className="label">
                      <span className="label-text">Target Branch</span>
                    </label>
                    <BranchSelector
                      branchName={target.name}
                      branches={repository.branches}
                      showBranchesOnly={true}
                      onChange={(branch) => {
                        setTarget(branch);
                      }}
                    />
                  </div>
                  <div className="flex mt-4 sm:mt-0">
                    <div className="form-control mr-4">
                      <button
                        className={
                          "btn btn-secondary btn-sm " +
                          (creatingTag ? "loading" : "")
                        }
                        onClick={async () => {
                          setCreatingTag(true);
                          const res = await props.createTag({
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
                      >
                        Create Tag
                      </button>
                    </div>
                    <div className="form-control">
                      <button
                        className={"btn btn-sm "}
                        onClick={() => {
                          setTagName(
                            repository.tags.length
                              ? repository.tags[repository.tags.length - 1].name
                              : ""
                          );
                          setNewTagOptionShown(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="sm:flex mt-8">
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
                    placeholder="Release Title"
                    className="input input-md input-bordered"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <MarkdownEditor value={description} setValue={setDescription} />
                <div className="my-4 divide-y divide-grey">
                  {attachments.map((a, i) => {
                    return (
                      <div
                        className={"flex py-2 items-center"}
                        key={"attachment" + i}
                      >
                        <div className="flex-1 text-sm">
                          {a.file ? a.file.name : a.name}
                        </div>
                        <div className="text-xs mr-2">
                          {formatBytes(a.file ? a.file.size : a.size)}
                        </div>
                        <div className="">
                          <div className="text-xs flex items-center">
                            <div className="mr-2">
                              {"(" +
                                shrinkSha(
                                  a.uploadResponse
                                    ? a.uploadResponse.data.sha
                                    : a.sha
                                ) +
                                ")"}
                            </div>
                            <button
                              className="btn btn-square btn-xs"
                              onClick={() => {
                                let a = [...attachments];
                                a.splice(i, 1);
                                setAttachments(a);
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
                      </div>
                    );
                  })}
                  {uploadingAttachment.file.name ? (
                    <div className="pt-2">
                      <div className="text-xs text-type-secondary">
                        {"Uploading " +
                          uploadingAttachment.file.name +
                          "... " +
                          parseFloat(uploadingAttachment.completed).toFixed(2) +
                          "%"}
                      </div>
                      <div className="flex mt-2">
                        <progress
                          className="progress progress-primary"
                          value={uploadingAttachment.completed}
                          max="100"
                        ></progress>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <Uploady
                    destination={{
                      url: process.env.NEXT_PUBLIC_OBJECTS_URL + "/upload",
                    }}
                  >
                    <UploadDropZone
                      className="flex items-center justify-center p-8 border border-grey border-dashed text-type-secondary"
                      onDragOverClassName="drag-over"
                    >
                      <UploadButton>
                        <span>Drag & Drop File(s) Here</span>
                      </UploadButton>
                    </UploadDropZone>
                    <LogProgress />
                  </Uploady>
                </div>
                <div className="text-right mt-4">
                  <div className="inline-block w-36">
                    <button
                      className={
                        "btn btn-sm btn-primary btn-block " +
                        (postingIssue ? "loading" : "")
                      }
                      disabled={title.trim().length === 0 || postingIssue}
                      onClick={createIssue}
                    >
                      Update Release
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-none sm:w-64 sm:pl-8 text-sm text-type-secondary mt-4 sm:mt-0">
              <h5 className="text-xl">Tagging Suggestions</h5>
              <p className="mt-4">
                It’s common practice to prefix your version names with the
                letter v. Some good tag names might be v1.0 or v2.3.4.
              </p>
              <p className="mt-2">
                If the tag isn’t meant for production use, add a pre-release
                version after the version name. Some good pre-release versions
                might be v0.2-alpha or v5.9-beta.3.
              </p>
              <p className="mt-2">
                If you’re new to releasing software, we highly recommend reading
                about{" "}
                <a
                  href="semver.org"
                  target="_blank"
                  rel="noreferrer"
                  className="link link-primary no-underline hover:underline"
                >
                  semantic versioning.
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    activeWallet: state.wallet.activeWallet,
  };
};

export default connect(mapStateToProps, { createRelease, createTag })(
  RepositoryReleaseEditView
);
