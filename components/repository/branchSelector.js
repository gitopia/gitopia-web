import Link from "next/link";

export default function BranchSelector({
  branches = [],
  branchName = "master",
  baseUrl,
  ...props
}) {
  return (
    <div className={"dropdown"} tabIndex="0">
      <div className="btn btn-sm btn-outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        <div className="flex-1 text-left">{branchName}</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="shadow-lg dropdown-content bg-base-300 rounded mt-2">
        <ul className="menu rounded">
          {branches.map((b, i) => {
            const cleanName = b.name.replace("refs/heads/", "");
            return (
              <li key={"branch-selector" + i}>
                <Link href={baseUrl + "/tree/" + cleanName}>
                  <a className="text-sm whitespace-nowrap">{cleanName}</a>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
