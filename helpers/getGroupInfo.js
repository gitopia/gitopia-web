export default async function getGroupInfo(apiClient, groupId) {
  if (!groupId) return null;
  try {
    const res = await apiClient.cosmos.group.v1.groupInfo({ groupId });
    return res.info;
  } catch (e) {
    console.error(e);
  }
}
