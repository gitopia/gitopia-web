import Link from "next/link";
import FaucetReceiver from "../faucetReceiver";
import AllowanceReceiver from "../allowanceReceiver";
import GreetUser from "../greetUser";
import PromptBackupWallet from "../promptBackupWallet";
import ActivityFeed from "./activityFeed";
import client from "../../helpers/apolloClient";
import { useLazyQuery, gql, useQuery } from "@apollo/client";
import { useState } from "react";
import AccountCard from "../account/card";

const QUERY_USER_REPOSITORIES = gql`
  query UserRepositories($address: String = "") {
    user(id: $address) {
      username
      repositoriesCreated {
        repository {
          updatedAt
          name
        }
      }
      memberOf {
        dao {
          repositoriesCreated {
            repository {
              name
              updatedAt
            }
          }
          name
          username
          members {
            user {
              name
              username
              avatarUrl
              description
              address
            }
          }
        }
        role
      }
      collaboratorOf {
        repository {
          name
          updatedAt
          owner {
            owner {
              username
            }
          }
        }
        permission
      }
    }
  }
`;

function UserDashboard(props) {
  const [tab, setTab] = useState("repositories");

  const { data, error, loading } = useQuery(QUERY_USER_REPOSITORIES, {
    client: client,
    variables: { address: "gitopia1mnzcusakrmucyqgz4zzemupzu385ayyy96p45t" },
  });

  return (
    <main className="container mx-auto py-4 sm:py-12">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="w-full max-w-md px-2 sm:px-0">
          <div className="mb-8">
            {process.env.NEXT_PUBLIC_FEE_GRANTER ? (
              <AllowanceReceiver />
            ) : (
              <FaucetReceiver />
            )}
          </div>
          <div className="mb-8">
            <GreetUser />
          </div>
          <div className="mb-8">
            <PromptBackupWallet />
          </div>
          <div className="mt-4">
            {/* <div className="text-xs text-type-tertiary uppercase font-bold px-4">
              Your Repositories
            </div> */}
            <div className="mt-4">
              {data?.user?.repositoriesCreated?.map((r) => {
                return (
                  <div>
                    <Link
                      className="btn btn-ghost btn-block btn-sm justify-start"
                      href={data.user.username + "/" + r.repository.name}
                    >
                      <span className="mr-1 mt-px">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          stroke="currentColor"
                        >
                          <path d="M9.5 7L4.5 12L9.5 17" strokeWidth="2" />
                          <path d="M14.5 7L19.5 12L14.5 17" strokeWidth="2" />
                        </svg>
                      </span>
                      <span>{r.repository.name}</span>
                    </Link>
                  </div>
                );
              })}
              {data?.user?.collaboratorOf?.map((m) => {
                return (
                  <div>
                    {m.repository?.map((r) => {
                      <Link
                        className="btn btn-ghost btn-block btn-sm justify-start"
                        href={r.owner.owner.username + "/" + r.name}
                      >
                        <span className="mr-1 mt-px">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            stroke="currentColor"
                          >
                            <path d="M9.5 7L4.5 12L9.5 17" strokeWidth="2" />
                            <path d="M14.5 7L19.5 12L14.5 17" strokeWidth="2" />
                          </svg>
                        </span>
                        <span>{r.owner.owner.username + "/" + r.name}</span>
                      </Link>;
                    })}
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <Link
                href="/new"
                className="btn btn-outline btn-wide btn-sm bg-box-grad-tl ml-4"
                data-test="create-new-repo"
              >
                <img className="w-4 h-4 mr-2 flex-none" src="repository.svg" />
                <div className="mr-6 flex-1">New Repository</div>
              </Link>
            </div>
            {/* <div className="text-xs text-type-tertiary uppercase font-bold px-4 mt-8">
              Other Repositories
            </div> */}
            <div className="mt-8">
              {data?.user?.memberOf?.map((m) => {
                return (
                  <div>
                    <div className="flex mb-2">
                      <Link
                        className="link link-primary no-underline ml-4"
                        href={m.dao?.username}
                      >
                        {m.dao?.name}
                      </Link>
                      <div className="ml-2">
                        {m.dao?.members?.map((m) => {
                          return (
                            <span className="ml-1">
                              <AccountCard
                                id={m?.user?.address}
                                showAvatar={true}
                                showId={false}
                                initialData={{ id: m.user.address, ...m.user }}
                                avatarSize="xxs"
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {m.dao?.repositoriesCreated?.map((r) => {
                      return (
                        <Link
                          className="btn btn-ghost btn-block btn-sm justify-start items-center"
                          href={m.dao.username + "/" + r.repository.name}
                        >
                          <span className="icon mr-1 mt-px">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              stroke="currentColor"
                            >
                              <path d="M9.5 7L4.5 12L9.5 17" strokeWidth="2" />
                              <path
                                d="M14.5 7L19.5 12L14.5 17"
                                strokeWidth="2"
                              />
                            </svg>
                          </span>
                          <span>
                            {r.repository.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="mt-4">
              <Link
                href="/account/daos/new"
                className="btn btn-outline btn-wide btn-sm bg-box-grad-tl ml-4"
                data-test="create_dao"
              >
                <img
                  className="w-4 h-4 mr-2 flex-none"
                  src="organization.svg"
                />
                <div className="mr-6 flex-1">Create a DAO</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full mt-14 px-2 sm:px-0">
          <ActivityFeed />
        </div>
      </div>
    </main>
  );
}

export default UserDashboard;
