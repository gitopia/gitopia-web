import api from "./getApi";

export default async function getUserAll() {
  try {
    const res = await api.queryUserAll();
    if (res.ok) {
      let u = res.data.User;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
