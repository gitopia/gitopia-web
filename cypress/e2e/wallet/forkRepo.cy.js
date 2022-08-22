const path = require("path");
describe("Fork Repo", () => {
  it("Is able to fork a repo", () => {
    cy.visit("/login");
//    cy.get('[data-test="recover-local-wallet"]').click();
//    cy.get('[data-test="mnemonic"]').type(
//      "absurd board stem cause inmate orange tower tonight code remember dirt voyage usage idle inner eagle liberty salt acid song letter cup ocean great"
//    );
//    cy.get('[data-test="recover_wallet_button"]').click();
//    cy.get('[data-test="wallet_name"]').type("Test1234");
//    cy.get('[data-test="wallet_password"]').type("Password");
//    cy.get('[data-test="wallet_confirm_password"]').type("Password");
//    cy.get('[data-test="recover_wallet_button"]').click();
//    cy.get("body").then(($body) => {
//      if ($body.find('[data-test="get-token"]').length > 0) {
//        cy.get('[data-test="get-token"]').click();
//      }
//    });
//    cy.wait(5000);
//    cy.get("body").then(($body) => {
//      if ($body.find('[data-test="create_profile"]').length > 0) {
//        cy.get('[data-test="create_profile"]').click();
//      }
//    });
//    cy.wait(5000);
    cy.get('[data-test="create-new-local-wallet"]').click();
    cy.get('[data-test="wallet_name"]').type("Test123");
    cy.get('[data-test="wallet_password"]').type("Password");
    cy.get('[data-test="wallet_confirm_password"]').type("Password");
    cy.get('[data-test="create_wallet"]').click();
    cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
    cy.contains('Done').click();
    cy.contains('Get TLORE').click();
    cy.wait(6000);
    cy.contains('Create Profile').click();
    cy.wait(6000);
    cy.visit("/gitopia17w3ytcpfhsenkwn4h3jxa9q8wg4w77rjwwcl36/test-repo");
    cy.get('[data-test="fork-repo"]').click();
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="grant-access"]').length > 0)
      {
        cy.get('[data-test="grant-access"]').click();
        cy.get("body").then(($body) => {
          if ($body.find('[data-test="wallet_password"]').length > 0) {
            cy.get('[data-test="wallet_password"]').type("Password");
            cy.get('[data-test="Unlock"]').click();
          }
        });
        cy.wait(6000);
      }
    });
    cy.get('[data-test="fork-owner"]').click();
    cy.wait(5000);
    cy.get('[data-test="go-to-repo"]').click();
    cy.wait(2000);
    cy.url().should("include","/test-repo");
  });
});
