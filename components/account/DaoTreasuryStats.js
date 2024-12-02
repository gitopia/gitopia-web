import { useState, useEffect } from "react";
import { Landmark, Users, ArrowUpRight } from "lucide-react";
import { getBalance } from "../../store/actions/wallet";
import shrinkAddress from "../../helpers/shrinkAddress";
import { useApiClient } from "../../context/ApiClientContext";
import { connect } from "react-redux";

function DaoTreasuryStats({ dao, className = "", getBalance, advanceUser }) {
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const { cosmosBankApiClient } = useApiClient();

  useEffect(() => {
    async function initBalance() {
      const balance = await getBalance(cosmosBankApiClient, dao.address);
      setTreasuryBalance(
        advanceUser === true
          ? balance + " " + process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN
          : balance / 1000000 + " " + process.env.NEXT_PUBLIC_CURRENCY_TOKEN
      );
    }
    initBalance();
  }, [dao.address]);

  return (
    <div className={`bg-base-200/50 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" />
          DAO Treasury
        </h3>
        <a
          href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/accounts/${dao.address}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          View on Explorer
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Treasury Address</div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <code className="text-sm font-mono">
              {shrinkAddress(dao.address)}
            </code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">Treasury Balance</div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Landmark className="w-4 h-4 text-primary" />
            </div>
            <div className="text-xl font-semibold uppercase">
              {treasuryBalance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    advanceUser: state.user.advanceUser,
  };
};

export default connect(mapStateToProps, {
  getBalance,
})(DaoTreasuryStats);
