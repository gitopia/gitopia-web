const path = require("path");

describe("Local wallet", () => {
  it("Is able to create local wallet", () => {
    cy.visit("/login");
    cy.get('[data-test="create-new-local-wallet"]').click();
    cy.get('[data-test="wallet_name"]').type("Test123");
    cy.get('[data-test="wallet_password"]').type("Password");
    cy.get('[data-test="wallet_confirm_password"]').type("Password");
    cy.get('[data-test="create_wallet"]').click();
    cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
  });

  it("Is able to generate 24 word recovery phase", () => {
    cy.get('[data-test="mnemonic"]').should("have.length", 24);
  });

  it("Is able to download wallet", () => {
    cy.get('[data-test="current_wallet_name"]').click();
    cy.get('[data-test="download_wallet"]').click();
    cy.get('[data-test="wallet_password"]').type("Password");
    cy.get('[data-test="Download"]').click();
    cy.readFile(path.join("cypress/downloads/Test123.json")).should("exist");
  });

  it("Is able to restore local wallet", () => {
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
  });
});
