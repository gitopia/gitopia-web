import { assets } from "../ibc-assets-config";
export default async function getChainInfo(chainName) {
  let info = assets.filter((asset) => {
    return asset.chain_name === chainName;
  });
  return info[0];
}
