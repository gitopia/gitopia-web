import Head from "next/head";
import Header from "../../../components/header";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import PublicTabs from "../../../components/dashboard/publicTabs";
import getDao from "../../../helpers/getDao";
import Footer from "../../../components/footer";
import getProposals from "../../../helpers/getProposals";
import dayjs from "dayjs";
import ProposalItem from "../../../components/dashboard/proposalItem";

export async function getStaticProps() {
  return { props: {} };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

function GitopiaProposals(props) {
  const router = useRouter();
  const [dao, setDao] = useState({
    name: "",
    repositories: [],
  });
  const [proposals, setProposals] = useState([]);
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  useEffect(async () => {
    const o = await getDao(router.query.userId);
    if (o) {
      setDao(o);
    }
  }, [router.query]);

  const hrefBase = "/" + router.query.userId;
  const letter = dao.name.slice(0, 1);

  const avatarLink =
    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === dao.address
      ? "/logo-g.svg"
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        letter;

  useEffect(async () => {
    if (router.query.userId !== process.env.NEXT_PUBLIC_GITOPIA_ADDRESS) {
      router.push("/" + router.query.userId);
    }
    const p = await getProposals();
    setProposals(p);
  }, []);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>{dao.name}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
          <div className="flex flex-1 mb-8">
            <div className="avatar flex-none mr-8 items-center">
              <div className={"w-14 h-14 rounded-full"}>
                <img src={avatarLink} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-md">{dao.name}</div>
              <div className="text-sm text-type-secondary mt-2">
                {dao.description}
              </div>
            </div>
          </div>
          <div className="flex flex-1 mt-8 border-b border-grey">
            <PublicTabs
              active="proposals"
              hrefBase={hrefBase}
              showPeople={true}
              showProposal={
                process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
                  router.query.userId && dao.address
              }
            />
          </div>
          <div className="flex">
            <div className="text-type-primary text-left items-center mt-8 ml-7">
              Proposal List
            </div>
            {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
            router.query.userId ? (
              <div className="flex-none w-42 ml-auto mr-5">
                <Link href={hrefBase + "/proposals/new"}>
                  <button className="btn btn-primary btn-sm btn-block text-xs mt-8">
                    CREATE NEW PROPOSAL
                  </button>
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="mt-10 grid grid-rows-auto grid-cols-2 gap-5">
            {proposals.length > 0 || proposals !== undefined ? (
              proposals.map((p) => {
                return (
                  <ProposalItem
                    proposal={p}
                    hrefBase={hrefBase + "/proposals"}
                    key={p.proposal_id}
                  />
                );
              })
            ) : (
              <div className="text-left px-5 pt-10 font-style: italic text-base">
                <h2>No Proposals to Show</h2>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
  };
};

export default connect(mapStateToProps, {})(GitopiaProposals);
