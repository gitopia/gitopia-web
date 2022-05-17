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
});
