import getContent from "../../../../../helpers/getContent";
import getAnyRepository from "../../../../../helpers/getAnyRepository";
import getAllRepositoryBranch from "../../../../../helpers/getAllRepositoryBranch";
import getAllRepositoryTag from "../../../../../helpers/getAllRepositoryTag";
import { Api } from "@gitopia/gitopia-js/dist/rest";

export default async function handler(req, res) {
  if (!req.query?.path) {
    console.error("Path not available");
    res.status(404).send("Not Found");
    return null;
  }

  const apiClient = new Api({ baseURL: process.env.NEXT_PUBLIC_API_URL });

  const repository = await getAnyRepository(
    apiClient,
    req.query.userId,
    req.query.repositoryId
  );

  const branches = await getAllRepositoryBranch(
    apiClient,
    req.query.userId,
    req.query.repositoryId
  );
  const joinedPath = req.query.path.join("/");
  let found = false,
    repoPath,
    branchSha;
  if (branches) {
    branches.every((b) => {
      let branch = b.name;
      let branchTest = new RegExp("^" + branch);
      if (branchTest.test(joinedPath)) {
        let path = joinedPath.replace(branch, "").split("/");
        path = path.filter((p) => p !== "");
        branchSha = b.sha;
        repoPath = path;
        found = true;
      }
      return true;
    });
  }
  if (!found) {
    const tags = await getAllRepositoryTag(
      apiClient,
      req.query.userId,
      req.query.repositoryId
    );
    if (tags) {
      tags.every((b) => {
        let branch = b.name;
        let branchTest = new RegExp("^" + branch);
        if (branchTest.test(joinedPath)) {
          let path = joinedPath.replace(branch, "").split("/");
          path = path.filter((p) => p !== "");
          branchSha = b.sha;
          repoPath = path;
          found = true;
          return false;
        }
        return true;
      });
    }
  }
  if (!found) {
    console.error("Branch not found", joinedPath);
    res.status(404).send("Not Found");
    return null;
  }

  const file = await getContent(
    repository.id,
    branchSha,
    repoPath.join("/"),
    null
  );
  if (file?.content) {
    if (file.content[0].type === "BLOB" && file.content[0].content) {
      try {
        let filename = repoPath[repoPath.length - 1] || "";
        let extension = filename.split(".").pop() || "";

        if (
          ["jpg", "jpeg", "png", "gif", "svg"].includes(extension.toLowerCase())
        ) {
          res.setHeader("Content-Type", "image/" + extension);
          res.status(200).send(new Buffer(file.content[0].content, "base64"));
          return {};
        } else {
          console.error("File not an image", filename);
          res.status(404).send("Not Found");
          return null;
        }
      } catch (e) {
        console.error(e);
        res.status(404).send("Not Found");
        return null;
      }
    } else {
      console.error("Unable to fetch file", file);
      res.status(404).send("Not Found");
      return null;
    }
  }
  console.error("File contents not loaded", file);
  res.status(404).send("Not Found");
  return null;
}
