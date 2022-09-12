
describe("Fork Workflows", () => {

    let testData;
    
    beforeEach(() => {
      cy.viewport(1280,720);
      cy.restoreLocalStorage();
      cy.fixture('userData').then((data) => {
        testData = data;
        return testData;
      })
      cy.visit("/home");
      cy.wait(500);
      cy.get("body").then(($body) => {
        if ($body.find('[data-test="current_wallet_name"]').length == 0){
            cy.login(testData.walletname, testData.walletpass, testData.mnemonic);
        }
    });
    });
    
    afterEach(() => {
        cy.saveLocalStorage();
    });

    it("Is able to disable forking", () => {

        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(1500);
        cy.get('[data-test="allow-forking"]').then(($ele) => {
            if ($ele.is(':checked')) {
                cy.wrap($ele).click({ force: true });
                cy.unlock(testData.walletpass);
                cy.wait(6000);
            } else {
                cy.log("fork disabled by default");
            }
        })
        cy.get('[data-test="allow-forking"]').should('not.be.checked');
    });

    it("Is able to enable forking", () => {

        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(1500);
        cy.get('[data-test="allow-forking"]').then(($ele) => {
            if ($ele.is(':checked')) {
                cy.log("fork allowed by default");
            } else {
                cy.wrap($ele).click({ force: true });
                cy.unlock(testData.walletpass);
                cy.wait(6000);
            }
        })
        cy.get('[data-test="allow-forking"]').should('be.checked');
    });

    it("Forking is disabled on the repo error", () => {

        cy.visit("/gitopia17w3ytcpfhsenkwn4h3jxa9q8wg4w77rjwwcl36/Hackathon");
        cy.get('[data-test="fork-repo"]').click();
        cy.get('[data-test="forking_disabled"]').should("has.text","Forking is disabled on this repository, please contact the owner to allow forking.")
    });

    it("Fork - Repo already exists error", () => {

        cy.visit("/gitopia17w3ytcpfhsenkwn4h3jxa9q8wg4w77rjwwcl36/test-repo");
        cy.get('[data-test="fork-repo"]').click();
        cy.get("body").then(($body) => {
        if ($body.find('[data-test="grant-access"]').length > 0)
        {
            cy.get('[data-test="grant-access"]').click();
            cy.unlock(testData.walletpass);
            cy.wait(6000);
        }
        });
        cy.get('[data-test="fork-owner"]').contains(testData.walletname).click();
        cy.unlock(testData.walletpass);
        cy.wait(500);
        cy.get('p.reapop__notification-message').should("has.text","Query failed with (18): failed to execute message; message index: 0: repository (test-repo) already exists: invalid request: invalid request");
    });

    it("Is able to fork a repo", () => {

        cy.clearLocalStorage();

        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
        cy.visit("/home");
        if (cy.get('[data-test="get-token"]').contains("Get TLORE")) {
            cy.get('[data-test="get-token"]').click();
            cy.wait(6000);
        }

        cy.visit("/gitopia17w3ytcpfhsenkwn4h3jxa9q8wg4w77rjwwcl36/test-repo");
        cy.get('[data-test="fork-repo"]').click();
        cy.get("body").then(($body) => {
        if ($body.find('[data-test="grant-access"]').length > 0)
        {
            cy.get('[data-test="grant-access"]').click();
            cy.unlock("Password");
            cy.wait(6000);
        }
        });
        cy.get('[data-test="fork-owner"]').contains("Test123").click();
        cy.unlock("Password");
        cy.wait(500);
        cy.wait(5000);
        cy.get('[data-test="go-to-repo"]').click();
        cy.wait(2000);
        cy.url().should("include","/test-repo");
    });

    

})