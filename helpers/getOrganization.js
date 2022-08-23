import api from "./getApi";

export default async function getOrganization(orgId) {
  if (!orgId) return null;
  try {
    const res = await api.queryDao(orgId);
    if (res.ok) {
      let u = res.data.dao;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
