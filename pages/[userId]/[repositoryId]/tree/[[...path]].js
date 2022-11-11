import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";

import Header from "../../../../components/header";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";

import BranchSelector from "../../../../components/repository/branchSelector";
import Breadcrumbs from "../../../../components/repository/breadcrumbs";
import CommitDetailRow from "../../../../components/repository/commitDetailRow";
import FileBrowser from "../../../../components/repository/fileBrowser";
import Footer from "../../../../components/footer";
import getBranchSha from "../../../../helpers/getBranchSha";
import useRepository from "../../../../hooks/useRepository";
import dynamic from "next/dynamic";
import MarkdownWrapper from "../../../../components/markdownWrapper";
import getContent from "../../../../helpers/getContent";
import getCommitHistory from "../../../../helpers/getCommitHistory";
import { useErrorStatus } from "../../../../hooks/errorHandler";
import formatBytes from "../../../../helpers/formatBytes";

// let vscdarkplus;
import vscdarkplus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";

const SyntaxHighlighter = dynamic(async () => {
  // vscdarkplus = (
  //   await import("react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus")
  // ).default;
  return (await import("react-syntax-highlighter")).Prism;
});

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryTreeView(props) {
  const router = useRouter();
  const { repository } = useRepository();
  const { setErrorStatusCode } = useErrorStatus();

  const [entityList, setEntityList] = useState([]);
  const [hasMoreEntities, setHasMoreEntities] = useState(null);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [file, setFile] = useState(null);
  const [fileSyntax, setFileSyntax] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [showRenderedFile, setShowRenderedFile] = useState(false);
  const [showRenderedFileOption, setShowRenderedFileOption] = useState(false);
  const [isImageFile, setIsImageFile] = useState(false);
  const [commitDetail, setCommitDetail] = useState({
    author: {},
    message: "",
    title: "",
    id: "",
  });
  const [commitsLength, setCommitsLength] = useState(0);
  const [repoPath, setRepoPath] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [isTag, setIsTag] = useState(false);
  const [readmeFile, setReadmeFile] = useState(null);
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
  }, []);

  useEffect(async () => {
    console.log("query", router.query);
    if (repository.branches.length) {
      console.log(repository, router.query.path);
      if (!router.query.path) {
        setErrorStatusCode(404);
      }
      const joinedPath = router.query.path.join("/");
      let found = false;
      repository.branches.every((b) => {
        let branch = b.name;
        let branchTest = new RegExp("^" + branch);
        if (branchTest.test(joinedPath)) {
          let path = joinedPath.replace(branch, "").split("/");
          path = path.filter((p) => p !== "");
          setBranchName(branch);
          setIsTag(false);
          setRepoPath(path);
          console.log("branchName", branch, "repoPath", path, "isTag", false);
          found = true;
        }
        return true;
      });
      if (!found) {
        repository.tags.every((b) => {
          let branch = b.name;
          let branchTest = new RegExp("^" + branch);
          if (branchTest.test(joinedPath)) {
            let path = joinedPath.replace(branch, "").split("/");
            path = path.filter((p) => p !== "");
            setBranchName(branch);
            setIsTag(true);
            setRepoPath(path);
            console.log("branchName", branch, "repoPath", path, "isTag", true);
            found = true;
            return false;
          }
          return true;
        });
      }
      if (!found) {
        setErrorStatusCode(404);
      }
    }
  }, [router.query.path, repository.id]);

  const loadEntities = async (currentEntities = [], firstTime = false) => {
    if (typeof window !== "undefined") {
      setLoadingEntities(true);
      const res = await getContent(
        repository.id,
        getBranchSha(branchName, repository.branches, repository.tags),
        repoPath.join("/"),
        firstTime ? null : hasMoreEntities
      );
      console.log(res);
      if (res) {
        if (res.content) {
          if (res.content[0].type === "BLOB" && res.content[0].size) {
            // display file contents
            setEntityList([]);
            setReadmeFile(null);
            try {
              let filename = repoPath[repoPath.length - 1] || "";
              let extension = filename.split(".").pop() || "";
              setFileSyntax(extension);
              setFileSize(res.content[0].size);

              if (res.content[0].content) {
                if (
                  ["jpg", "jpeg", "png", "gif"].includes(
                    extension.toLowerCase()
                  )
                ) {
                  setIsImageFile(true);
                  setFile(res.content[0].content);
                } else {
                  setIsImageFile(false);
                  setFile(window.atob(res.content[0].content));
                }

                if (extension.toLowerCase() === "md") {
                  setShowRenderedFileOption(true);
                  setShowRenderedFile(true);
                } else {
                  setShowRenderedFileOption(false);
                  setShowRenderedFile(false);
                }
              } else {
                setFile("File size is too big to show (> 1MB)");
              }
            } catch (e) {
              // TODO: show error to user
              console.error(e);
              setFile(null);
              setFileSize(0);
              setShowRenderedFile(false);
              setIsImageFile(false);
              setShowRenderedFileOption(false);
            }
          } else {
            // display folder tree
            firstTime
              ? setEntityList(res.content)
              : setEntityList([...currentEntities, ...res.content]);
            setFile(null);

            const readmeRegex = new RegExp(/^README/gi);
            let readmeFileFound = false;
            for (let i = 0; i < res.content.length; i++) {
              if (readmeRegex.test(res.content[i].name)) {
                const readme = await getContent(
                  repository.id,
                  getBranchSha(
                    branchName,
                    repository.branches,
                    repository.tags
                  ),
                  res.content[i].name
                );

                if (readme) {
                  if (readme.content && readme.content[0]) {
                    try {
                      let file = window.atob(readme.content[0].content);
                      setReadmeFile(file);
                      readmeFileFound = true;
                      break;
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
            if (!readmeFileFound) {
              setReadmeFile(null);
            }
          }
        } else {
          setErrorStatusCode(404);
        }
        if (res.pagination && res.pagination.next_key) {
          setHasMoreEntities(res.pagination.next_key);
        } else {
          setHasMoreEntities(null);
        }
      }
      setLoadingEntities(false);
    }
  };

  useEffect(async () => {
    if (repository.branches.length) {
      loadEntities([], true);
      const commitHistory = await getCommitHistory(
        repository.id,
        getBranchSha(branchName, repository.branches, repository.tags),
        repoPath.join("/"),
        1
      );
      if (
        commitHistory &&
        commitHistory.commits &&
        commitHistory.commits.length
      ) {
        setCommitDetail(commitHistory.commits[0]);
        setCommitsLength(commitHistory.pagination.total);
      }
    }
  }, [repoPath]);

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
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="code" />
          <div className="">
            <div className="flex justify-start mt-8 flex-wrap gap-4">
              <div>
                <BranchSelector
                  branches={repository.branches}
                  tags={repository.tags}
                  branchName={branchName}
                  isTag={isTag}
                  baseUrl={
                    "/" + repository.owner.id + "/" + repository.name + "/tree"
                  }
                />
              </div>
              <div>
                <Breadcrumbs
                  branchName={branchName}
                  baseUrl={"/" + repository.owner.id + "/" + repository.name}
                  repoPath={repoPath}
                  repoName={repository.name}
                />
              </div>
            </div>
            <div className="flex mt-4">
              <div className="flex-1 border border-gray-700 rounded overflow-hidden">
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
                    branchName
                  }
                  commitsLength={commitsLength}
                  maxMessageLength={isMobile ? 0 : 90}
                  isMobile={isMobile}
                />
                <FileBrowser
                  entityList={entityList}
                  branchName={branchName}
                  baseUrl={"/" + repository.owner.id + "/" + repository.name}
                  repoPath={repoPath}
                  repoName={repository.name}
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
                {file !== null ? (
                  <div>
                    <div className="flex bg-base-200 p-2">
                      <div className="flex-1">{formatBytes(fileSize)} </div>
                      {showRenderedFileOption ? (
                        <div className="btn-group">
                          <input
                            type="radio"
                            name="options"
                            data-title="Source"
                            className="btn btn-xs"
                            checked={!showRenderedFile}
                            onChange={() => {
                              setShowRenderedFile(!showRenderedFile);
                            }}
                          />
                          <input
                            type="radio"
                            name="options"
                            data-title="Rendered"
                            className="btn btn-xs"
                            checked={showRenderedFile}
                            onChange={() => {
                              setShowRenderedFile(!showRenderedFile);
                            }}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {isImageFile ? (
                      <div className="flex justify-center align-center">
                        <img
                          src={"data:image/" + fileSyntax + ";base64, " + file}
                        />
                      </div>
                    ) : showRenderedFile ? (
                      <div className="markdown-body p-4">
                        <MarkdownWrapper
                          hrefBase={[
                            "",
                            repository.owner.id,
                            repository.name,
                            "tree",
                            branchName,
                          ].join("/")}
                        >
                          {file}
                        </MarkdownWrapper>
                      </div>
                    ) : (
                      <SyntaxHighlighter
                        style={vscdarkplus}
                        language={fileSyntax}
                        showLineNumbers
                        customStyle={{ margin: 0, background: "transparent" }}
                      >
                        {file}
                      </SyntaxHighlighter>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
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
                  branchName,
                ].join("/")}
              >
                {readmeFile}
              </MarkdownWrapper>
            </div>
          ) : (
            ""
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
  };
};

export default connect(mapStateToProps, {})(RepositoryTreeView);
