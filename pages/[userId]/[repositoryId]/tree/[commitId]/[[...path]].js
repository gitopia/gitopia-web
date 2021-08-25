import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";

import { initRepository } from "../../../../../store/actions/git";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import vscdarkplus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";
import BranchSelector from "../../../../../components/repository/branchSelector";
import Breadcrumbs from "../../../../../components/repository/breadcrumbs";
import CommitDetailRow from "../../../../../components/repository/commitDetailRow";
import FileBrowser from "../../../../../components/repository/fileBrowser";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryTreeView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { ID: router.query.userId },
  });

  const [entityList, setEntityList] = useState([]);
  const [file, setFile] = useState(null);
  const [fileSyntax, setFileSyntax] = useState("");
  const [commitDetail, setCommitDetail] = useState({
    commit: { author: {}, message: "" },
    oid: "",
  });

  const repoPath = router.query.path || [];

  useEffect(async () => {
    console.log("query", router.query);
    const r = await getUserRepository(repository.owner.ID, repository.name);
    if (r) {
      setRepository({
        ...r,
      });
    }

    if (typeof window !== "undefined") {
      const res = await initRepository(
        "5",
        "803ef70fd9f65ef800567ff9456fac525bc3e3c2",
        "bitcoin",
        router.query.userId,
        repoPath
      );
      if (res) {
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
  }, [router.query]);

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
        <main className="container mx-auto max-w-screen-lg py-12">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="code"
            hrefBase={repository.owner.ID + "/" + repository.name}
          />
          <div className="">
            <div className="flex justify-start mt-8">
              <div className="">
                <BranchSelector repository={repository} />
              </div>
              <div className="ml-4">
                <Breadcrumbs query={router.query} />
              </div>
            </div>
            <div className="flex mt-4">
              <div className="flex-1 border border-gray-700 rounded overflow-hidden">
                <CommitDetailRow commitDetail={commitDetail} />
                <FileBrowser entityList={entityList} query={router.query} />
                {file !== null ? (
                  <SyntaxHighlighter
                    style={vscdarkplus}
                    language={fileSyntax}
                    showLineNumbers
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
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(RepositoryTreeView);
