import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import { isCurrentUserEligibleToUpdate } from "../../../../store/actions/repository";
import getRepositoryReleaseAll from "../../../../helpers/getRepositoryReleaseAll";
import getRepositoryReleaseLatest from "../../../../helpers/getRepositoryReleaseLatest";
import ReleaseView from "../../../../components/repository/releaseView";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryReleasesView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    forks: [],
    stargazers: [],
    releases: [],
  });

  const [latestRelease, setLatestRelease] = useState({
    creator: "",
    attachments: [],
  });
  const [olderReleases, setOlderReleases] = useState([]);
  const [currentUserEditPermission, setCurrentUserEditPermission] = useState(
    false
  );

  useEffect(async () => {
    const r = await getUserRepository(repository.owner.id, repository.name);
    if (r) {
      setRepository(r);
      if (r.releases.length > 1) {
        const older = r.releases.slice(0, r.releases.length - 2).reverse();
        setOlderReleases(older);
      } else {
        setOlderReleases([]);
      }

      console.log(r);
    }
  }, [router.query.repositoryId, router.query.userId]);

  const getLatestRelease = async () => {
    if (repository) {
      const release = await getRepositoryReleaseLatest(
        repository.owner.id,
        repository.name
      );
      console.log(release);
      if (release) setLatestRelease(release);
    }
  };

  useEffect(getLatestRelease, [repository]);

  useEffect(async () => {
    setCurrentUserEditPermission(
      await props.isCurrentUserEligibleToUpdate(repository.owner.id)
    );
  }, [repository, props.user]);

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
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
            showSettings={currentUserEditPermission}
          />
          <div className="flex mt-8">
            <div className="form-control flex-1 mr-8">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pr-16 input input-ghost input-sm input-bordered"
                />
                <button className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div> */}
            </div>
            <div className="flex-none w-36">
              <Link
                href={
                  "/" +
                  repository.owner.id +
                  "/" +
                  repository.name +
                  "/releases/new"
                }
              >
                <button className="btn btn-primary btn-sm btn-block">
                  New Release
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <ReleaseView
              repository={repository}
              release={latestRelease}
              latest={true}
            />
            {olderReleases.map((r) => {
              return (
                <div>
                  <Link
                    href={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/releases/" +
                      r.tagName
                    }
                  >
                    <a className="text-3xl link link-primary no-underline hover:underline">
                      {repository.name + " " + r.tagName}
                    </a>
                  </Link>
                </div>
              );
            })}
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
    user: state.user,
  };
};

export default connect(mapStateToProps, { isCurrentUserEligibleToUpdate })(
  RepositoryReleasesView
);
