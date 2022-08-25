describe("Test Wallet Workflows", () => {

    beforeEach(() => {
        cy.restoreLocalStorage();
      });
      
      afterEach(() => {
        cy.saveLocalStorage();
      });

    it("Test wallet password format error", () => {
        cy.viewport(1280,720);
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Passwor");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('.label-text-alt').should("has.text","Password should be atleast 8 characters");

    })

    it("Test wallet password mismatch error", () => {
        cy.viewport(1280,720);
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password1");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('.label-text-alt').should("has.text","Confirm password and password are not matching")
    })

    it("Test wallet creation", () => {
        cy.viewport(1280,720);
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
        cy.get('[data-test="mnemonic"]').should("have.length", 24);
        cy.get('[data-test="current_wallet_name"]').click();
        cy.get('[data-test="download_wallet"]').click();
        cy.get('[data-test="wallet_password"]').type("Password");
        cy.get('[data-test="Download"]').click();
        cy.readFile("cypress/downloads/Test123.json").should("exist");
    });
    

    it("Test wallet name already exists error", () => {
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('.label-text-alt').should("has.text", "Wallet name already taken");
        cy.wait(1000);
    })

    it("Test recover wallet", () => {
        cy.viewport(1280,720);
        cy.visit("/login");

        cy.readFile("cypress/downloads/Test123.json", (err, data) => {
            if (err) {
                return console.error(err);
            };
          }).then((data) => {

        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').click().type(data.mnemonic);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="wallet_name"]').type(data.name).should("have.value",data.name);
        cy.get('[data-test="wallet_password"]').type(data.password).should("have.value",data.password);
        cy.get('[data-test="wallet_confirm_password"]').type(data.password).should("have.value",data.password);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", data.name);
    })

})

    
})