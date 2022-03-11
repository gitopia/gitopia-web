import Link from "next/link";
import FaucetReceiver from "../faucetReceiver";
import GreetUser from "../greetUser";
import KnowledgeCenter from "./knowledgeCenter";
import CreateUser from "../createUser";

function UserDashboard(props) {
  return (
    <main className="container mx-auto max-w-screen-lg py-12">
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
      <div className="flex mt-4">
        <div className="flex flex-1 mr-2 bg-box-grad-tl bg-base-200 p-4 rounded-md">
          <div className="flex-none bg-box-grad-v w-40 h-full rounded-md flex items-center">
            <img src="repository.svg" />
          </div>
          <div className="flex flex-col px-8 py-12">
            <div className="text-lg mb-8">Create a new repository</div>
            <div className="text-xs mb-8 text-type-secondary">
              Begin from scratch or import an existing repository
            </div>
            <Link href="/new">
              <a className="btn btn-outline btn-sm">Create a Repository</a>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 ml-2 bg-box-grad-tl bg-base-200 p-4 rounded-md">
          <div className="flex-none bg-box-grad-v w-40 h-full rounded-md flex items-center">
            <img src="organization.svg" />
          </div>
          <div className="flex flex-col px-8 py-12">
            <div className="text-lg mb-8">Create a new DAO</div>
            <div className="text-xs mb-8 text-type-secondary">
              A DAO is a self-organizing online community that uses Gitopia to
              manage its development securely
            </div>
            <Link href="/account/organizations/new">
              <button className="btn btn-outline btn-sm">Create a DAO</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12 pl-4 pr-12">
        <KnowledgeCenter />
      </div>
    </main>
  );
}

export default UserDashboard;
