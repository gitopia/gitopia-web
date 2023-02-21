import api from "./getApi";

export default async function getUserDaoAll(usernameOrAddress) {
  if (!usernameOrAddress) return null;
  try {
    const res = await api.queryUserDaoAll(usernameOrAddress);
    if (res.status === 200) {
      return res.data.dao;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}
