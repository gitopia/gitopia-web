import Head from "next/head";
import Header from "../../../../components/header";
import dayjs from "dayjs";
import DashboardSelector from "../../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../../components/topRepositories";
import OrgViewTabs from "../../../../components/dashboard/orgViewTabs";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import getHomeUrl from "../../../../helpers/getHomeUrl";
import Link from "next/link";
import getOrganization from "../../../../helpers/getOrganization";
import getProposals from "../../../../helpers/getProposals";

function GitopiaProposalsView(props) {
  const router = useRouter();
  const hrefBase = "/daos/" + router.query.orgId;
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });
  const [allRepos, setAllRepos] = useState([""]);
  const [proposals, setProposals] = useState([]);
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);
  const letter = org.id ? org.name.slice(0, 1) : "x";

  const avatarLink =
    process.env.NEXT_PUBLIC_GITOPIA_ADDRESS === org.address
      ? "/logo-g.svg"
      : "https://avatar.oxro.io/avatar.svg?length=1&height=100&width=100&fontSize=52&caps=1&name=" +
        letter;

  useEffect(async () => {
    const o = await getOrganization(router.query.orgId);
    if (o) {
      setOrg(o);
    }
  }, [router.query]);

  const getAllRepos = async () => {
    if (org.id) {
      setAllRepos(org.repositories);
    }
  };

  useEffect(getAllRepos, [org, props.currentDashboard]);

  useEffect(() => {
    if (
      router.query.orgId !== props.currentDashboard &&
      router.query.orgId !== undefined
    ) {
      router.push(getHomeUrl(props.dashboards, props.currentDashboard));
    }
  }, [props.currentDashboard]);

  useEffect(async () => {
    await getProposals().then((res) => {
      if (res !== undefined) {
        setProposals(res);
      }
    });
  }, []);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia Proposals</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <div className="w-64 border-r border-grey flex flex-col">
          <div className="flex-1">
            <DashboardSelector />
            <TopRepositories
              repositories={allRepos.map((r) => {
                return { owner: props.currentDashboard, ...r };
              })}
            />
            <button className="text-sm text-type-secondary text-left mx-8 border-b border-grey py-2 mb-4 w-48">
              Gitopia
            </button>
          </div>
          <div>
            {/* <BackendStatus /> */}
            <div className="bg-footer-grad py-6">
              <div className="text-xs text-type-secondary mx-8 mb-4">
                &copy; Gitopia {new Date().getFullYear()}
              </div>
              <div className="mx-6">
                {process.env.NEXT_PUBLIC_GITOPIA_ADDRESS ? (
                  <a
                    className={"btn btn-xs btn-link mt-2"}
                    href={"/" + process.env.NEXT_PUBLIC_GITOPIA_ADDRESS}
                    target="_blank"
                  >
                    View source code
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 px-4">
          <div className="container mx-auto max-w-screen-lg py-12">
            <div className="flex border-b border-grey">
              <div className="text-base text-type-secondarypy-2">Gitopia</div>
              <div className="ml-auto">
                <OrgViewTabs active="proposals" hrefBase={hrefBase} />
              </div>
            </div>
          </div>
          <main className="container mx-auto max-w-screen-lg">
            <div className="flex">
              <div className="text-type-primary text-left items-center">
                Proposal List
              </div>
              <div className="flex-none w-42 ml-auto">
                <Link href={hrefBase + "/proposals/new"}>
                  <button className="btn btn-primary btn-sm btn-block text-xs">
                    CREATE NEW PROPOSAL
                  </button>
                </Link>
              </div>
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
                            {dayjs(p.submit_time).unix() -
                              dayjs(p.voting_start_time).unix() >
                            0
                              ? "--"
                              : " " + dayjs(p.voting_start_time).format("LLL")}
                          </div>
                        </div>
                        <div className="flex mr-5 mt-1 secondary font-bold text-xs ml-4">
                          {"Voting End "}
                          <div className="ml-5 secondary text-xs font-normal text-type-secondary">
                            {dayjs(p.submit_time).unix() -
                              dayjs(p.voting_end_time).unix() >
                            0
                              ? "--"
                              : " " + dayjs(p.voting_end_time).format("LLL")}
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
                                parseInt(p.final_tally_result.abstain) /
                                  100000000
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
      </div>
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

export default connect(mapStateToProps, {})(GitopiaProposalsView);