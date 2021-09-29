import Head from "next/head";
import Header from "../../components/header";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import Footer from "../../components/footer";
import getUser from "../../helpers/getUser";
import getOrganization from "../../helpers/getOrganization";
import PublicTabs from "../../components/dashboard/publicTabs";

export async function getServerSideProps() {
  return { props: {} };
}

function OrganizationPeopleView(props) {
  const router = useRouter();
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });
  const [allMembers, setAllMembers] = useState([]);

  useEffect(async () => {
    const o = await getOrganization(router.query.userId);

    if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const getAllMembers = async () => {
    if (org.id) {
      const pr = org.members.map((m) => getUser(m.id));
      const members = await Promise.all(pr);
      setAllMembers(members);
    }
  };

  useEffect(getAllMembers, [org]);

  const hrefBase = "/" + router.query.userId;
  const letter = org.name.slice(0, 1);

  const avatarLink =
    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === org.address
      ? "/logo-g.svg"
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        letter;

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{org.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <div className="flex">
            <div className="avatar flex-none mr-8">
              <div className={"w-20 h-20 rounded"}>
                <img src={avatarLink} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-2xl">{org.name}</div>
              <div className="text-sm text-type-secondary mt-2">
                {org.description}
              </div>
            </div>
          </div>
          <div className="flex flex-1 mt-8">
            <PublicTabs active="people" hrefBase={hrefBase} showPeople={true} />
          </div>
          <div className="mt-8 max-w-3xl">
            <ul className="divide-y divide-grey">
              {allMembers.map((m, i) => {
                return (
                  <li className="p-4" key={m.id}>
                    <div className="flex items-center">
                      <div className="avatar mr-2">
                        <div className="w-8 h-8 rounded-full">
                          <img
                            src={
                              "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
                              m.creator.slice(-1)
                            }
                          />
                        </div>
                      </div>
                      <div className="mr-8">
                        <Link href={"/" + m.creator}>
                          <a className="text-md btn-link">{m.creator}</a>
                        </Link>
                      </div>
                      <div className="flex-1 text-right">
                        {org.members[i].role}
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

export default connect(mapStateToProps, {})(OrganizationPeopleView);
