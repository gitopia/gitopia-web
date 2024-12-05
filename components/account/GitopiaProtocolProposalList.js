import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import getProposals from "../../helpers/getProposals";
import ProposalItem from "../dashboard/proposalItem";
import { useApiClient } from "../../context/ApiClientContext";

function GitopiaProtocolProposalList({ dao, ...props }) {
  const router = useRouter();
  // const [dao, setDao] = useState({
  //   name: "",
  //   repositories: [],
  // });
  const [proposals, setProposals] = useState([]);
  const { cosmosGovApiClient } = useApiClient();

  useEffect(() => {
    async function initProposals() {
      if (router.query.userId !== process.env.NEXT_PUBLIC_GITOPIA_ADDRESS) {
        router.push("/" + router.query.userId);
      }
      const p = await getProposals(cosmosGovApiClient);
      setProposals(p);
    }
    initProposals();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mt-8">
        <div className="text-lg">Proposal List</div>

        <div className="flex-none">
          <Link
            href={"/" + router.query.userId + "?tab=protocolproposals&id=new"}
            className="btn btn-primary btn-sm btn-wide"
          >
            New Proposal
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-rows-auto grid-cols-2 gap-5">
        {proposals?.length ? (
          proposals.map((p) => {
            return (
              <ProposalItem
                proposal={p}
                hrefBase={"/" + router.query.userId + "?tab=protocolproposals"}
                key={p.proposal_id}
              />
            );
          })
        ) : (
          <div className="text-left text-sm text-type-secondary">
            <h2>No proposals yet</h2>
          </div>
        )}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
  };
};

export default connect(mapStateToProps, {})(GitopiaProtocolProposalList);
