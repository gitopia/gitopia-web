import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Head from "next/head";

import Header from "../../../../components/header";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";

import vscdarkplus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import BranchSelector from "../../../../components/repository/branchSelector";
import Breadcrumbs from "../../../../components/repository/breadcrumbs";
import CommitDetailRow from "../../../../components/repository/commitDetailRow";
import FileBrowser from "../../../../components/repository/fileBrowser";
import Footer from "../../../../components/footer";
import getBranchSha from "../../../../helpers/getBranchSha";
import useRepository from "../../../../hooks/useRepository";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import getContent from "../../../../helpers/getContent";
import getCommitHistory from "../../../../helpers/getCommitHistory";

const SyntaxHighlighter = dynamic(
  async () => (await import("react-syntax-highlighter")).Prism
);

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryTreeView(props) {
  const router = useRouter();
  const { repository } = useRepository();

  const [entityList, setEntityList] = useState([]);
  const [hasMoreEntities, setHasMoreEntities] = useState(null);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [file, setFile] = useState(null);
  const [fileSyntax, setFileSyntax] = useState("");
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

  useEffect(async () => {
    console.log("query", router.query);
    if (repository) {
      console.log(repository);
      if (!router.query.path) {
        // TODO: show 404 page
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
        // TODO: show 404 page
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
          if (res.content[0].type === "BLOB" && res.content[0].content) {
            // display file contents
            setEntityList([]);
            try {
              let file = window.atob(res.content[0].content);
              setFile(file);
              let filename = repoPath[repoPath.length - 1] || "";
              let extension = filename.split(".").pop() || "";
              setFileSyntax(extension);
            } catch (e) {
              // TODO: show error to user
              console.error(e);
              setFile(null);
            }
          } else {
            // display folder tree
            firstTime
              ? setEntityList(res.content)
              : setEntityList([...currentEntities, ...res.content]);
            setFile(null);
          }
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
    loadEntities([], true);
    const commitHistory = await getCommitHistory(
      repository.id,
      getBranchSha(branchName, repository.branches, repository.tags),
      repoPath.join("/"),
      1
    );
    console.log(commitHistory);
    if (
      commitHistory &&
      commitHistory.commits &&
      commitHistory.commits.length
    ) {
      setCommitDetail(commitHistory.commits[0]);
      setCommitsLength(commitHistory.pagination.total);
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
            <div className="flex justify-start mt-8">
              <div className="">
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
              <div className="ml-4">
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
                  maxMessageLength={90}
                />
                <FileBrowser
                  entityList={entityList}
                  branchName={branchName}
                  baseUrl={"/" + repository.owner.id + "/" + repository.name}
                  repoPath={repoPath}
                  repoName={repository.name}
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
                  fileSyntax === "md" ? (
                    <div className="markdown-body p-4">
                      <ReactMarkdown>{file}</ReactMarkdown>
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
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
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
