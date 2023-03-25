import { useEffect, useState } from "react";
import Link from "next/link";

function TopRepositories({ repositories = [] }) {
  const [repos, setRepos] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (repositories.length) {
      let newRepos = [],
        maxLen = Math.min(repositories.length, 5);
      for (let i = 0; i < maxLen; i++) {
        newRepos.push({
          ...repositories[repositories.length - i - 1],
        });
      }
      setRepos(newRepos);
      if (repositories.length > 5) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } else {
      setRepos([]);
      setHasMore(false);
    }
  }, [repositories]);

  return (
    <div className="my-8">
      <div className="text-sm text-type-secondary mx-8 border-b border-grey py-2 mb-4">
        Repositories
      </div>
      <ul className="menu compact mx-3">
        {repos.map((r) => {
          return (
            <li className="" key={r.id}>
              <Link href={"/" + r.username + "/" + r.name} className="rounded" data-test="top_repositories">
                {r.name}
              </Link>
            </li>
          );
        })}
      </ul>
      {hasMore ? (
        <div className="mx-6 my-2">
          <Link
            href={"/" + repos[0].username}
            className="btn btn-xs btn-link"
            data-test="all_repositories"
          >
            All Repositories
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TopRepositories;
