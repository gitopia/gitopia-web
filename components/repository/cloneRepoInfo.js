import { connect } from "react-redux";
import { notify } from "reapop";

function CloneRepoInfo({ remoteUrl, ...props }) {
  return (
    <div className="dropdown dropdown-end outline-none" tabIndex="0">
      <button className="btn btn-sm btn-outline w-26" tabIndex="0">
        <div className="flex-1 text-left px-2">Clone</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div className="shadow-lg dropdown-content bg-base-300 rounded mt-1 overflow-hidden w-max p-4 text-left">
        <div className="flex items-center p-2 rounded text-sm alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="mr-2">Install gitopia remote helper first.</span>
          <a
            href="https://docs.gitopia.com/git-remote-gitopia"
            target="_blank"
            className="link link-primary no-underline hover:underline"
          >
            Learn more
          </a>
        </div>
        <div className="mt-4">
          <div className="relative w-full mt-4">
            <input
              rows={2}
              cols={120}
              name="repository-url"
              type="text"
              value={"git clone " + remoteUrl}
              readOnly={true}
              className="w-full input input-ghost input-sm input-bordered py-2 pr-12"
            />
            <button
              className="absolute right-0 top-0 btn btn-ghost btn-sm"
              onClick={(e) => {
                navigator.clipboard.writeText("git clone " + remoteUrl);
                props.notify("Copied to clipboard", "info");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { notify })(CloneRepoInfo);
