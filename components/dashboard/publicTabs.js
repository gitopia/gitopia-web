import Link from "next/link";
export default function PublicTabs({
  hrefBase,
  active,
  showPeople = false,
  ...props
}) {
  return (
    <div className="tabs relative">
      <Link href={hrefBase}>
        <a
          className={
            "tab tab-md tab-bordered" +
            (active === "repositories" ? " tab-active" : "")
          }
        >
          <span>Owned Repositories</span>
        </a>
      </Link>
      {!showPeople ? (
        <Link href={hrefBase + "/transactions"}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "transactions" ? " tab-active" : "")
            }
          >
            <span>Transactions</span>
          </a>
        </Link>
      ) : (
        ""
      )}
      {showPeople ? (
        <Link href={hrefBase + "/people"}>
          <a
            className={
              "tab  tab-md tab-bordered" +
              (active === "people" ? " tab-active" : "")
            }
          >
            <span>People</span>
          </a>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
