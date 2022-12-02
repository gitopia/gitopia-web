import Link from "next/link";

export default function DaoViewTabs({ hrefBase, active }) {
  return (
    <div className="">
      <div className="tabs">
        <Link
          href={hrefBase + "/proposals"}
          className={"tab" + (active === "proposals" ? " tab-active" : "")}>

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
                strokeWidth="2"
              />
            </svg>
          </span>
          <span>Proposals</span>

        </Link>
      </div>
    </div>
  );
}
