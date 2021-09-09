import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import { getCommits } from "../../../../store/actions/git";
import { parseDiff, Diff, Hunk } from "react-diff-view";
import getDiff from "../../../../helpers/getDiff";
import getDiffStat from "../../../../helpers/getDiffStat";
import "react-diff-view/style/index.css";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryTreeView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    forks: [],
    stargazers: [],
  });

  const [files, setFiles] = useState([]);

  const renderFile = ({
    oldRevision,
    newRevision,
    type,
    hunks,
    oldPath,
    newPath,
  }) => {
    return hunks.length ? (
      <div className="mt-8 border border-grey rounded-md">
        <div className="bg-base-200 flex rounded-t-md">
          <div className="flex-1 flex text-sm px-4 py-4">
            <div className="badge badge-md mr-4">{type}</div>
            {type === "delete" ? (
              <div>
                <span>{oldPath}</span>
              </div>
            ) : (
              ""
            )}
            {type === "modify" ? (
              <div>
                <span>{oldPath}</span>
                <span className="px-4">&#8594;</span> <span>{newPath}</span>
              </div>
            ) : (
              ""
            )}
            {type === "added" ? (
              <div>
                <span>{newPath}</span>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="text-type-dark bg-base-content">
          <Diff
            key={oldRevision + "-" + newRevision}
            viewType="split"
            diffType={type}
            hunks={hunks}
          >
            {(hunks) =>
              hunks.map((hunk) => <Hunk key={hunk.content} hunk={hunk} />)
            }
          </Diff>
        </div>
      </div>
    ) : (
      ""
    );
  };

  useEffect(async () => {
    const r = await getUserRepository(repository.owner.id, repository.name);
    if (r) {
      setRepository({
        ...r,
      });
      const c = await getCommits(
        r.id,
        router.query.commitId,
        r.name,
        router.query.userId,
        1
      );
      console.log(c);
      if (c && c.length === 2) {
        const diff = await getDiff(r.id, router.query.commitId, c[1].oid);
        const files = parseDiff(diff, { nearbySequences: "zip" });
        setFiles(files);
        console.log(files);
      }
    }
  }, [router.query]);

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
        <main className="py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="code"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div>{files.map(renderFile)}</div>
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
