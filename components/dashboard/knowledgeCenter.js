export default function KnowledgeCenter() {
  return (
    <div className="">
      <div className="flex mb-6 items-center">
        <div className="flex-none border border-grey rounded-full w-12 h-12 sm:w-14 sm:h-14 p-3 sm:mr-10 mr-2">
          <img src="/logo-g.svg"></img>
        </div>
        <div className="sm:flex w-full">
          <div className="flex-1 text-sm font-bold">Learn About Gitopia</div>

          <div className="text-sm">
            See our{" "}
            <a
              href="https://docs.gitopia.com/"
              className="btn-link"
              target="_blank"
              rel="noreferrer"
            >
              Knowledge Center
            </a>{" "}
            for more information
          </div>
        </div>
      </div>
      <div className="flex sm:ml-24 sm:border-b sm:border-grey sm:py-2 mb-4">
        <div className="flex-1 text-sm">Create a new repository</div>
        <a
          href="https://docs.gitopia.com/repository"
          className="btn btn-link btn-xs"
          target="_blank"
          rel="noreferrer"
        >
          Read More
        </a>
      </div>
      <div className="flex sm:ml-24 sm:border-b sm:border-grey sm:py-2 mb-4">
        <div className="flex-1 text-sm">Create a new DAO</div>
        <a
          href="https://docs.gitopia.com/dao"
          className="btn btn-link btn-xs"
          target="_blank"
          rel="noreferrer"
        >
          Read More
        </a>
      </div>
      <div className="flex sm:ml-24 sm:border-b sm:border-grey sm:py-2 mb-4">
        <div className="flex-1 text-sm">git remote helper</div>
        <a
          href="https://docs.gitopia.com/git-remote-gitopia"
          className="btn btn-link btn-xs"
          target="_blank"
          rel="noreferrer"
        >
          Read More
        </a>
      </div>
    </div>
  );
}
