export default function KnowledgeCenter() {
  return (
    <div className="">
      <div className="flex mb-6 items-center">
        <div className="border border-grey rounded-full w-14 h-14 p-3 mr-10">
          <img src="/logo-g.svg"></img>
        </div>
        <div className="flex-1 text-sm font-bold">Learn About Gitopia</div>
        <div className="text-sm">
          See our{" "}
          <a
            href="https://docs.gitopia.com/"
            className="btn-link"
            target="_blank"
          >
            Knowledge Center
          </a>{" "}
          for more information
        </div>
      </div>
      <div className="flex ml-24 border-b border-grey py-2 mb-4">
        <div className="flex-1 text-sm">Create a new repository</div>
        <a
          href="https://docs.gitopia.com/repository"
          className="btn btn-link btn-xs"
          target="_blank"
        >
          Read More
        </a>
      </div>
      <div className="flex ml-24 border-b border-grey py-2 mb-4">
        <div className="flex-1 text-sm">Create a new DAO</div>
        <a
          href="https://docs.gitopia.com/organizations"
          className="btn btn-link btn-xs"
          target="_blank"
        >
          Read More
        </a>
      </div>
      <div className="flex ml-24 border-b border-grey py-2 mb-4">
        <div className="flex-1 text-sm">git remote helper</div>
        <a
          href="https://docs.gitopia.com/git-remote-gitopia"
          className="btn btn-link btn-xs"
          target="_blank"
        >
          Read More
        </a>
      </div>
    </div>
  );
}
