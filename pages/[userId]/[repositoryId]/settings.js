import Head from "next/head";
import Header from "../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";

import getUserRepository from "../../../helpers/getUserRepository";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import Footer from "../../../components/footer";
import TextInput from "../../../components/textInput";
import RenameRepository from "../../../components/repository/renameRepository";
import CollaboratorsList from "../../../components/repository/collaboratorsList";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    collaborators: [],
    forks: [],
    stargazers: [],
  });

  useEffect(async () => {
    const r = await getUserRepository(
      router.query.userId,
      router.query.repositoryId
    );
    if (r) {
      setRepository(r);
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
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="settings"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div className="flex mt-8">
            <div className="flex-none w-64">
              <ul className="menu py-4">
                <li>
                  <a className="rounded" href="#repository">
                    Repository
                  </a>
                </li>
                <li>
                  <a className="rounded" href="#collaborators">
                    Collaborators
                  </a>
                </li>
                <li>
                  <a className="rounded" href="#permissions">
                    Permissions
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-1 px-4">
              <div className="divide-y divide-grey">
                <div className="text-2xl py-6" id="repository">
                  Repository
                </div>
                <div className="py-6">
                  <RenameRepository
                    currentName={repository.name}
                    repoId={repository.id}
                    onSuccess={async (newRepoName) => {
                      const url = [
                        "",
                        repository.owner.id,
                        newRepoName,
                        "settings",
                      ].join("/");
                      console.log("goto", url);
                      router.push(url);
                    }}
                  />
                </div>
                <div className="flex py-6 items-center">
                  <div className="flex-1 mr-8">
                    <div className="label-text">Transfer Ownership</div>
                    <div className="label-text-alt text-type-secondary">
                      Transfer this repository to another use or to an
                      organization where you have the ability to create
                      repositories
                    </div>
                  </div>
                  <div className="flex-none w-52">
                    <button className="btn btn-sm btn-block btn-accent btn-outline">
                      Transfer Ownership
                    </button>
                  </div>
                </div>
                <div className="flex py-6 items-center">
                  <div className="flex-1 mr-8">
                    <div className="label-text">Archive Repository</div>
                    <div className="label-text-alt text-type-secondary">
                      Mark this repository as archived and read-only
                    </div>
                  </div>
                  <div className="flex-none w-52">
                    <button className="btn btn-sm btn-block btn-accent btn-outline">
                      Archive Repository
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 divide-y divide-grey">
                <div className="text-2xl py-6" id="collaborators">
                  Collaborators
                </div>
                <div className="py-4">
                  <CollaboratorsList collaborators={repository.collaborators} />
                </div>
              </div>
              <div className="mt-8 divide-y divide-grey">
                <div className="text-2xl py-6" id="permissions">
                  Permissions
                </div>
                <div className="form-control py-4">
                  <label className="cursor-pointer label">
                    <div>
                      <div className="label-text">Allow merge commits</div>
                      <div className="label-text-alt text-type-secondary">
                        Add all commits from the head branch to the base branch
                        with merge commit
                      </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control py-4">
                  <label className="cursor-pointer label">
                    <div>
                      <div className="label-text">Allow squash commits</div>
                      <div className="label-text-alt text-type-secondary">
                        Combine all commits from the head branch into a single
                        commit in the base branch
                      </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control py-4">
                  <label className="cursor-pointer label">
                    <div>
                      <div className="label-text">Allow rebase commits</div>
                      <div className="label-text-alt text-type-secondary">
                        Add all commits from the head branch onto the base
                        branch individually
                      </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control py-4">
                  <label className="cursor-pointer label">
                    <div>
                      <div className="label-text">Allow Forking</div>
                      <div className="label-text-alt text-type-secondary">
                        Add all commits from the head branch onto the base
                        branch individually
                      </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control py-4">
                  <label className="cursor-pointer label">
                    <div>
                      <div className="label-text">Enable Issues</div>
                      <div className="label-text-alt text-type-secondary">
                        Allow people to raise issues
                      </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
              </div>
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

export default connect(mapStateToProps, {})(RepositoryView);
