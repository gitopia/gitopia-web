import { Api } from "../store/gitopia.gitopia.rewards/rest";

export default async function getTasks(apiNode, address) {
  if (!address) return {};
  try {
    const api = new Api({ baseURL: apiNode });
    const res = await api.queryTasks(address);
    if (res) {
      return res.data.tasks;
    }
  } catch (e) {
    console.error(e);
  }
}
