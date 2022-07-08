import { useState, useEffect } from "react";
import getUserRepository from "../helpers/getUserRepository";
import { useRouter } from "next/router";
import { useErrorStatus } from "./errorHandler";

export default function useRepository(initialRepository = {}) {
  const { setErrorStatusCode } = useErrorStatus();
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: router.query.repositoryId,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    collaborators: [],
    defaultBranch: "master",
    branches: [],
    tags: [],
    issues: [],
    labels: [],
    forks: [],
    stargazers: [],
    releases: [],
    ...initialRepository,
  });
  const [refreshIndex, setRefreshIndex] = useState(1);
  const [firstFetchLoading, setFirstFetchLoading] = useState(false);

  const refreshRepository = () => setRefreshIndex((prevIndex) => prevIndex + 1);

  useEffect(async () => {
    const r = await getUserRepository(
      router.query.userId,
      router.query.repositoryId
    ).then((r) => {
      if (r) {
        setRepository(r);
      } else {
        setErrorStatusCode(404);
      }
      setFirstFetchLoading(false);
    });
  }, [router.query, refreshIndex]);

  return { repository, refreshRepository, firstFetchLoading };
}
