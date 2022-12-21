export const assets = [
  {
    chain_name: "osmosis",
    chain_id: {
      id: "osmo-test-4",
      version: 4,
    },
    client_id: "07-tendermint-3132",
    connection_id: "connection-2640",
    channel_id: "channel-1775",
    port_id: "transfer",
    icon: "./tokens/osmo.svg",
    rpc_node: "https://rpc-test.osmosis.zone/",
    api_node: "https://osmosistest-rpc.quickapi.com/",
    prefix: "osmo",
    coin_minimal_denom: "uosmo",
    fee: "200",
  },
];

export const coingeckoId = {
  uosmo: { id: "osmosis", coinDecimals: 6, coinDenom: "OSMO" },
};
export const gitopiaIbc = {
  chain_name: "gitopia",
  chain_id: {
    id: "gitopia-janus-devnet-3",
    version: 3,
  },
  client_id: "07-tendermint-3",
  connection_id: "connection-0",
  channel_id: "channel-0",
  port_id: "transfer",
};
