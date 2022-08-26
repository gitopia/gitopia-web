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
import AccountOrgHeader from "../../components/account/orgHeader";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function AccountView(props) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const [user, setUser] = useState({
    creator: "",
  });
  const [dao, setDao] = useState({
    name: "",
  });

  const validAddress = new RegExp("gitopia[a-z0-9]{39}");
  const hrefBase = "/" + router.query.userId;

  const getId = async () => {
    if (validAddress.test(router.query.userId)) {
      const [u, o] = await Promise.all([
        getUser(router.query.userId),
        getDao(router.query.userId),
      ]);
      if (u) {
        setUser(u);
        setDao({ name: "" });
      } else if (o) {
        setDao(o);
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

  useEffect(getId, [router.query]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{user.id ? user.creator : dao.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          {dao.address ? (
            <AccountOrgHeader org={dao} refresh={getId} />
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
              org={dao}
              userId={router.query.userId}
            />
          ) : (
            ""
          )}
          {router.query.tab === "repositories" ? (
            <AccountRepositories
              user={user}
              org={dao}
              userId={router.query.userId}
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
          {router.query.tab === "people" ? <AccountPeople org={dao} /> : ""}
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
