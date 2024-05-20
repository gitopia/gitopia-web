import getBranchSha from "./getBranchSha";
import getRepository from "./getRepository";
import getAllRepositoryBranch from "./getAllRepositoryBranch";
import getAllRepositoryTag from "./getAllRepositoryTag";

export default async function getPullRepoInfo(
  apiClient,
  pullRequest,
  baseRepository
) {
  let p = pullRequest;
  if (p.base.repositoryId === p.head.repositoryId) {
    p.head.repository = p.base.repository = baseRepository;
    if (p.state === "OPEN") {
      p.head.sha = getBranchSha(
        p.head.branch,
        baseRepository.branches,
        baseRepository.tags
      );
      p.base.sha = getBranchSha(
        p.base.branch,
        baseRepository.branches,
        baseRepository.tags
      );
    } else {
      p.base.sha = p.base.commitSha;
      p.head.sha = p.head.commitSha;
    }
  } else {
    const forkRepo = await getRepository(apiClient, p.head.repositoryId);
    forkRepo.branches = await getAllRepositoryBranch(
      apiClient,
      forkRepo.owner.id,
      forkRepo.name
    );
    forkRepo.tags = await getAllRepositoryTag(
      apiClient,
      forkRepo.owner.id,
      forkRepo.name
    );
    if (forkRepo) {
      p.head.repository = forkRepo;
      p.base.repository = baseRepository;
      if (p.state === "OPEN") {
        p.head.sha = getBranchSha(
          p.head.branch,
          forkRepo.branches,
          forkRepo.tags
        );
        p.base.sha = getBranchSha(
          p.base.branch,
          baseRepository.branches,
          baseRepository.tags
        );
      } else {
        p.base.sha = p.base.commitSha;
        p.head.sha = p.head.commitSha;
      }
    }
  }
  return p;
}
