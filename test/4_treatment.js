const LicenseProvider = artifacts.require("./LicenseProvider.sol");
const AuthorityManager = artifacts.require("./AuthorityManager.sol");
const TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
const Treatment = artifacts.require("./Treatment.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

contract("Treatment", accounts => {
  let authorityManagerInstance;
  let licenseProviderInstance;
  let treatmentProviderInstance;

  let treatment1Hash;
  let treatment2Hash;
  let treatmentURL;
  let measureHash;
  let measureURL;

  before(async () => {
    /*
    Setup:
        Account0: ContractDeployer
        Account0: Initial authority
        Account1: Added authority
        Account2: TreatmentProvider
        Account3: LicenseIssuer
        Account4: LicenseProvider
        Account5: A license holder
        Account8: Mesure Contract address 

    During testing:
        Account6: Address generated (off-chain, unlinkable) by patient for treatment
        Account7: Address generated (off-chain, unlinkable) by another patient for treatment
    */

    authorityManagerInstance = await AuthorityManager.deployed();
    licenseProviderInstance = await LicenseProvider.deployed();
    treatmentProviderInstance = await TreatmentProvider.deployed();
    treatmentInstance = await Treatment.deployed();

    //Generate hashes and URLs
    treatment1Hash = web3.utils.randomHex(32);
    treatment2Hash = web3.utils.randomHex(32);
    treatmentURL = "https://treatments.provider5.com/treatments";

    measureHash = web3.utils.randomHex(32);
    measureURL = "https://measures.provider2.com/treatments";

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

  it("Should be impossible to register Account8 as measureContract for Account1", async () => {
    truffleAssert.reverts(
      treatmentInstance.registerMeasureContract(accounts[8], {
        from: accounts[1]
      })
    );
  });

  it("Should be possible to register Account8 as measureContract for Account0", async () => {
    truffleAssert.passes(
      treatmentInstance.registerMeasureContract(accounts[8], {
        from: accounts[0]
      })
    );
  });

  it("Should be impossible to reregister measureContract for Account0", async () => {
    truffleAssert.reverts(
      treatmentInstance.registerMeasureContract(accounts[9], {
        from: accounts[0]
      })
    );
  });

  it("Account5 should be a trusted license", async () => {
    const isTrusted = await licenseProviderInstance.isLicenseTrusted.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  it("Account2 should be a trusted treatment provider", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[2]
    );
    assert.ok(isTrusted);
  });

  it("Account2 (TreatmentProvider) should be able to create a treatment", async () => {
    truffleAssert.passes(
      treatmentInstance.createTreatment(
        accounts[6],
        treatment1Hash,
        treatmentURL,
        { from: accounts[2] }
      )
    );
  });

  it("Account5 (LicenseHolder) should be able to approve the first treatment", async () => {
    truffleAssert.passes(
      treatmentInstance.approveTreatment(accounts[6], { from: accounts[5] })
    );
  });

  it("Account2 (TreatmentProvider) should be able to create another treatment", async () => {
    truffleAssert.passes(
      treatmentInstance.createTreatment(
        accounts[7],
        treatment2Hash,
        treatmentURL,
        { from: accounts[2] }
      )
    );
  });

  it("Account5 (LicenseHolder) should be able to approve the second treatment", async () => {
    truffleAssert.passes(
      treatmentInstance.approveTreatment(accounts[6], { from: accounts[5] })
    );
  });

  it("The number of treatments registered to account5 (LicenseHolder) should be 2.", async () => {
    const treatmentAddresses = await treatmentInstance.getTreatmentsForLicense(
      accounts[5]
    );
    assert.equal(treatmentAddresses.length, 2);
  });

  it("It should be possible to fetch the URL and datahash of the first treatment though only knowing the lincenseAddress", async () => {
    const treatmentAddresses = await treatmentInstance.getTreatmentsForLicense(
      accounts[5]
    );
    const [
      approvingLicense,
      treatmentProvider,
      fullDataHash,
      fullDataURL,
      isSpent
    ] = await treatmentInstance.getTreatmentData(treatmentAddresses[0]);

    assert.equal(fullDataHash, treatment1Hash);
  });

  it("It should be possible to fetch the URL and datahash of the second treatment though only knowing the lincenseAddress", async () => {
    const treatmentAddresses = await treatmentInstance.getTreatmentsForLicense(
      accounts[5]
    );
    const [
      approvingLicense,
      treatmentProvider,
      fullDataHash,
      fullDataURL,
      isSpent
    ] = await treatmentInstance.getTreatmentData(treatmentAddresses[1]);

    assert.equal(fullDataHash, treatment2Hash);
  });

  it("Should be impossible to spend the first treatment (Account6) for Account9 (None)", async () => {
    truffleAssert.reverts(
      treatmentInstance.spendTreatment(accounts[6], { from: accounts[9] })
    );
  });

  it("Treatment1 (Account6) should not be spent.", async () => {
    const [
      approvingLicense,
      treatmentProvider,
      fullDataHash,
      fullDataURL,
      isSpent
    ] = await treatmentInstance.getTreatmentData(accounts[6]);

    assert.isFalse(isSpent);
  });

  it("Should be possible to spend the first treatment (Account6) for Account8 (MeasureContract)", async () => {
    truffleAssert.reverts(
      treatmentInstance.spendTreatment(accounts[6], { from: accounts[8] })
    );
  });

  it("Treatment1 (Account6) should be spent.", async () => {
    const [
      approvingLicense,
      treatmentProvider,
      fullDataHash,
      fullDataURL,
      isSpent
    ] = await treatmentInstance.getTreatmentData(accounts[6]);

    assert.ok(isSpent);
  });
});
