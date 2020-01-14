const TreatmentManager = artifacts.require("./TreatmentManager.sol");
const assert = require("chai").assert;
const truffleAssert = require("truffle-assertions");

contract("TreatmentManager", accounts => {
  let treatmentManagerInstance;

  before(async () => {
    treatmentManagerInstance = await TreatmentManager.deployed();
  });

  it("Account0 is authorized", async () => {
    const isAuth = await treatmentManagerInstance.isAuthorized.call(
      accounts[0]
    );
    assert.ok(isAuth);
  });

  it("Account1 is not authorized", async () => {
    const isAuth = await treatmentManagerInstance.isAuthorized.call(
      accounts[1]
    );
    assert.isFalse(isAuth);
  });
});
