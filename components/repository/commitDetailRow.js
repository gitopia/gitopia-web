import dayjs from "dayjs";
import Link from "next/link";

export default function CommitDetailRow({
  commitDetail,
  commitInBranchLink = "",
}) {
  let authorName = "";
  let message = "";
  if (commitDetail && commitDetail.commit && commitDetail.commit.author) {
    authorName = commitDetail.commit.author.name || "";
    message = commitDetail.commit.message || "";
  }
  return (
    <div className="flex px-2 py-2 bg-base-200 items-center">
      <div className="flex-1 flex">
        <div className="avatar">
          <div className="rounded-full w-6 h-6 mr-2">
            <img
              src={
                "https://avatar.oxro.io/avatar.svg?length=1&height=40&width=40&fontSize=18&caps=1&name=" +
                authorName.slice(0, 1)
              }
            />
          </div>
        </div>
        <span className="pr-4 border-r border-grey">{authorName}</span>
        <span className="px-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {message}
        </span>
      </div>
      <div className="mr-2 flex-none">
        <Link href={commitInBranchLink}>
          <a className="btn-link btn-sm">{commitDetail.oid.slice(0, 6)}</a>
        </Link>
      </div>
      <div className="flex-none text-sm">
        {dayjs(
          (commitDetail.commit.author.timestamp +
            commitDetail.commit.author.timezoneOffset) *
            1000
        ).format("DD MMM YY")}
      </div>
    </div>
  );
}
