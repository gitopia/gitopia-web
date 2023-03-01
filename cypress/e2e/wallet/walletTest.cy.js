
describe("Test Wallet Workflows", () => {

    let testData;

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.viewport(1280,720);
        cy.fixture('userData').then((data) => {
            testData = data;
            return testData;
        })
      });
      
      afterEach(() => {
        cy.saveLocalStorage();
      });

    it("Test wallet password format error", () => {
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        // cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Passwor");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('.label-text-alt').should("has.text","Password should be atleast 8 characters");

    })

    it("Test wallet password mismatch error", () => {
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        // cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password1");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('.label-text-alt').should("has.text","Confirm password and password are not matching")
    })

    it("Test wallet creation", () => {
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
        cy.get('[data-test="username"]').clear().type("Test123").should("have.value","Test123");
        cy.get('[data-test="full name"]').clear().type("Test").should("have.value","Test");
        cy.get('[data-test="bio"]').clear().type("Test").should("have.value","Test");
        cy.wait(5000);
        cy.get('[data-test="create_profile"]').click();
        cy.get('p.reapop__notification-message').should("has.text","Query failed with (6): failed to execute message; message index: 0: username is already taken: (Test123): invalid request: unknown request")
        cy.wait(1000);
        cy.get('[data-test="username"]').clear().type(`Test00${testData.repoid}`).should("have.value",`Test00${testData.repoid}`);
        cy.get('[data-test="create_profile"]').click();
        cy.wait(6000);
        cy.get('[data-test="current_wallet_name"]').should("has.text", `Test00${testData.repoid}`);

    })

    it("Is able to download wallet", () => {
        cy.visit("/home");
        cy.wait(2000);

        const download = `cypress/downloads/Test00${testData.repoid}.json`

        cy.get('[data-test="current_wallet_name"]').click();
        cy.get('[data-test="download_wallet"]').click();
        cy.get('[data-test="wallet_password"]').type("Password");
        cy.get('[data-test="Download"]').click();
        cy.readFile(download).should("exist");
    });

    it("Test wallet log out", () => {
        cy.visit("/home");
        cy.get('[data-test="wallet-menu"]').click();
        cy.get('[data-test="log-out"]').click();
        cy.get('[data-test="wallet-menu"]').should("has.text","Connect Wallet");
    })

    it("Test wallet log in", () => {
        cy.visit("/home");
        cy.get('[data-test="wallet-menu"]').click();
        cy.get('[data-test="log-out"]').click();
        
        cy.visit("/home");
        cy.get('[data-test="wallet-menu"]').click();
        cy.contains(`Test00${testData.repoid}`).click();
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.contains("Unlock").click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", `Test00${testData.repoid}`);
        
    })

    it("Test switch wallet incorrect password error", () => {
        cy.visit("/home");
        cy.get('[data-test="wallet-menu"]').click();
        cy.get('[data-test="log-out"]').click();
        cy.get('[data-test="wallet-menu"]').should("has.text","Connect Wallet");
        cy.get('[data-test="wallet-menu"]').click();
        cy.contains(`Test00${testData.repoid}`).click();
        cy.contains("Unlock").click();
        cy.get('[class="label-text-alt text-error"]').should("has.text", "Please enter the password");
        cy.get('[data-test="wallet_password"]').clear().type("Passwo").should("have.value","Passwo");
        cy.contains("Unlock").click();
        cy.get('[class="label-text-alt text-error"]').should("has.text", "Wrong password");
    })

    it("Test switch wallet", () => {
        cy.visit("/home");
        cy.get('[data-test="wallet-menu"]').click();
        cy.get('[data-test="log-out"]').click();
        cy.get('[data-test="wallet-menu"]').should("has.text","Connect Wallet");
        cy.get('[data-test="wallet-menu"]').click();
        cy.contains(`Test00${testData.repoid}`).click();
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.contains("Unlock").click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", `Test00${testData.repoid}`);
    })

    it("Test recover wallet incorrect mnemonic error", () => {
        cy.clearLocalStorage();
        cy.visit("/login");

        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').click().type("lounge degree borrow seven gesture double slide certain stool unhappy auction marriage relax advice tackle bone famous market rice floor wink enemy jungle enemy");
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[class="label-text-alt text-error"]').should("has.text", "Please enter 24 valid english words");
       
    })

    it("Test recover wallet", () => {
        cy.clearLocalStorage();
        cy.visit("/login");

        const download = `cypress/downloads/Test00${testData.repoid}.json`

        cy.readFile(download, (err, data) => {
            if (err) {
                return console.error(err);
            };
          }).then((data) => {

        cy.get('[data-test="recover-local-wallet"]').click();
        cy.get('[data-test="mnemonic"]').click().type(data.mnemonic);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[name="wallet_password"]').type(data.password).should("have.value",data.password);
        cy.get('[name="wallet_confirm_password"]').type(data.password).should("have.value",data.password);
        cy.get('[data-test="recover_wallet_button"]').click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", data.name);
    })

})

    
})