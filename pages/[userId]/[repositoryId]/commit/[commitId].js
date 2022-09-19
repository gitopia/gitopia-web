import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import getDiff from "../../../../helpers/getDiff";
import useRepository from "../../../../hooks/useRepository";
import CommitDetailRow from "../../../../components/repository/commitDetailRow";
import DiffView from "../../../../components/repository/diffView";
import getCommit from "../../../../helpers/getCommit";
import { useErrorStatus } from "../../../../hooks/errorHandler";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryCommitDiffView(props) {
  const router = useRouter();
  const { repository } = useRepository();
  const { setErrorStatusCode } = useErrorStatus();

  const [viewType, setViewType] = useState("unified");

  const [commit, setCommit] = useState({
    message: "",
    title: "",
    author: {},
    stat: { addition: 0, deletion: 0 },
    id: "",
  });

  useEffect(async () => {
    if (repository.id) {
      const c = await getCommit(repository.id, router.query.commitId);
      if (c && c.id) {
        const data = await getDiff(
          Number(repository.id),
          router.query.commitId,
          null,
          null,
          true
        );
        if (data) {
          setCommit({ ...c, ...data });
        }
      } else {
        setErrorStatusCode(404);
      }
    }
  }, [router.query, repository.id]);

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
        <main
          className={
            "py-12 px-4 " +
            (viewType === "unified" ? "container mx-auto max-w-screen-lg" : "")
          }
        >
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="code" />
          <div className="my-8 border border-grey rounded-md overflow-hidden">
            <CommitDetailRow commitDetail={commit} maxMessageLength={90} />
          </div>
          <DiffView
            stats={commit}
            repoId={repository.id}
            baseRepoId={repository.id}
            currentSha={router.query.commitId}
            onViewTypeChange={(v) => setViewType(v)}
          />
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

export default connect(mapStateToProps, {})(RepositoryCommitDiffView);
