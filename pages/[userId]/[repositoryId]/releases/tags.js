import Head from "next/head";
import Header from "../../../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import RepositoryHeader from "../../../../components/repository/header";
import RepositoryMainTabs from "../../../../components/repository/mainTabs";
import useRepository from "../../../../hooks/useRepository";
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
                legacyBehavior>
                <button className="btn btn-primary btn-sm btn-block">
                  New Release
                </button>
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

export default connect(mapStateToProps, {})(RepositoryTagsView);
