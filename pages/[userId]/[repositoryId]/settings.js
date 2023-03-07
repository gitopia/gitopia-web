import Head from "next/head";
import Header from "../../../components/header";

import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import Footer from "../../../components/footer";
import RenameRepository from "../../../components/repository/renameRepository";
import ChangeDefaultBranch from "../../../components/repository/changeDefaultBranch";
import CollaboratorsList from "../../../components/repository/collaboratorsList";
import TransferOwnership from "../../../components/repository/transferOwnership";
import DeleteRepository from "../../../components/repository/deleteRepository";
import useRepository from "../../../hooks/useRepository";
import ToggleForking from "../../../components/repository/toggleForking";
import useWindowSize from "../../../hooks/useWindowSize";
import BranchProtectionRules from "../../../components/repository/branchProtectionRules";
import { notify } from "reapop";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositorySettingsView(props) {
  const router = useRouter();
  const { repository, refreshRepository } = useRepository();
  const { isMobile } = useWindowSize();

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
          <RepositoryMainTabs repository={repository} active="settings" />
          <div className="sm:flex mt-4 sm:mt-8">
            {!isMobile ? (
              <div className="flex-none w-64">
                <ul className="menu py-4">
                  <li>
                    <a className="rounded" href="#repository">
                      Repository
                    </a>
                  </li>
                  <li>
                    <a className="rounded" href="#branches">
                      Branches
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
            ) : (
              ""
            )}
            <div className="flex-1 sm:px-4">
              <div className="divide-y divide-grey">
                <div
                  className="text-lg sm:text-2xl py-4 sm:py-6"
                  id="repository"
                >
                  Repository
                </div>
                <div className="sm:px-4 py-4 sm:py-6">
                  <RenameRepository
                    currentName={repository.name}
                    repoId={repository.id}
                    repoName={repository.name}
                    repoOwner={repository.owner.id}
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
                  <div className="mt-6">
                    <TransferOwnership
                      currentOwnerId={repository.owner.id}
                      repoName={repository.name}
                      repoId={repository.id}
                      onSuccess={async (newOwnerId) => {
                        const url = [
                          "",
                          newOwnerId,
                          repository.name,
                          "settings",
                        ].join("/");
                        console.log("goto", url);
                        router.push(url);
                      }}
                    />
                  </div>
                  <div className="mt-6">
                    <DeleteRepository
                      currentOwnerId={repository.owner.id}
                      repoName={repository.name}
                      onSuccess={async () => {
                        router.push("/home");
                      }}
                    />
                  </div>
                </div>
                {/* <div className="flex py-6 items-center">
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
                </div> */}
              </div>
              <div className="mt-2 sm:mt-8 divide-y divide-grey">
                <div className="text-lg sm:text-2xl py-4 sm:py-6" id="branches">
                  Branches
                </div>
                <div className="sm:px-4 py-4 sm:py-6">
                  <ChangeDefaultBranch
                    repoId={repository.id}
                    repoName={repository.name}
                    repoOwner={repository.owner.id}
                    repoDefaultBranch={repository.defaultBranch}
                    onSuccess={(name) => {
                      props.notify("updated default branch to " + name, "info");
                    }}
                  />
                  <div className="mt-6">
                    <BranchProtectionRules
                      repoId={repository.id}
                      repoName={repository.name}
                      repoOwner={repository.owner.id}
                      onSuccess={async (branch) => {
                        props.notify(
                          "Disabled forch push in " + branch + " branch",
                          "info"
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-8 divide-y divide-grey">
                <div
                  className="text-lg sm:text-2xl py-4 sm:py-6"
                  id="collaborators"
                >
                  Collaborators
                </div>
                <div className="py-4">
                  <CollaboratorsList
                    repoName={repository.name}
                    repoOwnerId={repository.owner.id}
                    collaborators={[
                      { id: repository.owner.id, permission: "CREATOR" },
                      ...repository.collaborators,
                    ]}
                    refreshRepository={refreshRepository}
                  />
                </div>
              </div>
              <div className="sm:mt-8 divide-y divide-grey">
                <div
                  className="text-lg sm:text-2xl py-4 sm:py-6"
                  id="permissions"
                >
                  Permissions
                </div>
                {/* <div className="form-control py-4">
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
                </div> */}
                <div className="form-control sm:px-4 py-4 sm:py-6">
                  <ToggleForking
                    repoOwner={repository.owner.id}
                    repoName={repository.name}
                    allowForking={repository.allowForking}
                    onSuccess={refreshRepository}
                  />
                </div>
                {/* <div className="form-control py-4">
                  <label className="cursor-pointer label">
                    <div>
                      <div className="label-text">Enable Issues</div>
                      <div className="label-text-alt text-type-secondary">
                        Allow people to raise issues
                      </div>
                    </div>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div> */}
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

export default connect(mapStateToProps, { notify })(RepositorySettingsView);
