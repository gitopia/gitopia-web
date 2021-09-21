import Head from "next/head";
import Header from "../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import Footer from "../../components/footer";
import getUser from "../../helpers/getUser";
import getRepository from "../../helpers/getRepository";
import getOrganization from "../../helpers/getOrganization";
import dayjs from "dayjs";

export async function getServerSideProps() {
  return { props: {} };
}

function AccountView(props) {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    repositories: [],
  });
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });
  const [allRepos, setAllRepos] = useState([]);

  useEffect(async () => {
    const [u, o] = await Promise.all([
      getUser(router.query.userId),
      getOrganization(router.query.userId),
    ]);
    console.log(u, o);
    if (u) {
      setUser(u);
    } else if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const getAllRepos = async () => {
    if (user.id) {
      const pr = user.repositories.map((r) => getRepository(r.id));
      const repos = await Promise.all(pr);
      setAllRepos(repos);
      console.log(repos);
    } else if (org.id) {
      const pr = org.repositories.map((r) => getRepository(r.id));
      const repos = await Promise.all(pr);
      setAllRepos(repos);
      console.log(repos);
    }
  };

  useEffect(getAllRepos, [user, org]);

  const hrefBase = "/" + router.query.userId;
  const active = "issues";
  const letter = user.id
    ? user.creator.slice(-1)
    : org.id
    ? org.name.slice(0, 1)
    : "x";

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{user.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <div className="flex">
            <div className="avatar flex-none mr-8">
              <div
                className={
                  "w-20 h-20 " + (user.id ? "rounded-full" : "rounded")
                }
              >
                <img
                  src={
                    "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                    letter
                  }
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-2xl">
                {user.id ? user.creator : org.name}
              </div>
            </div>
          </div>
          <div className="flex flex-1 mt-8">
            <div className="tabs">
              {/* <Link href={hrefBase}>
                <a
                  className={
                    "tab tab-lg tab-bordered" +
                    (active === "code" ? " tab-active" : "")
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    stroke="currentColor"
                  >
                    <path d="M9.5 7L4.5 12L9.5 17" strokeWidth="2" />
                    <path d="M14.5 7L19.5 12L14.5 17" strokeWidth="2" />
                  </svg>

                  <span>Overview</span>
                </a>
              </Link> */}
              <Link href={hrefBase}>
                <a
                  className={
                    "tab tab-lg tab-bordered" +
                    (active === "issues" ? " tab-active" : "")
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                  >
                    <path
                      transform="translate(0,2)"
                      d="M5.93782 16.5L12 6L18.0622 16.5H5.93782Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>

                  <span>Repositories</span>
                </a>
              </Link>
              {/* <Link href={hrefBase}>
                <a
                  className={
                    "tab tab-lg tab-bordered" +
                    (active === "pulls" ? " tab-active" : "")
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                  >
                    <path
                      d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="8.5" cy="18.5" r="2.5" fill="currentColor" />
                    <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
                    <path
                      d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                      fill="currentColor"
                    />
                  </svg>

                  <span>Projects</span>
                </a>
              </Link>
              <Link href={hrefBase}>
                <a
                  className={
                    "tab tab-lg tab-bordered" +
                    (active === "settings" ? " tab-active" : "")
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Packages</span>
                </a>
              </Link> */}
            </div>
          </div>
          <div className="mt-8">
            <ul className="divide-y divide-grey">
              {allRepos.map((r) => {
                return (
                  <li className="p-4" key={r.id}>
                    <div>
                      <div>
                        <Link href={hrefBase + "/" + r.name}>
                          <a className="text-2xl btn-link">{r.name}</a>
                        </Link>
                      </div>
                      <div className="mt-2">{r.description}</div>
                      <div className="mt-2 text-xs text-type-secondary">
                        {"Last updated " +
                          dayjs(r.updatedAt * 1000).format("DD-MM-YYYY")}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
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

export default connect(mapStateToProps, {})(AccountView);
