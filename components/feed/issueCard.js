import pluralize from "../../helpers/pluralize";
import getRepoHeader from "./repositoryHeader";
import Link from "next/link";
import AccountCard from "../account/card";
import dayjs from "dayjs";

const getIssueCard = (p, i) => {
  let ownerData = { ...p.owner?.owner, ...p.owner?.user },
    closerData = { ...p.closedBy };
  if (ownerData) {
    ownerData.id = ownerData.address;
  }
  if (closerData) {
    closerData.id = closerData.address;
  }
  return (
    <div className="p-4 my-4" key={"feedIssue" + i}>
      {getRepoHeader(p?.repository?.repository)}
      <Link
        href={[
          "",
          p?.repository?.repository?.owner?.owner?.username
            ? p?.repository?.repository?.owner?.owner?.username
            : p?.repository?.repository?.ownerId,
          p?.repository?.repository?.name,
          "issues",
          p?.iid,
        ].join("/")}
        className="mx-10 mb-2 max-w-xs lg:max-w-2xl flex"
      >
        <span className="text-type-primary">{p?.title}</span>
        <span className="text-neutral ml-2">#{p?.iid}</span>
      </Link>
      {p?.description ? (
        <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
          {p?.description}
        </div>
      ) : (
        ""
      )}
      <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
        {p?.state == "OPEN" ? (
          <>
            <span
              className={
                "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
              }
            />
            <span>Issue opened by</span>
            <AccountCard
              id={ownerData?.id}
              initialData={ownerData}
              avatarSize="xxs"
              showAvatar={false}
              showId={true}
            />
            <span>{dayjs(p?.createdAt * 1000).fromNow()}</span>
          </>
        ) : (
          <>
            <span
              className={
                "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
              }
            />
            <span>Issue closed by</span>
            <AccountCard
              id={closerData?.id}
              initialData={closerData}
              avatarSize="xxs"
              showAvatar={false}
              showId={true}
            />
            <span>{dayjs(p?.closedAt * 1000).fromNow()}</span>
          </>
        )}
        <span className="w-1 h-1 mt-2 mx-2 rounded-full bg-neutral"></span>
        <span className="capitalize">
          {p?.commentsCount} {pluralize("comment", p?.commentsCount)}
        </span>
      </div>
    </div>
  );
};

export default getIssueCard;
