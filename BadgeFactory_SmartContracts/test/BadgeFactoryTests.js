// Tests for deploying badgefactory
// multiple consoles simultaneously deployed
// access control on loyaltyconsole and campaigns
const { expect } = require("chai");
const { hardhatArguments } = require("hardhat");
require("ethers");
require("hardhat");

describe("BadgeFactory", function () {
    it("BadgeFactory deployment and campaigns deployer deployment", async function () {
        // Owner of the badgefactory
        const [owner] = await ethers.getSigners();

        // Deploy badgefactory, it also deploys campaign deployer
        const badgeFactory_contract = await ethers.deployContract(
            "BadgeFactory"
        );
        await badgeFactory_contract.waitForDeployment();
        //console.log(badgeFactory_contract)

        // await expect(badgeFactory_contract).to.emit(
        //     await badgeFactory_contract.getAddress(),
        //     "DeployerAt"
        // );

        //console.log(await badgeFactory_contract.getAddress());
    });
});
