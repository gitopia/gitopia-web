

describe("Test Workflows", () => {

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

    it("Is able to comment", () => {
  
      cy.visit("/gitopia1dsud9wjd6z90c6wclxyu0yam3805w3wxavw86c/awesome-cosmos/pulls/3");
      cy.wait(1000);
      cy.get('[data-test="assignee"]').filter(':contains("Assignees")').within(() => {
        cy.contains("Assignees").click();
        cy.wait(500);
        cy.get('[data-test="assignee_search"]').type(
          "gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0"
        ).should("have.value","gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0");
        cy.get('[data-test="assignee_save"]').click();
      });
      cy.unlock(testData.walletpass);
      cy.wait(6000);
      cy.get('[data-test="selected_assignee"]').invoke('attr','data-tip').should("eq",testData.walletaddress);
    });

})

