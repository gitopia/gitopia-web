import getNodeInfo from "./getNodeInfo";

async function checkLeapSnap() {
  try {
    const result = await window.ethereum.request({
      method: "wallet_requestSnaps",
      params: {
        "npm:@leapwallet/metamask-cosmos-snap": {},
      },
    });
    console.log(result);
    if (
      result &&
      result["npm:@leapwallet/metamask-cosmos-snap"] &&
      result["npm:@leapwallet/metamask-cosmos-snap"].enabled
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function isLeapSnapEnabled() {
  if (typeof window === "undefined") return null;
  if (document.readyState === "complete") {
    return await checkLeapSnap();
  }
  return new Promise((resolve) => {
    const documentStateChange = async (event) => {
      if (event.target?.readyState === "complete") {
        let res = await checkLeapSnap();
        resolve(res);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
}

export default async function initMetamask() {
  const leapSnapEnabled = await isLeapSnapEnabled();
  if (leapSnapEnabled) {
    const supportedChains =
      (await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: "npm:@leapwallet/metamask-cosmos-snap",
          request: {
            method: "getSupportedChains",
          },
        },
      })) || {};
    const info = await getNodeInfo();

    if (supportedChains[info.default_node_info.network]) {
      return info;
    } else {
      try {
        const suggestChain = await window.ethereum.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: "npm:@leapwallet/metamask-cosmos-snap",
            request: {
              method: "suggestChain",
              params: {
                chainInfo: {
                  chainId: info.default_node_info.network,
                  chainName: info.application_version.name,
                  rpc: process.env.NEXT_PUBLIC_RPC_URL,
                  rest: process.env.NEXT_PUBLIC_API_URL,
                  stakeCurrency: {
                    coinDenom: process.env.NEXT_PUBLIC_CURRENCY_TOKEN,
                    coinMinimalDenom:
                      process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
                    coinDecimals: 6,
                    coinGeckoId: "gitopia",
                  },
                  bech32Config: {
                    bech32PrefixAccAddr: "gitopia",
                    bech32PrefixAccPub: "gitopia",
                    bech32PrefixValAddr: "gitopia",
                    bech32PrefixValPub: "gitopia",
                    bech32PrefixConsAddr: "gitopia",
                    bech32PrefixConsPub: "gitopia",
                  },
                  bip44: {
                    coinType: 118,
                  },
                  currencies: [
                    {
                      coinDenom: process.env.NEXT_PUBLIC_CURRENCY_TOKEN,
                      coinMinimalDenom:
                        process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
                      coinDecimals: 6,
                      coinGeckoId: "gitopia",
                    },
                  ],
                  feeCurrencies: [
                    {
                      coinDenom: process.env.NEXT_PUBLIC_CURRENCY_TOKEN,
                      coinMinimalDenom:
                        process.env.NEXT_PUBLIC_ADVANCE_CURRENCY_TOKEN,
                      coinDecimals: 6,
                      coinGeckoId: "gitopia",
                    },
                  ],
                },
                gasPriceStep: {
                  low: 0.0012,
                  average: 0.0016,
                  high: 0.0024,
                },
              },
            },
          },
        });
        console.log(suggestChain);
      } catch {
        alert("Failed to suggest the chain");
      }
    }
    // await leap.enable(info.default_node_info.network);
    return info;
  }
  return null;
}
