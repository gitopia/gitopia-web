import Link from "next/link";
import dayjs from "dayjs";

export default function FileBrowser({
  entityList,
  baseUrl,
  repoPath = [],
  branchName,
  isMobile = false,
}) {
  return (
    <>
      {entityList.map((e, i) => {
        let commitTitle = e.last_commit ? e.last_commit.title : "";
        let commitDate = e.last_commit?.author?.date;
        return (
          <Link
            href={[baseUrl, "tree", branchName, e.path].join("/")}
            key={"entity" + i}
            className="flex px-2 py-2 items-center hover:bg-neutral text-sm"
          >
            {e.type === "BLOB" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            )}
            <div className="flex-1">{e.name}</div>
            {!isMobile ? (
              <div className="w-1/2 text-left text-type-tertiary whitespace-nowrap truncate">
                {commitTitle}
              </div>
            ) : (
              ""
            )}
            <div className="sm:w-1/6 text-right text-type-tertiary">
              {dayjs(commitDate, "YYYY-MM-DD HH:mm:ss Z").fromNow()}
            </div>
          </Link>
        );
      })}
    </>
  );
}
