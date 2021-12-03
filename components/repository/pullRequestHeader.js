import Link from "next/link";
import shrinkAddress from "../../helpers/shrinkAddress";

export default function PullRequestHeader({
  repository,
  pullRequest,
  ...props
}) {
  return (
    <div className="">
      <div>
        <span className="text-3xl mr-2">{pullRequest.title}</span>
        <span className="text-3xl text-type-secondary">#{pullRequest.iid}</span>
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={
            "flex items-center rounded-full border pl-4 pr-6 py-2 mr-4 " +
            (pullRequest.state === "OPEN"
              ? "border-green-900"
              : "border-red-900")
          }
        >
          <span
            className={
              "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              (pullRequest.state === "OPEN" ? "bg-green-900" : "bg-red-900")
            }
          />
          <span className="text-type uppercase">{pullRequest.state}</span>
        </span>
        <span className="text-xs mr-2 text-type-secondary">
          {shrinkAddress(pullRequest.creator) + " wants to merge "}
          <Link
            href={
              "/" +
              repository.owner.id +
              "/" +
              repository.name +
              "/tree/" +
              pullRequest.head.branch
            }
          >
            <a className="text-xs link link-primary no-underline hover:underline">
              {pullRequest.head.branch}
            </a>
          </Link>
          {" to "}
          <Link
            href={
              "/" +
              repository.owner.id +
              "/" +
              repository.name +
              "/tree/" +
              pullRequest.base.branch
            }
          >
            <a className="text-xs link link-primary no-underline hover:underline">
              {pullRequest.base.branch}
            </a>
          </Link>
        </span>
      </div>
    </div>
  );
}
