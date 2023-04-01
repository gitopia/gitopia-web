import find from "lodash/find.js";
import fs from "fs";
import { Api } from "@gitopia/gitopia-js/dist/rest.js";
import * as env from "@next/env";
import globby from "globby";
import filter from "lodash/filter.js";
import knex from "knex";
import path from "path";

env.default.loadEnvConfig(process.cwd());

const dbPath = path.join(process.cwd(), "seo/db.sqlite3");

const db = knex({
  client: "better-sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  migrations: {
    tableName: "knex_migrations",
  },
});

const paginationLimit = 200,
  workingDir = "./seo";

let owners = [],
  users = [],
  daos = [],
  repositories = [],
  issues = [],
  pulls = [],
  branches = [],
  tags = [],
  comments = [],
  releases = [],
  whois = [],
  dynamicPaths = [],
  dynamicPathParams = [],
  blacklist = {};

async function populate(
  queryFunc,
  dataField,
  populateObject,
  transformData = (d) => d
) {
  const api = new Api({ baseURL: process.env.NEXT_PUBLIC_API_URL });
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
    if (res.status === 200) {
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

function addPath(params, urlParts, data) {
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

async function updateBlacklist() {
  // Remove case insensetive duplicate names from repositories by same owner
  const duplicateRepos = await db.raw(`
    select id from Repositories where UPPER(name) in
    (select UPPER(name) from Repositories group by UPPER(name), ownerAddress having count(*)>1)
    and ownerAddress in
    (select ownerAddress from Repositories group by UPPER(name), ownerAddress having count(*)>1)
  `);
  blacklist["Repository"] = duplicateRepos.map((r) => Number(r.id));
  console.log(
    "Blacklisted duplicate repository names",
    blacklist["Repository"].length
  );
}

async function dumpData() {
  for (let i = 0; i < whois.length; i++) {
    let o = whois[i];
    await db("Whois").insert(o).onConflict("id").merge();
  }
  for (let i = 0; i < users.length; i++) {
    let o = users[i];
    await db("Users")
      .insert({
        address: o.creator,
        data: JSON.stringify(o),
      })
      .onConflict("address")
      .merge();
  }
  for (let i = 0; i < daos.length; i++) {
    let o = daos[i];
    await db("Daos")
      .insert({
        address: o.address,
        data: JSON.stringify(o),
      })
      .onConflict("address")
      .merge();
  }
  for (let i = 0; i < repositories.length; i++) {
    let o = repositories[i];
    await db("Repositories")
      .insert({
        id: o.id,
        name: o.name,
        ownerUsername: o.owner.username,
        ownerAddress: o.owner.address,
        ownerType: o.owner.type,
        updatedAt: o.updatedAt,
        data: JSON.stringify(o),
      })
      .onConflict("id")
      .merge();
  }
  for (let i = 0; i < issues.length; i++) {
    let o = issues[i];
    await db("Issues")
      .insert({
        id: o.id,
        iid: o.iid,
        repositoryId: o.repositoryId,
        data: JSON.stringify(o),
      })
      .onConflict("id")
      .merge();
  }
  for (let i = 0; i < pulls.length; i++) {
    let o = pulls[i];
    await db("PullRequests")
      .insert({
        id: o.id,
        iid: o.iid,
        baseRepositoryId: o.base.repositoryId,
        data: JSON.stringify(o),
      })
      .onConflict("id")
      .merge();
  }
  for (let i = 0; i < comments.length; i++) {
    let o = comments[i];
    await db("Comments")
      .insert({
        id: o.id,
        repositoryId: o.repositoryId,
        parentIid: o.parentIid,
        parent: o.parent,
        data: JSON.stringify(o),
      })
      .onConflict("id")
      .merge();
  }
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
    users.push(u);
    return {
      address: u.creator,
      ...u,
    };
  }),
  populate("queryDaoAll", "dao", owners, (d) => {
    daos.push(d);
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
  .then(async () => {
    await updateBlacklist();
    for (let i = 0; i < owners.length; i++) {
      let u = owners[i];
      if (!/^temp-/.test(u.username) && u.address)
        addPath({ userId: u.username ? u.username : u.address }, [
          u.username ? u.username : u.address,
        ]);
    }
    console.log("Saving Owners", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-owners.json");
    for (let i = 0; i < repositories.length; i++) {
      let r = repositories[i];
      let owner = find(owners, { address: r.owner.id });
      let b = filter(branches, { repositoryId: r.id }),
        t = filter(tags, { repositoryId: r.id });
      r.owner.username = owner?.username ? owner.username : r.owner.id;
      r.owner.address = r.owner.id;
      if (owner?.username) r.owner.id = r.owner.username;
      r.branches = b;
      r.tags = t;
      if (
        !/^temp-/.test(owner.username) &&
        owner.address &&
        !blacklist.Repository?.includes(Number(r.id))
      ) {
        addPath(
          {
            userId: r.owner.username,
            repositoryId: r.name,
          },
          [owner?.username, r.name]
        );
      }
    }
    console.log("Saving Repositories", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-repositories.json");
    for (let j = 0; j < issues.length; j++) {
      let i = issues[j];
      let repo = find(repositories, { id: i.repositoryId });
      if (
        !/^temp-/.test(repo?.owner?.username) &&
        repo?.owner?.username &&
        repo?.name &&
        i.iid &&
        !blacklist.Repository?.includes(Number(repo.id))
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
    }
    console.log("Saving Issues", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-issues.json");
    for (let i = 0; i < pulls.length; i++) {
      let p = pulls[i];
      let repo = find(repositories, { id: p.base.repositoryId });
      if (
        !/^temp-/.test(repo?.owner?.username) &&
        repo?.owner?.username &&
        repo?.name &&
        p.iid &&
        !blacklist.Repository?.includes(Number(repo.id))
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
    }
    console.log("Saving Pull Requests", dynamicPathParams.length);
    saveParamsForPaths(workingDir + "/paths-pulls.json");
    await dumpData();
    console.log("Data dumped to", dbPath);
    db.destroy();
  })
  .then(saveSitemap);
