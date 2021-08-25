import Link from "next/link";

export default function Breadcrumbs(props) {
  const { query } = props;
  const repoPath = query.path || [];
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link
            href={[
              "",
              query.userId,
              query.repositoryId,
              "tree",
              query.commitId,
            ].join("/")}
          >
            <a>{query.repositoryId}</a>
          </Link>
        </li>
        {repoPath.map((p, i) => {
          return (
            <li key={"breadcrumb" + i}>
              <Link
                href={[
                  "",
                  query.userId,
                  query.repositoryId,
                  "tree",
                  query.commitId,
                  ...repoPath.slice(0, i + 1),
                ].join("/")}
              >
                <a>{repoPath[i]}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
