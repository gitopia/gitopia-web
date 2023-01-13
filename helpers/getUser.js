import api from "./getApi";

export default async function getUser(userId) {
  if (!userId) return null;
  try {
    const res = await api.queryUser(userId);
    if (res.ok) {
      let u = res.data.User;
      return u;
    }
  } catch (e) {
    console.log("Not found User", userId);
  }
}
