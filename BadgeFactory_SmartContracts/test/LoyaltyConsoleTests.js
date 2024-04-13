// Tests for deploying LoyaltyConsole
// access control on campaigns
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { hardhatArguments } = require("hardhat");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("LoyaltyConsole", function () {
    // Fixture of LoyaltyConsole
    async function deployLoyaltyConsoleFixture() {
        // Get all default addresses
        const [factoryOwner, brand1, brand2, cust1, cust2] =
            await ethers.getSigners();

        // Prepare badgefactory
        const badgefactory = await ethers.getContractFactory("BadgeFactory");
        const badgefactory_addr = await badgefactory.deploy();
        // BadgeFactory & Deployer deployed here
        console.log(
            `BadgeFactory Deployed At: ${await badgefactory_addr.getAddress()}`
        );

        // Be a brand a try to deploy
        // Register as a brand
        await badgefactory_addr.connect(brand1).register(1);

        // Deploy a loyaltyconsole
        const loyaltyconsole = await ethers.getContractFactory(
            "LoyaltyConsole"
        );
        let loyaltyconsole_addr = await badgefactory_addr
            .connect(brand1)
            .deploy_console();
        await loyaltyconsole_addr.wait(1);
        //const loyaltyconsole_contract = loyaltyconsole.attach();
        console.log(
            `LoyaltyConsole deployed at: ${JSON.stringify(loyaltyconsole_addr)}`
        );

        return {
            badgefactory_addr,
            factoryOwner,
            loyaltyconsole,
            brand1,
            brand2,
            cust1,
            cust2,
        };
        // Check IPFS active
    }

    it("LoyaltyConsole is deployed by a brand/business/project", async function () {
        // Load fixture here
        //-----------------
        const {
            badgefactory_addr,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
            cust3,
        } = await loadFixture(deployLoyaltyConsoleFixture);
        //console.log(await badgeFactory_contract.getAddress());
    });
});
