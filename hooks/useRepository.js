import { useState, useEffect } from "react";
import getAnyRepository from "../helpers/getAnyRepository";
import { useRouter } from "next/router";
import { useErrorStatus } from "./errorHandler";
import getUser from "../helpers/getUser";
import getOrganization from "../helpers/getOrganization";

export default function useRepository() {
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
  });
  const [refreshIndex, setRefreshIndex] = useState(1);
  const [firstFetchLoading, setFirstFetchLoading] = useState(true);

  const refreshRepository = () => setRefreshIndex((prevIndex) => prevIndex + 1);

  useEffect(async () => {
    const r = await getAnyRepository(
      router.query.userId,
      router.query.repositoryId
    );
    if (r) {
      let ownerDetails = {};
      if (r.owner.type === "USER") {
        ownerDetails = await getUser(r.owner.id);
        setRepository({
          ...r,
          owner: {
            type: r.owner.type,
            id:
              ownerDetails.username !== "" ? ownerDetails.username : r.owner.id,
            address: r.owner.id,
            username: ownerDetails.username,
            avatarUrl: ownerDetails.avatarUrl,
          },
        });
      } else {
        ownerDetails = await getOrganization(r.owner.id);
        setRepository({
          ...r,
          owner: {
            type: r.owner.type,
            id: ownerDetails.name,
            address: r.owner.id,
            username: ownerDetails.name,
            avatarUrl: ownerDetails.avatarUrl,
          },
        });
      }
    } else {
      setErrorStatusCode(404);
    }
    setFirstFetchLoading(false);
  }, [router.query, refreshIndex]);

  return { repository, refreshRepository, firstFetchLoading };
}
