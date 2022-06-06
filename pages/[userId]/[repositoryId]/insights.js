import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../helpers/getUserRepository";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import Footer from "../../../components/footer";
import Link from "next/link";
import dayjs from "dayjs";
import getRepository from "../../../helpers/getRepository";
import shrinkAddress from "../../../helpers/shrinkAddress";
import useRepository from "../../../hooks/useRepository";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryInsightsView(props) {
  const { repository } = useRepository();
  const [childRepos, setChildRepos] = useState([]);
  const [parentRepo, setParentRepo] = useState(null);

  const refreshRepositoryForks = async () => {
    if (repository.id) {
      if (repository.forks.length) {
        const pr = repository.forks.map((r) => getRepository(r));
        const repos = await Promise.all(pr);
        setChildRepos(repos);
        console.log("repos", repos);
      }
      if (repository.parent !== "0") {
        const repo = await getRepository(repository.parent);
        if (repo) {
          setParentRepo(repo);
        }
      }
    }
  };

  useEffect(refreshRepositoryForks, [repository]);

  const ownerRepoLinkItem = (r, current = false) => {
    return (
      <div className="flex items-center">
        <div>
          <Link href={"/" + r.owner.id}>
            <a
              className={
                "text-sm btn-link " + (current ? "text-type-secondary" : "")
              }
            >
              {shrinkAddress(r.owner.id)}
            </a>
          </Link>
        </div>
        <span className="text-sm text-type-quaternary mx-2">/</span>
        <div>
          <Link href={"/" + r.owner.id + "/" + r.name}>
            <a
              className={
                "text-sm btn-link " + (current ? "text-type-secondary" : "")
              }
            >
              {r.name}
            </a>
          </Link>
        </div>
        {current ? (
          <div className="ml-2 badge badge-sm bg-purple-900 text-purple-50 border-purple-900">
            Current Repository
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  const renderDescendents = (hasParent = false) => {
    return (
      <>
        <li className={hasParent ? "flex border-l border-grey mx-1" : ""}>
          {hasParent ? <span className="text-grey mr-1">&mdash;</span> : ""}
          {ownerRepoLinkItem(repository, true)}
        </li>
        {childRepos.length ? (
          <li className={hasParent ? "flex mx-1" : ""}>
            {hasParent ? (
              <span className="text-transparent mr-1">&mdash;</span>
            ) : (
              ""
            )}
            <ul className="my-1">
              {childRepos.map((r) => {
                return (
                  <li className="flex border-l border-grey mx-1" key={r.id}>
                    <span className="text-grey mr-1">&mdash;</span>
                    {ownerRepoLinkItem(r)}
                  </li>
                );
              })}
            </ul>
          </li>
        ) : (
          ""
        )}
      </>
    );
  };

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
          <RepositoryMainTabs repository={repository} active="insights" />
          <div className="sm:flex mt-8">
            <div className="flex-none w-64 py-4">
              <ul className="menu compact rounded bg-base-200">
                <li className="bordered">
                  <a className="">Forks</a>
                </li>
              </ul>
            </div>
            <div className="flex-1 sm:p-4">
              {parentRepo ? (
                <ul>
                  <li>{ownerRepoLinkItem(parentRepo)}</li>
                  <ul className="my-1">{renderDescendents(true)}</ul>
                </ul>
              ) : (
                <ul>{renderDescendents()}</ul>
              )}
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

export default connect(mapStateToProps, {})(RepositoryInsightsView);
