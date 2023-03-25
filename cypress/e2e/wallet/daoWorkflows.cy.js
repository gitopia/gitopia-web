describe("Create Pull Request", () => {
  let testData;

  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.fixture("userData").then((data) => {
      testData = data;
      return testData;
    });
  });

  // it("Is able to push changes", () => {
  //   cy.visit('https://github.com/login');
  //   cy.get('[id="login_field"]').type(testData.login);
  //   cy.get('[id="password"]').type(testData.password);
  //   cy.get('[name="commit"]').click();
  //   cy.visit('https://github.com/zajedm/hello-world-dao/tree/dev');
  //   cy.get('[aria-label="Edit this file"]').click();
  //   cy.get('[id="code-editor"]').type("{enter}## Test");
  //   cy.get('[id="code-editor"]').type(`${testData.prid}`);
  //   cy.get('[id="submit-file"]').click();
  //   cy.get('[id="actions-tab"]').click();
  // });

  it("Is able to create a PR", () => {
    cy.visit("/login");
    cy.get('[data-test="recover-local-wallet"]').click();
    cy.get('[data-test="mnemonic"]').type(testData.mnemonic);
    cy.get('[data-test="recover_wallet_button"]').click();
    // cy.get('[data-test="wallet_name"]').type(testData.walletname);
    cy.get('[data-test="wallet_password"]').type(testData.walletpass);
    cy.get('[data-test="wallet_confirm_password"]').type(testData.walletpass);
    cy.get('[data-test="recover_wallet_button"]').click();
    cy.get('[data-test="current_wallet_name"]').should(
      "has.text",
      testData.walletname
    );

    cy.get('[data-test="select_user_dao"]').click();
    cy.contains("test-dao").click();
    cy.get('[data-test="selected_user"]').should("has.text", "test-dao");
    cy.get('a[data-test="top_repositories"]').first().should("has.text", "test-repo");

    cy.visit('/test-dao/test-repo');
    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="new-pull-request"]').click();
    cy.wait(1000);
    cy.get('[data-test="select-branch"]').first().click();
    cy.contains("dev").click({ force: true });
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
});
