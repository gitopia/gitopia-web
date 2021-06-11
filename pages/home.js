import Head from "next/head";
import Header from "../components/header";
import CreateRepository from "../components/createRepository";
import BackendStatus from "../components/backendStatus";

export default function Home(props) {
  return (
    <div data-theme="dark" className="bg-base-100 text-base-content">
      <Head>
        <title>Gitopia</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <div className="flex">
        <div class="w-64 border-r border-grey">
          <div className="border-b border-grey p-4">
            <select class="select select-ghost select-md w-full max-w-xs">
              <option selected="selected">Snehil Buxy</option>
              <option>Org: Gitopia</option>
              <option>Org: Polygon</option>
              <option>Org: yEarn Finance</option>
            </select>
          </div>
          <div className="my-8">
            <div className="text-md mx-8 border-b border-grey py-2 mb-4">
              Personal
            </div>
            <ul class="menu compact mx-4">
              <li className="mb-2">
                <a class="rounded">Item 1</a>
              </li>
              <li>
                <a class="rounded">Item 2</a>
              </li>
            </ul>
          </div>
          <div className="my-8">
            <div className="text-md mx-8 border-b border-grey py-2 mb-4">
              Decentralized
            </div>
            <ul class="menu compact mx-4">
              <li className="mb-2">
                <a class="rounded">Item 1</a>
              </li>
              <li className="mb-2">
                <a class="rounded">Item 2</a>
              </li>
              <li className="mb-2">
                <a class="rounded">Item 3</a>
              </li>
              <li>
                <a class="rounded">Item 4</a>
              </li>
            </ul>
          </div>
          <BackendStatus />
        </div>
        <div className="flex-1 ">
          <main className="container mx-auto max-w-screen-lg py-12">
            <div className="flex mb-12">
              <div className>
                <div className="text-xs uppercase">Welcome,</div>
                <div className="text-lg">Snehil Buxy</div>
              </div>
              <div className="flex-1"></div>
              <div className>
                <div className="text-xs uppercase ml-2">Show:</div>
                <select class="select select-ghost select-xs w-32">
                  <option selected="selected">Pull Requests</option>
                  <option>Issues</option>
                  <option>Proposals</option>
                </select>
              </div>
            </div>
            <div className="flex mb-4">
              <div className="flex flex-1 mr-2 bg-box-grad-tl bg-base-200 p-4 rounded-md">
                <div className="flex-none bg-box-grad-v w-40 h-full rounded-md flex items-center">
                  <img src="repository.svg" />
                </div>
                <div className="flex flex-col px-8 py-12">
                  <div className="text-lg mb-8">Create a New Repository</div>
                  <div className="text-xs mb-8">
                    Begin from scratch or import an excisting repository
                  </div>
                  <button className="btn btn-outline btn-md">
                    Create a Repository
                  </button>
                </div>
              </div>
              <div className="flex flex-1 ml-2 bg-box-grad-tl bg-base-200 p-4 rounded-md">
                <div className="flex-none bg-box-grad-v w-40 h-full rounded-md flex items-center"></div>
                <div className="flex flex-col px-8 py-12">
                  <div className="text-lg mb-8">Create a New Organisation</div>
                  <div className="text-xs mb-8">
                    Organization is the team in which your repositories live
                    under.
                  </div>
                  <button className="btn btn-outline btn-md">
                    Create an Organisation
                  </button>
                </div>
              </div>
            </div>
            <div className="flex mb-12 bg-box-grad-tl bg-base-200 px-4 py-8 justify-between items-center rounded-md">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 border rounded p-2 inline ml-2 mr-6 opacity-60"
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

              <a class="btn btn-primary btn-link btn-xs">Import files</a>
            </div>
            <div className="">
              <div className="flex mb-6 items-center">
                <div className="border-2 border-grey rounded-full w-16 h-16 p-3 mr-8">
                  <img src="logo-g.svg"></img>
                </div>
                <div className="flex-1 text-sm font-bold">
                  Learn About Gitopia
                </div>
                <div className="text-sm">
                  See our{" "}
                  <a href="#" className="btn-link">
                    Knowledge Center
                  </a>{" "}
                  for more information
                </div>
              </div>
              <div className="flex ml-24 border-b border-grey py-2 mb-4">
                <div className="flex-1 text-sm">Why is Gitopia Different?</div>
                <a href="#" className="btn btn-link btn-xs">
                  Read More
                </a>
              </div>
              <div className="flex ml-24 border-b border-grey py-2 mb-4">
                <div className="flex-1 text-sm">
                  Can I still own my own repositories?
                </div>
                <a href="#" className="btn btn-link btn-xs">
                  Read More
                </a>
              </div>
              <div className="flex ml-24 border-b border-grey py-2 mb-4">
                <div className="flex-1 text-sm">What is an organization?</div>
                <a href="#" className="btn btn-link btn-xs">
                  Read More
                </a>
              </div>
            </div>
            <div>
              {/* <CurrentWallet />
              <div className="divider" />
              <CreateWallet />
              <div className="divider" />
              <CreateRepository />
              */}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
