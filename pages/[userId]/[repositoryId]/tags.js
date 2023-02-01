import Head from "next/head";
import Header from "../../../components/header";
import { useRouter } from "next/router";
import Link from "next/link";
import { connect } from "react-redux";
import dayjs from "dayjs";
import RepositoryHeader from "../../../components/repository/header";
import RepositoryMainTabs from "../../../components/repository/mainTabs";
import useRepository from "../../../hooks/useRepository";

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
              className="btn btn-sm">
              Branches
            </Link>
            <Link
              href={[
                "",
                router.query.userId,
                router.query.repositoryId,
                "tags",
              ].join("/")}
              className="btn btn-sm btn-active">
              Tags
            </Link>
          </div>
          <div className="mt-14">
            {repository.tags.map((b) => {
              return (
                <div className="mt-8" key={b.name}>
                  <a
                    className="flex"
                    href={
                      "/" +
                      repository.owner.id +
                      "/" +
                      repository.name +
                      "/tree/" +
                      b.name
                    }
                  >
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
                    <div className="text-primary">{b.name}</div>
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

export default connect(mapStateToProps, {})(RepositoryTagsView);
