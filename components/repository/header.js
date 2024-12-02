import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  GitFork,
  Tags,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/router";
import shrinkAddress from "../../helpers/shrinkAddress";
import getDao from "../../helpers/getDao";
import { useApiClient } from "../../context/ApiClientContext";
import DAOProtectionBadge from "./DaoProtectionBadge";

const OwnershipBadge = ({ type }) => {
  if (type === "USER") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs">
        <User size={12} className="text-blue-400" />
        <span className="text-blue-400">Personal Repository</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs">
      <Users size={12} className="text-purple-400" />
      <span className="text-purple-400">DAO Repository</span>
    </div>
  );
};

const RepositoryHeader = ({ repository, daoData, selectedAddress }) => {
  const [forkTargetShown, setForkTargetShown] = useState(false);
  const [branchCount, setBranchCount] = useState(0);
  const [tagCount, setTagCount] = useState(0);
  const router = useRouter();

  const isDAORepository = repository.owner.type === "DAO";
  const daoConfig = daoData?.config || {};

  useEffect(() => {
    if (repository.id) {
      setBranchCount(repository.branches.length);
      setTagCount(repository.tags.length);
    }
  }, [repository.id]);

  const enabledFeatures = [
    daoConfig.require_pull_request_proposal,
    daoConfig.require_release_proposal,
    daoConfig.require_repository_deletion_proposal,
    daoConfig.require_collaborator_proposal,
  ].filter(Boolean).length;

  const governanceFeatures = [
    {
      enabled: daoConfig.require_pull_request_proposal,
      icon: GitPullRequest,
      label: "Pull Requests",
      description: "Pull request merges require DAO approval",
    },
    {
      enabled: daoConfig.require_release_proposal,
      icon: Tags,
      label: "Releases",
      description: "Creating releases requires DAO approval",
    },
    {
      enabled: daoConfig.require_repository_deletion_proposal,
      icon: Trash2,
      label: "Deletion",
      description: "Repository deletion requires DAO approval",
    },
    {
      enabled: daoConfig.require_collaborator_proposal,
      icon: Users,
      label: "Collaborators",
      description: "Adding/removing collaborators requires DAO approval",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl flex items-center gap-2">
              <div className="flex items-center gap-2 group">
                {isDAORepository ? (
                  <Users size={16} className="text-purple-400" />
                ) : (
                  <User size={16} className="text-blue-400" />
                )}
                <Link
                  href={`/${repository.owner.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {shrinkAddress(repository.owner.id)}
                </Link>
              </div>
              <span className="text-gray-500">/</span>
              <Link
                href={`/${repository.owner.id}/${repository.name}`}
                className="hover:text-primary transition-colors"
                data-test="repo_name"
              >
                {repository.name}
              </Link>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <OwnershipBadge type={repository.owner.type} />
            {isDAORepository && daoData && (
              <DAOProtectionBadge
                enabledFeatures={enabledFeatures}
                governanceFeatures={governanceFeatures}
              />
            )}
            {repository.fork && (
              <div className="badge badge-outline text-type-tertiary">
                <GitFork className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            className="flex items-center gap-2 px-2 py-1 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/20 rounded-full text-xs transition-colors"
            data-test="fork-repo"
            onClick={() => {
              if (selectedAddress && repository?.allowForking) {
                router.push(
                  ["", repository.owner.id, repository.name, "fork"].join("/")
                );
              } else {
                setForkTargetShown(true);
              }
            }}
            disabled={!(branchCount || tagCount)}
          >
            <GitFork size={12} className="text-gray-400" />
            <span className="text-gray-400">Forks</span>
            <span className="ml-1 px-1.5 py-0.5 bg-gray-500/20 rounded-full">
              {repository.forks.length}
            </span>
          </button>
        </div>
      </div>

      {/* Fork Modal */}
      <input
        type="checkbox"
        checked={forkTargetShown}
        readOnly
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box max-w-sm">
          {repository.allowForking ? (
            !selectedAddress ? (
              <>
                <p>Please login to fork repository</p>
                <div className="modal-action">
                  <label
                    className="btn btn-sm"
                    onClick={() => setForkTargetShown(false)}
                  >
                    Ok
                  </label>
                </div>
              </>
            ) : null
          ) : repository?.owner?.address === selectedAddress ? (
            <>
              <p>
                Forking is disabled on this repository, please allow in settings
                -&gt; permissions
              </p>
              <div className="modal-action mt-8">
                <label
                  className="btn btn-sm"
                  onClick={() => setForkTargetShown(false)}
                >
                  Cancel
                </label>
                <Link
                  className="btn btn-sm btn-primary"
                  href={[
                    "",
                    repository.owner.id,
                    repository.name,
                    "settings#permissions",
                  ].join("/")}
                >
                  Goto Settings
                </Link>
              </div>
            </>
          ) : (
            <>
              <p data-test="forking_disabled">
                Forking is disabled on this repository, please contact the owner
                to allow forking.
              </p>
              <div className="modal-action mt-8">
                <label
                  className="btn btn-sm"
                  onClick={() => setForkTargetShown(false)}
                >
                  Ok
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeader;
