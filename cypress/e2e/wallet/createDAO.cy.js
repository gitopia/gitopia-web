describe("Create DAO", () => {
    
    let testData;
    
    beforeEach(() => {
      cy.viewport(1280,720);
      cy.fixture('userData').then((data) => {
        testData = data;
        return testData;
      })
    })

    it("Is able to create a DAO", () => {
        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        // cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);
        
        cy.get('[data-test="create_dao"]').click();
        cy.get('[data-test="dao_name"]').type("test-dao");
        cy.get('[data-test="dao_description"]').type("Test DAO");
        cy.get('[data-test="create_dao"]').click();
        cy.get("body").then(($body) => {
            if ($body.find('[data-test="wallet_password"]').length > 0) {
                cy.get('[data-test="wallet_password"]').type(testData.walletpass);
                cy.get('[data-test="Unlock"]').click();
                }
        });
        cy.wait(6000);
        cy.get('[data-test="select_user_dao"]').click();
        cy.contains("test-dao").click();
        cy.get('[data-test="selected_user"]').should("has.text","test-dao");
        })

    it("Is able to add and remove member", () => {
        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        // cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);
        cy.get('[data-test="select_user_dao"]').click();
        cy.contains("test-dao").click();
        cy.get('[data-test="selected_user"]').should("has.text","test-dao");
        
        cy.get('[data-test="user_address"').type("gitopia1dsud9wjd6z90c6wclxyu0yam3805w3wxavw86c");
        cy.get('[data-test="member_role"]').select("Member");
        cy.get('[data-test="add"]').click();
        cy.wait(6000);
        
        cy.get('[data-test="remove"]').last().click();
        cy.wait(6000);
    })

    it("Is able to create repository", () => {

        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        // cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);
        cy.get('[data-test="select_user_dao"]').click();
        cy.contains("test-dao").click();
        cy.get('[data-test="selected_user"]').should("has.text","test-dao");

        cy.get('[data-test="create_repo"]').click();
        cy.get('[data-test="repository_name"]').type(`test-repo`);
        cy.get('[data-test="repository_description"]').type("Testing");
        cy.get('[data-test="create-repo-button"]').click();
        cy.get("body").then(($body) => {
            if ($body.find('[data-test="wallet_password"]').length > 0) {
                cy.get('[data-test="wallet_password"]').type(testData.walletpass);
                cy.get('[data-test="Unlock"]').click();
            }
        });
        cy.wait(6000);
    })

    it("Is able to create issue", () => {
        const uuid = () => Cypress._.random(0, 1e6);
        const id = uuid();

        cy.visit("/login");
        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').type(
        testData.mnemonic
        );
        cy.get('[data-test="recover_wallet_button"]').click();
        // cy.get('[data-test="wallet_name"]').type(testData.walletname);
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", testData.walletname);
        cy.get('[data-test="select_user_dao"]').click();
        cy.contains("test-dao").click();
        cy.get('[data-test="selected_user"]').should("has.text","test-dao");

        cy.contains("test-repo").click();


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
        cy.wait(6000);
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

})