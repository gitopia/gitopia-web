import Link from "next/link";
import pullRequestStateClass from "../../helpers/pullRequestStateClass";
import shrinkAddress from "../../helpers/shrinkAddress";
import IssuePullTitle from "./issuePullTitle";

export default function PullRequestHeader({
  repository,
  pullRequest,
  onUpdate,
  ...props
}) {
  let headLink = "",
    headName = pullRequest.head.branch;
  if (pullRequest.head.repository.owner) {
    headLink = [
      "",
      pullRequest.head.repository.owner.id,
      pullRequest.head.repository.name,
      "tree",
      pullRequest.head.branch,
    ].join("/");

    if (pullRequest.head.repositoryId !== pullRequest.base.repositoryId)
      headName =
        shrinkAddress(pullRequest.head.repository.owner.id) +
        "/" +
        pullRequest.head.branch;
  }

  return (
    <div className="">
      <div>
        <IssuePullTitle
          issuePullObj={pullRequest}
          repository={repository}
          isPull={true}
          onUpdate={onUpdate}
        />
      </div>
      <div className="mt-4 flex items-center">
        <span
          className={
            "flex items-center rounded-full border pl-4 pr-6 py-1 mr-4 " +
            "border-" +
            pullRequestStateClass(pullRequest.state)
          }
        >
          <span
            className={
              "mr-4 h-2 w-2 rounded-md justify-self-end self-center inline-block " +
              "bg-" +
              pullRequestStateClass(pullRequest.state)
            }
          />
          <span className="text-type text-sm uppercase">
            {pullRequest.state}
          </span>
        </span>
        <span className="text-xs mr-2 text-type-secondary">
          {shrinkAddress(pullRequest.creator) + " wants to merge "}
          <Link
            href={headLink}
            className="text-xs link link-primary no-underline hover:underline">

            {headName}

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
            className="text-xs link link-primary no-underline hover:underline">

            {pullRequest.base.branch}

          </Link>
        </span>
      </div>
    </div>
  );
}
