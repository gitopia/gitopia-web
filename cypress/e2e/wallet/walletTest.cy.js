
describe("Test Wallet Workflows", () => {

    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.viewport(1280,720);
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

        cy.get('[data-test="create-new-local-wallet"]').click();
        // cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="create_wallet"]').click();
        // cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
        cy.wait(500);
        cy.get('[data-test="username"]').clear().type("Test1234").should("have.value","Test1234");
        cy.get('[data-test="full name"]').clear().type("Test1234").should("have.value","Test1234");
        cy.get('[data-test="bio"]').clear().type("Test1234").should("have.value","Test1234");
        cy.get('[data-test="create_profile"]').click();

    })

    it("Is able to generate 24 word recovery phase", () => {
        cy.get('[data-test="mnemonic"]').should("have.length", 24);
      });
    
    it("Is able to download wallet", () => {
        cy.get('[data-test="current_wallet_name"]').click();
        cy.get('[data-test="download_wallet"]').click();
        cy.get('[data-test="wallet_password"]').type("Password");
        cy.get('[data-test="Download"]').click();
        cy.readFile("cypress/downloads/Test123.json").should("exist");
        cy.get('[data-test="done_go_home"]').click();
    });

    it("Low balance error", () => {
        const uuid = () => Cypress._.random(0, 1e6);
        const id = uuid();
    
        cy.get('[data-test="create-new-repo"]').click();
        cy.get('[data-test="repository_name"]').type(`repo${id}`).should("have.value",`repo${id}`);
        cy.get('[data-test="repository_description"]').type("Testing").should("have.value","Testing");
        cy.wait(5000);
        cy.get('[data-test="create-repo-button"]').click();
        cy.get('p.reapop__notification-message').should("has.text","Balance low for creating repository")
    })

    it("Is able to get tokens", () => {
        cy.visit("/home");
        if (cy.get('[data-test="get-token"]').contains("Get TLORE")) {
          cy.get('[data-test="get-token"]').click();
          cy.wait(6000);
          cy.get('p.reapop__notification-message').should("has.text","Balance updated");
        }
      });
    
    it("Is able to create profile", () => {
        cy.visit("/home");
        cy.get("body").then(($body) => {
          if ($body.find('[data-test="create_profile"]').length > 0) {
            cy.get('[data-test="create_profile"]').click();
            cy.unlock("Password");
            cy.wait(6000);
            cy.get('p.reapop__notification-message').should("has.text","Your profile is created");
          }
        });
    });
    

    it("Test wallet name already exists error", () => {
        cy.visit("/login");

        cy.get('[data-test="create-new-local-wallet"]').click();
        // cy.get('[data-test="wallet_name"]').clear().type("Test123");
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="wallet_confirm_password"]').clear().type("Password").should("have.value","Password");
        cy.get('[data-test="create_wallet"]').click();
        cy.get('.label-text-alt').should("has.text", "Wallet name already taken");
        cy.wait(1000);
    })

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
        cy.contains("Test123").click();
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.contains("Unlock").click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
        
    })

    it("Test switch wallet incorrect password error", () => {
        cy.visit("/home");
        cy.get('[data-test="wallet-menu"]').click();
        cy.get('[data-test="log-out"]').click();
        cy.get('[data-test="wallet-menu"]').should("has.text","Connect Wallet");
        cy.get('[data-test="wallet-menu"]').click();
        cy.contains("Test123").click();
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
        cy.contains("Test123").click();
        cy.get('[data-test="wallet_password"]').clear().type("Password").should("have.value","Password");
        cy.contains("Unlock").click();
        cy.get('[data-test="current_wallet_name"]').should("has.text", "Test123");
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