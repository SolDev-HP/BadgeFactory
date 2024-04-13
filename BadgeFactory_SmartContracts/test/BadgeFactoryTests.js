// Tests for deploying badgefactory
// multiple consoles simultaneously deployed
// access control on loyaltyconsole and campaigns
// @todo : add tests related to campaign interactions after LoyaltyConsole is done
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
        // Now we need to deploy Campaigns [RewardPoints, Badges, Tickets, Codes] seperately
        // and then set their implementation addresses in badgefactory
        // No owner zone, clone will use their own state variables so we are just using implementation
        const rewardpointFactory = await ethers.getContractFactory(
            "RewardPoints"
        );
        const rewardpoints_campImpl = await rewardpointFactory.deploy();
        rewardpoints_campImpl.waitForDeployment();

        const badgesFactory = await ethers.getContractFactory("Badges");
        const badges_campImpl = await badgesFactory.deploy();
        badges_campImpl.waitForDeployment();

        const ticketsFactory = await ethers.getContractFactory("Tickets");
        const tickets_campImpl = await ticketsFactory.deploy();
        tickets_campImpl.waitForDeployment();

        const codesFactory = await ethers.getContractFactory("Codes");
        const codes_campImpl = await codesFactory.deploy();
        codes_campImpl.waitForDeployment();

        const badgefactory = await ethers.getContractFactory("BadgeFactory");
        const badgefactory_addr = await badgefactory.deploy();
        badgefactory_addr.waitForDeployment();

        // Four tx of setting campaign implementations for badgefactory
        // could've set constructor so that it accepts all this data, but I'll keep that for refactor @todo
        const tx1 = await badgefactory_addr.set_campaign_implementation(
            1,
            await rewardpoints_campImpl.getAddress()
        );
        const tx2 = await badgefactory_addr.set_campaign_implementation(
            2,
            await badges_campImpl.getAddress()
        );
        const tx3 = await badgefactory_addr.set_campaign_implementation(
            3,
            await tickets_campImpl.getAddress()
        );
        const tx4 = await badgefactory_addr.set_campaign_implementation(
            4,
            await codes_campImpl.getAddress()
        );
        // BadgeFactory & Deployer deployed here
        // console.log(
        //     `BadgeFactory Deployed At: ${await badgefactory_addr.getAddress()}`
        // );

        return {
            badgefactory_addr,
            rewardpoints_campImpl,
            badges_campImpl,
            tickets_campImpl,
            codes_campImpl,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
            cust3,
        };
        // Check IPFS active
    }

    it("BadgeFactory is deployed, Anyone can register themselves", async function () {
        // Load fixture here
        //-----------------
        const {
            badgefactory_addr,
            rewardpoints_campImpl,
            badges_campImpl,
            tickets_campImpl,
            codes_campImpl,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
            cust3,
        } = await loadFixture(deployBadgeFactoryFixture);

        // Owner of the badgefactory
        //console.log(`BadgeFactory owner: ${await factoryOwner.getAddress()}`);

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
        // It now requires us to upload following structure to ipfs -
        //  and pass that hash to start_campaign call -
        //  the function now requires (Campaign_Type, Campaign_Strct_Stored_at_ipfs_hash)
        // struct Campaign {
        //     uint256 _campaign_id;                // ID [TotalCampaignsDeployed+1] don't have this?
        //     bytes32 _campaign_name;              // 32 lettes name
        //     bytes32 _campaign_details;           // 32 letters details (Can change later)
        //     uint256 _campaign_type;              // campaign_type [1, 2, 3, 4]
        //     /*address _campaign_deployed_at;*/   // We have this in another var on loyaltyconsole
        //     bool _campaign_active;               // Set later?
        // }
    });
});
