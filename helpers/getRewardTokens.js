import { Api } from "../store/gitopia.gitopia.rewards/rest";

export default async function getRewardToken(apiNode, address) {
  if (!address) return null;
  try {
    const api = new Api({ baseURL: apiNode });
    const res = await api.queryReward(address);
    if (res) {
      return res.data.rewards;
    }
  } catch (e) {
    console.error(e);
  }
}
