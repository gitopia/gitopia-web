export default function Header() {
  return (
    <div className="navbar border-b border-grey bg-base-100 text-base-content">
      <div className="flex-none lg:hidden">
        <label for="main-drawer" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-6 h-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div className="flex-none px-6 w-64">
        <img width={120} height={30} src="/logo-white.svg"></img>
      </div>
      <div className="flex-none mr-6">
        <div class="form-control">
          <div class="relative">
            <input
              type="text"
              placeholder="Search"
              class="w-full pr-16 input input-ghost input-bordered"
            />
            <button class="absolute right-0 top-0 rounded-l-none btn btn-ghost">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="items-stretch">
        <a class="btn btn-ghost btn-sm rounded-btn">Explore</a>
        <a class="btn btn-ghost btn-sm rounded-btn">Marketplace</a>
      </div>
      <div className="flex-1"></div>
      <div className="flex-none mr-4">
        <button className="btn btn-primary btn-sm px-4 ">Connect Wallet</button>
      </div>
      <div className="flex-none mr-4">
        <div className="dropdown dropdown-end">
          <div tabIndex="0" className="avatar">
            <div className="rounded-full w-10 h-10 m-1">
              <img src="https://i.pravatar.cc/500?img=32" />
            </div>
          </div>
          <ul className="shadow menu dropdown-content bg-base-200 rounded-box w-52">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
