import api from "./getApi";

export default async function getOrganization(orgId) {
  if (!orgId) return null;
  try {
    const res = await api.queryOrganization(orgId);
    if (res.ok) {
      let u = res.data.Organization;
      return u;
    }
  } catch (e) {}
}
