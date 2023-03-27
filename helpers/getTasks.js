import { Api } from "../store/gitopia.gitopia.rewards/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default async function getTasks(address) {
  if (!address) return {};
  try {
    const res = await api.queryTasks(address);
    if (res.ok) {
      return res.data.tasks;
    }
  } catch (e) {
    console.error(e);
  }
}
