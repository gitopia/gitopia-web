import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";

import { initRepository } from "../../../../store/actions/git";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscdarkplus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import BranchSelector from "../../../../components/repository/branchSelector";
import Breadcrumbs from "../../../../components/repository/breadcrumbs";
import CommitDetailRow from "../../../../components/repository/commitDetailRow";
import FileBrowser from "../../../../components/repository/fileBrowser";
import Footer from "../../../../components/footer";
import getBranchSha from "../../../../helpers/getBranchSha";
import useRepository from "../../../../hooks/useRepository";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryTreeView(props) {
  const router = useRouter();
  const { repository } = useRepository();

  const [entityList, setEntityList] = useState([]);
  const [file, setFile] = useState(null);
  const [fileSyntax, setFileSyntax] = useState("");
  const [commitDetail, setCommitDetail] = useState({
    commit: { author: {}, message: "" },
    oid: "",
    branches: [],
    tags: [],
  });
  const [repoPath, setRepoPath] = useState([]);
  const [branchName, setBranchName] = useState("");
  const [isTag, setIsTag] = useState(false);
  // let repoPath = router.query.path || [];
  // let branchName = "";

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
        if (joinedPath.includes(branch)) {
          let path = joinedPath.replace(branch, "").split("/");
          path = path.filter((p) => p !== "");
          setBranchName(branch);
          setIsTag(false);
          setRepoPath(path);
          console.log("branchName", branch, "repoPath", path, "isTag", false);
          found = true;
          return false;
        }
        return true;
      });
      if (!found) {
        repository.tags.every((b) => {
          let branch = b.name;
          if (joinedPath.includes(branch)) {
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
  }, [router.query.path, repository]);

  useEffect(async () => {
    if (typeof window !== "undefined") {
      const res = await initRepository(
        repository.id,
        getBranchSha(branchName, repository.branches, repository.tags),
        repository.name,
        router.query.userId,
        repoPath
      );
      console.log(router.query.userId);
      if (res) {
        console.log(res);
        if (res.commit) {
          setCommitDetail(res.commit);
        }
        if (res.entity) {
          if (res.entity.tree) {
            setEntityList(res.entity.tree);
            setFile(null);
          } else if (res.entity.blob) {
            setEntityList([]);
            try {
              let decodedFile = new TextDecoder().decode(res.entity.blob);
              setFile(decodedFile);
              let filename = repoPath[repoPath.length - 1] || "";
              let extension = filename.split(".").pop() || "";
              setFileSyntax(extension);
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          console.log("Entity Not found");
        }
      } else {
        console.log("Repo Not found");
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
          <RepositoryMainTabs
            repoOwner={repository.owner.id}
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
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
                    commitDetail.oid
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
                {file !== null ? (
                  <SyntaxHighlighter
                    style={vscdarkplus}
                    language={fileSyntax}
                    showLineNumbers
                    customStyle={{ margin: 0, background: "transparent" }}
                  >
                    {file}
                  </SyntaxHighlighter>
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
