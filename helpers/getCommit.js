const validSha = new RegExp(/^[a-f0-9]{40}$/);
import axios from "../helpers/axiosFetch";

export default async function getCommit(storageApiUrl, repoId = null, commitSha = null) {
  let obj = {};
  if (repoId === null) {
    return obj;
  }
  if (!validSha.test(commitSha)) {
    return obj;
  }
  let baseUrl = storageApiUrl + "/commits";
  let params = {
    repository_id: Number(repoId),
  };
  if (commitSha) {
    baseUrl = baseUrl + "/" + commitSha;
  }
  try {
    return await axios.post(baseUrl, params).then((response) => {
      return response.data;
    });
  } catch (e) {
    console.error(e);
    return obj;
  }
}
