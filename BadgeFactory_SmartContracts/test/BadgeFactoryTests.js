// Tests for deploying badgefactory
// multiple consoles simultaneously deployed
// access control on loyaltyconsole and campaigns
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { hardhatArguments } = require("hardhat");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("BadgeFactory", function () {
    // Fixture of BadgeFactory
    async function deployBadgeFactoryFixture() {
        // Get all default addresses
        const [factoryOwner, brand1, brand2, cust1, cust2, cust3] =
            await ethers.getSigners();

        // Prepare badgefactory
        const badgefactory = await ethers.getContractFactory("BadgeFactory");
        const badgefactory_addr = await badgefactory.deploy();
        // BadgeFactory & Deployer deployed here
        console.log(
            `BadgeFactory Deployed At: ${await badgefactory_addr.getAddress()}`
        );

        return {
            badgefactory_addr,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
            cust3,
        };
    }

    it("BadgeFactory is deployed, Anyone can register themselves", async function () {
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
        } = await loadFixture(deployBadgeFactoryFixture);

        // Owner of the badgefactory
        console.log(`BadgeFactory owner: ${await factoryOwner.getAddress()}`);
        // Register brand1 and brand2 as Entity
        await badgefactory_addr.connect(brand1).register(1); // Register as Entity
        await badgefactory_addr.connect(brand2).register(1);
        // Register customers
        await badgefactory_addr.connect(cust1).register(0);
        await badgefactory_addr.connect(cust2).register(0);
        await badgefactory_addr.connect(cust3).register(0);
        //console.log(await badgeFactory_contract.getAddress());
    });

    it("Should allow brand/business to deploy their LoyaltyConsole", async function () {
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
        } = await loadFixture(deployBadgeFactoryFixture);

        // Loyalty console related checks
    });
});
