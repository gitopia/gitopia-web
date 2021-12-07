import { useState, useEffect } from "react";
import getRepository from "../helpers/getRepository";
import getRepositoryPull from "../helpers/getRepositoryPull";
import getBranchSha from "../helpers/getBranchSha";
import { useRouter } from "next/router";

export default function usePullRequest(repository) {
  const router = useRouter();
  const [pullRequest, setPullRequest] = useState({
    iid: router.query.pullRequestIid,
    creator: "",
    comments: [],
    reviewers: [],
    assignees: [],
    labels: [],
    head: { repository: {} },
    base: { repository: {} },
  });
  const [refreshIndex, setRefreshIndex] = useState(1);

  const refreshPullRequest = () =>
    setRefreshIndex((prevIndex) => prevIndex + 1);

  useEffect(async () => {
    const p = await getRepositoryPull(
      router.query.userId,
      router.query.repositoryId,
      router.query.pullRequestIid
    );
    if (p) {
      if (p.base.repositoryId === p.head.repositoryId) {
        p.head.repository = p.base.repository = repository;
        if (p.state === "OPEN") {
          p.head.sha = getBranchSha(
            p.head.branch,
            repository.branches,
            repository.tags
          );
          p.base.sha = getBranchSha(
            p.base.branch,
            repository.branches,
            repository.tags
          );
        } else {
          p.base.sha = p.base.commitSha;
          p.head.sha = p.head.commitSha;
        }
      } else {
        const forkRepo = await getRepository(p.head.repositoryId);
        if (forkRepo) {
          p.head.repository = forkRepo;
          p.base.repository = repository;
          if (p.state === "OPEN") {
            p.head.sha = getBranchSha(
              p.head.branch,
              forkRepo.branches,
              forkRepo.tags
            );
            p.base.sha = getBranchSha(
              p.base.branch,
              repository.branches,
              repository.tags
            );
          } else {
            p.base.sha = p.base.commitSha;
            p.head.sha = p.head.commitSha;
          }
        }
      }
      setPullRequest(p);
    }
  }, [router.query, repository.id, refreshIndex]);

  return { pullRequest, refreshPullRequest };
}
