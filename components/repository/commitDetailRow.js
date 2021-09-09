import dayjs from "dayjs";
import Link from "next/link";

export default function CommitDetailRow({
  commitDetail,
  commitInBranchLink = "",
}) {
  console.log("commitInBranchLink", commitInBranchLink);
  return (
    <div className="flex px-2 py-4 bg-base-200 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 mr-2 flex-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="mr-4 flex-none">{commitDetail.commit.author.name}</div>
      <div className="mr-4 flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
        {commitDetail.commit.message}
      </div>
      <div className="mr-4 flex-none">
        <Link href={commitInBranchLink}>
          <a className="btn-link">{commitDetail.oid.slice(0, 6)}</a>
        </Link>
      </div>
      <div className="flex-none">
        {dayjs(
          (commitDetail.commit.author.timestamp +
            commitDetail.commit.author.timezoneOffset) *
            1000
        ).format("DD MMM YY")}
      </div>
    </div>
  );
}
