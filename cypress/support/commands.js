// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import dayjs from "dayjs";

Cypress.Commands.add("dayjs", () => {
  return dayjs();
});

Cypress.Commands.add("login", (wallet, pass, mnemonic) => {
  cy.visit("/login");
  cy.url().should("include", "/login");
  cy.get('[data-test="recover-local-wallet"]').click();
  cy.get('[data-test="mnemonic"]')
    .type(mnemonic)
    .should("have.value", mnemonic);
  cy.get('[data-test="recover_wallet_button"]').click();
  cy.get('[name="wallet_password"]').type(pass).should("have.value", pass);
  cy.get('[name="wallet_confirm_password"]')
    .type(pass)
    .should("have.value", pass);
  // cy.get('[data-test="wallet_name"]').type(wallet).should("have.value",wallet);
  // cy.get('[data-test="wallet_password"]').type(pass).should("have.value",pass);
  // cy.get('[data-test="wallet_confirm_password"]').type(pass).should("have.value",pass);
  cy.get('[data-test="recover_wallet_button"]').click();
  cy.wait(500);
  // cy.get('[data-test="current_wallet_name"]').should("has.text", wallet);
});

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add("unlock", (pass) => {
  cy.wait(500);
  cy.get("body").then(($body) => {
    if ($body.find('[data-test="wallet_password"]').length > 0) {
      cy.get('[data-test="wallet_password"]').type(pass);
      cy.get('[data-test="Unlock"]').click();
    }
  });
});
