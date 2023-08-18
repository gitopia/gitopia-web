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
        repository(orderBy: updatedAt, orderDirection: desc) {
          name
        }
      }
      memberOf {
        dao {
          repositoriesCreated {
            repository(orderBy: updatedAt, orderDirection: desc) {
              name
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
        repository(orderBy: updatedAt, orderDirection: desc) {
          name
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
  const { data, error, loading } = useQuery(QUERY_USER_REPOSITORIES, {
    client: client,
    variables: { address: props.selectedAddress },
    onCompleted: (data) => {
      let daos = {};
      data?.user?.memberOf?.map((m) => {
        daos[m.dao?.username] = false;
      });
      setShowAll({
        mine: false,
        collab: false,
        daos,
      });
    },
  });
  const maxRepos = 4;
  const [showAll, setShowAll] = useState({
    mine: false,
    collab: false,
    daos: {},
  });

  console.log(showAll);

  return (
    <>
      <div className="mb-8">
        <GreetUser />
      </div>
      {process.env.NEXT_PUBLIC_FEE_GRANTER ? (
        <AllowanceReceiver />
      ) : (
        <FaucetReceiver />
      )}
      <div className="mb-8">
        <PromptBackupWallet />
      </div>
      <div className="mt-4">
        {/* <div className="text-xs text-type-tertiary uppercase font-bold px-4">
              Your Repositories
            </div> */}
        <div className="mt-4">
          {data?.user?.repositoriesCreated?.map((r, i) => {
            if (i > maxRepos && !showAll.mine) {
              return "";
            }
            return (
              <div>
                <Link
                  className="btn btn-ghost btn-block btn-sm justify-start"
                  href={data.user.username + "/" + r.repository.name}
                >
                  <span className="mr-1 mt-1">
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
          {data?.user?.repositoriesCreated?.length > maxRepos ? (
            <button
              className="btn btn-link btn-xs"
              onClick={() => {
                setShowAll({ ...showAll, mine: !showAll.mine });
              }}
            >
              Show {showAll.mine ? "Less" : "More"}
            </button>
          ) : (
            ""
          )}
          {data?.user?.collaboratorOf?.map((m, i) => {
            if (i > maxRepos && !showAll.collab) {
              return "";
            }
            return (
              <div>
                <Link
                  className="btn btn-ghost btn-block btn-sm justify-start"
                  href={
                    m.repository.owner.owner.username + "/" + m.repository.name
                  }
                >
                  <span className="mr-1 mt-1">
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
                  <span>
                    {m.repository.owner.owner.username +
                      "/" +
                      m.repository.name}
                  </span>
                </Link>
              </div>
            );
          })}
          {data?.user?.collaboratorOf?.length > maxRepos ? (
            <button
              className="btn btn-link btn-xs"
              onClick={() => {
                setShowAll({ ...showAll, mine: !showAll.collab });
              }}
            >
              Show {showAll.collab ? "Less" : "More"}
            </button>
          ) : (
            ""
          )}
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
                <div className="flex mt-8 mb-4">
                  <Link
                    className="link link-primary no-underline ml-4 text-xl"
                    href={m.dao?.username}
                  >
                    {m.dao?.name}
                  </Link>
                  <div className="mt-1 ml-2 flex items-center gap-1">
                    {m.dao?.members?.map((m) => {
                      return (
                        <AccountCard
                          id={m?.user?.address}
                          showAvatar={true}
                          showId={false}
                          initialData={{ id: m.user.address, ...m.user }}
                          avatarSize="xxs"
                        />
                      );
                    })}
                  </div>
                  {m.role === "OWNER" ? (
                    <Link
                      href={`/daos/${m.dao?.username}/dashboard`}
                      className="ml-2 mt-1 btn btn-xs btn-square btn-ghost"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path d="M14.1211 4.22183L19.7779 9.87869L9.46424 20.1924L3.80738 20.1924L3.80738 14.5355L14.1211 4.22183Z"></path>
                        <path d="M15.1816 9.5249L11.6461 13.0604"></path>
                      </svg>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
                {m.dao?.repositoriesCreated?.map((r, i) => {
                  if (i > maxRepos && !showAll.daos[m.dao?.username]) {
                    return "";
                  }
                  return (
                    <Link
                      className="btn btn-ghost btn-block btn-sm justify-start items-center"
                      href={m.dao.username + "/" + r.repository.name}
                    >
                      <span className="icon mr-1 mt-1">
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
                  );
                })}
                {m.dao?.repositoriesCreated?.length > maxRepos ? (
                  <button
                    className="link link-secondary ml-4 no-underline text-xs"
                    onClick={() => {
                      setShowAll({
                        ...showAll,
                        daos: {
                          ...showAll.daos,
                          [m.dao?.username]: !showAll.daos[m.dao?.username],
                        },
                      });
                    }}
                  >
                    Show {showAll.daos[m.dao?.username] ? "Less" : "More"}
                  </button>
                ) : (
                  ""
                )}
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
            <img className="w-4 h-4 mr-2 flex-none" src="organization.svg" />
            <div className="mr-6 flex-1">Create a DAO</div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
