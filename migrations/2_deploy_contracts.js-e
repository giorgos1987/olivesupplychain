var FarmerRole = artifacts.require("../contracts/base/ProducerRole.sol");
var DistributorRole = artifacts.require("../contracts/base/DistributorRole.sol");
var RetailerRole = artifacts.require("../contracts/base/RetailerRole.sol");
var CustomerRole = artifacts.require("../contracts/base/CustomerRole.sol");
var SupplyChain = artifacts.require("../contracts/base//SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FarmerRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(RetailerRole);
  deployer.deploy(CustomerRole);
  deployer.deploy(SupplyChain);
};
