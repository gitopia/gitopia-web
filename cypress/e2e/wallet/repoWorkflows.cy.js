describe("Repository Workflows", () => {
    
    let testData;
    
    beforeEach(() => {
      cy.viewport(1280,720);
      cy.fixture('userData').then((data) => {
        testData = data;
        return testData;
      })
    })

    it("Is able to toggle forking", () => {
        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);

        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('[data-test="allow-forking"]').click();
        cy.wait(500);
    });

    it("Is able to rename repository", () => {
        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);

        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('[data-test="rename"]').click();
        cy.get('[data-test="repository_name"]').type("{moveToEnd}1");
        cy.get('[data-test="rename"]').click();
        cy.get("body").then(($body) => {
        if ($body.find('[data-test="wallet_password"]').length > 0) {
            cy.get('[data-test="wallet_password"]').type(testData.walletpass);
            cy.get('[data-test="Unlock"]').click();
            }
        });
        cy.wait(6000);
        cy.get('[data-test="rename"]').click();
        cy.get('[data-test="repository_name"]').click();
        cy.get('[data-test="repository_name"]').type("{backspace}");
        cy.get('[data-test="rename"]').click();
        cy.get("body").then(($body) => {
        if ($body.find('[data-test="wallet_password"]').length > 0) {
            cy.get('[data-test="wallet_password"]').type(testData.walletpass);
            cy.get('[data-test="Unlock"]').click();
            }
        });
        cy.wait(1000);
    })

    it("Is able to add/remove collaborators", () => {
        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);

        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('.input').type("gitopia1g245p7dg3sdsd6vty3ky8rrh26uu2g6njqdstw");
        cy.get('[data-test="permissions"]').select("Maintain");
        cy.get('[data-test="add"]').click();
        cy.wait(6000);
        cy.get('[data-test="remove"]').click();
        cy.wait(8000);
    })

});

