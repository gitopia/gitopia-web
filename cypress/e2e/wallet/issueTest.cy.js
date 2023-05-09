describe("Issue Workflows", () => {
  let testData;

  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.restoreLocalStorage();
    cy.fixture("userData").then((data) => {
      testData = data;
      return testData;
    });
    cy.visit("/home");
    cy.wait(500);
    cy.get("body").then(($body) => {
      if ($body.find('[data-test="current_wallet_name"]').length == 0) {
        cy.login(testData.walletname, testData.walletpass, testData.mnemonic);
      }
    });
    //cy.get('[data-test="all_repositories"]').click();
    cy.wait(500);
    cy.get('[data-test="all_repositories"]').click();
    cy.wait(1000);
    cy.get('[data-test="repositories_tab"]').click();
    cy.wait(1000);
    cy.contains("hello-world").click();
    cy.get('[data-test="issues"]').click();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("Is able to create issue", () => {
    cy.get('[data-test="new-issue"]').click();
    cy.get('[data-test="issue_title"]')
      .type(`issue${testData.issueid}`)
      .should("have.value", `issue${testData.issueid}`);
    cy.get("textarea").type("Description").should("have.value", "Description");
    cy.get('[data-test="create_issue"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="issue-pull-title"]').should(
      "has.text",
      `issue${testData.issueid}`
    );

    let id = testData.issueid + 1;

    cy.readFile("cypress/fixtures/userData.json", (err, data) => {
      if (err) {
        return console.error(err);
      }
    }).then((data) => {
      data.issueid = id;
      cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data));
    });
  });

  it("Is able to create issue with bounty", () => {
    cy.get('[data-test="new-issue"]').click();
    cy.get('[data-test="issue_title"]')
      .type(`issue${testData.issueid + 1}`)
      .should("have.value", `issue${testData.issueid + 1}`);
    cy.get("textarea").type("Description").should("have.value", "Description");
    cy.get('[data-test="attach_bounty"]').click();
    cy.get('[data-test="select_token"]')
      .find("option")
      .eq(1)
      .invoke("val")
      .then((value) => {
        cy.get('[data-test="select_token"]').select(value);
      });
    cy.get('[data-type="amount_entered"]')
      .type("0.000001")
      .should("have.value", "0.000001");
    cy.get('[data-type="add_token"]').click();
    cy.dayjs().then((dayjsObj) => {
      const currentTime = dayjsObj;
      const time = currentTime.add(1, "day").format("YYYY-MM-DD");
      cy.get('input[data-type="expiry_date"]')
        .clear()
        .type(time)
        .should("have.value", time);
    });
    cy.get('[data-type="attach_bounty"]').click();
    cy.get('[data-test="create_issue"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="issue-pull-title"]').should(
      "has.text",
      `issue${testData.issueid + 1}`
    );
    cy.get('[data-type="issue_bounty_view"]').should("has.text", `Bounties`);

    let id = testData.issueid + 2;

    cy.readFile("cypress/fixtures/userData.json", (err, data) => {
      if (err) {
        return console.error(err);
      }
    }).then((data) => {
      data.issueid = id;
      cy.writeFile("cypress/fixtures/userData.json", JSON.stringify(data));
    });
  });

  it("Is able to add assignees", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-test="assignee"]').click();
    cy.get('[data-test="assignee_search"]')
      .type("gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0")
      .should("have.value", "gitopia18gtaqn8g58cxyxyd7wj7vpk790d6wxfk0frfg0");
    cy.get('[data-test="assignee_save"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="selected_assignee"]')
      .invoke("attr", "data-tip")
      .should("eq", testData.walletaddress);
  });

  it("Is able to comment", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-testid="text-area"]')
      .type("Initial Comment")
      .should("have.value", "Initial Comment");
    cy.get('[data-test="comment"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="comment_view"]')
      .filter(':contains("Initial Comment")')
      .log("comment check passed");
  });

  it("Is able to edit comment", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-test="comment_view"]')
      .filter(':contains("Initial Comment")')
      .then(() => {
        cy.get('[data-test="comment_options"]').click();
        cy.get('[data-test="edit_comment"]').click();
        cy.contains("Initial Comment").click().type("{moveToEnd}1");
        cy.get('[data-test="comment"]').first().click();
      });
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="comment_view"]')
      .filter(':contains("Initial Comment1")')
      .log("Comment editted");
  });

  it("Is able to delete comment", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-test="comment_view"]')
      .filter(':contains("Initial Comment1")')
      .then(() => {
        cy.get('[data-test="comment_options"]').click();
        cy.get('[data-test="delete_comment"]').click();
      });
    cy.get('[data-test="del_comment"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.log("Comment deleted");
  });

  it("Is able to rename issue title", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-test="edit_issue"]').click();
    cy.get('[name="title"]').click().type("{moveToEnd}1");
    cy.get('[data-test="save_issue"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
  });

  it("Is able to select label", () => {
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
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.get('[data-test="edit_labels"]').click();
    cy.wait(100);
    cy.get('[data-test="new_label"]').click();
    cy.wait(100);
    cy.get('[data-test="label_name"]')
      .click()
      .type("new")
      .should("have.value", "new");
    cy.wait(100);
    cy.get('[data-test="label_description"]')
      .click()
      .type("new label")
      .should("have.value", "new label");
    cy.wait(100);
    cy.get('[data-test="save_label"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get('[data-test="existing_labels"]').should(($labels) => {
      expect($labels).to.contain("new");
    });
    cy.go("back");
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.get('[data-test="select_label"]').should(($labels) => {
      expect($labels).to.contain("new");
    });
  });

  it("Is able to delete label", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.get('[data-test="edit_labels"]').click();
    cy.wait(100);
    cy.get('[data-test="label"]')
      .filter(':contains("new")')
      .within(() => {
        cy.get('[data-test="delete_label"]').click();
        cy.get('[data-test="del_label"]').click();
      });
    cy.unlock(testData.walletpass);
    cy.wait(8000);
    cy.get('[data-test="existing_labels"]').should(($labels) => {
      expect($labels).to.not.contain("new");
    });
    cy.go("back");
    cy.get('[data-test="labels"]').click();
    cy.wait(100);
    cy.get('[data-test="select_label"]').should(($labels) => {
      expect($labels).to.not.contain("new");
    });
  });

  it("Is able to create bounty", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.wait(1500);
    cy.get('[data-test="bounty_tab"]').click();
    cy.get('[data-test="new_bounty"]').should("has.text", "NEW BOUNTY").click();
    cy.wait(1000);
    cy.get('[data-test="select_token"]')
      .find("option")
      .eq(1)
      .invoke("val")
      .then((value) => {
        cy.get('[data-test="select_token"]').select(value);
      });
    cy.get('[data-type="amount_entered"]')
      .type("0.000002")
      .should("have.value", "0.000002");
    cy.get('[data-type="add_token"]').click();
    cy.dayjs().then((dayjsObj) => {
      const currentTime = dayjsObj;
      const time = currentTime.add(1, "day").format("YYYY-MM-DD");
      cy.get('input[data-type="expiry_date"]')
        .clear()
        .type(time)
        .should("have.value", time);
    });
    cy.get('[data-type="attach_bounty"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(10000);
    cy.get('[data-test="bounty-amount"]').should("contain", "0.000002");
  });

  it("Is able to extend bounty", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.wait(1500);
    cy.get('[data-test="bounty_tab"]').click();
    cy.get("[data-test=bounty_extend_button]").click();
    cy.dayjs().then((dayjsObj) => {
      const currentTime = dayjsObj;
      const time = currentTime.add(2, "day").format("YYYY-MM-DD");
      cy.get('input[data-test="extend_expiry_date"]')
        .clear()
        .type(time)
        .should("have.value", time);
    });
    cy.get('[data-test="extend_bounty"]').click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.dayjs().then((dayjsObj) => {
      const currentTime = dayjsObj;
      const time = currentTime.add(2, "day").format("MMM D, YYYY");
      cy.get('[data-test="bounty-expiry"]').should("contain", time);
    });
  });

  it("Is able to close bounty", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.wait(1500);
    cy.get('[data-test="bounty_tab"]').click();
    cy.get("[data-test=bounty_close_button]").click();
    cy.unlock(testData.walletpass);
    cy.wait(6000);
    cy.get("[data-test=bounty_reverted]").should("be.visible");
  });

  it("Is able to close issue", () => {
    cy.contains(`issue${testData.issueid}`).click();
    cy.wait(1500);
    cy.get('[data-test="close_issue"]')
      .should("has.text", "Close Issue")
      .click();
    cy.unlock(testData.walletpass);
    cy.wait(8000);
    cy.get('[data-test="close_issue"]').should("has.text", "Re-Open Issue");
  });

  it("Is able to reopen issue", () => {
    cy.get('[data-test="closed_issues"]').click();
    cy.contains(`issue${testData.issueid}`).click();
    cy.wait(1500);
    cy.get('[data-test="close_issue"]')
      .should("has.text", "Re-Open Issue")
      .click();
    cy.unlock(testData.walletpass);
    cy.wait(8000);
    cy.get('[data-test="close_issue"]').should("has.text", "Close Issue");
  });
});
