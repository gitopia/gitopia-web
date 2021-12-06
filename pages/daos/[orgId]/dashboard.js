import { useEffect } from "react";
import { connect } from "react-redux";
import Head from "next/head";
import Header from "../../../components/header";
import DashboardSelector from "../../../components/dashboard/dashboardSelector";
import TopRepositories from "../../../components/topRepositories";
import getHomeUrl from "../../../helpers/getHomeUrl";
import { useRouter } from "next/router";
import { getOrganizationDetailsForDashboard } from "../../../store/actions/organization";
import Org from "../../../components/dashboard/org";
import OrgView from "../../../components/dashboard/orgView";
import Link from "next/dist/client/link";

function OrgDashboard(props) {
  const router = useRouter();
  const [menuState, setMenuState] = useState(1);
  useEffect(() => {
    console.log("org dashboard", router.query.orgId, props.currentDashboard);
    if (router.query.orgId !== props.currentDashboard) {
      router.push(getHomeUrl(props.dashboards, props.currentDashboard));
    }
    props.getOrganizationDetailsForDashboard();
  }, [props.currentDashboard]);

  return (
    <div
      data-theme="dark"
      className="flex flex-col bg-base-100 text-base-content min-h-screen"
    >
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="flex flex-1">
        <div className="w-64 border-r border-grey flex flex-col">
          <div className="flex-1">
            <DashboardSelector />
            <TopRepositories
              repositories={props.repositories.map((r) => {
                return { owner: props.currentDashboard, ...r };
              })}
            />
            <button
              className="text-sm text-type-secondary text-left mx-8 border-b border-grey py-2 mb-4 w-48"
              onClick={() => {
                setMenuState(2);
              }}
            >
              Gitopia
            </button>
          </div>
          <div>
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
          {menuState === 1 && <Org organization={props.organization} />}
          {menuState === 2 && <OrgView organization={props.organization} />}
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

export default connect(mapStateToProps, { getOrganizationDetailsForDashboard })(
  OrgDashboard
);
