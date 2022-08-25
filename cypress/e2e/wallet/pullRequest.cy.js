describe("Create Pull Request", () => {

  let testData;
    
  beforeEach(() => {
    cy.viewport(1280,720);
    cy.fixture('userData').then((data) => {
      testData = data;
      return testData;
    })
  })
   
  it("Is able to push changes", () => {
    cy.visit('https://github.com/login');
    cy.get('[id="login_field"]').type(testData.login);
    cy.get('[id="password"]').type(testData.password);
    cy.get('[name="commit"]').click();
    cy.visit('https://github.com/zajedm/hello-world/tree/dev');
    cy.get('[aria-label="Edit this file"]').click();
    cy.get('[id="code-editor"]').type("{enter}## Test");
    cy.get('[id="code-editor"]').type(`${testData.prid}`);
    cy.get('[id="submit-file"]').click();
    cy.get('[id="actions-tab"]').click();
  });
  
  it("Is able to create a PR", () => {

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
      
    cy.wait(15000);
    cy.reload();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="new-pull-request"]').click();
    cy.wait(1000);
    cy.get('[data-test="select-branch"]').first().click();
    cy.contains('dev').click({force: true});
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="create-pr"]').click();
    cy.get('[data-test="pr-title"]').type(`Test PR${testData.prid}`);
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="Unlock"]').click();
      }
    });
    cy.wait(1000);
  });

  it("Is able to merge a PR", () => {
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

    cy.get('[data-test="code"]').click();
    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="merge-pr"]').click();
    cy.wait(1000);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="wallet_password"]').length > 0) {
        cy.get('[data-test="wallet_password"]').type(testData.walletpass);
        cy.get('[data-test="Unlock"]').click();
      }
    });
    cy.wait(3000);
    cy.get('[data-test="code"]').click();
    cy.get('[id="readme"]').scrollIntoView();
    cy.get('[id="readme"]').should("contain",`Test${testData.prid}`)
    cy.log("PR merged successfully");
    
    let id = testData.prid + 1;

    cy.readFile("cypress/fixtures/userData.json", (err, data) => {
      if (err) {
          return console.error(err);
      };
    }).then((data) => {
      data.prid = id;
      cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data))
  })
  });

});
