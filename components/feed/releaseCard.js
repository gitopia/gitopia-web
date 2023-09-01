import pluralize from "../../helpers/pluralize";
import getRepoHeader from "./repositoryHeader";
import Link from "next/link";
import dayjs from "dayjs";


const getReleaseCard = (l, i) => {
  return (
    <div className="p-4 my-0" key={"feedBounty" + i}>
      {getRepoHeader(l?.repository?.repository)}
      <Link
        href={[
          "",
          l?.repository?.repository?.owner?.owner?.username
            ? l?.repository?.repository?.owner?.owner?.username
            : l?.repository?.repository?.ownerId,
          l?.repository?.repository?.name,
          "releases/tag",
          l?.tagName,
        ].join("/")}
        className="mx-10 mb-2 max-w-xs lg:max-w-2xl"
      >
        <span className="text-type-primary">{l?.name}</span>
      </Link>
      {l?.description ? (
        <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
          {l?.description}
        </div>
      ) : (
        ""
      )}
      <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
        <span>Released {dayjs(l?.updatedAt * 1000).fromNow()}</span>
        <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
        <span className="capitalize">
          {l?.attachments?.length}{" "}
          {pluralize("attachment", l?.attachments?.length)}
        </span>
      </div>
    </div>
  );
};

export default getReleaseCard;
