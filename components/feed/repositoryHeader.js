import AccountCard from "../account/card";
import Link from "next/link";

const getRepoHeader = (r) => {
  if (!r) return "";
  let ownerData = { ...r.owner?.owner, ...r.owner?.user };
  if (ownerData) {
    ownerData.id = ownerData.username ? ownerData.username : ownerData.address;
  }
  return (
    <div className="flex items-center mb-2">
      <AccountCard
        id={ownerData?.id}
        showId={true}
        showAvatar={true}
        avatarSize="sm"
        initialData={ownerData}
        autoLoad={false}
      />
      <div className="mx-2 text-type-tertiary">/</div>
      <Link
        href={[
          "",
          ownerData?.username ? ownerData.username : ownerData.id,
          r.name,
        ].join("/")}
      >
        <div className="text-primary">{r.name}</div>
      </Link>
      <div className="flex-1"></div>
      <div className="flex-none btn-group">
        <Link
          className="btn btn-xs btn-ghost border-grey-50"
          data-test="fork-repo"
          href={["", ownerData?.id, r.name, "fork"].join("/")}
          disabled={!r.allowForking}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-2"
            stroke="currentColor"
          >
            <path
              d="M11.9998 12.5L6.49982 12.5L6.49982 5.5M11.9998 12.5L17.4998 12.5L17.4998 5.5M11.9998 12.5L11.9998 17.5"
              strokeWidth="2"
              fill="none"
            />
            <path d="M14.4998 19.5C14.4998 20.8807 13.3805 22 11.9998 22C10.6191 22 9.49982 20.8807 9.49982 19.5C9.49982 18.1193 10.6191 17 11.9998 17C13.3805 17 14.4998 18.1193 14.4998 19.5Z" />
            <circle cx="6.49982" cy="5.5" r="2.5" />
            <circle cx="17.4998" cy="5.5" r="2.5" />
          </svg>

          <span>FORK</span>
        </Link>
        <button
          className="btn btn-xs btn-ghost border-grey-50"
          href={["", ownerData?.id, r.name, "insights"].join("/")}
          disabled={!r.allowForking}
        >
          {r.forksCount || 0}
        </button>
      </div>
    </div>
  );
};

export default getRepoHeader;