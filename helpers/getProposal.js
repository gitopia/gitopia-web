import api from "./getProposalApi";

export default async function getProposal(id) {
  try {
    const res = await api.queryProposal(id);
    if (res.ok) {
      let u = res.data.proposal;
      return u;
    }
  } catch (e) {
    console.error(e);
  }
}
