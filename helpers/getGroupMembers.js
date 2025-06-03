export default async function getGroupMembers(apiClient, groupId) {
  if (!groupId) return null;
  try {
    const res = await apiClient.cosmos.group.v1.groupMembers({ groupId });
    return res.members;
  } catch (e) {
    console.error(e);
  }
}
