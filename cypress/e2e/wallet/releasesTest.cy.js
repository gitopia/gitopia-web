
describe("Create Releases", () => {

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
    cy.wait(500);
    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('hello-world').click();
  });
    
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("Is able to create a tag", () => {
    cy.get('[data-test="releases"]').click();
    cy.get('[data-test="new-release"]').click();

    cy.get('[data-test="select-branch"]').click();
    cy.get('[data-test="create-tag"]').click();
    cy.get('[data-test="tag-name"]').click().clear().type(`v0.0.${testData.tagid}`).should("have.value",`v0.0.${testData.tagid}`);
    cy.get('[data-test="create-tag"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(4000);
    cy.get('[data-test="select-branch"]').should("contain",`v0.0.${testData.tagid}`);

    let id = testData.tagid + 1;

    cy.readFile("cypress/fixtures/userData.json", (err, data) => {
      if (err) {
        return console.error(err);
      };
    }).then((data) => {
      data.tagid = id;
      cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data))
    })      
  })

  it("Is able to select a tag", () => {
    cy.get('[data-test="releases"]').click();
    cy.get('[data-test="new-release"]').click();

    cy.get('[data-test="select-branch"]').click();

    const filterSelector = `:contains("${testData.tagid}")`

    cy.get('[data-test="branch_selector"]').find('li').filter(filterSelector).click();
    cy.get('[data-test="select-branch"]').should("contain",`v0.0.${testData.tagid}`);
  })

  it("Is able to create a Release", () => {
    
    cy.get('[data-test="releases"]').click();
    cy.get('[data-test="new-release"]').click();

    cy.get('[data-test="select-branch"]').click();
    cy.get('[data-test="branch_selector"]').find('li').eq(0).should("has.text","v0.0.1").click();
    cy.get('[data-test="release-title"]').click().type(`Release v0.0.1`).should("have.value",`Release v0.0.1`);
    cy.get('[data-test="create-release"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(1000);
    
  });

  it("Is able to edit a Release", () => {

    cy.get('[data-test="releases"]').click();
    cy.get('[data-test="release-edits"]').click();
    cy.get('[data-test="release-edit"]').click();
    cy.wait(1000);
    cy.get('[data-testid="text-area"]').click().clear().type("Release created for testing").should("have.value","Release created for testing");
    cy.get('[data-test="update-release"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(2000);
  });

  it("Is able to delete a Release", () => {
    
    cy.get('[data-test="releases"]').click();
    cy.get('[data-test="release-edits"]').click();
    cy.get('[data-test="release-del"]').click();    
    cy.get('[data-test="del-release"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(2000);
  });
    
});