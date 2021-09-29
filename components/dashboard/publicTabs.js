import Link from "next/link";
export default function PublicTabs({
  hrefBase,
  active,
  showPeople = false,
  ...props
}) {
  return (
    <div className="tabs">
      <Link href={hrefBase}>
        <a
          className={
            "tab tab-lg tab-bordered" +
            (active === "repositories" ? " tab-active" : "")
          }
        >
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
          <span>Repositories</span>
        </a>
      </Link>
      {showPeople ? (
        <Link href={hrefBase + "/people"}>
          <a
            className={
              "tab tab-lg tab-bordered" +
              (active === "people" ? " tab-active" : "")
            }
          >
            <span className="icon mr-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 20V18C19 16.3431 17.6569 15 16 15H8C6.34315 15 5 16.3431 5 18V20"
                  stroke="currentColor"
                  stroke-width="2"
                />
                <circle
                  cx="12"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  stroke-width="2"
                />
              </svg>
            </span>
            <span>People</span>
          </a>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}
