const AuthorityManagement = artifacts.require("./AuthorityManager.sol");

contract("AuthorityManager", accounts => {
  after("clean up...", () => {
    console.log("Cleaning up");
  });

  it("Account2 should be unable to propose a vote", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    try {
      await authorityManagementInstance.propose(1, accounts[2], {
        from: accounts[2]
      });
      assert.fail("Unauthorized account could set state");
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Account0 should be unable to vote on nonexistant proposal", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    try {
      await authorityManagementInstance.voteOnProposal(10, {
        from: accounts[0]
      });
      assert.fail("Could vote on nonexistant proposal");
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Account0 should be able to propose Account1 as authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    await authorityManagementInstance.propose(1, accounts[1], {
      from: accounts[0]
    });
    const proposalID = await authorityManagementInstance.getLastProposalSubmitted.call(
      accounts[0]
    );

    assert.equal(proposalID, 1);
  });

  it("Account1 should be able to claimAuthority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    await authorityManagementInstance.enactProposal(1, {
      from: accounts[1]
    });
    const account2IsAuthorized = await authorityManagementInstance.isAuthorized.call(
      accounts[1],
      { from: accounts[1] }
    );

    assert.ok(account2IsAuthorized);
  });

  it("Account1 should be unable to claimAuthority again", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    try {
      await authorityManagementInstance.enactProposal(1, {
        from: accounts[1]
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Account1 should be able to propose Account2 as authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    try {
      await authorityManagementInstance.propose(1, accounts[2], {
        from: accounts[1]
      });
      assert.ok(true);
    } catch (error) {
      assert.fail();
    }
  });

  it("Account2 should be unable to claim authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    try {
      await authorityManagementInstance.enactProposal(2, {
        from: accounts[2]
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Account0 should be able to vote on proposal for Account2 promotion", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    await authorityManagementInstance.voteOnProposal(2, { from: accounts[0] });
    try {
      await authorityManagementInstance.voteOnProposal(2, {
        from: accounts[0]
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Account2 should be able to claim authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    try {
      await authorityManagementInstance.enactProposal(2, { from: accounts[5] });
      assert.ok(true);
    } catch (error) {
      assert.fail();
    }
  });

  it("Account0 and 1 should be able to propose Account3 as authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    try {
      authorityManagementInstance.propose(1, accounts[3], {
        from: accounts[0]
      });
      authorityManagementInstance.voteOnProposal(3, { from: accounts[1] });
      assert.ok(true);
    } catch (error) {
      assert.fail();
    }
  });

  it("Account 1 and 2 should be able to remove Account0 as authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    await authorityManagementInstance.propose(2, accounts[0], {
      from: accounts[2]
    });
    await authorityManagementInstance.voteOnProposal(4, { from: accounts[1] });
    await authorityManagementInstance.enactProposal(4, { from: accounts[1] });
    try {
      await authorityManagementInstance.propose(2, accounts[2], {
        from: accounts[0]
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it("After Account0 is removed, Account3 should be unanble to claim authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    try {
      await authorityManagementInstance.enactProposal(3, { from: accounts[3] });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it("The number of authorities should be 2", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    const num = await authorityManagementInstance.getNumAuthorities.call();
    assert.equal(num, 2);
  });

  it("Account0 and 3 is not an authority. Account 1 and 2 is.", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    try {
      authorityManagementInstance.propose(2, accounts[3], {
        from: accounts[1]
      });
      authorityManagementInstance.propose(2, accounts[5], {
        from: accounts[2]
      });
    } catch (error) {
      assert.fail();
    }

    try {
      authorityManagementInstance.propose(2, accounts[5], {
        from: accounts[0]
      });
      authorityManagementInstance.propose(2, accounts[5], {
        from: accounts[3]
      });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });
});
