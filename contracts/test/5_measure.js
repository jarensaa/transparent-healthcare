const LicenseProvider = artifacts.require("./LicenseProvider.sol");
const AuthorityManager = artifacts.require("./AuthorityManager.sol");
const TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
const Treatment = artifacts.require("./Treatment.sol");
const Measure = artifacts.require("./Measure.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

const treatmentObjectMapper = (treatmentArray) => {
  return {
    approvingLicense: treatmentArray[0],
    treatmentProvider: treatmentArray[1],
    fullDataHash: treatmentArray[2],
    fullDataURL: treatmentArray[3],
    isSpent: treatmentArray[4],
  };
};

const measureObjectMapper = (measureArray) => {
  return {
    rating: measureArray[0],
    fullMeasureHash: measureArray[1],
    fullMeasureURL: measureArray[2],
  };
};

contract("Measure", (accounts) => {
  let authorityManagerInstance;
  let licenseProviderInstance;
  let treatmentProviderInstance;
  let treatmentInstance;
  let measureInstance;

  let treatment1Hash;
  let treatment2Hash;
  let treatmentURL;

  let measureHash;
  let measureURL;
  let measureRating;

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
        Account6: Measure Contract address 
        Account7: Address generated (off-chain, unlinkable) by patient for treatment1
        Account8: Address generated (off-chain, unlinkable) by another patient for treatment2
    */

    authorityManagerInstance = await AuthorityManager.deployed();
    licenseProviderInstance = await LicenseProvider.deployed();
    treatmentProviderInstance = await TreatmentProvider.deployed();
    treatmentInstance = await Treatment.deployed();
    measureInstance = await Measure.deployed();

    //Generate hashes and URLs
    treatment1Hash = web3.utils.randomHex(32);
    treatment2Hash = web3.utils.randomHex(32);
    treatmentURL = "https://treatments.provider5.com/treatments";

    measureHash = web3.utils.randomHex(32);
    measureURL = "https://measures.provider2.com/treatments";
    measureRating = 8;

    // Set up Account 0 and 1 as authorities
    await authorityManagerInstance.propose(1, accounts[1], {
      from: accounts[0],
    });
    await authorityManagerInstance.enactProposal(1, {
      from: accounts[1],
    });

    // Set up account 2 as treatment provider
    await treatmentProviderInstance.addSenderAsProvider({ from: accounts[2] });
    await treatmentProviderInstance.addTrustInProvider(accounts[2], {
      from: accounts[0],
    });

    // Set up account 3 as licenseIssuer
    await licenseProviderInstance.registerSenderAsIssuer({ from: accounts[3] });
    await licenseProviderInstance.addTrustInLicenseIssuer(accounts[3], {
      from: accounts[0],
    });

    // Set up account 4 as licenseProvider
    await licenseProviderInstance.registerProvider({ from: accounts[4] });
    await licenseProviderInstance.addTrustInProvider(accounts[4], {
      from: accounts[1],
    });

    // Issue license to Account5
    await licenseProviderInstance.issueLicenseToAddress(accounts[5], {
      from: accounts[3],
    });

    // Set account4 as trusted provider for license
    await licenseProviderInstance.proposeLicenseProviderMovement(accounts[4], {
      from: accounts[5],
    });

    await licenseProviderInstance.approveLicenseProviderMovement(accounts[5], {
      from: accounts[4],
    });

    //Create treatments and approce them by license
    await treatmentInstance.createTreatment(
      accounts[7],
      treatment1Hash,
      treatmentURL,
      { from: accounts[2] }
    );

    await treatmentInstance.approveTreatment(accounts[7], {
      from: accounts[5],
    });

    await treatmentInstance.createTreatment(
      accounts[8],
      treatment2Hash,
      treatmentURL,
      {
        from: accounts[2],
      }
    );

    await treatmentInstance.approveTreatment(accounts[8], {
      from: accounts[5],
    });
  });

  it("Treatment1 (Account7) should not be spent.", async () => {
    const treatmentArray = await treatmentInstance.getTreatmentData(
      accounts[7]
    );
    const treatmentObject = treatmentObjectMapper(treatmentArray);
    assert.isFalse(treatmentObject.isSpent);
  });

  it("Should be possible to create new measure for Account7", async () => {
    await truffleAssert.passes(
      measureInstance.createMeasure(measureRating, measureHash, measureURL, {
        from: accounts[7],
      })
    );
  });

  it("Treatment1 (Account7) should be spent.", async () => {
    const treatmentArray = await treatmentInstance.getTreatmentData(
      accounts[7]
    );
    const treatmentObject = treatmentObjectMapper(treatmentArray);
    assert.equal(treatmentObject.isSpent, true);
  });

  it("Should not be possible to create new measure for Account7", async () => {
    await truffleAssert.reverts(
      measureInstance.createMeasure(measureRating, measureHash, measureURL, {
        from: accounts[7],
      })
    );
  });

  it("Should not be possible to create new measure for Account9", async () => {
    await truffleAssert.reverts(
      measureInstance.createMeasure(measureRating, measureHash, measureURL, {
        from: accounts[9],
      })
    );
  });

  it("Should be possible to get info for measure", async () => {
    const measureArray = await measureInstance.getMeasureForTreatment(
      accounts[7]
    );
    const measureObject = measureObjectMapper(measureArray);

    assert.equal(measureObject.fullMeasureURL, measureURL);
  });
});
