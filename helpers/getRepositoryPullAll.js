import { queryClient } from "gitopiajs";

export default async function getRepositoryPullAll(
  id,
  repoName,
  option,
  pagination
) {
  try {
    const qc = await queryClient({ addr: process.env.NEXT_PUBLIC_API_URL });
    const query = {};
    for (let o in option) {
      query[`option.${o}`] = option[o];
    }
    for (let p in pagination) {
      query[`pagination.${p}`] = pagination[p];
    }
    console.log(query);
    const res = await qc.queryRepositoryPullRequestAll(id, repoName, query);
    if (res.ok) {
      return res.data;
    }
    return {};
  } catch (e) {
    console.error(e);
  }
}
