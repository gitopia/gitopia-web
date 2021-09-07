import { useEffect, useState } from "react";
import Link from "next/link";

function TopRepositories({ repositories = [] }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    console.log("repoitories", repositories);
    if (repositories.length) {
      let newRepos = [],
        maxLen = Math.min(repositories.length, 5);
      for (let i = 0; i < maxLen; i++) {
        newRepos.push({
          ...repositories[i],
        });
      }
      setRepos(newRepos);
    } else {
      setRepos([]);
    }
  }, [repositories]);

  return (
    <div className="my-8">
      <div className="text-md mx-8 border-b border-grey py-2 mb-4">
        Top Repositories
      </div>
      <ul className="menu compact mx-4">
        {repos.map((r) => {
          return (
            <li className="mb-2" key={r.id}>
              <Link href={"/" + r.owner + "/" + r.name}>
                <a className="rounded">{r.name}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TopRepositories;
