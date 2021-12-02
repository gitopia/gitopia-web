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

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryInsightsView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    collaborators: [],
    forks: [],
    stargazers: [],
    branches: [],
    tags: [],
  });
  const [allRepos, setAllRepos] = useState([]);

  const refreshRepository = async () => {
    const r = await getUserRepository(
      router.query.userId,
      router.query.repositoryId
    );
    if (r) {
      setRepository(r);
      if (r.forks.length) {
        const pr = r.forks.map((r) => getRepository(r));
        const repos = await Promise.all(pr);
        setAllRepos(repos);
        console.log("repos", repos);
      }
    }
  };

  useEffect(refreshRepository, [router.query]);

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
      </div>
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
          <RepositoryMainTabs
            active="insights"
            hrefBase={repository.owner.id + "/" + repository.name}
            showSettings={true}
          />
          <div className="flex mt-8">
            <div className="flex-none w-64 py-4">
              <ul className="menu compact rounded bg-base-200">
                <li className="bordered">
                  <a className="">Forks</a>
                </li>
              </ul>
            </div>
            <div className="flex-1 p-4">
              <ul className="">
                <li>{ownerRepoLinkItem(repository, true)}</li>
                <li>
                  <ul className="my-1">
                    {allRepos.map((r) => {
                      return (
                        <li
                          className="flex border-l border-grey mx-1"
                          key={r.id}
                        >
                          <span className="text-grey mr-1">&mdash;</span>
                          {ownerRepoLinkItem(r)}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
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
