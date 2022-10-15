import Link from "next/link";
export default function PublicTabs({
  hrefBase,
  active,
  showPeople = false,
  showProposal = false,
  ...props
}) {
  return (
    <div className="tabs relative overflow-x-auto overflow-y-hidden flex-nowrap">
      <Link href={hrefBase}>
        <a
          className={
            "tab tab-md tab-bordered" +
            (active === "overview" ? " tab-active" : "")
          }
        >
          <span className="icon mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              height={16}
              width={16}
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#ADBECB"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
              />
            </svg>
          </span>
          <span>Overview</span>
        </a>
      </Link>

      <Link href={hrefBase + "?tab=repositories"}>
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
        <Link href={hrefBase + "?tab=transactions"}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "transactions" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                height={16}
                width={16}
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
        <Link href={hrefBase + "?tab=people"}>
          <a
            className={
              "tab  tab-md tab-bordered" +
              (active === "people" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={16}
                width={16}
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ADBECB"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </span>
            <span>People</span>
          </a>
        </Link>
      ) : (
        ""
      )}
      {showProposal ? (
        <Link href={hrefBase + "?tab=proposals"}>
          <a
            className={
              "tab  tab-md tab-bordered" +
              (active === "proposals" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={16}
                width={16}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#ADBECB"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                />
              </svg>
            </span>
            <span>Proposals</span>
          </a>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
