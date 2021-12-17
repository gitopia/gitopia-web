import { useState, useEffect } from "react";
import getUserRepository from "../helpers/getUserRepository";
import { useRouter } from "next/router";

export default function useRepository() {
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
  });
  const [refreshIndex, setRefreshIndex] = useState(1);

  const refreshRepository = () => setRefreshIndex((prevIndex) => prevIndex + 1);

  useEffect(async () => {
    const r = await getUserRepository(
      router.query.userId,
      router.query.repositoryId
    );
    if (r) {
      setRepository(r);
    }
  }, [router.query, refreshIndex]);

  return { repository, refreshRepository };
}
