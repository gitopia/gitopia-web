import find from "lodash/find.js";
import fs from "fs";
import { Api } from "@gitopia/gitopia-js/dist/rest.js";
import * as env from "@next/env";
import globby from "globby";
import filter from "lodash/filter.js";

env.default.loadEnvConfig(process.cwd());

const paginationLimit = 200,
  workingDir = "./seo";

let owners = [],
  repositories = [],
  issues = [],
  pulls = [],
  branches = [],
  tags = [],
  comments = [],
  releases = [],
  whois = [],
  dynamicPaths = [],
  dynamicPathParams = [];

async function populate(
  queryFunc,
  dataField,
  populateObject,
  transformData = (d) => d
) {
  const api = new Api({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
  let nextKey = null,
    res;

  if (!api[queryFunc]) {
    console.log("Not found", queryFunc);
    return;
  }
  if (!populateObject) {
    console.log("Not found", populateObject);
    return;
  }
  do {
    res = await api[queryFunc]({
      "pagination.key": nextKey,
      "pagination.limit": paginationLimit,
    });
    if (res.ok) {
      if (!res.data[dataField]) {
        console.log("Not found", dataField, res.data);
        return;
      }
      for (let i = 0; i < res.data[dataField].length; i++) {
        populateObject.push(transformData(res.data[dataField][i]));
      }
      nextKey = res.data.pagination.next_key;
    } else {
      nextKey = null;
    }
  } while (nextKey);
  console.log("Found", dataField, populateObject.length);
}

function addPath(params, urlParts) {
  dynamicPaths.push("/" + urlParts.join("/"));
  dynamicPathParams.push({ params });
}

function ensureWorkingDir() {
  if (!fs.existsSync(workingDir)) fs.mkdirSync(workingDir);
}

async function getStaticPaths() {
  const pages = await globby([
    "pages/**/*.js",
    "!pages/_*.js",
    "!pages/[userId]/",
    "!pages/**/[**/*.js",
    "!pages/api",
    "!pages/404.js",
  ]);
  return pages;
}

function addStaticPage(page) {
  const path = page.replace("pages", "").replace(".js", "").replace(".mdx", "");
  const route = path === "/index" ? "" : path;
  return `  <url>
    <loc>${`${process.env.NEXT_PUBLIC_SERVER_URL}${route}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`;
}

function addDynamicPage(page) {
  return `  <url>
    <loc>${`${process.env.NEXT_PUBLIC_SERVER_URL}${page}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
}

function saveParamsForPaths(filename) {
  fs.writeFileSync(filename, JSON.stringify(dynamicPathParams), "utf8");
  dynamicPathParams = [];
}

function dumpData() {
  fs.writeFileSync(workingDir + "/dump-owners.json", JSON.stringify(owners));
  fs.writeFileSync(
    workingDir + "/dump-repositories.json",
    JSON.stringify(repositories)
  );
  fs.writeFileSync(workingDir + "/dump-issues.json", JSON.stringify(issues));
  fs.writeFileSync(workingDir + "/dump-pulls.json", JSON.stringify(pulls));
  fs.writeFileSync(
    workingDir + "/dump-comments.json",
    JSON.stringify(comments)
  );
  fs.writeFileSync(workingDir + "/dump-whois.json", JSON.stringify(whois));
  fs.writeFileSync(
    workingDir + "/dump-releases.json",
    JSON.stringify(releases)
  );
}

async function saveSitemap() {
  const staticPaths = await getStaticPaths();
  const sitemapString = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   ${staticPaths.map(addStaticPage).join("\n")}
   ${dynamicPaths.map(addDynamicPage).join("\n")}
   </urlset>`;
  fs.writeFileSync(workingDir + "/sitemap.xml", sitemapString, "utf8");
  console.log(
    "Sitemap created with",
    staticPaths.length + dynamicPaths.length,
    "links"
  );
}

ensureWorkingDir();
if (!process.env.GENERATE_SEO_PAGES) {
  console.warn(
    "Page generation flag is off, run `GENERATE_SEO_PAGES=1 yarn build` to generate pages"
  );
  process.exit(0);
}
console.log("API_URL", process.env.NEXT_PUBLIC_API_URL);
console.log("SERVER_URL", process.env.NEXT_PUBLIC_SERVER_URL);

Promise.all([
  populate("queryUserAll", "User", owners, (u) => {
    return {
      address: u.creator,
      ...u,
    };
  }),
  populate("queryDaoAll", "dao", owners, (d) => {
    return {
      username: d.name.toLowerCase(),
      ...d,
    };
  }),
  populate("queryRepositoryAll", "Repository", repositories),
  populate("queryIssueAll", "Issue", issues),
  populate("queryPullRequestAll", "PullRequest", pulls),
  populate("queryBranchAll", "Branch", branches),
  populate("queryTagAll", "Tag", tags),
  populate("queryCommentAll", "Comment", comments),
  populate("queryReleaseAll", "Release", releases),
  populate("queryWhoisAll", "Whois", whois),
  getStaticPaths(),
])
  .then(() => {
    owners.forEach((u) => {
      if (!/^temp-/.test(u.username) && u.address)
        addPath({ userId: u.username ? u.username : u.address }, [
          u.username ? u.username : u.address,
        ]);
    });
    console.log("Saving Owners", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-owners.json");
    repositories.forEach((r) => {
      let owner = find(owners, { address: r.owner.id });
      let b = filter(branches, { repositoryId: r.id }),
        t = filter(tags, { repositoryId: r.id });
      r.owner.username = owner?.username ? owner.username : r.owner.id;
      r.owner.address = r.owner.id;
      if (owner?.username) r.owner.id = r.owner.username;
      r.branches = b;
      r.tags = t;
      if (!/^temp-/.test(owner.username) && owner.address) {
        addPath(
          {
            userId: r.owner.username,
            repositoryId: r.name,
          },
          [owner?.username, r.name]
        );
      }
    });
    console.log("Saving Repositories", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-repositories.json");
    issues.forEach((i) => {
      let repo = find(repositories, { id: i.repositoryId });
      if (
        !/^temp-/.test(repo?.owner?.username) &&
        repo?.owner?.username &&
        repo?.name &&
        i.iid
      ) {
        addPath(
          {
            userId: repo?.owner.username,
            repositoryId: repo?.name,
            issueIid: i.iid,
          },
          [repo?.owner.username, repo?.name, "issues", i.iid]
        );
      }
    });
    console.log("Saving Issues", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-issues.json");
    pulls.forEach((p) => {
      let repo = find(repositories, { id: p.base.repositoryId });
      if (
        !/^temp-/.test(repo?.owner?.username) &&
        repo?.owner?.username &&
        repo?.name &&
        p.iid
      ) {
        addPath(
          {
            userId: repo?.owner.username,
            repositoryId: repo?.name,
            pullRequestIid: p.iid,
          },
          [repo?.owner.username, repo?.name, "pulls", p.iid]
        );
      }
    });
    console.log("Saving Pull Requests", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-pulls.json");
    dumpData();
  })
  .then(saveSitemap);
