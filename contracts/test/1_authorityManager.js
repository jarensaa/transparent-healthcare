const AuthorityManagement = artifacts.require("./AuthorityManager.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

contract("AuthorityManager", accounts => {
  let authorityManagementInstance;

  before(async () => {
    authorityManagementInstance = await AuthorityManagement.deployed();
  });

  after("clean up...", () => {
    console.log("Cleaning up");
  });

  it("Account0 should be only authority", async () => {
    const authorities = await authorityManagementInstance.getAuthorities();
    assert.ok(authorities.includes(accounts[0]));
  });

  it("Account2 should be unable to propose a vote", async () => {
    await truffleAssert.fails(
      authorityManagementInstance.propose(1, accounts[2], {
        from: accounts[2]
      }),
      "Unauthorized"
    );
  });

  it("Account0 should be unable to vote on nonexistant proposal", async () => {
    await truffleAssert.reverts(
      authorityManagementInstance.voteOnProposal(10, {
        from: accounts[0]
      }),
      "Proposal does not exist or has been enacted"
    );
  });

  it("Account0 should be able to propose Account1 as authority", async () => {
    const result = await authorityManagementInstance.propose(1, accounts[1], {
      from: accounts[0]
    });
    truffleAssert.eventEmitted(result, "ProposalEvent");
  });

  it("Account1 should be able to claimAuthority", async () => {
    const result = await authorityManagementInstance.enactProposal(1, {
      from: accounts[1]
    });

    truffleAssert.eventEmitted(result, "NewAuthorityEvent");
  });

  it("Account0 and 1 should be all authorities", async () => {
    const authorities = await authorityManagementInstance.getAuthorities();
    assert.ok(
      authorities.includes(accounts[0]) && authorities.includes(accounts[1])
    );
  });

  it("Account1 should have authority", async () => {
    const account1IsAuthorized = await authorityManagementInstance.isAuthorized.call(
      accounts[1],
      { from: accounts[1] }
    );
    assert.ok(account1IsAuthorized);
  });

  it("Account1 should be unable to claimAuthority again", async () => {
    await truffleAssert.reverts(
      authorityManagementInstance.enactProposal(1, {
        from: accounts[1]
      }),
      "Proposal does not exist or has been enacted"
    );
  });

  it("Account1 should be able to propose Account2 as authority", async () => {
    await truffleAssert.passes(
      authorityManagementInstance.propose(1, accounts[2], {
        from: accounts[1]
      })
    );
  });

  it("Account2 should be unable to claim authority", async () => {
    await truffleAssert.reverts(
      authorityManagementInstance.enactProposal(2, {
        from: accounts[2]
      }),
      "Proposal does not have enough votes to be enacted"
    );
  });

  it("Account0 should be able to vote on proposal for Account2 promotion", async () => {
    const result = await authorityManagementInstance.voteOnProposal(2, {
      from: accounts[0]
    });

    truffleAssert.eventEmitted(result, "ProposalVoteEvent");
  });

  it("Account0 and 2 should be voters on proposal", async () => {
    const voters = await authorityManagementInstance.getProposal(2);

    assert.ok(
      voters[2].includes(accounts[0]) &&
        voters[2].includes(accounts[1]) &&
        voters[2].length == 2
    );
  });

  it("Account2 should be able to claim authority", async () => {
    const result = await authorityManagementInstance.enactProposal(2, {
      from: accounts[5]
    });

    truffleAssert.eventEmitted(result, "ProposalEnactedEvent");
  });

  it("Account0,1 and 2 should be all authorities", async () => {
    const authorities = await authorityManagementInstance.getAuthorities();
    assert.ok(
      authorities.includes(accounts[0]) &&
        authorities.includes(accounts[1]) &&
        authorities.includes(accounts[2])
    );
  });

  it("Account2 should have authority", async () => {
    const account2HasAuthority = await authorityManagementInstance.isAuthorized.call(
      accounts[2]
    );
    assert.ok(account2HasAuthority);
  });

  it("Account0 should be able to propose Account3 as authority", async () => {
    await truffleAssert.passes(
      authorityManagementInstance.propose(1, accounts[3], {
        from: accounts[0]
      })
    );
  });

  it("Account1 should be able to vote for Account3 proposal", async () => {
    await truffleAssert.passes(
      authorityManagementInstance.voteOnProposal(3, {
        from: accounts[1]
      })
    );
  });

  it("Account1 should be able to propose removal of Account0 as authority", async () => {
    await truffleAssert.passes(
      authorityManagementInstance.propose(2, accounts[0], {
        from: accounts[2]
      })
    );
  });

  it("The number of proposals should be 5", async () => {
    const proposals = await authorityManagementInstance.getProposalCount();
    assert.equal(proposals, 4);
  });

  it("Account2 should be able to vote on proposal for removal of Account0 as authority", async () => {
    await truffleAssert.passes(
      authorityManagementInstance.voteOnProposal(4, {
        from: accounts[1]
      })
    );
  });

  it("Account 1 should be able to enact on vote to remove Account0 as authority", async () => {
    const result = await authorityManagementInstance.enactProposal(4, {
      from: accounts[1]
    });

    truffleAssert.eventEmitted(result, "RemovedAuthorityEvent");
  });

  it("Account1 and 2 should be all authorities", async () => {
    const authorities = await authorityManagementInstance.getAuthorities();
    assert.ok(
      authorities.length == 2 &&
        authorities.includes(accounts[1]) &&
        authorities.includes(accounts[2])
    );
  });

  it("Account0 should not have authority", async () => {
    const account0HasAuthority = await authorityManagementInstance.isAuthorized.call(
      accounts[0]
    );
    assert.isFalse(account0HasAuthority);
  });

  it("After Account0 is removed, Account3 should be unanble to claim authority", async () => {
    await truffleAssert.reverts(
      authorityManagementInstance.enactProposal(3, { from: accounts[3] }),
      "Proposal does not have enough votes to be enacted"
    );
  });

  it("The number of authorities should be 2", async () => {
    const num = await authorityManagementInstance.getNumAuthorities.call();
    assert.equal(num, 2);
  });

  it("Account0 should not have authority", async () => {
    const hasAuth = await authorityManagementInstance.isAuthorized.call(
      accounts[0]
    );
    assert.isFalse(hasAuth);
  });

  it("Account1 should have authority", async () => {
    const hasAuth = await authorityManagementInstance.isAuthorized.call(
      accounts[1]
    );
    assert.ok(hasAuth);
  });

  it("Account2 should have authority", async () => {
    const hasAuth = await authorityManagementInstance.isAuthorized.call(
      accounts[2]
    );
    assert.ok(hasAuth);
  });

  it("Account3 should not have authority", async () => {
    const hasAuth = await authorityManagementInstance.isAuthorized.call(
      accounts[3]
    );
    assert.isFalse(hasAuth);
  });
});
