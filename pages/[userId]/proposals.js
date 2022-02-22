import Head from "next/head";
import Header from "../../components/header";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import PublicTabs from "../../components/dashboard/publicTabs";
import getOrganization from "../../helpers/getOrganization";
import Footer from "../../components/footer";
import getProposals from "../../helpers/getProposals";
import dayjs from "dayjs";

export async function getServerSideProps() {
  return { props: {} };
}

function GitopiaProposals(props) {
  const router = useRouter();
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });
  const [proposals, setProposals] = useState([]);
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  useEffect(async () => {
    const o = await getOrganization(router.query.userId);

    if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const hrefBase = "/" + router.query.userId;
  const hrefBaseOrg = "/daos/" + router.query.userId;
  const letter = org.name.slice(0, 1);

  const avatarLink =
    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === org.address
      ? "/logo-g.svg"
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        letter;

  useEffect(async () => {
    const p = await getProposals();
    setProposals(p);
  });

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
      <div className="flex-1 bg-repo-grad-v">
        <main className="container mx-auto max-w-screen-lg py-12 px-4">
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
          <div className="flex flex-1 mt-8 border-b border-grey">
            <PublicTabs
              active="proposals"
              hrefBase={hrefBase}
              showPeople={true}
              showProposal={
                process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
                  props.currentDashboard && org.address
              }
            />
          </div>
          <div className="flex">
            <div className="text-type-primary text-left items-center mt-8 ml-7">
              Proposal List
            </div>
            {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
            props.currentDashboard ? (
              <div className="flex-none w-42 ml-auto mr-5">
                <Link href={hrefBaseOrg + "/proposals/new"}>
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
                  <div className="flex flex-col items-center">
                    <div className="w-full h-72 border-2 border-grey rounded-lg p-3">
                      <div className="flex">
                        <div className="mt-2 ml-4 text-sm uppercase font-bold">
                          {"#" + p.proposal_id}
                        </div>
                        <div className="mt-2 ml-auto font-bold text-xs secondary uppercase mr-3">
                          {dayjs(p.submit_time).fromNow()}
                        </div>
                      </div>
                      <div className="mt-5 ml-4 text-sm uppercase font-medium text-type">
                        {typeof p.content !== "undefined"
                          ? p.content.title
                          : ""}
                      </div>
                      <div className="mt-3 ml-4 text-xs text-type-secondary">
                        {typeof p.content !== "undefined"
                          ? p.content.description.slice(0, 250)
                          : ""}
                      </div>
                      <div className="flex mr-5 mt-5 secondary font-bold text-xs ml-4">
                        {"Voting Start "}
                        <div className="ml-3 secondary text-xs font-normal text-type-secondary">
                          {" " + dayjs(p.voting_start_time).format("LLL")}
                        </div>
                      </div>
                      <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                        {"Voting End "}
                        <div className="ml-5 secondary text-xs font-normal text-type-secondary">
                          {" " + dayjs(p.voting_end_time).format("LLL")}
                        </div>
                      </div>

                      <div className="mt-8 w-fit border-t-2 border-grey ml-3 mr-3"></div>
                      <div className="flex mt-2">
                        <div className="mr-5 secondary uppercase font-bold text-xs ml-3 text-type-secondary">
                          {p.final_tally_result !== undefined
                            ? "yes " +
                              parseInt(p.final_tally_result.yes) / 100000000
                            : ""}
                        </div>
                        <div className="mr-5 secondary uppercase font-bold text-xs ml-3 text-type-secondary">
                          {p.final_tally_result !== undefined
                            ? "abstain " +
                              parseInt(p.final_tally_result.abstain) / 100000000
                            : ""}
                        </div>
                        <div className="mr-5 secondary uppercase font-bold text-xs ml-3 text-type-secondary">
                          {p.final_tally_result !== undefined
                            ? "no " +
                              parseInt(p.final_tally_result.no) / 100000000
                            : ""}
                        </div>
                        <div className="mr-5 secondary uppercase font-bold text-xs ml-3 text-type-secondary">
                          {p.final_tally_result !== undefined
                            ? "no with veto " +
                              parseInt(p.final_tally_result.no_with_veto) /
                                100000000
                            : ""}
                        </div>
                        <a
                          className="link link-primary modal-button no-underline ml-auto font-bold text-xs uppercase text-green mr-3"
                          href={
                            "/daos/" +
                            router.query.orgId +
                            "/proposals/" +
                            p.proposal_id
                          }
                          target="_blank"
                        >
                          read proposal
                        </a>
                      </div>
                    </div>
                  </div>
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
    repositories: state.organization.repositories,
    organization: state.organization,
  };
};

export default connect(mapStateToProps, {})(GitopiaProposals);
