const LicenseProvider = artifacts.require("./LicenseProvider.sol");
const AuthorityManager = artifacts.require("./AuthorityManager.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

contract("LicenseProvider", accounts => {
  let authorityManagerInstance;
  let licenseProviderInstance;

  before(async () => {
    authorityManagerInstance = await AuthorityManager.deployed();
    licenseProviderInstance = await LicenseProvider.deployed();

    // Set up Account 0 and 1 as authorities
    await authorityManagerInstance.propose(1, accounts[1], {
      from: accounts[0]
    });
    await authorityManagerInstance.enactProposal(1, {
      from: accounts[1]
    });
  });

  it("Account2 can register themselves as a licenseIssuer", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.registerSenderAsIssuer({ from: accounts[2] })
    );
  });

  it("Account2 should not be a trusted licenseIssuer", async () => {
    const isTrusted = await licenseProviderInstance.isTrustedLicenseIssuer.call(
      accounts[2]
    );
    assert.isFalse(isTrusted);
  });

  it("Account1 should be able to trust Account2 as issuer", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.addTrustInLicenseIssuer(accounts[2], {
        from: accounts[1]
      })
    );
  });

  it("Account1 should be unable to trust Account3 as issuer (is not an issuer)", async () => {
    await truffleAssert.fails(
      licenseProviderInstance.addTrustInLicenseIssuer(accounts[3], {
        from: accounts[1]
      })
    );
  });

  it("Account2 should be a trusted licenseIssuer", async () => {
    const isTrusted = await licenseProviderInstance.isTrustedLicenseIssuer.call(
      accounts[2]
    );
    assert.ok(isTrusted);
  });

  it("Account2 should be able to issue license to Account5", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.issueLicenseToAddress(accounts[5], {
        from: accounts[2]
      })
    );
  });

  it("The license of account5 should not be trusted", async () => {
    const isTrusted = await licenseProviderInstance.isLicenseTrusted.call(
      accounts[5]
    );
    assert.isFalse(isTrusted);
  });

  it("Account3 should be able to register as a provider", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.registerProvider({ from: accounts[3] })
    );
  });

  it("Account0 should be able to trust Account3 as a provider", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.addTrustInProvider(accounts[3], {
        from: accounts[0]
      })
    );
  });

  it("Account5 should be able to propose registration of their license with Account3", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.proposeLicenseMovement(accounts[3], {
        from: accounts[5]
      })
    );
  });

  it("Account3 should be able to approve proposition to register license of Account5 with it", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.approveLicenseMovement(accounts[5], {
        from: accounts[3]
      })
    );
  });

  it("The issuer of Account5's license should be Account2", async () => {
    const isser = await licenseProviderInstance.getIsserOfLicense.call(
      accounts[5]
    );
    assert.equal(isser, accounts[2]);
  });

  it("Account2 should be a trusted licenseIssuer", async () => {
    const isTrusted = await licenseProviderInstance.isTrustedLicenseIssuer.call(
      accounts[2]
    );
    assert.ok(isTrusted);
  });

  it("The provider of Account5's license should be Account3", async () => {
    const provider = await licenseProviderInstance.getProviderForLicense.call(
      accounts[5]
    );
    assert.equal(provider, accounts[3]);
  });

  it("Account3 should be a trusted provider", async () => {
    const isTrusted = await licenseProviderInstance.isTrustedProvider.call(
      accounts[3]
    );
    assert.ok(isTrusted);
  });

  it("The license of account5 should be trusted", async () => {
    const isTrusted = await licenseProviderInstance.isLicenseTrusted.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  // Should a license issued by a revoked issuer still be ok? No, but it should be possbile for a new
  // License issuer to approve it.
  it("Account1 should be able to revoke trust of Account2 as issuer", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.removeTrustInLicenseIssuer(accounts[2], {
        from: accounts[1]
      })
    );
  });

  it("The license of account5 should not be trusted", async () => {
    const isTrusted = await licenseProviderInstance.isLicenseTrusted.call(
      accounts[5]
    );
    assert.isFalse(isTrusted);
  });

  it("Account6 can register themselves as a licenseIssuer", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.registerSenderAsIssuer({ from: accounts[6] })
    );
  });

  it("Account1 should be able to trust Account6 as issuer", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.addTrustInLicenseIssuer(accounts[6], {
        from: accounts[1]
      })
    );
  });

  it("Account5 should be able to propose to get their license approved by Account6", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.proposeMoveToLicenseIssuer(accounts[6], {
        from: accounts[5]
      })
    );
  });

  it("Account6 should be able approve poposal to approve the license of Account5", async () => {
    await truffleAssert.passes(
      licenseProviderInstance.approveMoveToLicenseIssuer(accounts[5], {
        from: accounts[6]
      })
    );
  });

  it("The license of account5 should be trusted", async () => {
    const isTrusted = await licenseProviderInstance.isLicenseTrusted.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });
});
