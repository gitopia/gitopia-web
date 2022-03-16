import api from "./getProposalApi";

export default async function getProposals() {
  try {
    const res = await api.queryProposals();
    if (res.ok) {
      let u = res.data.proposals;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
