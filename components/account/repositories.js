import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import getRepository from "../../helpers/getRepository";
import sortBy from "lodash/sortBy";
import getAnyRepositoryAll from "../../helpers/getAnyRepositoryAll";

function AccountRepositories(props) {
  const [allRepos, setAllRepos] = useState([]);

  const getAllRepos = async () => {
    if (props.userId) {
      const pr = await getAnyRepositoryAll(props.userId);
      const repos = sortBy(pr, (r) => -Number(r.updatedAt));
      setAllRepos(repos);
    } else {
      setAllRepos([]);
    }
  };

  useEffect(() => {
    getAllRepos();
  }, [props.user, props.dao]);

  return (
    <>
      <ul className="mt-8">
        {allRepos !== null
          ? allRepos.map((r) => {
              return (
                <li className="p-4" key={r.id}>
                  <div>
                    <div>
                      <Link
                        href={props.userId + "/" + r.name}
                        className="text-base btn-link"
                      >
                        {r.name}
                      </Link>
                    </div>
                    <div className="mt-2 text-sm">{r.description}</div>
                  </div>
                  <div className="flex mt-2">
                    <div className="flex-1 text-xs text-type-secondary">
                      {"Last updated " + dayjs(r.updatedAt * 1000).fromNow()}
                    </div>
                    <div className="flex items-end text-type-secondary text-sm mr-4">
                      <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                      >
                        <path
                          transform="translate(0,2)"
                          d="M5.93782 16.5L12 6L18.0622 16.5H5.93782Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                        />
                      </svg>

                      <span>{r.issuesCount}</span>
                    </div>
                    <div className="flex items-end text-type-secondary text-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                      >
                        <path
                          d="M8.5 18.5V12M8.5 5.5V12M8.5 12H13C14.1046 12 15 12.8954 15 14V18.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="8.5"
                          cy="18.5"
                          r="2.5"
                          fill="currentColor"
                        />
                        <circle cx="8.5" cy="5.5" r="2.5" fill="currentColor" />
                        <path
                          d="M17.5 18.5C17.5 19.8807 16.3807 21 15 21C13.6193 21 12.5 19.8807 12.5 18.5C12.5 17.1193 13.6193 16 15 16C16.3807 16 17.5 17.1193 17.5 18.5Z"
                          fill="currentColor"
                        />
                      </svg>

                      <span>{r.pullsCount}</span>
                    </div>
                  </div>
                </li>
              );
            })
          : ""}
      </ul>
    </>
  );
}

export default AccountRepositories;
