import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";

function CloneRepoInfo({ remoteUrl, ...props }) {
  const [tab, setTab] = useState("gitopia");
  const [cloneCmd, setCloneCmd] = useState("git clone " + remoteUrl);

  useEffect(() => {
    if (tab === "gitopia") {
      setCloneCmd("git clone " + remoteUrl);
    } else if (tab === "ipfs") {
      setCloneCmd("ipfs_clone " + remoteUrl);
    } else if (tab === "arweave") {
      setCloneCmd("arweave_clone " + remoteUrl);
    }
  }, [tab]);

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
        <div className="tabs mb-4">
          <button
            className={
              "tab tab-sm tab-bordered" +
              (tab === "gitopia" ? " tab-active" : "")
            }
            onClick={() => {
              setTab("gitopia");
            }}
          >
            Gitopia Server
          </button>
          <button
            className={
              "tab tab-sm tab-bordered" + (tab === "ipfs" ? " tab-active" : "")
            }
            onClick={() => {
              setTab("ipfs");
            }}
          >
            IPFS
          </button>
          <button
            className={
              "tab tab-sm tab-bordered" +
              (tab === "arweave" ? " tab-active" : "")
            }
            onClick={() => {
              setTab("arweave");
            }}
          >
            Arweave
          </button>
        </div>
        <div className="flex items-center py-2 px-4 rounded-lg text-sm alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-px"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="mr-2">Install gitopia remote helper first</span>
          <a
            href="https://docs.gitopia.com/git-remote-gitopia"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline btn-secondary btn-sm"
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
              value={cloneCmd}
              readOnly={true}
              className="w-full input input-ghost input-md input-bordered py-2 pr-14"
            />
            <button
              className="absolute right-0 top-0 btn btn-ghost btn-md"
              onClick={(e) => {
                navigator.clipboard.writeText(cloneCmd);
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
