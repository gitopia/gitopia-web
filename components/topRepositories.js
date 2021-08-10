import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Link from "next/link";

function TopRepositories(props) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (Object.keys(props.repositoryNames).length) {
      let newRepos = [],
        maxLen = 5;
      for (let r in props.repositoryNames) {
        newRepos.push({
          name: r,
          owner: props.address,
          id: props.repositoryNames[r],
        });
        if (--maxLen === 0) break;
      }
      setRepos(newRepos);
    } else {
      setRepos([]);
    }
    console.log(props);
  }, [props.repositoryNames]);

  return (
    <div className="my-8">
      <div className="text-md mx-8 border-b border-grey py-2 mb-4">
        Top Repositories
      </div>
      <ul className="menu compact mx-4">
        {repos.map((r) => {
          return (
            <li className="mb-2" key={r.id}>
              <Link href={r.owner + "/" + r.name}>
                <a className="rounded">{r.name}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    address: state.wallet.selectedAddress,
    creator: state.user.creator,
    repositories: state.user.repositories,
    repositoryNames: state.user.repositoryNames,
  };
};

export default connect(mapStateToProps, {})(TopRepositories);
