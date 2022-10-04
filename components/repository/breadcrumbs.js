import Link from "next/link";

export default function Breadcrumbs({
  baseUrl,
  repoPath,
  branchName,
  repoName,
}) {
  const path = [...repoPath];
  return (
    <div className="text-sm breadcrumbs">
      <ul className="flex-wrap">
        <li>
          <Link href={[baseUrl, "tree", branchName].join("/")}>
            <a>{repoName}</a>
          </Link>
        </li>
        {path.map((p, i) => {
          return (
            <li key={"breadcrumb" + i}>
              <Link
                href={[
                  baseUrl,
                  "tree",
                  branchName,
                  ...path.slice(0, i + 1),
                ].join("/")}
              >
                <a>{path[i]}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
