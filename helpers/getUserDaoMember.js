import api from "./getApi";

export default async function getDaoMember(daoId) {
  if (!daoId) return null;
  try {
    const res = await api.queryDaoMemberAll(daoId);
    if (res.ok) {
      let m = res.data.Member;
      return m;
    } else return [];
  } catch (e) {
    console.error(e);
  }
}
