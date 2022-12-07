import find from "lodash/find.js";
import fs from "fs";
import { Api } from "@gitopia/gitopia-js/rest.js";
import * as env from "@next/env";
import globby from "globby";

env.default.loadEnvConfig(process.cwd());
console.log("API_URL", process.env.NEXT_PUBLIC_API_URL);
console.log("SERVER_URL", process.env.NEXT_PUBLIC_SERVER_URL);

const paginationLimit = 10,
  workingDir = "./seo";

let owners = [],
  repositories = [],
  issues = [],
  pulls = [],
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

function createDir() {
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
  getStaticPaths(),
])
  .then(() => {
    createDir();
    owners.forEach((u) => {
      addPath({ userId: u.username ? u.username : u.address }, [
        u.username ? u.username : u.address,
      ]);
    });
    saveParamsForPaths(workingDir + "/paths-owners.json");
    repositories.forEach((r) => {
      let owner = find(owners, { address: r.owner.id });
      r.owner.username = owner?.username ? owner.username : r.owner.id;
      addPath(
        {
          userId: r.owner.username,
          repositoryId: r.name,
        },
        [owner?.username, r.name]
      );
    });
    saveParamsForPaths(workingDir + "/paths-repositories.json");
    issues.forEach((i) => {
      let repo = find(repositories, { id: i.repositoryId });
      addPath(
        {
          userId: repo?.owner.username,
          repositoryId: repo?.name,
          issueIid: i.iid,
        },
        [repo?.owner.username, repo?.name, "issues", i.iid]
      );
    });
    saveParamsForPaths(workingDir + "/paths-issues.json");
    pulls.forEach((p) => {
      let repo = find(repositories, { id: p.base.repositoryId });
      addPath(
        {
          userId: repo?.owner.username,
          repositoryId: repo?.name,
          pullRequestIid: p.iid,
        },
        [repo?.owner.username, repo?.name, "pulls", p.iid]
      );
    });
    saveParamsForPaths(workingDir + "/paths-pulls.json");
  })
  .then(saveSitemap);
