describe("Create Releases", () => {

    let testData;
      
    beforeEach(() => {
      cy.viewport(1280,720);
      cy.fixture('userData').then((data) => {
        testData = data;
        return testData;
      })
    })

    it("Is able to create a Release", () => {

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
    
      cy.contains('hello-world').click();
      cy.get('[data-test="releases"]').click();
      cy.get('[data-test="new-release"]').click();
      cy.get('[data-test="select-branch"]').click();
      cy.get('[data-test="create-tag"]').click();
      cy.get('[data-test="tag-name"]').type(`v0.0.${testData.tagid}`);
      cy.get('[data-test="create-tag"]').click();
      cy.get("body").then(($body) => {
        if ($body.find('[data-test="wallet_password"]').length > 0) {
          cy.get('[data-test="wallet_password"]').type(testData.walletpass);
          cy.get('[data-test="Unlock"]').click();
        }
      });
      cy.wait(4000);
      cy.get('[data-test="release-title"]').type(`Release v0.0.${testData.tagid}`);
      cy.get('[data-test="create-release"]').click();
      cy.wait(1000);
      
      let id = testData.tagid + 1;

      cy.readFile("cypress/fixtures/userData.json", (err, data) => {
        if (err) {
            return console.error(err);
        };
      }).then((data) => {
        data.tagid = id;
        cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data))
      })
        
    });

    it("Is able to edit a Release", () => {
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
    
      cy.contains('hello-world').click();
      cy.get('[data-test="releases"]').click();
      cy.get('[data-test="release-edits"]').click();
      cy.get('[data-test="release-edit"]').click();
      cy.wait(500);
      cy.get('[data-testid="text-area"]').type("Test Release");
      cy.get('[data-test="update-release"]').click();
      cy.get("body").then(($body) => {
        if ($body.find('[data-test="wallet_password"]').length > 0) {
          cy.get('[data-test="wallet_password"]').type(testData.walletpass);
          cy.get('[data-test="Unlock"]').click();
        }
      });
      cy.wait(2000);
    });

    it("Is able to delete a Release", () => {
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
  
      cy.contains('hello-world').click();
      cy.get('[data-test="releases"]').click();
      cy.get('[data-test="release-edits"]').click();
      cy.get('[data-test="release-del"]').click();    
      cy.get('[data-test="del-release"]').click();
      cy.get("body").then(($body) => {
        if ($body.find('[data-test="wallet_password"]').length > 0) {
          cy.get('[data-test="wallet_password"]').type(testData.walletpass);
          cy.get('[data-test="Unlock"]').click();
        }
      });
      cy.wait(2000);
    });
    
});