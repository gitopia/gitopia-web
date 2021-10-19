import { useState,useEffect } from "react";
import getUserRepository from "../../../../helpers/getUserRepository";
import { useRouter } from "next/router";

export default function useSetRepository(rq) {
  const router = useRouter();
  const [repository, setRepository] = useState({
		id: rq.repositoryId,
    name: rq.repositoryId,
    owner: { id: rq.userId },
		issues: [],
    labels: [],
    forks: [],
    stargazers: [],
  });
	
 	useEffect(async () => {
    const [r] = await Promise.all([getUserRepository(rq.userId, rq.repositoryId),]);
    if (r) setRepository(r);
  }, [rq]);

	return repository;
}