import Link from "next/link";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { isCurrentUserEligibleToUpdate } from "../../store/actions/repository";
import {
  Code,
  AlertTriangle,
  GitPullRequestArrow,
  BarChart2,
  Settings,
  Shield,
} from "lucide-react";

function RepositoryMainTabs({ repository, active, daoData, ...props }) {
  const [currentUserEditPermission, setCurrentUserEditPermission] =
    useState(false);

  const [hrefBase, setHrefBase] = useState(
    "/" + repository.owner.id + "/" + repository.name
  );

  useEffect(() => {
    async function updatePermissions() {
      setCurrentUserEditPermission(
        await props.isCurrentUserEligibleToUpdate(repository)
      );
      setHrefBase("/" + repository.owner.id + "/" + repository.name);
    }
    updatePermissions();
  }, [repository, props.user]);

  return (
    <div className="">
      <div className="tabs relative z-10 whitespace-nowrap flex-nowrap overflow-x-auto overflow-y-hidden">
        <Link
          href={hrefBase}
          className={
            "tab tab-md tab-bordered" + (active === "code" ? " tab-active" : "")
          }
          data-test="code"
        >
          <Code className="h-6 w-6 mr-2" />
          <span>Code</span>
        </Link>
        <Link
          href={hrefBase + "/issues"}
          className={
            "tab tab-md tab-bordered" +
            (active === "issues" ? " tab-active" : "")
          }
          data-test="issues"
        >
          <AlertTriangle className="h-6 w-6 mr-2" />
          <span>Issues</span>
        </Link>
        <Link
          href={hrefBase + "/pulls"}
          className={
            "tab tab-md tab-bordered" +
            (active === "pulls" ? " tab-active" : "")
          }
          data-test="pull-requests"
        >
          <GitPullRequestArrow className="h-6 w-6 mr-2" />
          <span className="flex items-center gap-2">
            Pull Requests
            {daoData?.config?.require_pull_request_proposal &&
              repository.owner.type === "DAO" && (
                <div className="group relative">
                  <Shield
                    size={14}
                    className="text-green-400 fill-green-400/10 cursor-help"
                  />
                  <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-xs text-white rounded whitespace-nowrap z-50">
                    Merging pull requests requires DAO approval
                    <div className="absolute top-1/2 right-full -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                  </div>
                </div>
              )}
          </span>
        </Link>
        <Link
          href={hrefBase + "/insights"}
          className={
            "tab tab-md tab-bordered" +
            (active === "insights" ? " tab-active" : "")
          }
        >
          <BarChart2 className="h-5 w-5 mr-2" />
          <span>Insights</span>
        </Link>
        {currentUserEditPermission ? (
          <Link
            href={hrefBase + "/settings"}
            className={
              "tab tab-md tab-bordered" +
              (active === "settings" ? " tab-active" : "")
            }
            data-test="settings"
          >
            <Settings className="h-5 w-5 mr-2" />
            <span>Settings</span>
          </Link>
        ) : null}
      </div>
      <div className="border-b border-grey relative -top-px z-0" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, {
  isCurrentUserEligibleToUpdate,
})(RepositoryMainTabs);
