describe('Mirror Action', () => {

  it('Is it able to mirror GitHub Repo', () => {
    cy.visit('https://github.com/login');
    cy.get('[id="login_field"]').type("zajedm");
    cy.get('[id="password"]').type("KZQ@rqp9cqm8dwm7tqe")
    cy.get('[name="commit"]').click();
    cy.visit('https://github.com/zajedm/hello-world');
    cy.get('[aria-label="Edit this file"]').click();
    cy.get('[id="code-editor"]').type("{enter}## Test");
    cy.get('[id="submit-file"]').click();
    cy.get('[id="actions-tab"]').click();
  });

  it('Has the code been pushed to Gitopia Repo', () => {
    cy.visit('https://gitopia.com/gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0/hello-world');
    cy.wait(20000);
    cy.reload();
    //cy.get('[id="readme"]').should("has.text","Test");
  });
})