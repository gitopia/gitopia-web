const path = require("path");
const username = (Math.random() + 1).toString(36).substring(7);
const password = "Password";
const avatar_image_url = 'https://gitopia.com/ejaaz.svg';

describe("Local wallet", () => {
  it("Is able to create local wallet", () => {
    cy.visit("/login");
    cy.get('[data-test="create-new-local-wallet"]').click();
    cy.get('[data-test="wallet_password"]').type(password);
    cy.get('[data-test="wallet_confirm_password"]').type(password);
    cy.get('[data-test="create_wallet"]').click();
  });

  it("Is able to fund local wallet", () => {
    cy.wait(3000);
    cy.get('[data-test="fund_wallet_next"]').click();
  });

  it("Is able to create profile", () => {
    cy.get('[data-test="username"]').type(username);
    cy.get('[data-test="fullname"]').type("Cypress Test User");
    cy.get('[data-test="bio"]').type("Cypress Test Bio");
    cy.get('[data-test="avatar_image_popup"]').click();
    cy.get('[data-test="avatar_image_url_tab"]').click();
    cy.get('[data-test="avatar_image_url"]').type(avatar_image_url);
    cy.wait(1000);
    cy.get('[data-test="avatar_popup_update"]').click();
    cy.get('[data-test="create_profile"]').click();
    cy.wait(500);
    cy.get('[data-test="current_wallet_name"]').should('have.text', username);
    cy.get('[data-test="current_wallet_avatar"]').should('have.prop', 'src', avatar_image_url);
  });

  it("Is able to download wallet", () => {
    cy.get('[data-test="current_wallet_name"]').click();
    cy.get('[data-test="download_wallet"]').click();
    cy.get('[data-test="wallet_password"]').type(password);
    cy.get('[data-test="Download"]').click();
    cy.readFile(path.join("cypress/downloads/" + username + ".json")).should("exist");
  });

  it("Is able to restore local wallet", () => {
    cy.visit("/login");
    cy.get('[data-test="recover-local-wallet"]').click();
    cy.get('[data-test="mnemonic"]').type(
      "mercy sound sustain lab indicate skin devote tenant crucial crime wrong educate mirror planet shallow logic one flee animal solve tide hospital seat into"
    );
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="wallet_password"]').type(password);
    cy.get('[data-test="wallet_confirm_password"]').type(password);
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="current_wallet_address"]').should(
      "has.text",
      "gitopia1dsu...w86c"
    );
  });

});
