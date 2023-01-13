import Head from "next/head";
import Header from "../../components/header";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Footer from "../../components/footer";
import getUser from "../../helpers/getUser";
import getDao from "../../helpers/getDao";
import PublicTabs from "../../components/dashboard/publicTabs";
import UserHeader from "../../components/user/header";
import AccountOverview from "../../components/account/overview";
import { useErrorStatus } from "../../hooks/errorHandler";
import getWhois from "../../helpers/getWhois";
import AccountRepositories from "../../components/account/repositories";
import AccountTransactions from "../../components/account/transactions";
import AccountPeople from "../../components/account/people";
import AccountDaoHeader from "../../components/account/daoHeader";
import DaoProposalList from "../../components/account/daoProposalList";
import DaoProposalCreate from "../../components/account/daoProposalCreate";
import DaoProposalDetails from "../../components/account/daoProposalDetails";
import validAddress from "../../helpers/validAddress";
import sortBy from "lodash/sortBy";
import find from "lodash/find";
import filter from "lodash/filter";

export async function getStaticProps({ params }) {
  let data,
    u,
    d,
    allRepos = [];
  const fs = (await import("fs")).default;
  let whois = JSON.parse(fs.readFileSync("./seo/dump-whois.json")),
    repositories = JSON.parse(fs.readFileSync("./seo/dump-repositories.json")),
    owners = JSON.parse(fs.readFileSync("./seo/dump-owners.json"));
  if (validAddress.test(params.userId)) {
    data = find(whois, { address: params.userId });
  } else {
    data = find(whois, { name: params.userId });
  }
  if (data?.ownerType === "USER") {
    u = find(owners, { address: data.address });
    const pr = filter(repositories, (r) => r.owner.id === u.creator);
    allRepos = sortBy(pr, (r) => -Number(r.updatedAt));
  } else if (data?.ownerType === "DAO") {
    d = find(owners, { address: data.address });
    const pr = filter(repositories, (r) => r.owner.id === d.address);
    allRepos = sortBy(pr, (r) => -Number(r.updatedAt));
  }

  return {
    props: { user: u || {}, dao: d || {}, allRepos },
    revalidate: 1,
  };
}

// export async function getServerSideProps({ params }) {
//   let data, u,
//     d,
//     allRepos = [];
//       data = await getWhois(params.userId);
//     if (data?.ownerType === "USER") {
//       u = await getUser(params.userId);
//       const pr = await getAnyRepositoryAll(params.userId);
//       allRepos = sortBy(pr, (r) => -Number(r.updatedAt));
//     } else if (data?.ownerType === "DAO") {
//       d = await getDao(params.userId);
//       const pr = await getAnyRepositoryAll(params.userId);
//       allRepos = sortBy(pr, (r) => -Number(r.updatedAt));
//     }
//   return {
//     props: { user: u || {}, dao: d || {}, allRepos },
//     revalidate: 1,
//   };
// }

export async function getStaticPaths() {
  const fs = (await import("fs")).default;
  let paths = [];
  try {
    paths = JSON.parse(fs.readFileSync("./seo/paths-owners.json"));
  } catch (e) {
    console.error(e);
  }
  return {
    paths,
    fallback: "blocking",
  };
}

function AccountView(props) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const [user, setUser] = useState({
    creator: "",
    repositories: [],
    ...props.user,
  });
  const [dao, setDao] = useState({
    name: "",
    repositories: [],
    ...props.dao,
  });

  const hrefBase = "/" + router.query.userId;

  const getId = async (updatedName) => {
    if (updatedName) {
      router.push("/" + updatedName);
      return;
    }
    if (validAddress.test(router.query.userId)) {
      const validUserAddress = new RegExp("^gitopia([a-z0-9]{39})$");
      let u, d;
      if (validUserAddress.test(router.query.userId)) {
        u = await getUser(router.query.userId);
      } else {
        d = await getDao(router.query.userId);
      }
      if (u) {
        setUser(u);
        setDao({ name: "" });
      } else if (d) {
        setDao(d);
      } else {
        setErrorStatusCode(404);
        setUser({ creator: "" });
      }
    } else {
      const data = await getWhois(router.query.userId);
      if (data?.ownerType === "USER") {
        const u = await getUser(data.address);
        if (u) {
          setUser(u);
        } else {
          setErrorStatusCode(404);
          setUser({ creator: "" });
        }
      } else if (data?.ownerType === "DAO") {
        const o = await getDao(data.address);
        if (o) {
          setDao(o);
        } else {
          setErrorStatusCode(404);
          setDao({ name: "" });
        }
      } else {
        setErrorStatusCode(404);
        setUser({ creator: "" });
      }
    }
  };

  useEffect(() => {
    getId();
  }, [router.query.userId]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>
          {user.id ? (user.username ? user.username : user.creator) : dao.name}
        </title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          {dao.address ? (
            <AccountDaoHeader dao={dao} refresh={getId} />
          ) : (
            <UserHeader user={user} refresh={getId} />
          )}
          <div className="flex flex-1 mt-8 border-b border-grey">
            <PublicTabs
              active={router.query.tab || "overview"}
              hrefBase={hrefBase}
              showPeople={dao.address}
              showProposal={
                process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
                  router.query.userId && dao.address
              }
            />
          </div>
          {router.query.tab === "overview" || router.query.tab === undefined ? (
            <AccountOverview
              user={user}
              dao={dao}
              userId={router.query.userId}
              allRepos={props.allRepos}
            />
          ) : (
            ""
          )}
          {router.query.tab === "repositories" ? (
            <AccountRepositories
              user={user}
              dao={dao}
              userId={router.query.userId}
              allRepos={props.allRepos}
            />
          ) : (
            ""
          )}
          {router.query.tab === "transactions" ? (
            <AccountTransactions
              userId={user.creator ? user.creator : dao.address}
            />
          ) : (
            ""
          )}
          {router.query.tab === "proposals" ? (
            router.query.id ? (
              router.query.id === "new" ? (
                <DaoProposalCreate dao={dao} />
              ) : (
                <DaoProposalDetails id={router.query.id} />
              )
            ) : (
              <DaoProposalList dao={dao} />
            )
          ) : (
            ""
          )}
          {router.query.tab === "people" ? <AccountPeople dao={dao} /> : ""}
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
    currentDashboard: state.user.currentDashboard,
  };
};

export default connect(mapStateToProps, {})(AccountView);
