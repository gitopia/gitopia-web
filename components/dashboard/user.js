import Link from "next/link";
import FaucetReceiver from "../faucetReceiver";
import GreetUser from "../greetUser";
import KnowledgeCenter from "./knowledgeCenter";
import CreateUser from "../createUser";

function UserDashboard(props) {
  return (
    <main className="container mx-auto max-w-screen-lg py-4 sm:py-12">
      {/* <div className="flex">
        <GreetUser />
        <div className="flex-1"></div>
        <div>
          <div className="text-xs uppercase ml-2">Show:</div>
          <select
            className="select select-ghost select-xs w-32"
            defaultValue="1"
          >
            <option value="1">Pull Requests</option>
            <option value="2">Issues</option>
            <option value="3">Proposals</option>
          </select>
        </div>
      </div> */}
      <FaucetReceiver />
      <CreateUser />
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
            <Link href="/new">
              <a className="btn btn-outline btn-sm mt-4">Create a Repository</a>
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
            <Link href="/account/daos/new">
              <button className="btn btn-outline btn-sm">Create a DAO</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mt-12 sm:pl-4 sm:pr-12">
        <KnowledgeCenter />
      </div>
    </main>
  );
}

export default UserDashboard;
