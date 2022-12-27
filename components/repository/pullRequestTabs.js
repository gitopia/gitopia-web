import Link from "next/link";

export default function PullRequestTabs({ hrefBase, active }) {
  return (
    <div className="flex">
      <div className="flex-none tabs">
        <Link
          href={hrefBase}
          className={
            "tab tab-lifted" + (active === "conversation" ? " tab-active" : "")
          }
        >
          Conversation
        </Link>
        <Link
          href={hrefBase + "/commits"}
          className={
            "tab tab-lifted" + (active === "commits" ? " tab-active" : "")
          }
        >
          Commits
        </Link>
        <Link
          href={hrefBase + "/files"}
          className={
            "tab tab-lifted" + (active === "files" ? " tab-active" : "")
          }
        >
          Files Changed
        </Link>
        <Link
          href={hrefBase + "/issues"}
          className={
            "tab tab-lifted" + (active === "issues" ? " tab-active" : "")
          }
        >
          Issues
        </Link>
      </div>
      <div
        className="flex-1 border-b"
        style={{ borderColor: "rgb(40, 49, 60)" }}
      ></div>
    </div>
  );
}
