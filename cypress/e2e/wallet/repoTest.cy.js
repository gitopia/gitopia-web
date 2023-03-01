describe("Repository Workflows", () => {

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
    })
    
    afterEach(() => {
        cy.saveLocalStorage();
    });

    it("Is able to create repository", () => {
        const uuid = () => Cypress._.random(0, 1e6);
        const id = uuid();
    
        cy.visit("/home");
        cy.wait(500);
        cy.get('[data-test="create-new-repo"]').click();
        cy.wait(500);
        cy.get('[data-test="repository_name"]').type(`repo${id}`).should("have.value",`repo${id}`);
        cy.get('[data-test="repository_description"]').type("Testing").should("have.value","Testing");
        cy.get('[data-test="create-repo-button"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
    });

    it("Check create repository - missing repo name error", () => {
        cy.visit("/home");
        cy.get('[data-test="create-new-repo"]').click();
        cy.get('[data-test="create-repo-button"]').click();
        cy.get('.label-text-alt').should("has.text","Please enter a repository name");
    });

    it("Check create repository - sanitizedNameTest", () => {
        cy.visit("/home");
        cy.get('[data-test="create-new-repo"]').click();
        cy.get('[data-test="repository_name"]').type("[]]").should("have.value","[]]");
        cy.get('.label-text-alt').should("has.text","Your repository would be named as ---");
    });

    // it("Check create repository - missing description error", () => {
    //     const uuid = () => Cypress._.random(0, 1e6);
    //     const id = uuid();
    
    //     cy.visit("/home");
    //     cy.get('[data-test="create-new-repo"]').click();
    //     cy.get('[data-test="repository_name"]').type(`repo${id}`).should("have.value",`repo${id}`);
    //     cy.get('[data-test="create-repo-button"]').click();
    //     cy.get('.label-text-alt').should("has.text","Please enter a description");
    // });

    it("Check create repository - name already taken error", () => {
        cy.visit("/home");
        cy.get('[data-test="create-new-repo"]').click();
        cy.get('[data-test="repository_name"]').type("Test-repo").should("have.value","Test-repo");
        cy.get('[data-test="create-repo-button"]').click();
        cy.get('.label-text-alt').should("has.text","Repository name already taken");
    });

    it("Is able to toggle forking", () => {

        cy.get('[data-test="all_repositories"]').click();
        cy.wait(1000);
        cy.get('[data-test="repositories_tab"]').click();
        cy.wait(1000);
        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('[data-test="allow-forking"]').click({force: true});
        cy.unlock(testData.walletpass);
        cy.wait(6000);
    });

    it("Is able to rename repository", () => {

        cy.get('[data-test="all_repositories"]').click();
        cy.wait(1000);
        cy.get('[data-test="repositories_tab"]').click();
        cy.wait(1000);
        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('[data-test="rename"]').click();
        cy.get('[data-test="repository_name"]').type("{moveToEnd}1").should("have.value","Test-repo1");
        cy.get('[data-test="rename"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
        cy.get('[data-test="repo_name"]').should("has.text","Test-repo1");
        cy.get('[data-test="rename"]').click();
        cy.get('[data-test="repository_name"]').click().type("{backspace}").should("have.value","Test-repo");
        cy.get('[data-test="rename"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
        cy.get('[data-test="repo_name"]').should("has.text","Test-repo");
    })

    it("Is able to add collaborators", () => {

        cy.get('[data-test="all_repositories"]').click();
        cy.wait(1000);
        cy.get('[data-test="repositories_tab"]').click();
        cy.wait(1000);
        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('.input').type("gitopia1wum35ycsalxu584c7gnc7udfrhncjulg8ssjhk");
        cy.get('[data-test="permissions"]').select("Maintain");
        cy.get('[data-test="add"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
    })

    it("Is able to remove collaborators", () => {

        cy.get('[data-test="all_repositories"]').click();
        cy.wait(1000);
        cy.get('[data-test="repositories_tab"]').click();
        cy.wait(1000);
        cy.contains("Test-repo").click();
        cy.get('[data-test="settings"]').click();
        cy.wait(500);
        cy.get('[data-test="remove"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
    })

});

