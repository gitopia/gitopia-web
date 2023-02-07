export const assets = [
  {
    chain_name: "osmosis",
    chain_id: {
      id: "osmo-test-4",
      version: 4,
    },
    client_id: "07-tendermint-3519",
    connection_id: "connection-2976",
    channel_id: "channel-2200",
    port_id: "transfer",
    icon: "/tokens/osmo.svg",
    rpc_node: "https://rpc-test.osmosis.zone:443",
    api_node: "https://osmosistest-rpc.quickapi.com/",
    lcd_node: "https://lcd.testnet.osmosis.zone/",
    prefix: "osmo",
    coin_minimal_denom: "uosmo",
    fee: "200",
  },
];

export const coingeckoId = {
  uosmo: {
    id: "osmosis",
    coinDecimals: 6,
    coinDenom: "OSMO",
    icon: "/tokens/osmosis.svg",
  },
  utlore: {
    id: "",
    coinDecimals: 6,
    coinDenom: "TLORE",
    icon: "/tokens/gitopia.svg",
  },
};
export const gitopiaIbc = {
  chain_name: "gitopia",
  chain_id: {
    id: "gitopia-janus-devnet-4",
    version: 4,
  },
  client_id: "07-tendermint-3",
  connection_id: "connection-0",
  channel_id: "channel-0",
  port_id: "transfer",
};
