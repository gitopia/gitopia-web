import Link from "next/link";
export default function PublicTabs({
  hrefBase,
  active,
  showPeople = false,
  showProposal = false,
  showGrants = false,
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
      {showGrants ? (
        <Link href={hrefBase + "?tab=grants"}>
          <a
            className={
              "tab tab-md tab-bordered" +
              (active === "grants" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#ADBECB"
                height={16}
                width={16}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                />
              </svg>
            </span>
            <span>Grants</span>
          </a>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
