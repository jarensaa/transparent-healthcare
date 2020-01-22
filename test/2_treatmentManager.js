const TreatmentProvider = artifacts.require("./TreatmentProvider.sol");
const AuthorityManager = artifacts.require("./AuthorityManager.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

/*
interface ITreatmentProviderManager {
    function addSenderAsProvider() external;
    function removeSenderAsProvider() external;
    function addTrustInProvider(address _address) external;
    function removeTrustInProvider(address _address) external;
    function isTrustedProvider(address _address) external view returns (bool);
    function isAuthorized(address _address) 
}
*/

contract("TreatmentManager", accounts => {
  let treatmentProviderInstance;
  let authorityManagerInstance;

  before(async () => {
    authorityManagerInstance = await AuthorityManager.deployed();
    treatmentProviderInstance = await TreatmentProvider.deployed();

    // Set up Account 0 and 1 as authorities
    await authorityManagerInstance.propose(1, accounts[1], {
      from: accounts[0]
    });
    await authorityManagerInstance.enactProposal(1, {
      from: accounts[1]
    });
  });

  it("Account0 is authorized", async () => {
    const isAuth = await treatmentProviderInstance.isAuthorized.call(
      accounts[0]
    );
    assert.ok(isAuth);
  });

  it("Account1 is authorized", async () => {
    const isAuth = await treatmentProviderInstance.isAuthorized.call(
      accounts[1]
    );
    assert.ok(isAuth);
  });

  it("Account5 can be added as provider", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.addSenderAsProvider({ from: accounts[5] })
    );
  });
});
