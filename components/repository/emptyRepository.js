export default function EmptyRepository(props) {
  const { repository } = props;
  return (
    <>
      <div className="flex border-2 border-grey rounded-md px-8 py-2 mt-16 items-center">
        <div className="flex-none w-72 text-xl">Quick Setup</div>
        <div className="flex-1 flex items-center">
          <div className="tabs flex-none mr-4">
            <div className="tab tab-bordered tab-active">HTTPS</div>
            <div className="tab tab-bordered">SSH</div>
          </div>
          <div className="form-control flex-1">
            <div className="relative">
              <input
                name="repository-url"
                type="text"
                value={
                  "gitopia://" + repository.owner.ID + "/" + repository.name
                }
                readOnly={true}
                className="w-full pr-16 input input-ghost input-bordered"
              />
              <button className="absolute right-0 top-0 rounded-md-l-none btn btn-ghost">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-16">
        <div className="border-2 border-grey rounded-md p-8 h-96 flex flex-col">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="flex-none py-4">
            <div className="text-xl mb-4">
              Push existing repository from command line
            </div>
            <div className="w-44">
              <button className="btn btn-primary btn-xs btn-block">
                Copy commands
              </button>
            </div>
          </div>
        </div>
        <div className="border-2 border-grey rounded-md p-8 flex flex-col">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </div>
          <div className="flex-none py-4">
            <div className="text-xl mb-4">
              Import code from another repository
            </div>
            <div className="w-44">
              <button className="btn btn-primary btn-xs btn-block">
                Copy commands
              </button>
            </div>
          </div>
        </div>
        <div className="border-2 border-grey rounded-md p-8 flex flex-col">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-none py-4">
            <div className="text-xl mb-4">
              Create a new repository from command line
            </div>
            <div className="w-44">
              <button className="btn btn-primary btn-xs btn-block">
                Copy commands
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
