import Head from "next/head";
import Header from "../../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import RepositoryHeader from "../../../../../components/repository/header";
import RepositoryMainTabs from "../../../../../components/repository/mainTabs";
import Footer from "../../../../../components/footer";
import {
  isCurrentUserEligibleToUpdate,
  deleteRelease,
} from "../../../../../store/actions/repository";
import getRepositoryRelease from "../../../../../helpers/getRepositoryRelease";
import ReleaseView from "../../../../../components/repository/releaseView";
import useRepository from "../../../../../hooks/useRepository";
import { useErrorStatus } from "../../../../../hooks/errorHandler";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryReleaseView(props) {
  const router = useRouter();
  const { repository } = useRepository();
  const { setErrorStatusCode } = useErrorStatus();

  const [release, setRelease] = useState({
    creator: "",
    attachments: [],
  });
  const [isLatest, setIsLatest] = useState(false);
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);

  useEffect(async () => {
    if (repository.releases.length) {
      const latest = repository.releases.slice(-1);
      console.log("latest", latest);
      if (latest[0].tagName == router.query.tagName) {
        setIsLatest(true);
      } else {
        setIsLatest(false);
      }
    }
  }, [repository, router.query.tagName]);

  const getRelease = async () => {
    if (repository) {
      const rel = await getRepositoryRelease(
        repository.owner.id,
        repository.name,
        router.query.tagName
      );
      console.log(rel);

      if (rel && rel.id) {
        setRelease(rel);
      } else {
        setErrorStatusCode(404);
      }
    }
  };

  useEffect(getRelease, [repository]);

  useEffect(async () => {
    setCurrentUserEditPermission(
      await props.isCurrentUserEligibleToUpdate(repository)
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
          <RepositoryMainTabs repository={repository} active="code" />

          <div className="mt-4 space-y-4">
            <ReleaseView
              repository={repository}
              release={release}
              latest={isLatest}
              showEditControls={currentUserEditPermission}
              onDelete={async (id) => {
                const res = await props.deleteRelease({ releaseId: id });
                if (res && res.code === 0) {
                  router.push(
                    "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/releases"
                  );
                }
              }}
              noLink={true}
            />
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
})(RepositoryReleaseView);
