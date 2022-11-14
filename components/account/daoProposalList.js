import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import getProposals from "../../helpers/getProposals";
import dayjs from "dayjs";
import ProposalItem from "../../components/dashboard/proposalItem";

function DaoProposalList({ dao, ...props }) {
  const router = useRouter();
  // const [dao, setDao] = useState({
  //   name: "",
  //   repositories: [],
  // });
  const [proposals, setProposals] = useState([]);
  var localizedFormat = require("dayjs/plugin/localizedFormat");
  dayjs.extend(localizedFormat);

  useEffect(async () => {
    if (router.query.userId !== process.env.NEXT_PUBLIC_GITOPIA_ADDRESS) {
      router.push("/" + router.query.userId);
    }
    const p = await getProposals();
    setProposals(p);
  }, []);

  return <>
    <div className="flex justify-between items-center mt-8">
      <div className="text-lg">Proposal List</div>

      <div className="flex-none">
        <Link href={"/" + router.query.userId + "?tab=proposals&id=new"} legacyBehavior>
          <button className="btn btn-primary btn-sm btn-wide">
            New Proposal
          </button>
        </Link>
      </div>
    </div>

    <div className="mt-8 grid grid-rows-auto grid-cols-2 gap-5">
      {proposals?.length ? (
        proposals.map((p) => {
          return (
            <ProposalItem
              proposal={p}
              hrefBase={"/" + router.query.userId + "?tab=proposals"}
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
  </>;
}

const mapStateToProps = (state) => {
  return {
    currentDashboard: state.user.currentDashboard,
    dashboards: state.user.dashboards,
  };
};

export default connect(mapStateToProps, {})(DaoProposalList);
