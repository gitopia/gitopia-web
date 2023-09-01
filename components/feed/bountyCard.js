import getRepoHeader from "./repositoryHeader";
import Link from "next/link";
import AccountCard from "../account/card";
import dayjs from "dayjs";

const getBountyCard = (b, i) => {
  let isExpired = b?.expireAt < dayjs().unix();
  let rewareeData = { ...b?.rewardee };
  if (rewareeData) {
    rewareeData.id = rewareeData.address;
  }
  return (
    <div className="p-4 my-0" key={"feedBounty" + i}>
      {getRepoHeader(b?.repository)}
      <Link
        href={[
          "",
          b?.repository?.owner?.owner?.username
            ? b?.repository?.owner?.owner?.username
            : b?.repository?.ownerId,
          b?.repository?.name,
          "issues",
          b?.parentIssue?.issue?.iid,
        ].join("/")}
        className="mx-10 mb-2 max-w-xs lg:max-w-2xl"
      >
        <span className="text-type-primary">
          {b?.amount?.map((a) => {
            return (
              <>
                <span className="">
                  {a.amount / 1000000 + " " + a.denom.slice(1).toUpperCase()}
                </span>
              </>
            );
          })}
        </span>
        {b?.state == "BOUNTY_STATE_DESTCREDITED" ? (
          <>
            <span className="ml-2">Rewared to</span>
            <AccountCard
              id={rewareeData?.id}
              initialData={rewareeData}
              avatarSize="xs"
              showAvatar={true}
              showId={true}
            />
          </>
        ) : (
          ""
        )}
      </Link>
      <div className="mx-10 mt-2 text-xs text-type-secondary max-w-xs lg:max-w-2xl max-h-[5rem] overflow-hidden">
        {b?.parentIssue?.issue?.title}
      </div>
      <div className="mx-10 mt-2 flex gap-1 text-xs text-type-secondary max-w-xs lg:max-w-2xl">
        {b?.state == "BOUNTY_STATE_REVERTEDBACK" ? (
          <>
            <span
              className={
                "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-red-900"
              }
            />
            <span>Bounty reverted {dayjs(b?.updatedAt * 1000).fromNow()}</span>
          </>
        ) : (
          ""
        )}
        {b?.state == "BOUNTY_STATE_SRCDEBITTED" ? (
          isExpired ? (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-pink-900"
                }
              />
              <span>Bounty expired {dayjs(b?.expireAt * 1000).fromNow()}</span>
            </>
          ) : (
            <>
              <span
                className={
                  "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
                }
              />
              <span>
                Bounty expires in {dayjs(b?.expireAt * 1000).fromNow()}
              </span>
            </>
          )
        ) : (
          ""
        )}
        {b?.state == "BOUNTY_STATE_DESTCREDITED" ? (
          <>
            <span
              className={
                "mr-1 mt-px h-2 w-2 rounded-md justify-self-end self-center inline-block bg-green-900"
              }
            />
            <span>Bounty rewared {dayjs(b?.updatedAt * 1000).fromNow()}</span>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default getBountyCard;