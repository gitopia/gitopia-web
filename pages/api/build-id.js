import fs from "fs";

export default (req, res) => {
  try {
    const buffer = fs.readFileSync(".next/BUILD_ID");
    return res.status(200).json({ buildId: buffer.toString() });
  } catch (e) {}
  return res.status(404).send("Not Found");
};
