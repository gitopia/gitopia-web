const atob = (base64) => {
  return Buffer.from(base64, "base64").toString("utf-8");
};

export default atob;