export const coingeckoId = {
  uosmo: {
    id: "osmosis",
    coinDecimals: 6,
    coinDenom: "OSMO",
    icon: "/tokens/osmosis.svg",
  },
  [process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN]: {
    id: "gitopia",
    coinDecimals: 6,
    coinDenom: process.env.NEXT_PUBLIC_CURRENCY_TOKEN.toString(),
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
  osmosis: {
    gasPrice: "0.025uosmo",
  },
  cosmoshub: {
    gasPrice: "0.1uatom",
  },
  osmosistestnet: {
    gasPrice: "0.025uosmo",
  },
  cosmoshubtestnet: {
    gasPrice: "0.1uatom",
  },
};
