import { useState, useEffect } from "react";
import getPullRequest from "../helpers/getPullRequest";
import { useRouter } from "next/router";
import { useErrorStatus } from "./errorHandler";
import getPullRepoInfo from "../helpers/getPullRepoInfo";

export default function usePullRequest(repository, initialPullRequest = {}) {
  const router = useRouter();
  const { setErrorStatusCode } = useErrorStatus();
  const [pullRequest, setPullRequest] = useState({
    iid: router.query.pullRequestIid,
    creator: "",
    description: "",
    comments: [],
    reviewers: [],
    assignees: [],
    labels: [],
    issues: [],
    head: { repository: {} },
    base: { repository: {} },
    ...initialPullRequest,
  });
  const [refreshIndex, setRefreshIndex] = useState(1);

  const refreshPullRequest = () =>
    setRefreshIndex((prevIndex) => prevIndex + 1);

  useEffect(() => {
    async function initRepository() {
      const p = await getPullRequest(
        router.query.userId,
        router.query.repositoryId,
        router.query.pullRequestIid
      );
      if (p) {
        setPullRequest(await getPullRepoInfo(p, repository));
      } else {
        setErrorStatusCode(404);
      }
    }
    initRepository();
  }, [router.query, repository.id, refreshIndex]);

  return { pullRequest, refreshPullRequest };
}
