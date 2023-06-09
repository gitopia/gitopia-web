export default async function handler(req, res) {
  let url =
    process.env.NEXT_PUBLIC_IBC_ASSETS_REPO +
    `/chain-registry/_IBC/${req.query.chain}-${req.query.otherChain}.json`;
  let repoRes = await fetch(url);
  let data = await repoRes.text();
  res.setHeader(
    "cache-control",
    "public, s-maxage=3600, stale-while-revalidate=600"
  );

  return res.status(repoRes.status).send(data);
}
