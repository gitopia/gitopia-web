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
import { useErrorStatus } from "../../hooks/errorHandler";
import { ApolloProvider } from "@apollo/client";
import QueryTransaction from "../../helpers/queryTransaction";
import client from "../../helpers/apolloClient";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import ReactTooltip from "react-tooltip";

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
    repositories: [],
    organizations: [],
  });
  const [org, setOrg] = useState({
    name: "",
    repositories: [],
  });
  const [allRepos, setAllRepos] = useState([]);
  const [avatarLink, setAvatarLink] = useState("");
  const [contributions, setContributions] = useState([{}]);
  const [totalContributions, setTotalContributions] = useState(0);

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
              active="overview"
              hrefBase={hrefBase}
              showPeople={org.address}
              showProposal={
                process.env.NEXT_PUBLIC_GITOPIA_ADDRESS.toString() ===
                  router.query.userId && org.address
              }
            />
          </div>
          {!org.address ? (
            <div className="">
              <ApolloProvider client={client}>
                <QueryTransaction
                  setContributions={setContributions}
                  setTotalContributions={setTotalContributions}
                />
              </ApolloProvider>
              <div className="mt-8 border px-10 pt-12 pb-5 border-grey">
                <CalendarHeatmap
                  startDate={new Date().setFullYear(
                    new Date().getFullYear() - 1
                  )}
                  endDate={new Date()}
                  /*
                values={[
                  { date: "2022-01-01", count: 1 },
                  { date: "2022-01-22", count: 1 },
                  { date: "2022-01-30", count: 2 },
                ]}
                */
                  values={contributions}
                  gutterSize={4}
                  showWeekdayLabels={true}
                  classForValue={(value) => {
                    if (!value) {
                      return `color-gitopia-empty`;
                    }
                    if (value.count > 1) {
                      return "color-gitopia-high";
                    } else if (value.count == 1) {
                      return `color-gitopia-low`;
                    }
                    return `color-gitopia-empty`;
                  }}
                  tooltipDataAttrs={(value) => {
                    if (!value.count) {
                      return {
                        "data-tip": `No contributions`,
                      };
                    }
                    return {
                      "data-tip": `${value.count} ${
                        value.count == 1 ? "contribution" : "contributions"
                      } on ${dayjs(value.date).format("DD MMM YYYY")}`,
                    };
                  }}
                  //onClick={(value) => alert(`Clicked on value with count`)}
                />
                <ReactTooltip backgroundColor={"#6a737d"} />
                <div className="flex mb-5">
                  <div className="pl-9 text-grey-100 text-sm">
                    User committed {totalContributions}{" "}
                    {totalContributions < 1 ? "contribution" : "contributions"}{" "}
                    in the past year.
                  </div>
                  <div className="flex ml-auto text-xs text-grey-300 font-bold mr-1">
                    <div>LESS</div>
                    <div className="mt-1 bg-type-quaternary w-2.5 h-2.5 mr-1 ml-1"></div>
                    <div className="mt-1 bg-teal w-2.5 h-2.5"></div>
                    <div className="mt-1 bg-green w-2.5 h-2.5 mr-1 ml-1"></div>
                    <div>MORE</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
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
