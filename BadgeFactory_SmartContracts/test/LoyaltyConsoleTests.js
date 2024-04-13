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
        const badgefactory = await ethers.deployContract("BadgeFactory");
        await badgefactory.waitForDeployment();
        // BadgeFactory & Deployer deployed here
        console.log(
            `BadgeFactory Deployed At: ${await badgefactory.getAddress()}`
        );
        console.log(`Owner is: ${await factoryOwner.getAddress()}`);

        // Be a brand a try to deploy
        // Register as a brand
        await badgefactory.connect(brand1).register(1);

        // Deploy a loyaltyconsole
        // const loyaltyconsole = await ethers.getContractFactory(
        //     "LoyaltyConsole"
        // );
        const loyaltyconsole_tx = await badgefactory
            .connect(brand1)
            .deploy_console();
        await loyaltyconsole_tx.wait(1); // Let it deploy then we have the address of that campaign
        const brandaddress = await brand1.getAddress();
        const getAddress =
            await badgefactory._address_deployed_loyaltyConsoles_list(
                brandaddress,
                0 // Address, uint as it's a mapping to a list, we need to provide what's max
            );

        console.log(`LoyaltyConsole deployed at: ${getAddress}`);
        //const loyaltyconsole_contract = loyaltyconsole.attach();
        // console.log(
        //     `LoyaltyConsole deployed at: ${JSON.stringify(loyaltyconsole_addr)}`
        // );

        return {
            badgefactory,
            factoryOwner,
            getAddress,
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
