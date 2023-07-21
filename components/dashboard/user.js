import Link from "next/link";
import FaucetReceiver from "../faucetReceiver";
import AllowanceReceiver from "../allowanceReceiver";
import GreetUser from "../greetUser";
import PromptBackupWallet from "../promptBackupWallet";
import ActivityFeed from "./activityFeed";

function UserDashboard(props) {
  return (
    <main className="container mx-auto max-w-screen-lg py-4 sm:py-12">
      <div className="mb-8">
        <GreetUser />
      </div>
      {process.env.NEXT_PUBLIC_FEE_GRANTER ? (
        <AllowanceReceiver />
      ) : (
        <FaucetReceiver />
      )}
      <PromptBackupWallet />
      <div className="sm:flex mt-4">
        <div className="flex flex-1 sm:mr-2 bg-box-grad-tl bg-base-200 p-4 rounded-md">
          <div className="flex-none bg-box-grad-v w-28 sm:w-40 h-full rounded-md flex items-center">
            <img src="repository.svg" />
          </div>
          <div className="flex flex-col px-2 sm:px-8 sm:py-12">
            <div className="text-lg mb-4 sm:mb-8">Create a new repository</div>
            <div className="text-xs mb-4 sm:mb-8 text-type-secondary">
              Begin from scratch or import an existing repository
            </div>
            <Link
              href="/new"
              className="btn btn-outline btn-sm mt-4"
              data-test="create-new-repo"
            >
              Create a Repository
            </Link>
          </div>
        </div>
        <div className="flex flex-1 sm:ml-2 bg-box-grad-tl bg-base-200 p-4 rounded-md mt-4 sm:mt-0">
          <div className="flex-none bg-box-grad-v w-28 sm:w-40 h-full rounded-md flex items-center">
            <img src="organization.svg" />
          </div>
          <div className="flex flex-col px-2 sm:px-8 sm:py-12">
            <div className="text-lg mb-4 sm:mb-8">Create a new DAO</div>
            <div className="text-xs mb-4 sm:mb-8 text-type-secondary">
              A DAO is a self-organizing online community that uses Gitopia to
              manage its development securely
            </div>
            <Link
              href="/account/daos/new"
              className="btn btn-outline btn-sm"
              data-test="create_dao"
            >
              Create a DAO
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <ActivityFeed />
      </div>
    </main>
  );
}

export default UserDashboard;
