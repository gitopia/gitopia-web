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
import { useApiClient } from "../../context/ApiClientContext";

export async function getStaticProps({ params }) {
  let data,
    u,
    d,
    allRepos = [];
  try {
    const db = (await import("../../helpers/getSeoDatabase")).default;
    if (validAddress.test(params.userId)) {
      data = await db
        .first("*")
        .from("Whois")
        .where({ address: params.userId });
    } else {
      data = await db.first("*").from("Whois").where({ name: params.userId });
    }
    if (data?.ownerType === "USER") {
      u = JSON.parse(
        (await db.first("*").from("Users").where({ address: data.address }))
          .data
      );
      let repoJsons = await db
        .select("*")
        .from("Repositories")
        .where({ ownerAddress: data.address })
        .orderBy("updatedAt", "desc")
        .limit(10);
      allRepos = repoJsons.map((j) => JSON.parse(j.data));
    } else if (data?.ownerType === "DAO") {
      d = JSON.parse(
        (await db.first("*").from("Daos").where({ address: data.address })).data
      );
      let repoJsons = await db
        .select("*")
        .from("Repositories")
        .where({ ownerAddress: data.address })
        .orderBy("updatedAt", "desc")
        .limit(10);
      allRepos = repoJsons.map((j) => JSON.parse(j.data));
    }
  } catch (e) {
    console.error(e);
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
  let paths = [];
  if (process.env.GENERATE_SEO_PAGES) {
    try {
      const fs = (await import("fs")).default;
      paths = JSON.parse(fs.readFileSync("./seo/paths-owners.json"));
    } catch (e) {
      console.error(e);
    }
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
  const { apiClient } = useApiClient();

  const hrefBase = "/" + router.query.userId;

  const getId = async (updatedName) => {
    if (updatedName) {
      router.push("/" + updatedName);
      return;
    }
    let u, d;
    if (validAddress.test(router.query.userId)) {
      const validUserAddress = new RegExp("^gitopia([a-z0-9]{39})$");
      if (validUserAddress.test(router.query.userId)) {
        u = await getUser(apiClient, router.query.userId);
      } else {
        d = await getDao(apiClient, router.query.userId);
      }
    } else {
      const data = await getWhois(apiClient, router.query.userId);
      if (data?.ownerType === "USER") {
        u = await getUser(apiClient, data.address);
      } else if (data?.ownerType === "DAO") {
        d = await getDao(apiClient, data.address);
      }
    }
    if (u) {
      setUser(u);
      setDao({ name: "" });
    } else if (d) {
      setUser({ creator: "" });
      setDao(d);
    } else {
      setErrorStatusCode(404);
      setUser({ creator: "" });
      setDao({ name: "" });
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
