export default async function getGroupMembers(cosmosGroupApiClient, groupId) {
  if (!groupId) return null;
  try {
    const res = await cosmosGroupApiClient.queryGroupMembers(groupId);
    if (res.status === 200) {
      let m = res.data.members;
      return m;
    } else return [];
  } catch (e) {
    console.error(e);
  }
}
