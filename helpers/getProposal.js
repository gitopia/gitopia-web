import axios from "../helpers/axiosFetch";

export default async function getProposal(apiNode, apiClient, id) {
  let proposer = "";
  let initialDeposit = "";
  const baseUrl =
    apiNode + "/cosmos/tx/v1beta1/txs?events=submit_proposal.proposal_id=" + id;
  await axios
    .get(baseUrl)
    .then(({ data }) => {
      if (data.tx_responses.length > 0) {
        proposer = data.tx_responses[0].tx.body.messages[0].proposer;
        initialDeposit =
          data.tx_responses[0].tx.body.messages[0].initial_deposit.length == 0
            ? []
            : data.tx_responses[0].tx.body.messages[0].initial_deposit[0]
                .amount;
      }
    })
    .catch((err) => {
      console.error(err);
    });

  try {
    const res = await apiClient.cosmos.gov.v1beta1.proposal({ proposalId: id });
    let u = res.proposal;
    let obj = {
      msg: u,
      proposer: proposer,
      initial_deposit: initialDeposit,
    };
    return obj;
  } catch (e) {
    console.error(e);
  }
}
