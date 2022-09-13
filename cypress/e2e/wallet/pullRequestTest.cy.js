describe("Create Pull Request", () => {

  let testData;
    
  beforeEach(() => {
    cy.viewport(1280,720);
    cy.restoreLocalStorage();
    cy.fixture('userData').then((data) => {
      testData = data;
      return testData;
    })
  });
    
  afterEach(() => {
    cy.saveLocalStorage();
  });

  
   
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

    cy.visit("/home");
    cy.wait(500);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="current_wallet_name"]').length == 0){
        cy.login(testData.walletname, testData.walletpass, testData.mnemonic);
      }
    });

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('hello-world').click();
      
    cy.wait(16000);
    cy.reload();

    cy.get('[data-test="select-branch"]').click();
    cy.wait(500);
    cy.get('[data-test="branch_selector"]').find('li').filter(':contains("dev")').click();
    cy.wait(1000);
    cy.url().should("include","/hello-world/tree/dev");
    cy.get('[id="readme"]').find('h2').filter(':contains("Test")').should("contain",`Test${testData.prid}`);

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="new-pull-request"]').click();
    cy.wait(1000);
    cy.get('[data-test="source_branch"]').within(() => {
      cy.get('[data-test="select-branch"]').click();
      cy.wait(500);
      cy.get('[data-test="branch_selector"]').filter(':contains("dev")').click();
    })
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="create-pr"]').click();
    cy.get('[data-test="pr-title"]').click().type(`Test PR${testData.prid}`).should("have.value",`Test PR${testData.prid}`);
    cy.get('[data-test="create-pr"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(7000);
    cy.get('[data-test="pr_state"]').should("has.text","This branch has no conflicts with base branch");
    cy.get('[data-test="merge-pr"]').should('be.visible');
  });

  it("Is able to merge a PR", () => {
    cy.visit("/home");
    cy.wait(500);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="current_wallet_name"]').length == 0){
        cy.login(testData.walletname, testData.walletpass, testData.mnemonic);
      }
    });

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('hello-world').click();

    cy.get('[data-test="code"]').click();
    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="pr_state"]').should("has.text","This branch has no conflicts with base branch");
    cy.get('[data-test="merge-pr"]').click();
    cy.wait(1000);
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="pr_state"]').should("has.text","This pull request is merged");
    cy.get('[data-test="code"]').click();
    cy.get('[id="readme"]').scrollIntoView();
    cy.get('[id="readme"]').find('h2').filter(':contains("Test")').should("contain",`Test${testData.prid}`)
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
