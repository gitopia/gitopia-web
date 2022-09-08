
describe("Issue Workflows", () => {

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
    })
    
    afterEach(() => {
        cy.saveLocalStorage();
    });


    it("Is able to create issue", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();
        cy.get('[data-test="new-issue"]').click();
        cy.get('[data-test="issue_title"]').type(`issue${testData.issueid}`).should("have.value",`issue${testData.issueid}`);
        cy.get("textarea").type("Description").should("have.value","Description");;
        cy.get('[data-test="create_issue"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
        cy.get('[data-test="issue-pull-title"]').should("has.text",`issue${testData.issueid}`)

        let id = testData.issueid + 1;

        cy.readFile("cypress/fixtures/userData.json", (err, data) => {
            if (err) {
                return console.error(err);
            };
          }).then((data) => {
            data.issueid = id;
            cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data))
        })
        });


    it("Is able to add assignees", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.get('[data-test="assignee"]').click();
        cy.get('[data-test="assignee_search"]').type(
          "gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0"
        ).should("have.value","gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0");
        cy.get('[data-test="assignee_save"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
        cy.get('[data-test="selected_assignee"]').invoke('attr','data-tip').should("eq",testData.walletaddress);
        });

    it("Is able to comment", () => {
        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.get('[data-testid="text-area"]').type("Initial Comment").should("have.value","Initial Comment");
        cy.get('[data-test="comment"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
        cy.get('[data-test="comment_view"]').filter(':contains("Initial Comment")').log("comment check passed");
    });

    it("Is able to edit comment", () => {
        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
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
        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.get('[data-test="comment_view"]').filter(':contains("Initial Comment1")').then(() => {
            cy.get('[data-test="comment_options"]').click();
            cy.get('[data-test="delete_comment"]').click();
        });
        cy.get('[data-test="del_comment"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
        cy.log("Comment deleted");
    });

    it("Is able to rename issue title", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.get('[data-test="edit_issue"]').click();
        cy.get('[name="title"]').click().type("{moveToEnd}1");
        cy.get('[data-test="save_issue"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
    });

    it("Is able to select label", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.get('[data-test="labels"]').click();
        cy.wait(100);
        cy.contains("bug").click();
        cy.wait(100);
        cy.get('[data-test="save_label"]').click();
        cy.unlock(testData.walletpass);
        cy.wait(6000);
    });

    it("Is able to create label", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
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

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.get('[data-test="labels"]').click();
        cy.wait(100);
        cy.get('[data-test="edit_labels"]').click();
        cy.wait(100);
        cy.get('[data-test="label"]').filter(':contains("new")').then(($body) => {
            $body.find('[data-test="delete_label"]').click();
        });
        cy.get('[data-test="del_label"]').last().click();
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

    it("Is able to close issue", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();

        cy.contains(`issue${testData.issueid}`).click();
        cy.wait(1500);
        cy.get('[data-test="close_issue"]').should("has.text","Close Issue").click();
        cy.unlock(testData.walletpass);
        cy.wait(8000);
        cy.get('[data-test="close_issue"]').should("has.text","Re-Open Issue");
    });

    it("Is able to reopen issue", () => {

        cy.contains('hello-world').click();
        cy.get('[data-test="issues"]').click();
        cy.get('[data-test="closed_issues"]').click();
        cy.contains(`issue${testData.issueid}`).click();
        cy.wait(1500);
        cy.get('[data-test="close_issue"]').should("has.text","Re-Open Issue").click();
        cy.unlock(testData.walletpass);
        cy.wait(8000);
        cy.get('[data-test="close_issue"]').should("has.text","Close Issue");
    });

});