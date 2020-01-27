const LicenseProvider = artifacts.require("./LicenseProvider.sol");
const AuthorityManager = artifacts.require("./AuthorityManager.sol");
const TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

contract("Treatment", accounts => {
  let authorityManagerInstance;
  let licenseProviderInstance;
  let treatmentProviderInstance;

  before(async () => {
    /*
    Setup:
        Account0: Initial authority
        Account1: Added authority
        Account2: TreatmentProvider
        Account3: LicenseIssuer
        Account4: LicenseProvider
        Account5: A license holder

    During testing:
        Account6: Address generated (off-chain, unlinkable) by patient for treatment
    */

    authorityManagerInstance = await AuthorityManager.deployed();
    licenseProviderInstance = await LicenseProvider.deployed();
    treatmentProviderInstance = await TreatmentProvider.deployed();

    // Set up Account 0 and 1 as authorities
    await authorityManagerInstance.propose(1, accounts[1], {
      from: accounts[0]
    });
    await authorityManagerInstance.enactProposal(1, {
      from: accounts[1]
    });

    // Set up account 2 as treatment provider
    await treatmentProviderInstance.addSenderAsProvider({ from: accounts[2] });
    await treatmentProviderInstance.addTrustInProvider(accounts[2], {
      from: accounts[0]
    });

    // Set up account 3 as licenseIssuer
    await licenseProviderInstance.registerSenderAsIssuer({ from: accounts[3] });
    await licenseProviderInstance.addTrustInLicenseIssuer(accounts[3], {
      from: accounts[0]
    });

    // Set up account 4 as licenseProvider
    await licenseProviderInstance.registerProvider({ from: accounts[4] });
    await licenseProviderInstance.addTrustInProvider(accounts[4], {
      from: accounts[1]
    });

    // Issue license to Account5
    await licenseProviderInstance.issueLicenseToAddress(accounts[5], {
      from: accounts[3]
    });

    // Set account4 as trusted provider for license
    await licenseProviderInstance.proposeLicenseMovement(accounts[4], {
      from: accounts[5]
    });
    await licenseProviderInstance.approveLicenseMovement(accounts[5], {
      from: accounts[4]
    });
  });

  it("Account5 should be a trusted license", async () => {
    const isTrusted = await licenseProviderInstance.isLicenseTrusted.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  it("Accoutn2 should be a trusted treatment provider", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[2]
    );
    assert.ok(isTrusted);
  });
});
