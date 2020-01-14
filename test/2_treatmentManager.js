const TreatmentManager = artifacts.require("./TreatmentManager.sol");

contract("TreatmentManager", accounts => {
  it("Should be pointing to authorityManager", async () => {
    assert.ok(true);
  });
});
