import fs from "fs";
import path from "path";
import { execFile } from "child_process";

function lastCommitId(dir) {
  return new Promise((resolve, reject) => {
    const gitArgs = [
      `--git-dir=${path.join(dir, ".git")}`,
      `--work-tree=${dir}`,
      "rev-parse",
      "HEAD",
    ];

    execFile("git", gitArgs, (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(String(stderr).trim());
      if (stdout) return resolve(String(stdout).trim());

      return reject(
        new Error(`No output from command: git ${gitArgs.join(" ")}`)
      );
    });
  });
}

function gitDescribe(dir) {
  return new Promise((resolve, reject) => {
    const gitArgs = [
      `--git-dir=${path.join(dir, ".git")}`,
      `--work-tree=${dir}`,
      "describe",
      "--tags",
      "--abbrev=1"
    ];

    execFile("git", gitArgs, (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(String(stderr).trim());
      if (stdout) return resolve(String(stdout).trim());

      return reject(
        new Error(`No output from command: git ${gitArgs.join(" ")}`)
      );
    });
  });
}

function findDotGit(inputDir, maxAttempts = 999) {
  // inputDir may not be the project root so look for .git dir in parent dirs too
  let dir = inputDir;

  const { root } = path.parse(dir);
  let attempts = 0; // protect against infinite tight loop if libs misbehave
  while (dir !== root && attempts < maxAttempts) {
    attempts += 1;
    try {
      fs.accessSync(path.join(dir, ".git"), (fs.constants || fs).R_OK);
      break;
    } catch (_) {
      dir = path.dirname(dir);
    }
  }
  if (dir === root || attempts >= maxAttempts) {
    dir = inputDir;
  }

  return dir;
}

async function determineBuildId({ dir } = { dir: "." }) {
  let topDir = findDotGit(dir);
  let version = gitDescribe(topDir);
  return version;
}

export { determineBuildId, findDotGit, lastCommitId, gitDescribe };
