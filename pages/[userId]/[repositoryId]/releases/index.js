import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import {
  isCurrentUserEligibleToUpdate,
  deleteRelease,
} from "../../../../store/actions/repository";
import getRepositoryReleaseLatest from "../../../../helpers/getRepositoryReleaseLatest";
import ReleaseView from "../../../../components/repository/releaseView";
import useRepository from "../../../../hooks/useRepository";
import { useApiClient } from "../../../../context/ApiClientContext";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryReleasesView(props) {
  const { repository, refreshRepository } = useRepository();
  const [latestRelease, setLatestRelease] = useState(null);
  const [olderReleases, setOlderReleases] = useState([]);
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);
  const { apiClient } = useApiClient();

  const getReleases = async () => {
    if (repository) {
      const release = await getRepositoryReleaseLatest(
        apiClient,
        repository.owner.id,
        repository.name
      );
      console.log(release);
      if (release && release.id) setLatestRelease(release);
      if (repository.releases.length > 1) {
        const older = repository.releases
          .slice(0, repository.releases.length - 1)
          .reverse();
        setOlderReleases(older);
        console.log(older, repository.releases);
      } else {
        setOlderReleases([]);
      }
    }
  };

  useEffect(() => {
    getReleases();
  }, [repository]);

  useEffect(() => {
    async function updatePermissions() {
      setCurrentUserEditPermission(
        await props.isCurrentUserEligibleToUpdate(repository)
      );
    }
    updatePermissions();
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
      <div className="flex flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="code" />
          <div className="mt-4">
            {latestRelease ? (
              <ReleaseView
                repository={repository}
                release={latestRelease}
                latest={true}
                showEditControls={currentUserEditPermission}
                onDelete={async (id) => {
                  const res = await props.deleteRelease(apiClient, {
                    releaseId: id,
                  });
                  await refreshRepository();
                  return res;
                }}
              />
            ) : (
              ""
            )}
            {olderReleases.length ? (
              <div className="p-4 mt-8 text-xl text-type-secondary">
                Older Releases
              </div>
            ) : (
              ""
            )}
            {olderReleases.map((r, i) => {
              return (
                <div className="px-4 py-2" key={"release" + i}>
                  <Link
                    href={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/releases/tag/" +
                      r.tagName
                    }
                    className="text-xl link link-primary no-underline hover:underline"
                  >
                    {repository.name + " " + r.tagName}
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

export default connect(mapStateToProps, {
  isCurrentUserEligibleToUpdate,
  deleteRelease,
})(RepositoryReleasesView);
