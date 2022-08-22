const path = require("path");

describe("Create Pull Request", () => {

  it("Is able to push changes", () => {
    cy.visit('https://github.com/login');
    cy.get('[id="login_field"]').type("zajedm");
    cy.get('[id="password"]').type("KZQ@rqp9cqm8dwm7tqe")
    cy.get('[name="commit"]').click();
    cy.visit('https://github.com/zajedm/hello-world/tree/dev');
    cy.get('[aria-label="Edit this file"]').click();
    cy.get('[id="code-editor"]').type("{enter}## Test");
    cy.get('[id="submit-file"]').click();
    cy.get('[id="actions-tab"]').click();
  });
  
  it("Is able to create a PR", () => {
    const uuid = () => Cypress._.random(0, 1e6);
    const id = uuid();

    cy.visit("/login");
    cy.get('[data-test="recover-local-wallet"]').click();
    cy.get('[data-test="mnemonic"]').type(
      "scorpion nurse foot toward glide village crash asset elite rough display garage chest crash process reject best cargo able always child advance veteran column"
    );
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="wallet_name"]').type("zajedm");
    cy.get('[data-test="wallet_password"]').type("aaaaaaaa");
    cy.get('[data-test="wallet_confirm_password"]').type("aaaaaaaa");
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="current_wallet_name"]').should("has.text", "zajedm");

    cy.contains('hello-world').click();
      
    cy.wait(15000);
    cy.reload();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="new-pull-request"]').click();
    cy.wait(1000);
    cy.get('[data-test="select-branch"]').first().click();
    cy.contains('dev').click({force: true});
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="create-pr"]').click();
    cy.get('[data-test="pr-title"]').type(`Test PR${id}`);
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type("aaaaaaaa");
        cy.get('[data-test="Unlock"]').click();
      }
    });
    cy.wait(1000);
  });

  it("Is able to merge a PR", () => {

    cy.get('[data-test="code"]').click();
    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="merge-pr"]').click();
    cy.wait(1000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type("aaaaaaaa");
        cy.get('[data-test="Unlock"]').click();
      }
    });
    cy.wait(3000);
    cy.get('[data-test="code"]').click();
    cy.get('[id="readme"]').scrollIntoView();
  });

});
