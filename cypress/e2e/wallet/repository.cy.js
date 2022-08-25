const path = require("path");
describe("Repository", () => {
  it("Is able to create repository", () => {
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();

    cy.visit("/login");
    cy.get('[data-test="recover-local-wallet"]').click();
    cy.get('[data-test="mnemonic"]').type(
      "mercy sound sustain lab indicate skin devote tenant crucial crime wrong educate mirror planet shallow logic one flee animal solve tide hospital seat into"
    );
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="wallet_name"]').type("Test123");
    cy.get('[data-test="wallet_password"]').type("Password");
    cy.get('[data-test="wallet_confirm_password"]').type("Password");
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="current_wallet_address"]').should(
      "has.text",
      "1dsu...w86c"
    );
    cy.get('[data-test="create-new-repo"]').click();
    cy.get('[data-test="repository_name"]').type(`repo${id}`);
    cy.get('[data-test="repository_description"]').type("Testing");
    cy.get('[data-test="create-repo-button"]').click();
    cy.wait(4000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type("Password");
        cy.get('[data-test="Unlock"]')
          .click()
          .then(() => {
            cy.url().should(
              "eq",
              `http://localhost:3000/gitopia1dsud9wjd6z90c6wclxyu0yam3805w3wxavw86c/repo${id}`
            );
          });
      } else {
        cy.url().should(
          "eq",
          `http://localhost:3000/gitopia1dsud9wjd6z90c6wclxyu0yam3805w3wxavw86c/repo${id}`
        );
      }
    });
  });

  it("Is able to create issue", () => {
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();
    cy.get('[data-test="issues"]').click();
    cy.get('[data-test="new-issue"]').click();
    cy.get('[data-test="issue_title"]').type(`issue${id}`);
    cy.get("textarea").type("Description");
    cy.get('[data-test="assignee"]').click();
    cy.get('[data-test="assignee_search"]').type(
      "gitopia1dsud9wjd6z90c6wclxyu0yam3805w3wxavw86c"
    );
    cy.get('[data-test="assignee_save"]').click();
    cy.get('[data-test="create_issue"]').click();
    cy.wait(4000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type("Password");
        cy.get('[data-test="Unlock"]')
          .click()
          .then(() => {
            cy.get('[data-test="issue-pull-title"]').should(
              "has.text",
              `issue${id}`
            );
          });
      } else {
        cy.get('[data-test="issue-pull-title"]').should(
          "has.text",
          `issue${id}`
        );
      }
    });
  });
});
