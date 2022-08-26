import Link from "next/link";
import { connect } from "react-redux";
import MembersList from "./membersList";
import { getDaoDetailsForDashboard } from "../../store/actions/dao";

function DaoDashboard({ dao = {}, ...props }) {
  return (
    <main className="container mx-auto max-w-screen-lg py-4 sm:py-12">
      <div className="flex">
        {/* <div>
          <div className="text-xs uppercase">Welcome to,</div>
          <Link href={"/" + organization.address}>
            <a className="text-lg btn-link">{organization.name}</a>
          </Link>
        </div>
        <div className="flex-1"></div> */}
        {/* <div>
          <div className="text-xs uppercase ml-2">Show:</div>
          <select
            className="select select-ghost select-xs w-32"
            defaultValue="1"
          >
            <option value="1">Pull Requests</option>
            <option value="2">Issues</option>
            <option value="3">Proposals</option>
          </select>
        </div> */}
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
            <Link href="/new">
              <a className="btn btn-outline btn-sm">Create a Repository</a>
            </Link>
          </div>
        </div>
      </div>
      {/* <div className="flex mb-12 bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 border rounded-md p-2 inline ml-2 mr-6 opacity-60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <div className="text-lg inline">
            Import or Mirror your Github Repositories
          </div>
        </div>

        <a className="btn btn-primary btn-link btn-xs">Import files</a>
      </div> */}
      <div className="mt-12 overflow-x-scroll">
        <MembersList
          members={dao.members}
          daoId={dao.address}
          refreshDao={props.getDaoDetailsForDashboard}
        />
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
