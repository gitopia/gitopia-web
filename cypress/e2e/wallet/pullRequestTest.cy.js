
describe("Create Pull Request", () => {

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
  
  it("Is able to create a PR", () => {

    const branchSelector = `:contains("test${testData.branchid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.get('[data-test="repositories_tab"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();
    cy.wait(500);

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="new-pull-request"]').click();
    cy.wait(1000);
    cy.get('[data-test="source_branch"]').within(() => {
      cy.get('[data-test="select-branch"]').click();
      cy.wait(500);
      cy.get('[data-test="branch_selector"]').find('li').filter(branchSelector).should("contain",`test${testData.branchid}`).click();
      cy.wait(500);
    })
    cy.get('[data-test="create-pr"]').click();
    cy.wait(1000);
    cy.get('[data-test="pr-title"]').click().type(`Test PR${testData.prid}`).should("have.value",`Test PR${testData.prid}`);
    cy.get('[data-test="create-pr"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(7000);
    cy.get('[data-test="pr_state"]').should("has.text","This branch has no conflicts with base branch");
    cy.get('[data-test="merge-pr"]').should('be.visible');

    let id;

    if(testData.branchid == 1){
      id = 2;
    }
    else{
      id = 1;
    };
    
    cy.readFile("cypress/fixtures/userData.json", (err, data) => {
      if (err) {
          return console.error(err);
      };
      }).then((data) => {
      data.branchid = id;
      cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data))
    })
  });

  it("Is able to add assignees", () => {

    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
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

  it("Is able to add reviewers", () => {

    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="assignee"]').filter(':contains("Reviewers")').within(() => {
      cy.contains("Reviewers").click();
      cy.wait(500);
      cy.get('[data-test="assignee_search"]').type(
        "gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0"
      ).should("have.value","gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0");
      cy.get('[data-test="assignee_save"]').click();
    });
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="selected_assignee"]').first().invoke('attr','data-tip').should("eq",testData.walletaddress);
  });

  it("Is able to comment", () => {
  
    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-testid="text-area"]').type("Initial Comment").should("have.value","Initial Comment");
    cy.get('[data-test="comment"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="comment_view"]').filter(':contains("Initial Comment")').log("comment check passed");
  });

  it("Is able to edit comment", () => {
    
    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="comment_view"]').filter(':contains("Initial Comment")').then(() => {
        cy.get('[data-test="comment_options"]').click();
        cy.get('[data-test="edit_comment"]').click();
        cy.contains("Initial Comment").click().type("{moveToEnd}1");
        cy.get('[data-test="comment"]').first().click();
    });
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="comment_view"]').filter(':contains("Initial Comment1")').log("Comment editted");
  });

  it("Is able to delete comment", () => {
    
    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="comment_view"]').filter(':contains("Initial Comment1")').then(() => {
      cy.get('[data-test="comment_options"]').click();
      cy.get('[data-test="delete_comment"]').click();
    });
    cy.get('[data-test="del_comment"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.log("Comment deleted");
  });

  it("Is able to rename PR title", () => {
    
    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="edit_issue"]').click();
    cy.get('[name="title"]').click().type("{moveToEnd}1");
    cy.get('[data-test="save_issue"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
  });

  it("Is able to select label", () => {

    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.contains("bug").click();
    cy.wait(100);
    cy.get('[data-test="save_label"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
  });

  it("Is able to create label", () => {

    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.get('[data-test="edit_labels"]').click();
    cy.wait(100);
    cy.get('[data-test="new_label"]').click();
    cy.wait(100);
    cy.get('[data-test="label_name"]').click().type("new").should("have.value","new");
    cy.wait(100);
    cy.get('[data-test="label_description"]').click().type("new label").should("have.value","new label");
    cy.wait(100);
    cy.get('[data-test="save_label"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="existing_labels"]').should(($labels) => {
      expect($labels).to.contain('new')
    });
    cy.go('back');
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.get('[data-test="select_label"]').should(($labels) => {
      expect($labels).to.contain('new')
    });
  });

  it("Is able to delete label", () => {

    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
      cy.get('[data-test="labels"]').click();
      cy.wait(100);
      cy.get('[data-test="edit_labels"]').click();
      cy.wait(100);
      cy.get('[data-test="label"]').filter(':contains("new")').within(() => {
          cy.get('[data-test="delete_label"]').click();
          cy.get('[data-test="del_label"]').click();
      });
      cy.unlock(testData.walletpass);
      cy.wait(8000);
      cy.get('[data-test="existing_labels"]').should(($labels) => {
          expect($labels).to.not.contain('new')
      });
      cy.go('back');
      cy.get('[data-test="labels"]').click();
      cy.wait(100);
      cy.get('[data-test="select_label"]').should(($labels) => {
          expect($labels).to.not.contain('new')
      });
  }); 

  it("Is able to merge a PR", () => {

    const filterSelector = `:contains("${testData.prid}")`

    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.contains('Test-PR').click();

    cy.get('[data-test="pull-requests"]').click();
    cy.get('[data-test="select-open-pr"]').filter(filterSelector).click();
    cy.wait(1000);
    cy.get('[data-test="pr_state"]').should("has.text","This branch has no conflicts with base branch");
    cy.get('[data-test="merge-pr"]').click();
    cy.wait(1000);
    cy.unlock(testData.walletpass);
    cy.wait(8000);
    cy.get('[data-test="pr_state"]').should("has.text","This pull request is merged");
    
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

  it("Is able to merge a PR - unauthorized user error", () => {
  

    cy.visit("/Test-dao/test/pulls/1");
    cy.wait(1000);
    cy.get('[data-test="pr_state"]').should("has.text","This branch has no conflicts with base branch");
    cy.get('[data-test="merge-pr"]').click();
    cy.wait(1000);
    cy.get('p.reapop__notification-message').should("has.text","User not authorized for merging pull requests");
  });

  it("Is able to close a PR - unauthorized user error", () => {


    cy.visit("/Test-dao/test/pulls/1");
    cy.wait(1000);
    cy.get('[data-test="close_pr"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(1000);
    cy.get('p.reapop__notification-message').should("has.text","Query failed with (6): failed to execute message; message index: 0: user (gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0) doesn't have permission to perform this operation: unauthorized: unknown request");
    });

});
