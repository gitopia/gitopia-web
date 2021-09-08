import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import dayjs from "dayjs";

import getUserRepository from "../../../../helpers/getUserRepository";
import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import getRepositoryIssueAll from "../../../../helpers/getRepositoryIssueAll";
import shrinkAddress from "../../../../helpers/shrinkAddress";
import Footer from "../../../../components/footer";

export async function getServerSideProps() {
  return { props: {} };
}

function RepositoryIssueView(props) {
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    issues: [],
    forks: [],
    stargazers: [],
  });

  const [allIssues, setAllIssues] = useState([]);

  useEffect(async () => {
    const r = await getUserRepository(repository.owner.id, repository.name);
    if (r) setRepository(r);
  }, []);

  const getAllIssues = async () => {
    if (repository) {
      const issues = await getRepositoryIssueAll(
        repository.owner.id,
        repository.name
      );
      setAllIssues(issues);
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
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <RepositoryHeader repository={repository} />
          <RepositoryMainTabs
            active="issues"
            hrefBase={repository.owner.id + "/" + repository.name}
          />
          <div className="flex mt-8">
            <div className="form-control flex-1 mr-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pr-16 input input-ghost input-sm input-bordered"
                />
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
                  </th>
                  <th>
                    <button className="btn btn-xs btn-ghost">
                      <span>Asignee</span>
                      <svg
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
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button className="btn btn-xs btn-ghost">
                      <span>Replies</span>
                      <svg
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
                      </svg>
                    </button>
                  </th>
                  <th>
                    <button className="btn btn-xs btn-ghost">
                      <span>Creation</span>
                      <svg
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
                      </svg>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allIssues.map((i) => {
                  return (
                    <tr key={i.iid}>
                      <td className="text-left flex">
                        <span
                          className={
                            "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
                            (i.state === "OPEN" ? "bg-green-900" : "bg-red-900")
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
                          <div className="text-xs">
                            #{i.iid} opened by {shrinkAddress(i.creator)}
                          </div>
                        </div>
                      </td>
                      <td>
                        {i.assignees
                          .map((a) => {
                            return shrinkAddress(a);
                          })
                          .join(", ")}
                      </td>
                      <td>{i.comments.length}</td>
                      <td>{dayjs(i.createdAt * 1000).format("DD MMM YYYY")}</td>
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
  };
};

export default connect(mapStateToProps, {})(RepositoryIssueView);
