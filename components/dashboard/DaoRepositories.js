import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Box, GitPullRequest, CircleDot, Plus } from "lucide-react";

const DaoRepositories = ({ repositories = [], dao, onCreateRepository }) => {
  const router = useRouter();

  const handleCreateRepo = () => {
    router.push({
      pathname: "/new",
      query: { owner: dao?.address },
    });
  };

  return (
    <div className="bg-base-200 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Repositories</h3>
        <button onClick={handleCreateRepo} className="btn btn-primary btn-sm">
          <Plus size={16} className="mr-2" />
          New Repository
        </button>
      </div>

      {repositories.length === 0 ? (
        <div className="text-center py-12 bg-base-100 rounded-lg">
          <Box
            size={48}
            className="mx-auto mb-4 text-muted-foreground opacity-50"
          />
          <h3 className="text-lg font-semibold mb-2">No repositories yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first repository
          </p>
          <button onClick={handleCreateRepo} className="btn btn-primary">
            <Plus size={16} className="mr-2" />
            Create Repository
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {repositories.map((repo) => (
            <div
              key={repo.id}
              className="bg-base-100 p-4 rounded-lg hover:bg-base-300 transition-colors border border-base-300"
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1">
                  <Link
                    href={`/${dao?.name?.toLowerCase()}/${repo.name}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {repo.name}
                  </Link>
                  <p
                    className={`mt-1 text-sm ${
                      repo.description
                        ? "text-muted-foreground"
                        : "text-muted-foreground/60 italic"
                    }`}
                  >
                    {repo.description || "No description provided"}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <CircleDot size={18} className="mr-1.5" />
                    <span className="text-sm">{repo.issuesCount}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <GitPullRequest size={18} className="mr-1.5" />
                    <span className="text-sm">{repo.pullsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DaoRepositories;
