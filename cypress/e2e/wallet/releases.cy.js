const path = require("path");

describe("Create Releases", () => {

    it("Is able to create a Release", () => {
        const uuid = () => Cypress._.random(0, 10);
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
        cy.get('[data-test="releases"]').click();
        cy.get('[data-test="new-release"]').click();
        cy.get('[data-test="select-branch"]').click();
        cy.get('[data-test="create-tag"]').click();
        cy.get('[data-test="tag-name"]').type(`v0.${id}`);
        cy.get('[data-test="create-tag"]').click();
        cy.get("body").then(($body) => {
            if ($body.find('[data-test="wallet_password"]').length > 0) {
              cy.get('[data-test="wallet_password"]').type("aaaaaaaa");
              cy.get('[data-test="Unlock"]').click();
            }
        });
        cy.wait(4000);
        cy.get('[data-test="release-title"]').type(`Release v0.${id}`);
        cy.get('[data-test="create-release"]').click();
        cy.wait(1000);
        
    });

    it("Is able to edit a Release", () => {
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
        cy.get('[data-test="releases"]').click();
        cy.get('[data-test="release-edits"]').click();
        cy.get('[data-test="release-edit"]').click();
        cy.get('[data-testid="text-area"]').type("Test Release");
        cy.get('[data-test="update-release"]').click();
        cy.get("body").then(($body) => {
            if ($body.find('[data-test="wallet_password"]').length > 0) {
              cy.get('[data-test="wallet_password"]').type("aaaaaaaa");
              cy.get('[data-test="Unlock"]').click();
            }
        });
        cy.wait(2000);
    });

    it("Is able to delete a Release", () => {
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
        cy.get('[data-test="releases"]').click();
        cy.get('[data-test="release-edits"]').click();
        cy.get('[data-test="release-del"]').click();    
        cy.get('[data-test="del-release"]').click();
        cy.get("body").then(($body) => {
            if ($body.find('[data-test="wallet_password"]').length > 0) {
              cy.get('[data-test="wallet_password"]').type("aaaaaaaa");
              cy.get('[data-test="Unlock"]').click();
            }
        });
        cy.wait(2000);
    });
    
});