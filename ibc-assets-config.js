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
  uatom: {
    id: "cosmos",
    coinDecimals: 6,
    coinDenom: "ATOM",
    icon: "/tokens/atom.svg",
  },
};

export const gasConfig = {
  osmosistestnet: {
    gasPrice: "0.025uosmo",
    multiplier: 1.3,
  },
  cosmoshubtestnet: {
    gasPrice: "0.1uatom",
    multiplier: 1.5,
  },
};
