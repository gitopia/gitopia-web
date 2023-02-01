import Head from "next/head";
import Header from "../../../../components/header";

import { useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import Footer from "../../../../components/footer";
import LabelEditor from "../../../../components/repository/labelEditor";
import LabelView from "../../../../components/repository/labelView";
import useRepository from "../../../../hooks/useRepository";
import { deleteRepositoryLabel } from "../../../../store/actions/repository";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryIssueLabelsView(props) {
  const router = useRouter();
  const { repository, refreshRepository } = useRepository();

  const [isAddingLabel, setIsAddingLabel] = useState(false);

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
          <RepositoryMainTabs repository={repository} active="issues" />
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
                  data-test="new_label"
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
                repoOwner={repository.owner.id}
                repoName={repository.name}
                onSuccess={async (label) => {
                  console.log(label);
                  refreshRepository();
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
                  repoOwner={repository.owner.id}
                  repoName={repository.name}
                  onDelete={async (id) => {
                    const res = await props.deleteRepositoryLabel({
                      repoOwner: repository.owner.id,
                      repoName: repository.name,
                      labelId: l.id,
                    });
                    if (res && res.code === 0) {
                      refreshRepository();
                    }
                  }}
                  refreshLabels={refreshRepository}
                  key={"labelview" + i}
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

export default connect(mapStateToProps, { deleteRepositoryLabel })(
  RepositoryIssueLabelsView
);
