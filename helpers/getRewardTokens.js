export default async function getRewardToken(apiClient, address) {
  if (!address) return null;
  try {
    const res = await apiClient.gitopia.gitopia.rewards.reward({
      recipient: address,
    });
    if (res) {
      return res.rewards;
    }
  } catch (e) {
    console.error(e);
  }
}
