import { fs, pfs, mkdir } from "../virtualfs";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import _, { sortBy } from "lodash";

const fetchGitObject = async (repoId, objectSha) => {
  let obj = null;
  await fetch("http://localhost:3000/api/objects/" + repoId + "/" + objectSha, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  })
    .then((response) => {
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump() {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                controller.close();
                return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        },
      });
    })
    .then((stream) => new Response(stream))
    .then((response) => response.arrayBuffer())
    .then((buf) => {
      obj = buf;
    })
    .catch((err) => console.error(err));

  return obj;
};

const getLocalGitObjectPath = (projectRoot, oid) => {
  const dirpath = `${projectRoot}/.git/objects/${oid.slice(0, 2)}`;
  const filepath = `${dirpath}/${oid.slice(2)}`;

  return { dirpath, filepath };
};

const writeGitObject = async (projectRoot, oid, object) => {
  const { dirpath, filepath } = getLocalGitObjectPath(projectRoot, oid);
  try {
    // await mkdir("/test/depth/of/mk");
    await mkdir(dirpath);
    const buf = Buffer.from(object, "base64");
    await pfs.writeFile(filepath, buf);
  } catch (e) {
    console.error(e);
  }
};

const ensureGitObject = async (repoId, oid, projectRoot) => {
  const { filepath } = getLocalGitObjectPath(projectRoot, oid);
  let fileFound = null;
  try {
    fileFound = await pfs.stat(filepath);
    if (!fileFound.size) {
      fileFound = null;
    }
  } catch (e) {}
  if (fileFound) {
    return;
  }
  const object = await fetchGitObject(repoId, oid);
  await writeGitObject(projectRoot, oid, object);
};

export const getLocalProjectRoot = (repoName, userId) => {
  return "/" + userId.slice(7, 11) + "/" + repoName;
};

export const initRepository = async (
  repoId,
  repoHead,
  repoName,
  userId,
  path = []
) => {
  const projectRoot = getLocalProjectRoot(repoName, userId);
  await mkdir(projectRoot);
  await ensureGitObject(repoId, repoHead, projectRoot);
  const parsedCommitObject = await git.readCommit({
    fs,
    dir: projectRoot,
    oid: repoHead,
  });
  console.log("parsedCommitObject", parsedCommitObject);
  const foundEntity = await findEntity(
    repoId,
    parsedCommitObject.commit.tree,
    "tree",
    projectRoot,
    Array(...path)
  );
  console.log("Entity", foundEntity);
  return { commit: parsedCommitObject, entity: foundEntity };
};

const findEntity = async (repoId, oid, type, projectRoot, path) => {
  if (path && path.length) {
    if (type === "tree") {
      const treeObj = await loadDirectory(repoId, oid, projectRoot);
      if (treeObj && treeObj.tree) {
        let pathObj = null;
        treeObj.tree.every((ent) => {
          if (ent.path === path[0]) {
            pathObj = ent;
            return false;
          }
          return true;
        });
        if (pathObj) {
          if (path.length === 1) {
            if (pathObj.type === "blob") {
              return await loadFile(repoId, pathObj.oid, projectRoot);
            } else if (pathObj.type === "tree") {
              return await loadDirectory(
                repoId,
                pathObj.oid,
                projectRoot,
                true
              );
            }
          }
          return findEntity(
            repoId,
            pathObj.oid,
            pathObj.type,
            projectRoot,
            path.splice(1)
          );
        } else {
          console.log("path not found", path[0]);
          return null;
        }
      }
    } else if (type === "blob") {
      const fileObj = await loadFile(repoId, oid, projectRoot);
      return fileObj;
    }
  }
};

export const loadDirectory = async (
  repoId,
  oid,
  projectRoot,
  sorted = false
) => {
  await ensureGitObject(repoId, oid, projectRoot);
  let parsedTreeObject = null;
  try {
    parsedTreeObject = await git.readTree({
      fs,
      dir: projectRoot,
      oid,
    });
  } catch (e) {}
  parsedTreeObject.tree = _.sortBy(parsedTreeObject.tree, [
    (i) => (i.type === "tree" ? -1 : 1),
  ]);
  return parsedTreeObject;
};

export const loadFile = async (repoId, oid, projectRoot) => {
  await ensureGitObject(repoId, oid, projectRoot);
  let parsedBlobObject = null;
  try {
    parsedBlobObject = await git.readBlob({
      fs,
      dir: projectRoot,
      oid,
    });
  } catch (e) {}
  return parsedBlobObject;
};
