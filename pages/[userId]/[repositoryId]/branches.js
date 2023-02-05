import Head from "next/head";
import Header from "../../../components/header";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import dayjs from "dayjs";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import useRepository from "../../../hooks/useRepository";
import {
  isCurrentUserEligibleToUpdate,
  deleteBranch,
} from "../../../store/actions/repository";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function RepositoryBranchesView(props) {
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
          <div className="btn-group mt-14">
            <Link
              href={[
                "",
                router.query.userId,
                router.query.repositoryId,
                "branches",
              ].join("/")}
              className="btn btn-sm btn-active"
            >
              Branches
            </Link>
            <Link
              href={[
                "",
                router.query.userId,
                router.query.repositoryId,
                "tags",
              ].join("/")}
              className="btn btn-sm"
            >
              Tags
            </Link>
          </div>
          <div className="mt-14">
            {repository.branches.map((b) => {
              return (
                <div className="mt-8" key={b.name}>
                  <a className="flex">
                    <div>
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mt-1.5 mr-1"
                      >
                        <g transform="scale(0.8)">
                          <path
                            d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="8.5"
                            cy="18.5"
                            r="2.5"
                            fill="currentColor"
                          />
                          <circle
                            cx="8.5"
                            cy="5.5"
                            r="2.5"
                            fill="currentColor"
                          />
                          <path
                            d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                            fill="currentColor"
                          />
                        </g>
                      </svg>
                    </div>
                    <a
                      className="text-primary"
                      href={
                        "/" +
                        repository.owner.id +
                        "/" +
                        repository.name +
                        "/tree/" +
                        b.name
                      }
                    >
                      {b.name}
                    </a>
                    <button
                      className="btn btn-xs btn-ghost ml-1 mt-0.5"
                      onClick={(e) => {
                        navigator.clipboard.writeText(b.name);
                      }}
                    >
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
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                    {currentUserEditPermission ? (
                      <div className=" ml-10 flex-none text-sm sm:text-base w-10 sm:w-20">
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
                                .deleteBranch({
                                  repoOwnerId: repository.owner.id,
                                  repositoryName: repository.name,
                                  name: b.name,
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
                  </a>
                  <div className="text-xs text-type-secondary mt-2">
                    {"last updated " + dayjs(b.updatedAt * 1000).fromNow()}
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
  isCurrentUserEligibleToUpdate,
  deleteBranch,
})(RepositoryBranchesView);
