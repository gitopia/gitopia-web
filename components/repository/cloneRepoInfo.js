import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { notify } from "reapop";
import { useApiClient } from "../../context/ApiClientContext";

function CloneRepoInfo({ remoteUrl, repositoryId, ...props }) {
  const [tab, setTab] = useState("gitopia");
  const [cloneCmd, setCloneCmd] = useState("git clone " + remoteUrl);
  const [storageInfo, setStorageInfo] = useState(null);
  const { storageApiClient } = useApiClient();

  useEffect(() => {
    if (tab === "gitopia") {
      setCloneCmd("git clone " + remoteUrl);
    }
  }, [tab, remoteUrl]);

  useEffect(() => {
    const fetchStorageInfo = async () => {
      if (repositoryId && storageApiClient) {
        try {
          const response = await storageApiClient.queryRepositoryPackfile(repositoryId);
          // log response
          console.log(response);
          setStorageInfo(response.data.packfile);
        } catch (error) {
          console.error("Error fetching storage info:", error);
        }
      }
    };

    if (tab === "storage") {
      fetchStorageInfo();
    }
  }, [tab, repositoryId, storageApiClient]);

  const formatSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

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
      <div className="shadow-lg dropdown-content bg-base-300 rounded mt-1 overflow-hidden p-4 text-left w-96">
        <div className="tabs px-2 mb-4">
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
              "tab tab-sm tab-bordered" +
              (tab === "storage" ? " tab-active" : "")
            }
            onClick={() => {
              setTab("storage");
            }}
          >
            Storage Info
          </button>
        </div>
        {tab === "gitopia" ? (
          <>
            <div className="flex items-center p-2 text-sm text-bold text-accent-focus">
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
              <span className="">Please Note</span>
            </div>
            <div className="px-2">
              <span className="text-sm mr-2">
                In order to use gitopia protocol, you need to install git remote
                helper first
              </span>
              <a
                href="https://docs.gitopia.com/git-remote-gitopia"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-teal"
              >
                Learn more
              </a>
            </div>
            <div className="mt-6">
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
          </>
        ) : tab === "storage" ? (
          <div className="mt-4">
            {storageInfo ? (
              <div className="bg-base-200 rounded-lg p-4 shadow space-y-4 border border-base-300">
                <div className="flex items-center space-x-3 mb-2">
                  <img src="/ipfs-logo.png" alt="IPFS" className="w-7 h-7" />
                  <span className="text-lg font-semibold text-base-content">Storage Information</span>
                </div>
                <div className="divide-y divide-base-300">
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-gray-500">Provider:</span>
                    <span className="font-mono text-base-content truncate max-w-[220px]" title={storageInfo.creator}>
                      {storageInfo.creator}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-gray-500">Size:</span>
                    <span className="font-mono text-base-content">{formatSize(parseInt(storageInfo.size))}</span>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-gray-500">IPFS CID:</span>
                    <span className="font-mono text-xs truncate max-w-[220px]" title={storageInfo.cid}>
                      {storageInfo.cid}
                    </span>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <span className="text-gray-500">Root Hash:</span>
                    <span className="font-mono text-xs truncate max-w-[220px]" title={storageInfo.root_hash}>
                      {storageInfo.root_hash}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Loading storage information...</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, { notify })(CloneRepoInfo);
