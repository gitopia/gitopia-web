import shrinkAddress from "../../helpers/shrinkAddress";
import Link from "next/link";

export default function RepositoryHeader({ repository }) {
  return (
    <div className="flex flex-1 mb-8">
      <div className="flex flex-1 text-primary text-xl items-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2 relative top-px"
          stroke="currentColor"
        >
          <rect x="4" y="6" width="16" height="9" strokeWidth="2" />
          <rect x="7" y="18" width="10" height="2" />
        </svg>

        <div className="mr-2">
          <Link href={"/" + repository.owner.id}>
            <a className="btn-link">{shrinkAddress(repository.owner.id)}</a>
          </Link>
        </div>
        <div className="mr-2">/</div>
        <div>{repository.name}</div>
      </div>
      <div className="flex text-sm divide-x divide-grey">
        <div className="flex items-center text-xs uppercase text-type-secondary font-bold pr-8">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <circle cx="12" cy="8" r="4" strokeWidth="2" />
            <path
              d="M5.93782 19.5C6.5522 18.4359 7.43587 17.5522 8.5 16.9378C9.56413 16.3234 10.7712 16 12 16C13.2288 16 14.4359 16.3234 15.5 16.9378C16.5641 17.5522 17.4478 18.4359 18.0622 19.5"
              strokeWidth="2"
            />
          </svg>

          <span>Watchers - {repository.stargazers.length}</span>
        </div>
        <div className="flex items-center text-xs uppercase text-type-secondary font-bold px-8">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
          >
            <g transform="scale(1.5,1.5) translate(2,2)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9011 5.95056C9.1074 5.00429 6.89683 2.79373 5.95056 0C5.00429 2.79373 2.79373 5.00429 0 5.95056C2.79373 6.89683 5.00429 9.1074 5.95056 11.9011C6.89683 9.1074 9.1074 6.89683 11.9011 5.95056Z"
              />
            </g>
          </svg>

          <span>Score - 0</span>
        </div>
        <div className="flex items-center text-xs uppercase text-type-secondary font-bold pl-8">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            stroke="currentColor"
          >
            <path
              d="M11.9998 12.5L6.49982 12.5L6.49982 5.5M11.9998 12.5L17.4998 12.5L17.4998 5.5M11.9998 12.5L11.9998 17.5"
              strokeWidth="2"
              fill="none"
            />
            <path d="M14.4998 19.5C14.4998 20.8807 13.3805 22 11.9998 22C10.6191 22 9.49982 20.8807 9.49982 19.5C9.49982 18.1193 10.6191 17 11.9998 17C13.3805 17 14.4998 18.1193 14.4998 19.5Z" />
            <circle cx="6.49982" cy="5.5" r="2.5" />
            <circle cx="17.4998" cy="5.5" r="2.5" />
          </svg>

          <span>Forks - {repository.forks.length}</span>
        </div>
      </div>
    </div>
  );
}
