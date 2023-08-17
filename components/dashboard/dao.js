import Link from "next/link";
import { connect } from "react-redux";
import MembersList from "./membersList";
import { getDaoDetailsForDashboard } from "../../store/actions/dao";
import AccountGrants from "../account/grants";
import GreetDao from "../greetDao";

function DaoDashboard({ dao = {}, ...props }) {
  return (
    <main className="container mx-auto max-w-screen-lg py-4 sm:py-12">
      <div className="flex mb-12 mx-4">
        <div className="avatar flex-none items-center">
          <div className={"w-16 h-16 rounded-md"}>
            {dao?.avatarUrl == "" ? (
              <span className="bg-purple-900 flex items-center justify-center text-4xl uppercase h-full">
                {dao?.name[0]}
              </span>
            ) : (
              <img src={dao?.avatarUrl} />
            )}
          </div>
        </div>
        <div className="pl-4">
          <Link href={"/" + dao?.name?.toLowerCase()} className="link link-primary text-2xl no-underline">{dao?.name}</Link>
          <div className="text-type-secondary">{dao?.address}</div>
        </div>
      </div>
      <div className="my-12 mx-4">
        <MembersList
          members={dao.members}
          daoId={dao.address}
          refreshDao={props.refreshData}
        />
      </div>
      <div className="flex-1 px-6">
        <div className="divide-y divide-grey">
          <div className="text-lg sm:text-2xl py-4 sm:py-6" id="authorizations">
            Authorizations
          </div>

          <AccountGrants address={dao.address} />
        </div>
      </div>
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    selectedAddress: state.wallet.selectedAddress,
  };
};

export default connect(mapStateToProps, {})(DaoDashboard);
