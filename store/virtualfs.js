import LightningFS from "@isomorphic-git/lightning-fs";

const isServer = typeof window === "undefined";

export let fs = {};
export let pfs = {};

if (!isServer) {
  fs = new LightningFS("fs");
  pfs = fs.promises;
  window.fs = fs;
  window.pfs = pfs;
}

export const existsPath = async (path) => {
  try {
    const a = await pfs.stat(path);
    return true;
  } catch (e) {
    return false;
  }
};

export const mkdir = async (dirpath) => {
  if (await existsPath(dirpath)) {
    // Do nothing
    // console.info("mkdir: exists", dirpath);
  } else {
    const dirs = dirpath.split("/");
    let cPath = "";
    for (let i = 1; i < dirs.length; i++) {
      try {
        cPath += "/" + dirs[i];
        await pfs.mkdir(cPath);
      } catch (e) {}
    }
  }
};
