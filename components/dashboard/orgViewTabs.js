import Link from "next/link";

export default function OrgViewTabs({ hrefBase, active }) {
  return (
    <div className="">
      <div className="tabs">
        <Link href={hrefBase + "/dashboard"}>
          <a
            className={"tab" + (active === "repositories" ? " tab-active" : "")}
          >
            <span>Owned Repositories</span>
          </a>
        </Link>
        <Link href={hrefBase + "/proposals"}>
          <a className={"tab" + (active === "proposals" ? " tab-active" : "")}>
            <span>Proposals</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
