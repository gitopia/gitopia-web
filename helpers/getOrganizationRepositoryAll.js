import api from "./getApi";

export default async function getOrganizationRepositoryAll(orgId) {
  if (!orgId) return null;
  try {
    // TODO: use queryOrganizationRepositoryAll
    const res = await api.queryOrganization(orgId);
    if (res.ok) {
      return res.data.Organization.repositories;
    }
  } catch (e) {
    console.error(e);
  }
}
