import Link from "next/link";
import { connect } from "react-redux";
import MembersList from "./membersList";
import { getDaoDetailsForDashboard } from "../../store/actions/dao";
import AccountGrants from "../account/grants";
import GreetDao from "../greetDao";

function DaoDashboard({ dao = {}, ...props }) {
  return (
    <main className="container mx-auto max-w-screen-lg py-4 sm:py-12">
      <div className="mb-8">
        <GreetDao dao={dao} />
      </div>
      <div className="flex">
        <div className="flex flex-1 bg-box-grad-tl bg-base-200 p-4 rounded-md">
          <div className="flex-none bg-box-grad-v w-28 sm:w-40 h-full rounded-md flex items-center">
            <img src="/repository.svg" />
          </div>
          <div className="flex flex-col px-2 sm:px-8 sm:py-12">
            <div className="text-lg mb-4 sm:mb-8">Create a New Repository</div>
            <div className="text-xs mb-4 sm:mb-8 text-type-secondary">
              Begin from scratch or import an existing repository
            </div>
            <Link href="/new" className="btn btn-outline btn-sm" data-test="create_repo">
              Create a Repository
            </Link>
          </div>
        </div>
      </div>
      <div className="my-12">
        <MembersList
          members={dao.members}
          daoId={dao.address}
          refreshDao={props.getDaoDetailsForDashboard}
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

export default connect(mapStateToProps, { getDaoDetailsForDashboard })(
  DaoDashboard
);
