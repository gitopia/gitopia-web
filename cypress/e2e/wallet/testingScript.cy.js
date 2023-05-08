const path = require("path");
const randomString = () => {
  const random = Math.random().toString(36).slice(2);
  return "my-repo-" + random;
};
const repoName = randomString();
describe("Push code to gitopia", () => {
  let testData;
  beforeEach(() => {
    cy.fixture("userData").then((data) => {
      testData = data;
    });
  });

  it("should push code to Gitopia", () => {
    cy.viewport(1280, 720);
    cy.restoreLocalStorage();
    cy.visit("/home");
    cy.wait(500);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="current_wallet_name"]').length == 0) {
        cy.login(testData.walletname, testData.walletpass, testData.mnemonic);
      }
    });
    cy.wait(1000);
    cy.get('[data-test="current_wallet_name"]').click();
    cy.get('[data-test="download_wallet"]').click();
    cy.get('[data-test="wallet_password"]').type(testData.walletpass);
    cy.get('[data-test="Download"]').click();

    cy.get('[data-test="create-new-repo"]').click();
    cy.get('[data-test="repository_name"]').type(repoName);
    cy.get('[data-test="repository_description"]').type("Testing");
    cy.get('[data-test="create-repo-button"]').click();
    cy.wait(4000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type("Password");
        cy.get('[data-test="Unlock"]')
          .click()
          .then(() => {
            cy.url().should("include", repoName);
          });
      } else {
        cy.url().should("include", repoName);
      }
    });

    cy.readFile(
      path.join("cypress/downloads/" + testData.walletname + ".json")
    ).should("exist");
    cy.exec("sh cypress/scripts/push_code.sh", {
      env: {
        repoName: repoName,
        walletName: testData.walletname,
      },
    }).then((result) => {
      cy.visit("/" + testData.walletname + "/" + repoName);
      cy.wait(500);
      cy.get('[data-test="branch_name"]').should("has.text", `test-branch-1`);
    });
  });

  it("should be able to create pr for pushed code", () => {
    cy.viewport(1280, 720);
    cy.restoreLocalStorage();
    cy.visit("/home");
    cy.wait(500);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="current_wallet_name"]').length == 0) {
        cy.login(testData.walletname, testData.walletpass, testData.mnemonic);
      }
    });
    cy.wait(1000);
    const branchSelector = `:contains("test-branch-2")`;
    cy.visit("/" + testData.walletname + "/" + repoName);

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="new-pull-request"]').click();
    cy.wait(1000);
    cy.get('[data-test="source_branch"]').within(() => {
      cy.get('[data-test="select-branch"]').click();
      cy.wait(500);
      cy.get('[data-test="branch_selector"]')
        .find("li")
        .filter(branchSelector)
        .should("contain", `test-branch-2`)
        .click();
      cy.wait(500);
    });
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="pr-title"]')
      .click()
      .type(`Test PR`)
      .should("have.value", `Test PR`);
    cy.get('[data-test="create-pr"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(7000);
    cy.get('[data-test="pr_state"]').should(
      "has.text",
      "This branch has no conflicts with base branch"
    );
    cy.get('[data-test="merge-pr"]').should("be.visible");
  });
});
