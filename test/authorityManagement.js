const AuthorityManagement = artifacts.require("./AuthorityManagement.sol");

contract("AuthorityManagement", accounts => {
  it("Account0 should be able to set value", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    await authorityManagementInstance.set(100, { from: accounts[0] });

    const storedData = await authorityManagementInstance.get.call();

    assert.equal(storedData, 100, "The value 100 was not stored.");
  });

  it("Account3 should be unable to set value", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    try {
      await authorityManagementInstance.set(200, { from: accounts[3] });
      assert.fail("Unauthorized account could set state");
    } catch (error) {
      assert.equal(error.reason, "Unauthorized");
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

  it("Account0 should be able to vote on proposal for Account2", async () => {
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

  it("Account 1 and 2 should be able to remove Account0 as authority", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    await authorityManagementInstance.enactProposal(2, { from: accounts[5] });
    await authorityManagementInstance.propose(2, accounts[0], {
      from: accounts[2]
    });
    await authorityManagementInstance.voteOnProposal(3, { from: accounts[1] });
    await authorityManagementInstance.enactProposal(3, { from: accounts[1] });
    try {
      await authorityManagementInstance.set(50, { from: accounts[0] });
      assert.fail();
    } catch (error) {
      assert.ok(true);
    }
  });

  it("Account2 should be able to set value", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();

    await authorityManagementInstance.set(200, { from: accounts[2] });

    const storedData = await authorityManagementInstance.get.call();

    assert.equal(storedData, 200, "The value 200 was not stored.");
  });

  it("The number of authorities should be 2", async () => {
    const authorityManagementInstance = await AuthorityManagement.deployed();
    const num = await authorityManagementInstance.getNumAuthorities.call();
    assert.equal(num, 2);
  });
});
