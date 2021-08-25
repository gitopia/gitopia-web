import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { initRepository } from "../../../store/actions/git";

import getUserRepository from "../../../helpers/getUserRepository";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import EmptyRepository from "../../../components/repository/emptyRepository";
import BranchSelector from "../../../components/repository/branchSelector";
import Breadcrumbs from "../../../components/repository/breadcrumbs";
import CommitDetailRow from "../../../components/repository/commitDetailRow";
import FileBrowser from "../../../components/repository/fileBrowser";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { ID: router.query.userId },
    branches: [],
  });

  const [entityList, setEntityList] = useState([]);
  const [readmeFile, setReadmeFile] = useState(null);
  const [commitDetail, setCommitDetail] = useState({
    commit: { author: {}, message: "" },
    oid: "",
  });

  useEffect(async () => {
    const r = await getUserRepository(repository.owner.ID, repository.name);
    if (r) setRepository(r);
    if (typeof window !== "undefined") {
      const res = await initRepository(
        "5",
        "803ef70fd9f65ef800567ff9456fac525bc3e3c2",
        "bitcoin",
        router.query.userId,
        []
      );
      if (res) {
        if (res.commit) {
          setCommitDetail(res.commit);
        }
        if (res.entity) {
          if (res.entity.tree) {
            setEntityList(res.entity.tree);
          }
        } else {
          console.log("Entity Not found");
        }
      } else {
        console.log("Repo Not found");
      }
      const readme = await initRepository(
        "5",
        "803ef70fd9f65ef800567ff9456fac525bc3e3c2",
        "bitcoin",
        router.query.userId,
        ["README.md"]
      );
      if (readme) {
        if (readme.entity) {
          if (readme.entity.blob) {
            try {
              let decodedFile = new TextDecoder().decode(readme.entity.blob);
              setReadmeFile(decodedFile);
            } catch (e) {
              console.error(e);
              setReadmeFile(null);
            }
          }
        } else {
          console.log("Entity Not found");
        }
      }
    }
  }, []);

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
          {/* {repository.branches.length ? ( */}

          <div className="">
            <div className="flex justify-start mt-8">
              <div className="">
                <BranchSelector repository={repository} />
              </div>
              <div className="ml-4">
                <Link
                  href={
                    repository.owner.ID + "/" + repository.name + "/branches"
                  }
                >
                  <a className="btn btn-ghost btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    {repository.branches.length} Branches
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex mt-8">
              <div className="flex-1 border border-gray-700 rounded overflow-hidden">
                <CommitDetailRow commitDetail={commitDetail} />
                <FileBrowser
                  entityList={entityList}
                  query={{ commitId: "master", ...router.query }}
                />
              </div>
              <div className="flex-none w-64 pl-8">
                <div>
                  <div className="flex-1 text-left px-3 mb-1">About</div>

                  <div className="text-xs px-3">No description</div>
                </div>
                <div className="divider"></div>
                <div>
                  <div className="flex-1 text-left px-3 mb-1">Releases</div>

                  <div className="text-xs px-3">None yet</div>
                </div>
                <div className="divider"></div>
                <div>
                  <div className="flex-1 text-left  px-3 mb-1">Packages</div>

                  <div className="text-xs px-3">None yet</div>
                </div>
              </div>
            </div>
            <div className="flex mt-8">
              {readmeFile ? (
                <div className="flex-1 border border-gray-700 rounded overflow-hidden p-4 markdown-body">
                  <ReactMarkdown>{readmeFile}</ReactMarkdown>
                </div>
              ) : (
                <div>No readme file</div>
              )}
              <div className="flex-none w-64 pl-8"></div>
            </div>
          </div>

          {/* ) : ( */}
          {/* <EmptyRepository repository={repository} /> */}
          {/* )} */}
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

export default connect(mapStateToProps, {})(RepositoryView);
