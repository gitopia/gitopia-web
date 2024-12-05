import Head from "next/head";
import Header from "../../components/header";
import { useEffect, useState, useCallback } from "react";
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
import GitopiaProtocolProposalList from "../../components/account/GitopiaProtocolProposalList";
import GitopiaProtocolProposalCreate from "../../components/account/GitopiaProtocolProposalCreate";
import GitopiaProtocolProposalDetails from "../../components/account/GitopiaProtocolProposalDetails";
import validAddress from "../../helpers/validAddress";
import { useApiClient } from "../../context/ApiClientContext";
import DaoProposalsList from "../../components/account/DaoProposalsList";
import getGroupMembers from "../../helpers/getGroupMembers";

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

function AccountView({
  user: initialUser,
  dao: initialDao,
  allRepos,
  selectedAddress,
}) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const [user, setUser] = useState({
    creator: "",
    repositories: [],
    ...initialUser,
  });
  const [dao, setDao] = useState({ name: "", repositories: [], ...initialDao });
  const [isLoading, setIsLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const { apiClient, cosmosGroupApiClient } = useApiClient();

  const hrefBase = `/${router.query.userId}`;

  const checkMembership = async (daoData) => {
    console.log(selectedAddress, daoData.group_id);
    if (!selectedAddress || !daoData.group_id) return;
    try {
      const members = await getGroupMembers(
        cosmosGroupApiClient,
        daoData.group_id
      );
      const isMember = members.some(
        (m) => m.member.address === selectedAddress
      );
      setIsMember(isMember);
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  const getId = useCallback(
    async (updatedName) => {
      if (updatedName) {
        router.push(`/${updatedName}`);
        return;
      }

      setIsLoading(true);
      try {
        let result;
        if (validAddress.test(router.query.userId)) {
          const validUserAddress = new RegExp("^gitopia([a-z0-9]{39})$");
          result = validUserAddress.test(router.query.userId)
            ? await getUser(apiClient, router.query.userId)
            : await getDao(apiClient, router.query.userId);
        } else {
          const data = await getWhois(apiClient, router.query.userId);
          result =
            data?.ownerType === "USER"
              ? await getUser(apiClient, data.address)
              : await getDao(apiClient, data.address);
        }

        if (result) {
          if ("group_id" in result) {
            setUser({ creator: "" });
            setDao(result);
            await checkMembership(result);
          } else {
            setUser(result);
            setDao({ name: "" });
          }
        } else {
          setErrorStatusCode(404);
          setUser({ creator: "" });
          setDao({ name: "" });
        }
      } catch (error) {
        console.error("Error fetching user/dao data:", error);
        setErrorStatusCode(500);
      } finally {
        setIsLoading(false);
      }
    },
    [router, apiClient, setErrorStatusCode]
  );

  useEffect(() => {
    getId();
  }, [getId]);

  const renderContent = () => {
    const { tab, id } = router.query;
    switch (tab) {
      case "repositories":
        return (
          <AccountRepositories
            user={user}
            dao={dao}
            userId={router.query.userId}
            allRepos={allRepos}
          />
        );
      case "transactions":
        return <AccountTransactions userId={user.creator || dao.address} />;
      case "proposals":
        return <DaoProposalsList dao={dao} />;
      case "protocolproposals":
        if (id === "new") return <GitopiaProtocolProposalCreate dao={dao} />;
        if (id) return <GitopiaProtocolProposalDetails id={id} />;
        return <GitopiaProtocolProposalList dao={dao} />;
      case "people":
        return <AccountPeople dao={dao} />;
      default:
        return (
          <AccountOverview
            user={user}
            dao={dao}
            userId={router.query.userId}
            allRepos={allRepos}
          />
        );
    }
  };

  const title = user.id ? user.username || user.creator : dao.name;

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {dao.address ? (
                <>
                  <AccountDaoHeader
                    dao={dao}
                    refresh={getId}
                    isMember={isMember}
                  />
                </>
              ) : (
                <UserHeader user={user} refresh={getId} />
              )}
              <div className="flex flex-1 mt-8 border-b border-grey">
                <PublicTabs
                  active={router.query.tab || "overview"}
                  hrefBase={hrefBase}
                  showPeople={dao.address}
                  showProposal={
                    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ===
                      router.query.userId && dao.address
                  }
                />
              </div>
              {renderContent()}
            </>
          )}
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
