import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import getRepositoryIssueAll from "../../../../helpers/getRepositoryIssueAll";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import Footer from "../../../../components/footer";
import AssigneeGroup from "../../../../components/repository/assigneeGroup";
import useRepository from "../../../../hooks/useRepository";

dayjs.extend(relativeTime);

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  const repository = useRepository();

  const [allIssues, setAllIssues] = useState([]);
  const [currentUserEditPermission, setCurrentUserEditPermission] = useState(
    false
  );

  useEffect(async () => {
    console.log(repository);
    if (repository) {
      let userPermission = false;
      console.log(props.selectedAddress);
      console.log(router.query.userId);
      if (props.selectedAddress === router.query.userId) {
        userPermission = true;
      } else if (props.user) {
        props.user.organizations.every((o) => {
          if (o.id === router.query.userId) {
            userPermission = true;
            return false;
          }
          return true;
        });
      }
      setCurrentUserEditPermission(userPermission);
    }
  }, [props.user]);

  const getAllIssues = async () => {
    if (repository) {
      const issues = await getRepositoryIssueAll(
        repository.owner.id,
        repository.name
      );
      console.log(issues);
      if (issues) setAllIssues(issues);
    }
  };

  useEffect(getAllIssues, [repository]);

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
            showSettings={currentUserEditPermission}
          />
          <div className="flex mt-8">
            <div className="form-control flex-1 mr-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pr-16 input input-ghost input-sm input-bordered"
                />
                <button className="absolute right-0 top-0 rounded-l-none btn btn-sm btn-ghost">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-none w-36">
              <Link
                href={
                  "/" +
                  repository.owner.id +
                  "/" +
                  repository.name +
                  "/issues/new"
                }
              >
                <button className="btn btn-primary btn-sm btn-block">
                  New Issue
                </button>
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <table className="table w-full text-center">
              <thead>
                <tr>
                  <th className="w-7/12 text-left">
                    <div className="btn-group">
                      <button className="btn btn-xs btn-ghost">
                        <span
                          className={
                            "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                          }
                        />
                        <span>Open</span>
                      </button>
                      <button className="btn btn-xs btn-ghost">
                        <span
                          className={
                            "mr-2 h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
                          }
                        />
                        <span>Closed</span>
                      </button>
                    </div>
                  </th>
                  <th>
                    <button className="btn btn-xs btn-ghost">
                      <span>Asignee</span>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                    </button>
                  </th>
                  <th>
                    <button className="btn btn-xs btn-ghost">
                      <span>Replies</span>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                    </button>
                  </th>
                  <th>
                    <button className="btn btn-xs btn-ghost">
                      <span>Creation</span>
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allIssues.map((i) => {
                  return (
                    <tr key={i.iid}>
                      <td>
                        <div className="text-left flex">
                          <span
                            className={
                              "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                              (i.state === "OPEN"
                                ? "bg-green-900"
                                : "bg-red-900")
                            }
                          />
                          <div>
                            <div>
                              <Link
                                href={
                                  "/" +
                                  repository.owner.id +
                                  "/" +
                                  repository.name +
                                  "/issues/" +
                                  i.iid
                                }
                              >
                                <a className="btn-neutral">{i.title}</a>
                              </Link>
                            </div>
                            <div className="text-xs text-type-secondary">
                              #{i.iid} opened by {shrinkAddress(i.creator)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap">
                          <AssigneeGroup assignees={i.assignees} />
                          {/* {i.assignees.map((a, i) => (
                            <span
                              className="pr-2 pb-2 whitespace-nowrap"
                              key={"assignee" + i}
                            >
                              <a
                                href={"/" + a}
                                className="btn-xs btn-link cursor-pointer"
                                target="_blank"
                              >
                                {shrinkAddress(a)}
                              </a>
                            </span>
                          ))} */}
                        </div>
                      </td>
                      <td className="text-xs">{i.comments.length}</td>
                      <td className="text-xs">
                        {dayjs(i.createdAt * 1000).fromNow()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(RepositoryIssueView);
