import api from "./getProposalApi";
import axios from "axios";

export default async function getProposal(id) {
  let proposer = "";
  let initialDeposit = "";
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL +
    "/cosmos/tx/v1beta1/txs?events=submit_proposal.proposal_id=" +
    id;
  await axios
    .get(baseUrl)
    .then(({ data }) => {
      proposer = data.tx_responses[0].tx.body.messages[0].proposer;
      initialDeposit =
        data.tx_responses[0].tx.body.messages[0].initial_deposit.length == 0
          ? []
          : data.tx_responses[0].tx.body.messages[0].initial_deposit[0].amount;
    })
    .catch((err) => {
      console.error(err);
    });

  try {
    const res = await api.queryProposal(id);
    if (res.status === 200) {
      let u = res.data.proposal;
      let obj = {
        msg: u,
        proposer: proposer,
        initial_deposit: initialDeposit,
      };
      return obj;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
  }
}
