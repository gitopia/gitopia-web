import Link from "next/link";

export default function OrgViewTabs({ hrefBase, active }) {
  return (
    <div className="">
      <div className="tabs">
        <Link href={hrefBase + "/proposals"}>
          <a className={"tab" + (active === "proposals" ? " tab-active" : "")}>
            <span className="icon mr-2">
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
              >
                <path
                  d="M1.93782 12.5L8 2L14.0622 12.5H1.93782Z"
                  stroke-width="2"
                />
              </svg>
            </span>
            <span>Proposals</span>
          </a>
        </Link>
        <Link href={hrefBase + "/voting"}>
          <a className={"tab" + (active === "voting" ? " tab-active" : "")}>
            <span className="icon mr-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                stroke="currentColor"
              >
                <path d="M9.5 7L4.5 12L9.5 17" strokeWidth="2" />
                <path d="M14.5 7L19.5 12L14.5 17" strokeWidth="2" />
              </svg>
            </span>
            <span>Voting</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
