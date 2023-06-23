import { useState, useEffect, useMemo } from "react";
import getAnyRepository from "../helpers/getAnyRepository";
import { useRouter } from "next/router";
import { useErrorStatus } from "./errorHandler";
import getUser from "../helpers/getUser";
import getDao from "../helpers/getDao";
import getAllRepositoryBranch from "../helpers/getAllRepositoryBranch";
import getAllRepositoryTag from "../helpers/getAllRepositoryTag";

export default function useRepository(initialRepository = {}) {
  const { setErrorStatusCode } = useErrorStatus();
  const router = useRouter();
  const [repository, setRepository] = useState({
    id: null,
    name: router.query.repositoryId,
    owner: { id: router.query.userId },
    collaborators: [],
    defaultBranch: null,
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

  useMemo(() => {
    const fetch = async () => {
      const r = await getAnyRepository(
        router.query.userId,
        router.query.repositoryId
      );
      if (r) {
        let ownerDetails = {};

        const [branches, tags] = await Promise.all([
          getAllRepositoryBranch(r.owner.id, r.name),
          getAllRepositoryTag(r.owner.id, r.name),
        ]);
        if (r.owner.type === "USER") {
          ownerDetails = await getUser(r.owner.id);
          setRepository({
            ...r,
            owner: {
              type: r.owner.type,
              id:
                ownerDetails.username !== ""
                  ? ownerDetails.username
                  : r.owner.id,
              address: r.owner.id,
              username: ownerDetails.username,
              avatarUrl: ownerDetails.avatarUrl,
            },
            branches: branches,
            tags: tags,
          });
        } else if (r.owner.type === "DAO") {
          ownerDetails = await getDao(r.owner.id);
          setRepository({
            ...r,
            owner: {
              type: r.owner.type,
              id: ownerDetails.name,
              address: r.owner.id,
              username: ownerDetails.name,
              avatarUrl: ownerDetails.avatarUrl,
            },
            branches: branches,
            tags: tags,
          });
        }
      } else {
        setErrorStatusCode(404);
      }
      setFirstFetchLoading(false);
    };
    if (!initialRepository.id) fetch();
  }, [router.query.userId, router.query.repositoryId, refreshIndex]);
  return { repository, refreshRepository, firstFetchLoading };
}
