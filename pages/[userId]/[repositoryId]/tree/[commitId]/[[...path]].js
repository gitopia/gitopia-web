import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import getUserRepository from "../../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";

import {
  initRepository,
  loadDirectory,
} from "../../../../../store/actions/git";
import dayjs from "dayjs";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import vscdarkplus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

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
                <div className={"dropdown dropdown-end"}>
                  <div className="btn btn-sm btn-outline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <div className="flex-1 text-left">master</div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li>
                      <Link
                        href={[
                          "",
                          router.query.userId,
                          router.query.repositoryId,
                          "tree",
                          router.query.commitId,
                        ].join("/")}
                      >
                        <a>{router.query.repositoryId}</a>
                      </Link>
                    </li>
                    {repoPath.map((p, i) => {
                      return (
                        <li key={"breadcrumb" + i}>
                          <Link
                            href={[
                              "",
                              router.query.userId,
                              router.query.repositoryId,
                              "tree",
                              router.query.commitId,
                              ...repoPath.slice(0, i + 1),
                            ].join("/")}
                          >
                            <a>{repoPath[i]}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex mt-4">
              <div className="flex-1 border border-gray-700 rounded overflow-hidden">
                <div className="flex px-2 py-4 bg-base-200 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 flex-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="mr-4 flex-none">
                    {commitDetail.commit.author.name}
                  </div>
                  <div className="mr-4 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {commitDetail.commit.message}
                  </div>
                  <div className="mr-4 flex-none">
                    {commitDetail.oid.slice(0, 6)}
                  </div>
                  <div className="flex-none">
                    {dayjs(
                      (commitDetail.commit.author.timestamp +
                        commitDetail.commit.author.timezoneOffset) *
                        1000
                    ).format("DD MMM YY")}
                  </div>
                </div>
                {entityList.map((e, i) => {
                  return (
                    <Link
                      href={[
                        "",
                        router.query.userId,
                        router.query.repositoryId,
                        "tree",
                        router.query.commitId,
                        ...repoPath,
                        e.path,
                      ].join("/")}
                      key={"entity" + i}
                    >
                      <a className="flex px-2 py-2 items-center hover:bg-neutral">
                        {e.type === "blob" ? (
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
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        ) : (
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
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                          </svg>
                        )}

                        <div className="flex-1">{e.path}</div>
                      </a>
                    </Link>
                  );
                })}
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
