import { Api } from "../store/gitopia.gitopia.rewards/rest";
const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
export default async function getTasks(address) {
  if (!address) return {};
  try {
    const res = await api.queryTasks(address);
    if (res.ok) {
      console.log(data);
      return res.data;
    }
  } catch (e) {
    console.error(e);
  }
}
