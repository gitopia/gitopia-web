import pluralize from "../../helpers/pluralize";
import getRepoHeader from "./repositoryHeader";
import dayjs from "dayjs";

const getRepositoryCard = (r, i) => {
  return (
    <div className="p-4 my-0" key={"feedRepo" + i}>
      {getRepoHeader(r)}
      {r.description ? (
        <div className="mx-10 mb-2 text-type-primary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
          {r.description}
        </div>
      ) : (
        ""
      )}
      <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl truncate">
        <span>Updated {dayjs(r?.updatedAt * 1000).fromNow()}</span>
        <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
        <span className="capitalize">
          {r.openPullsCount} Open {pluralize("pull request", r.openPullsCount)}
        </span>
        <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
        <span className="capitalize">
          {r.openIssuesCount} Open {pluralize("issue", r.openIssuesCount)}
        </span>
      </div>
    </div>
  );
};

export default getRepositoryCard;
