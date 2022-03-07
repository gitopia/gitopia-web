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
import PublicTabs from "../../components/dashboard/publicTabs";
import UserHeader from "../../components/user/header";
import { useErrorStatus } from "../errorHandler";

export async function getServerSideProps() {
  return { props: {} };
}

function AccountView(props) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const [user, setUser] = useState({
    creator: "",
    repositories: [],
  });
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });
  const [allRepos, setAllRepos] = useState([]);
  const [avatarLink, setAvatarLink] = useState("");

  useEffect(async () => {
    const [u, o] = await Promise.all([
      getUser(router.query.userId),
      getOrganization(router.query.userId),
    ]);
    console.log(u, o);
    if (u) {
      setUser(u);
      setOrg({ name: "", repositories: [] });
    } else if (o) {
      setOrg(o);
    } else {
      setErrorStatusCode(404);
      setUser({ creator: "", repositories: [] });
    }
  }, [router.query]);

  const getAllRepos = async () => {
    let letter = "x";
    if (user.id) {
      const pr = user.repositories.map((r) => getRepository(r.id));
      const repos = await Promise.all(pr);
      setAllRepos(repos.reverse());
      console.log(repos);
    } else if (org.id) {
      const pr = org.repositories.map((r) => getRepository(r.id));
      const repos = await Promise.all(pr);
      setAllRepos(repos.reverse());
      console.log(repos);
      letter = org.name.slice(0, 1);
    }
    const link =
      process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === org.address
        ? "/logo-g.svg"
        : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
          letter;
    setAvatarLink(link);
  };

  useEffect(getAllRepos, [user, org]);

  const hrefBase = "/" + router.query.userId;

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{user.id ? user.creator : org.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          {org.address ? (
            <div className="flex flex-1 mb-8">
              <div className="avatar flex-none mr-8 items-center">
                <div className={"w-14 h-14 rounded-full"}>
                  <img src={avatarLink} />
                </div>
              </div>
              <div className="flex-1">
                <div className="text-md">{org.name}</div>
                <div className="text-sm text-type-secondary mt-2">
                  {org.description}
                </div>
              </div>
            </div>
          ) : (
            <UserHeader user={user} />
          )}
          <div className="flex flex-1 mt-8 border-b border-grey">
            <PublicTabs
              active="repositories"
              hrefBase={hrefBase}
              showPeople={org.address}
            />
          </div>
          <div className="mt-8">
            <ul className="">
              {allRepos.map((r) => {
                return (
                  <li className="p-4" key={r.id}>
                    <div>
                      <div>
                        <Link href={hrefBase + "/" + r.name}>
                          <a className="text-base btn-link">{r.name}</a>
                        </Link>
                      </div>
                      <div className="mt-2 text-sm">{r.description}</div>
                      <div className="mt-2 text-xs text-type-secondary">
                        {"Last updated " + dayjs(r.updatedAt * 1000).fromNow()}
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
