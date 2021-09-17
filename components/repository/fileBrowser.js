import Link from "next/link";

export default function FileBrowser({
  entityList,
  baseUrl,
  repoPath = [],
  branchName,
  repoName,
}) {
  return (
    <>
      {entityList.map((e, i) => {
        return (
          <Link
            href={[baseUrl, "tree", branchName, ...repoPath, e.path].join("/")}
            key={"entity" + i}
          >
            <a className="flex px-2 py-2 items-center hover:bg-neutral">
              {e.type === "blob" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              )}

              <div className="flex-1">{e.path}</div>
            </a>
          </Link>
        );
      })}
    </>
  );
}
