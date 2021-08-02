import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { txClient, queryClient } from "gitopiajs";
import Link from "next/link";

function TopRepositories(props) {
  const [repos, setRepos] = useState([]);

  const getRepositories = async (address) => {
    try {
      const qc = await queryClient();
      const res = await qc.queryUserRepositoryAll(address);
      if (res.ok) {
        const topRepos = res.data.Repository.slice(0, 5);
        topRepos.forEach((r) => {
          try {
            const owner = JSON.parse(r.owner);
            r.owner = owner;
          } catch (e) {
            console.error(e);
          }
        });
        console.log(topRepos);
        setRepos(topRepos);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (props.selectedAddress) {
      getRepositories(props.selectedAddress);
    }
  }, [props.selectedAddress]);

  return (
    <div className="my-8">
      <div className="text-md mx-8 border-b border-grey py-2 mb-4">
        Top Repositories
      </div>
      <ul className="menu compact mx-4">
        {repos.map((r) => {
          return (
            <li className="mb-2" key={r.id}>
              <Link href={r.owner.ID + "/" + r.name}>
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
    activeWallet: state.wallet.activeWallet,
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(TopRepositories);
