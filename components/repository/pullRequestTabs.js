import Link from "next/link";

export default function PullRequestTabs({ hrefBase, active }) {
  return (
    <div className="flex">
      <div className="flex-none tabs">
        <Link href={hrefBase}>
          <a
            className={
              "tab tab-lifted" +
              (active === "conversation" ? " tab-active" : "")
            }
          >
            Conversation
          </a>
        </Link>
        <Link href={hrefBase + "/commits"}>
          <a
            className={
              "tab tab-lifted" + (active === "commits" ? " tab-active" : "")
            }
          >
            Commits
          </a>
        </Link>
        <Link href={hrefBase + "/files"}>
          <a
            className={
              "tab tab-lifted" + (active === "files" ? " tab-active" : "")
            }
          >
            Files Changed
          </a>
        </Link>
      </div>
      <div className="flex-1 border-b border-grey"></div>
    </div>
  );
}
