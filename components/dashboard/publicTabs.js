import Link from "next/link";
export default function PublicTabs({
  hrefBase,
  active,
  showPeople = false,
  showProposal = false,
  ...props
}) {
  return (
    <div className="tabs relative">
      <Link href={hrefBase}>
        <a
          className={
            "tab tab-md tab-bordered" +
            (active === "overview" ? " tab-active" : "")
          }
        >
          <span className="icon mr-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 20V18C19 16.3431 17.6569 15 16 15H8C6.34315 15 5 16.3431 5 18V20"
                stroke="#ADBECB"
                strokeWidth="2"
              />
              <circle cx="12" cy="8" r="3" stroke="#ADBECB" strokeWidth="2" />
            </svg>
          </span>
          <span>Overview</span>
        </a>
      </Link>

      <Link href={hrefBase + "/repositories"}>
        <a
          className={
            "tab tab-md tab-bordered" +
            (active === "repositories" ? " tab-active" : "")
          }
        >
          <span className="icon mr-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="4"
                y="6"
                width="16"
                height="9"
                stroke="#ADBECB"
                strokeWidth="2"
              />
              <rect x="7" y="18" width="10" height="2" fill="#ADBECB" />
            </svg>
          </span>
          <span>Repositories</span>
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
            <span className="icon mr-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.74662 12.2255L7.96537 11.2539L4.14025 13.4623L2.4082 14.4623L4.14025 15.4623L10.268 19.0002L12.0001 20.0002L13.7321 19.0002L19.8599 15.4623L21.592 14.4623L19.8599 13.4623L16.616 11.5894L15.0083 12.6612L18.1279 14.4623L12.0001 18.0002L5.87231 14.4623L9.74662 12.2255Z"
                  fill="#ADBECB"
                />
                <path
                  d="M12 5L19.8598 9.53787L12 14.0757L4.14017 9.53788L12 5Z"
                  stroke="#ADBECB"
                  strokeWidth="2"
                />
              </svg>
            </span>
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
      {showProposal ? (
        <Link href={hrefBase + "/proposals"}>
          <a
            className={
              "tab  tab-md tab-bordered" +
              (active === "proposals" ? " tab-active" : "")
            }
          >
            <span>Proposals</span>
          </a>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
