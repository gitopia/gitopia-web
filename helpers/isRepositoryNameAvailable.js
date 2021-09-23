import getOrganizationRepositoryAll from "./getOrganizationRepositoryAll";
import getUserRepositoryAll from "./getUserRepositoryAll";
const sanitizedNameTest = new RegExp(/[^\w.-]/g);

const isRepositoryNameAvailable = async (name, ownerId, accountsList) => {
  let alreadyAvailable = false,
    sanitizedName = name.replace(sanitizedNameTest, "-");
  let acc = _.find(accountsList, (a) => a.id === ownerId);
  if (acc && acc.type === "User") {
    const repos = await getUserRepositoryAll(ownerId);
    console.log(repos);
    repos.every((r) => {
      if (r.name === sanitizedName) {
        alreadyAvailable = true;
        return false;
      }
      return true;
    });
  } else if (acc && acc.type === "Organization") {
    const repos = await getOrganizationRepositoryAll(ownerId);
    console.log(repos);
    if (repos) {
      repos.every((r) => {
        if (r.name === sanitizedName) {
          alreadyAvailable = true;
          return false;
        }
        return true;
      });
    }
  }
  console.log(alreadyAvailable);
  return alreadyAvailable;
};

export default isRepositoryNameAvailable;
