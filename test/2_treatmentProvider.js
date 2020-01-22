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

contract("TreatmentProvider", accounts => {
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

  it("Provider can be trusted by Account1", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.addTrustInProvider(accounts[5], {
        from: accounts[1]
      })
    );
  });

  it("Provider can not be trusted by Account2", async () => {
    await truffleAssert.reverts(
      treatmentProviderInstance.addTrustInProvider(accounts[5], {
        from: accounts[2]
      })
    );
  });

  it("Account1 cannot give trust to address which is not provider", async () => {
    await truffleAssert.reverts(
      treatmentProviderInstance.addTrustInProvider(accounts[3], {
        from: accounts[1]
      })
    );
  });

  it("Provider is trusted", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  it("Provider can be trusted by Account0", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.addTrustInProvider(accounts[5], {
        from: accounts[0]
      })
    );
  });

  it("Provider is trusted", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  it("Trust in Provider can be removed by Account1", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.removeTrustInProvider(accounts[5], {
        from: accounts[1]
      })
    );
  });

  it("Provider is trusted", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  it("Trust in Provider can be removed by Account0", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.removeTrustInProvider(accounts[5], {
        from: accounts[0]
      })
    );
  });

  it("Provider is not trusted", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[5]
    );
    assert.isFalse(isTrusted);
  });

  it("Provider can be re-trusted by Account0", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.addTrustInProvider(accounts[5], {
        from: accounts[0]
      })
    );
  });

  it("Provider is trusted", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[5]
    );
    assert.ok(isTrusted);
  });

  it("Trust in Provider can not removed by Account1", async () => {
    await truffleAssert.fails(
      treatmentProviderInstance.removeTrustInProvider(accounts[5], {
        from: accounts[1]
      })
    );
  });

  it("Account5 can remove themselves as provider", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.removeSenderAsProvider({ from: accounts[5] })
    );
  });

  it("Account5 can be added as provider again", async () => {
    await truffleAssert.passes(
      treatmentProviderInstance.addSenderAsProvider({ from: accounts[5] })
    );
  });

  it("Provider is not trusted", async () => {
    const isTrusted = await treatmentProviderInstance.isTrustedProvider.call(
      accounts[5]
    );
    assert.isFalse(isTrusted);
  });
});
