import Link from "next/link";

export default function BranchSelector({
  branches = [],
  branchName = "master",
  baseUrl,
  ...props
}) {
  return (
    <div className={"dropdown"} tabIndex="0">
      <div className="btn btn-sm btn-outline items-center">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
        >
          <g transform="scale(0.9)">
            <path
              d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="8.5" cy="18.5" r="2.5" fill="currentColor" />
            <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
            <path
              d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
              fill="currentColor"
            />
          </g>
        </svg>
        <div className="flex-1 text-left px-2">{branchName}</div>
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
