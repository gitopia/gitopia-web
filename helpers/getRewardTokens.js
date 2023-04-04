import { Api } from "../store/gitopia.gitopia.rewards/rest";
const api = new Api({ baseURL: process.env.NEXT_PUBLIC_API_URL });
export default async function getRewardToken(address) {
  if (!address) return {};
  try {
    const res = await api.queryReward(address);
    if (res) {
      return res.data.reward;
    }
  } catch (e) {
    console.error(e);
  }
}
