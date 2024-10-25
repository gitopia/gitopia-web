export default async function getGroupInfo(cosmosGroupApiClient, groupId) {
  if (!groupId) return null;
  try {
    const res = await cosmosGroupApiClient.queryGroupInfo(groupId);
    if (res.status === 200) {
      let m = res.data.info;
      return m;
    } else return [];
  } catch (e) {
    console.error(e);
  }
}
