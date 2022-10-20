
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

        cy.wait(500);
        cy.get('[data-test="all_repositories"]').click();
        cy.wait(1000);
        cy.get('[data-test="repositories_tab"]').click();
        cy.wait(1000);
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
        cy.wait(500);
        cy.get('[data-test="all_repositories"]').click();
        cy.wait(1000);
        cy.get('[data-test="repositories_tab"]').click();
        cy.wait(1000);
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

        cy.visit("Test-dao/test");
        cy.get('[data-test="fork-repo"]').click();
        cy.get('[data-test="forking_disabled"]').should("has.text","Forking is disabled on this repository, please contact the owner to allow forking.")
        cy.wait(1000);
    });

    it("Fork - Repo already exists error", () => {

        cy.visit("/Zaje/test-repo");
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
        cy.get('p.reapop__notification-message').should("has.text","Query failed with (6): failed to execute message; message index: 0: repository (gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0/test-repo) already exist: key not found: unknown request");
    });

    it("Is able to fork a repo", () => {

        cy.clearLocalStorage();

        cy.visit("/login");

        let id = testData.repoid + 1;

        cy.readFile("cypress/fixtures/userData.json", (err, data) => {
        if (err) {
            return console.error(err);
        };
        }).then((data) => {
        data.repoid = id;
        cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data))
        })

        cy.get('[data-test="create-new-local-wallet"]').click();
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.wait(6000);
        cy.get('p.reapop__notification-message').should("has.text","Balance updated")
        cy.get('[data-test="username"]').clear().type(`Test00${testData.repoid}`).should("have.value",`Test00${testData.repoid}`);
        cy.get('[data-test="full name"]').clear().type("Test").should("have.value","Test");
        cy.get('[data-test="bio"]').clear().type("Test").should("have.value","Test");
        cy.get('[data-test="create_profile"]').click();
        cy.wait(6000);
        cy.get('[data-test="current_wallet_name"]').should("has.text", `Test00${testData.repoid}`);

        cy.visit("Zaje/test-repo");
        cy.get('[data-test="fork-repo"]').click();
        cy.get("body").then(($body) => {
        if ($body.find('[data-test="grant-access"]').length > 0)
        {
            cy.get('[data-test="grant-access"]').click();
            cy.unlock("Password");
            cy.wait(6000);
        }
        });
        cy.get('[data-test="fork-owner"]').contains(`Test00${testData.repoid}`).click();
        cy.unlock("Password");
        cy.wait(500);
        cy.wait(5000);
        cy.get('[data-test="go-to-repo"]').click();
        cy.wait(2000);
        cy.url().should("include","/test-repo");
    });

    

})