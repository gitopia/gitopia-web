import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import LabelEditor from "../../../../components/repository/labelEditor";
import LabelView from "../../../../components/repository/labelView";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryIssueLabelsView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    issues: [],
    labels: [],
    forks: [],
    stargazers: [],
    branches: [],
    tags: [],
  });

  const [isAddingLabel, setIsAddingLabel] = useState(false);

  const refreshLabels = async () => {
    const r = await getUserRepository(repository.owner.id, repository.name);
    console.log(r);
    if (r) setRepository(r);
  };

  useEffect(refreshLabels, [router.query]);

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
            active="issues"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div className="px-4 py-2 mt-8 rounded flex">
            <div className="flex-1">
              {repository.labels.length
                ? repository.labels.length + " Labels"
                : "No labels created yet"}{" "}
            </div>

            <div className="flex-none w-44">
              {!isAddingLabel ? (
                <button
                  className="btn btn-primary btn-sm btn-block"
                  onClick={() => {
                    setIsAddingLabel(true);
                  }}
                >
                  New Label
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          {isAddingLabel ? (
            <div className="border border-grey rounded p-4 my-4">
              <LabelEditor
                repoId={repository.id}
                onSuccess={async (label) => {
                  console.log(label);
                  await refreshLabels();
                  setIsAddingLabel(false);
                }}
                onCancel={() => {
                  setIsAddingLabel(false);
                }}
              />
            </div>
          ) : (
            ""
          )}
          <div className="mt-2 divide-y divide-grey">
            {repository.labels.map((l, i) => {
              return (
                <LabelView
                  label={l}
                  repoId={repository.id}
                  refreshLabels={refreshLabels}
                />
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
  };
};

export default connect(mapStateToProps, {})(RepositoryIssueLabelsView);
