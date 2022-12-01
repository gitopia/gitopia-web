const sanitizedNameTest = new RegExp(/[^\w.-]/g);
import getAnyRepository from "./getAnyRepository";

const isRepositoryNameTaken = async (name, ownerId) => {
  let sanitizedName = name.replace(sanitizedNameTest, "-");

  const repo = await getAnyRepository(ownerId, sanitizedName);
  if (repo) {
    return true;
  } else {
    return false;
  }
};

export default isRepositoryNameTaken;
