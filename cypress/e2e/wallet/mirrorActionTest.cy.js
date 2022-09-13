describe('Mirror Action', () => {

  let testData;
    
  beforeEach(() => {
    cy.viewport(1280,720);
    cy.fixture('userData').then((data) => {
      testData = data;
      return testData;
    })
  })

  it('Is it able to mirror GitHub Repo', () => {
    cy.visit('https://github.com/login');
    cy.get('[id="login_field"]').type(testData.login);
    cy.get('[id="password"]').type(testData.password)
    cy.get('[name="commit"]').click();
    cy.visit('https://github.com/zajedm/hello-world');
    cy.get('[aria-label="Edit this file"]').click();
    cy.get('[id="code-editor"]').type("{enter}## Test");
    cy.get('[id="code-editor"]').type(`${testData.prid}`);
    cy.get('[id="submit-file"]').click();
    cy.get('[id="actions-tab"]').click();
  });

  it('Has the code been pushed to Gitopia Repo', () => {
    cy.visit('https://gitopia.com/gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0/hello-world');
    cy.wait(20000);
    cy.reload();
    cy.get('[id="readme"]').find('h2').filter(':contains("Test")').should("contain",`Test${testData.prid}`);

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
})