/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("Whois", (t) => {
      t.string("creator");
      t.integer("id").primary();
      t.string("name");
      t.string("address");
      // ownerType: OwnerType;
      t.string("ownerType");
    })
    .createTable("Users", (t) => {
      t.string("address").primary();
      t.json("data");
    })
    .createTable("Daos", (t) => {
      t.string("address").primary();
      t.json("data");
    })
    .createTable("Repositories", (t) => {
      t.integer("id").primary();
      t.string("name");
      t.string("ownerUsername");
      t.string("ownerAddress");
      t.string("ownerType");
      t.timestamp("updatedAt");
      t.json("data");
    })
    .createTable("Issues", (t) => {
      t.integer('id').primary();
      t.integer("iid");
      t.integer("repositoryId");
      t.json("data");
    })
    .createTable("PullRequests", (t) => {
      t.integer('id').primary();
      t.integer("iid");
      t.integer("baseRepositoryId");
      t.json("data");
    })
    .createTable("Comments", (t) => {
      t.integer("id").primary();
      t.integer("repositoryId");
      t.integer("parentIid");
      t.string("parent");
      t.json("data");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("Whois")
    .dropTableIfExists("Users")
    .dropTableIfExists("Daos")
    .dropTableIfExists("Repositories")
    .dropTableIfExists("Issues")
    .dropTableIfExists("PullRequests")
    .dropTableIfExists("Comments");
};
