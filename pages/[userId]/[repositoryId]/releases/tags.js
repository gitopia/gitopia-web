import Head from "next/head";
import Header from "../../../../components/header";

import { connect } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import useRepository from "../../../../hooks/useRepository";
import {
  deleteTag,
  isCurrentUserEligibleToUpdate,
} from "../../../../store/actions/repository";

import dayjs from "dayjs";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryTagsView(props) {
  const router = useRouter();
  const { repository, refreshRepository } = useRepository();
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function updatePermissions() {
      setCurrentUserEditPermission(
        await props.isCurrentUserEligibleToUpdate(repository)
      );
    }
    updatePermissions();
  }, [repository]);

  return (
    <div
      data-theme="dark"
      className="bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{repository.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs repository={repository} active="code" />
          <div className="mt-8">
            <div className="flex-none w-36 ml-auto">
              <Link
                href={
                  "/" +
                  repository.owner.id +
                  "/" +
                  repository.name +
                  "/releases/new"
                }
                className="btn btn-primary btn-sm btn-block"
              >
                New Release
              </Link>
            </div>
            {/* TODO: Should just be tagged releases instead of all tags */}
            {repository.tags.map((t) => {
              return (
                <div className="mt-8" key={t.name}>
                  <div className="flex">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1 mr-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <div className="text-primary">{t.name}</div>
                    {currentUserEditPermission ? (
                      <div className="ml-2 flex-none text-sm sm:text-base w-10 sm:w-20">
                        <div
                          onClick={() => {
                            setConfirmDelete(true);
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="hover:cursor-pointer stroke-type-secondary hover:stroke-green"
                          >
                            <rect
                              x="6"
                              y="9"
                              width="12"
                              height="12"
                              strokeWidth="2"
                            />
                            <rect x="5.5" y="4.5" width="13" height="1" />
                            <rect x="9.5" y="2.5" width="5" height="1" />
                            <rect
                              x="10.5"
                              y="12.5"
                              width="5"
                              height="1"
                              transform="rotate(90 10.5 12.5)"
                            />
                            <rect
                              x="14.5"
                              y="12.5"
                              width="5"
                              height="1"
                              transform="rotate(90 14.5 12.5)"
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <input
                      type="checkbox"
                      checked={confirmDelete}
                      readOnly
                      className="modal-toggle"
                    />
                    <div className="modal">
                      <div className="modal-box">
                        <p>Are you sure ?</p>
                        <div className="modal-action">
                          <label
                            className="btn btn-sm"
                            onClick={() => {
                              setConfirmDelete(false);
                            }}
                          >
                            Cancel
                          </label>
                          <label
                            className={
                              "btn btn-sm btn-primary " +
                              (isDeleting ? "loading" : "")
                            }
                            onClick={async () => {
                              setIsDeleting(true);

                              props
                                .deleteTag({
                                  repoOwnerId: repository.owner.id,
                                  repositoryName: repository.name,
                                  name: t.name,
                                })
                                .then((res) => {
                                  if (res.code == 0) {
                                    refreshRepository();
                                    setConfirmDelete(false);
                                    setIsDeleting(false);
                                  }
                                });
                            }}
                          >
                            Delete
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-type-secondary mt-2">
                    {"last updated " + dayjs(t.updatedAt * 1000).fromNow()}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {
  deleteTag,
  isCurrentUserEligibleToUpdate,
})(RepositoryTagsView);
