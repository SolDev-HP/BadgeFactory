// Tests for deploying LoyaltyConsole
// access control on campaigns
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { hardhatArguments } = require("hardhat");
const axios = require("axios");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("LoyaltyConsole", function () {
    // Fixture of LoyaltyConsole
    async function deployLoyaltyConsoleFixture() {
        // Get all default addresses
        const [factoryOwner, brand1, brand2, cust1, cust2] =
            await ethers.getSigners();

        // Setup campaign implementations
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

        // Prepare badgefactory
        const badgefactory = await ethers.deployContract("BadgeFactory");
        await badgefactory.waitForDeployment();

        // Four tx of setting campaign implementations for badgefactory
        // could've set constructor so that it accepts all this data, but I'll keep that for refactor @todo
        const tx1 = await badgefactory.set_campaign_implementation(
            1,
            await rewardpoints_campImpl.getAddress()
        );
        const tx2 = await badgefactory.set_campaign_implementation(
            2,
            await badges_campImpl.getAddress()
        );
        const tx3 = await badgefactory.set_campaign_implementation(
            3,
            await tickets_campImpl.getAddress()
        );
        const tx4 = await badgefactory.set_campaign_implementation(
            4,
            await codes_campImpl.getAddress()
        );

        // BadgeFactory & Deployer deployed here
        // console.log(
        //     `BadgeFactory Deployed At: ${await badgefactory.getAddress()}`
        // );
        // console.log(`Owner is: ${await factoryOwner.getAddress()}`);

        // Be a brand a try to deploy
        // Register as a brand
        await badgefactory.connect(brand1).register(1);

        // Deploy a loyaltyconsole
        // const loyaltyconsole = await ethers.getContractFactory(
        //     "LoyaltyConsole"
        // );
        const loyaltyconsole_tx = await badgefactory
            .connect(brand1)
            .deploy_console([1]); // Deploy console with only rewardpoints campaign supported
        await loyaltyconsole_tx.wait(1); // Let it deploy then we have the address of that campaign
        const brandaddress = await brand1.getAddress();
        const loyaltyConsoleAddress =
            await badgefactory._address_deployed_loyaltyConsoles_list(
                brandaddress,
                0 // Address, uint as it's a mapping to a list, we need to provide what's max
            );

        //console.log(`LoyaltyConsole deployed at: ${loyaltyConsoleAddress}`);
        //const loyaltyconsole_contract = loyaltyconsole.attach();
        // console.log(
        //     `LoyaltyConsole deployed at: ${JSON.stringify(loyaltyconsole_addr)}`
        // );

        return {
            badgefactory,
            rewardpoints_campImpl,
            badges_campImpl,
            tickets_campImpl,
            codes_campImpl,
            loyaltyConsoleAddress,
            factoryOwner,
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
            badgefactory,
            rewardpoints_campImpl,
            badges_campImpl,
            tickets_campImpl,
            codes_campImpl,
            loyaltyConsoleAddress,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
        } = await loadFixture(deployLoyaltyConsoleFixture);
        //console.log(await badgeFactory_contract.getAddress());

        // This is where we create our ipfs, upload and get the hash,
        // pass that hash to create_campaign() function on loyaltyconsole
        let consoleFactory = await ethers.getContractFactory("LoyaltyConsole");
        const consoleContract = consoleFactory.attach(loyaltyConsoleAddress);

        // No. of deployed campaign should be 0 at this time
        const totalCampaigns = await consoleContract._total_campaigns();
        expect(totalCampaigns).to.equal(0);
    });

    // It allows deployment of new campaign
    it("Should allow deployment of new campaign, store campaign details on ipfs, validate storage", async function () {
        // Prepare fixture
        const {
            badgefactory,
            rewardpoints_campImpl,
            badges_campImpl,
            tickets_campImpl,
            codes_campImpl,
            loyaltyConsoleAddress,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
        } = await loadFixture(deployLoyaltyConsoleFixture);

        // This is where we create our ipfs, upload and get the hash,
        // pass that hash to create_campaign() function on loyaltyconsole
        let consoleFactory = await ethers.getContractFactory("LoyaltyConsole");
        const consoleContract = consoleFactory.attach(loyaltyConsoleAddress);

        // No. of deployed campaign should be 0 at this time
        // Validate increase after deploying the campaign
        const totalCampaigns = await consoleContract._total_campaigns();
        expect(totalCampaigns).to.equal(0);
        // Prepare a console details structure
        // struct Campaign {
        //     uint256 _campaign_id;                // ID [TotalCampaignsDeployed+1] don't have this?
        //     bytes32 _campaign_name;              // 32 lettes name (becuase bytes32, extended can be bytes if needed)
        //     bytes32 _campaign_details;           // 32 letters details (Can change later)
        //     uint256 _campaign_type;              // campaign_type [1, 2, 3, 4]
        //     bool _campaign_active;               // Set later?
        // }

        // Next I'll add time stamps of starting and ending campaign, not all campaigns remain active forever,
        //   Entity should be able to end campaign whenever, and should emit CampaignChanged event with relevant
        //   information - this is only if we need to inform customer with a notification

        const campaignDetails = {
            _campaign_id: Number(totalCampaigns), //ethers.formatUnits(totalCampaigns),
            _campaign_name: "XtraRewards",
            _campaign_details: "Reward points for Xtra",
            _campaign_type: 1, // This can be bytes if we want string
            _campaign_active: true,
        };

        // create json struct of var
        const jsonform = JSON.stringify(campaignDetails);
        const file_type_blob = new Blob([jsonform], {
            type: "application/json",
        });
        const inmemfile = new File([file_type_blob], "campaign_details.json");

        // Put this to ipfs and get hash
        const ipfs_link = process.env.IPFS_RPC;
        // Request
        const form_data = new FormData();
        form_data.append("file", inmemfile); // Pass created inmem file
        const hash_of_campaignDetails = await axios
            .post("http://127.0.0.1:5001/api/v0/add", form_data, {
                headers: {
                    "Content-Disposition": "form-data",
                    // name: "campaign_details",
                    // filename: "campaign_details.json",
                    "Content-Type": "application/octet-stream",
                },
            })
            .then((resp) => {
                return resp["data"]["Hash"];
            });
        // Hash received
        // console.log(`CampaignDetails Hash: ${hash_of_campaignDetails}`);

        // Now, validate hash with created campaign structure
        const campaign_from_ipfs = await axios.get(
            ipfs_link + hash_of_campaignDetails
        );
        // Validate campaignData on ipfs
        //console.log(campaign_from_ipfs["data"]);

        expect(JSON.stringify(campaign_from_ipfs["data"])).to.equal(
            JSON.stringify(campaignDetails)
        );

        // Deploy rewards points campaign with ipfs hash

        // Only console owners can start campaign, so brand1 is needed here
        await expect(
            consoleContract.start_campaign(
                1,
                new TextEncoder().encode(hash_of_campaignDetails)
            )
        ).to.be.revertedWith("EntityOnly");

        const campaign_start = await consoleContract
            .connect(brand1)
            .start_campaign(
                1,
                new TextEncoder().encode(hash_of_campaignDetails)
            );

        await campaign_start.wait(1);
        //console.log(campaign_start);
        // Total number of campaigns should increase after this
        const totalCampaignsNow = await consoleContract._total_campaigns();
        expect(Number(totalCampaignsNow)).to.equal(1);
        // And total of 1 rewards points campaign deployed as of now, validate
        const totalPointsCampNow =
            await consoleContract._total_points_campaigns();
        expect(Number(totalPointsCampNow)).to.equal(1);

        // IT wont let it start other types though (badges, tickets, codes)
        await expect(
            consoleContract
                .connect(brand1)
                .start_campaign(
                    2,
                    new TextEncoder().encode(hash_of_campaignDetails)
                )
        ).to.be.revertedWith("CampNotSupported");
        await expect(
            consoleContract
                .connect(brand1)
                .start_campaign(
                    3,
                    new TextEncoder().encode(hash_of_campaignDetails)
                )
        ).to.be.revertedWith("CampNotSupported");
        await expect(
            consoleContract
                .connect(brand1)
                .start_campaign(
                    4,
                    new TextEncoder().encode(hash_of_campaignDetails)
                )
        ).to.be.revertedWith("CampNotSupported");

        // Only one campaign type supported
        const numberOfSupportedCampaigns =
            await consoleContract.total_supported_campaigns();
        expect(Number(numberOfSupportedCampaigns)).to.equal(1);
    });

    // It should allow deployment of only supported campaigns
    it("Should allow deployment of only supported campaigns", async function () {
        // Prepare fixture
        const {
            badgefactory,
            rewardpoints_campImpl,
            badges_campImpl,
            tickets_campImpl,
            codes_campImpl,
            loyaltyConsoleAddress,
            factoryOwner,
            brand1,
            brand2,
            cust1,
            cust2,
        } = await loadFixture(deployLoyaltyConsoleFixture);

        // We create this console with support for [RewardPoints, Badges, Tickets]
        const loyaltyconsole_tx = await badgefactory
            .connect(brand1)
            .deploy_console([1, 2, 3]); // Deploy console with only rewardpoints campaign supported
        await loyaltyconsole_tx.wait(1); // Let it deploy then we have the address of that campaign
        const brandaddress = await brand1.getAddress();
        const loyaltyConsoleAddress2 =
            await badgefactory._address_deployed_loyaltyConsoles_list(
                brandaddress,
                1 // Address, uint as it's a mapping to a list, we need to provide what's max
                // address[0] is already deployed in fixture so it's 2nd element in index
            );
        let consoleFactory = await ethers.getContractFactory("LoyaltyConsole");
        const consoleContract = consoleFactory.attach(loyaltyConsoleAddress2);
        // No. of deployed campaign should be 0 at this time
        // Validate increase after deploying the campaign
        let totalCampaigns = await consoleContract._total_campaigns();
        expect(totalCampaigns).to.equal(0);

        // Now we deploy it
        const campaignDetails_RewardPoints = {
            _campaign_id: Number(totalCampaigns), //ethers.formatUnits(totalCampaigns),
            _campaign_name: "XtraRewards",
            _campaign_details: "Reward points for Xtra",
            _campaign_type: 1, // This can be bytes if we want string
            _campaign_active: true,
        };

        const campaignDetails_Badges = {
            _campaign_id: Number(totalCampaigns) + 1, //ethers.formatUnits(totalCampaigns),
            _campaign_name: "XtraRewards",
            _campaign_details: "Reward points for Xtra",
            _campaign_type: 2, // This can be bytes if we want string
            _campaign_active: true,
        };

        const campaignDetails_Tickets = {
            _campaign_id: Number(totalCampaigns) + 2, //ethers.formatUnits(totalCampaigns),
            _campaign_name: "XtraRewards",
            _campaign_details: "Reward points for Xtra",
            _campaign_type: 3, // This can be bytes if we want string
            _campaign_active: true,
        };

        // create json struct of var
        const json_rewardpoints = JSON.stringify(campaignDetails_RewardPoints);
        const json_badges = JSON.stringify(campaignDetails_Badges);
        const json_tickets = JSON.stringify(campaignDetails_Tickets);

        const file_rewardpoints = new Blob([json_rewardpoints], {
            type: "application/json",
        });
        const file_badges = new Blob([json_badges], {
            type: "application/json",
        });
        const file_tickets = new Blob([json_tickets], {
            type: "application/json",
        });

        // Now prepare all three files, so we can deploy each campaign seperately
        // validate that Codes campaign is not supported in this loyaltyConsole
        const inmemfile1 = new File(
            [file_rewardpoints],
            "campaign_details.json"
        );
        const inmemfile2 = new File([file_badges], "campaign_badges.json");
        const inmemfile3 = new File([file_tickets], "campaign_tickets.json");

        // Put this to ipfs and get hash
        const ipfs_link = process.env.IPFS_RPC;
        // Request
        const form_data = new FormData();
        form_data.append("file", inmemfile1); // Pass created inmem file
        const hash_of_campaignDetails = await axios
            .post("http://127.0.0.1:5001/api/v0/add", form_data, {
                headers: {
                    "Content-Disposition": "form-data",
                    "Content-Type": "application/octet-stream",
                },
            })
            .then((resp) => {
                return resp["data"]["Hash"];
            });

        // Now, validate hash with created campaign structure
        const campaign_from_ipfs = await axios.get(
            ipfs_link + hash_of_campaignDetails
        );
        // Validate campaignData on ipfs
        //console.log(campaign_from_ipfs["data"]);

        expect(JSON.stringify(campaign_from_ipfs["data"])).to.equal(
            JSON.stringify(campaignDetails_RewardPoints)
        );

        // Deploy rewards points campaign with ipfs hash

        // Only console owners can start campaign, so brand1 is needed here
        await expect(
            consoleContract.start_campaign(
                1,
                new TextEncoder().encode(hash_of_campaignDetails)
            )
        ).to.be.revertedWith("EntityOnly");

        const campaign_start = await consoleContract
            .connect(brand1)
            .start_campaign(
                1,
                new TextEncoder().encode(hash_of_campaignDetails)
            );

        await campaign_start.wait(1);
        // Total number of campaigns should increase after this
        const totalCampaignsNow = await consoleContract._total_campaigns();
        expect(Number(totalCampaignsNow)).to.equal(1);

        // Expect total supported campaign types to be 3
        const totalCampaignsSupported =
            await consoleContract.total_supported_campaigns();
        expect(Number(totalCampaignsSupported)).to.equal(3);

        // try to create new campaign_types and add them onto ipfs
        // how do you read them and what do they represent

        // Get deployed campaign 1 here, and perform ops
    });
    // Next tests
    // interact_rewardpoints - subscribe a customer to a campaign
    //      customer_details - [phone number, email, qrcode(todo), address]
    // interact_rewardpoints - Reward customer with points
    // interact_rewardpoints - Customer redeems their points for a purchase (init at brand/business front)
});
