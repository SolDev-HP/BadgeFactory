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
        const totalCampaigns = await consoleContract.total_campaigns();
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
        const totalCampaigns = await consoleContract.total_campaigns();
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

        const campaign_type = 1;
        const campaign_start = await consoleContract
            .connect(brand1)
            .start_campaign(
                campaign_type,
                new TextEncoder().encode(hash_of_campaignDetails)
            );

        await campaign_start.wait(1);
        //console.log(campaign_start);
        // Total number of campaigns should increase after this
        const totalCampaignsNow = await consoleContract.total_campaigns();
        expect(Number(totalCampaignsNow)).to.equal(1);
        // And total of 1 rewards points campaign deployed as of now, validate
        const totalPointsCampNow =
            await consoleContract.campaign_type_to_deploy_count(campaign_type);
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
    it("Should allow deployment of only supported campaigns, all campaigns are deployable if they are supported", async function () {
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
        let totalCampaigns = await consoleContract.total_campaigns();
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
            _campaign_name: "Anything Badges",
            _campaign_details: "These are anything badges",
            _campaign_type: 2, // This can be bytes if we want string
            _campaign_active: true,
            _badges_url: "https://google.com/icon.svg",
        };

        const campaignDetails_Tickets = {
            _campaign_id: Number(totalCampaigns) + 2, //ethers.formatUnits(totalCampaigns),
            _campaign_name: "XtraRewards",
            _campaign_details: "Reward points for Xtra",
            _campaign_type: 3, // This can be bytes if we want string
            _campaign_active: true,
            _tickets_expiry: 1902481752, //expiry in timestamp
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

        form_data.append("file1", inmemfile1); // Pass created inmem file
        form_data.append("file2", inmemfile2);
        form_data.append("file3", inmemfile3);
        const hash_of_campaigns = await axios
            .post("http://127.0.0.1:5001/api/v0/add", form_data, {
                headers: {
                    "Content-Disposition": "form-data",
                    "Content-Type": "application/octet-stream",
                },
            })
            .then((resp) => {
                // returned hash are in this formate
                // {name,hash,size}{name,hash,size}
                // to covert this into json, we need a comma between } and {
                // this regex replacer does that and returns data in json format
                const regex = /(?<=})[^\w]*{/g;
                let data = resp["data"].replace(regex, ",{");
                return JSON.parse("[" + data + "]");
            });

        // Now, validate hash with created campaign structure
        const campaign_from_ipfs1_points = await axios.get(
            ipfs_link + hash_of_campaigns[0]["Hash"]
        );
        const campaign_from_ipfs2_badges = await axios.get(
            ipfs_link + hash_of_campaigns[1]["Hash"]
        );
        const campaign_from_ipfs3_tickets = await axios.get(
            ipfs_link + hash_of_campaigns[2]["Hash"]
        );

        // Validate campaignData on ipfs
        //console.log(campaign_from_ipfs["data"]);

        expect(JSON.stringify(campaign_from_ipfs1_points["data"])).to.equal(
            JSON.stringify(campaignDetails_RewardPoints)
        );
        expect(JSON.stringify(campaign_from_ipfs2_badges["data"])).to.equal(
            JSON.stringify(campaignDetails_Badges)
        );
        expect(JSON.stringify(campaign_from_ipfs3_tickets["data"])).to.equal(
            JSON.stringify(campaignDetails_Tickets)
        );

        // Deploy rewards points campaign with ipfs hash

        // Only console owners can start campaign, so brand1 is needed here
        await expect(
            consoleContract.start_campaign(
                1,
                new TextEncoder().encode(hash_of_campaigns[0]["Hash"])
            )
        ).to.be.revertedWith("EntityOnly");

        const campaign_start = await consoleContract
            .connect(brand1)
            .start_campaign(
                1,
                new TextEncoder().encode(hash_of_campaigns[0]["Hash"])
            );

        await campaign_start.wait(1);
        // Total number of campaigns should increase after this
        let totalCampaignsNow = await consoleContract.total_campaigns();
        expect(Number(totalCampaignsNow)).to.equal(1);

        const campaign_start_badges = await consoleContract
            .connect(brand1)
            .start_campaign(
                2,
                new TextEncoder().encode(hash_of_campaigns[1]["Hash"])
            );

        await campaign_start_badges.wait(1);
        // Total number of campaigns should increase after this
        totalCampaignsNow = await consoleContract.total_campaigns();
        expect(Number(totalCampaignsNow)).to.equal(2);

        const campaign_start_tickets = await consoleContract
            .connect(brand1)
            .start_campaign(
                3,
                new TextEncoder().encode(hash_of_campaigns[2]["Hash"])
            );

        await campaign_start_tickets.wait(1);
        // Total number of campaigns should increase after this
        totalCampaignsNow = await consoleContract.total_campaigns();
        expect(Number(totalCampaignsNow)).to.equal(3);

        // This should fail
        await expect(
            consoleContract.connect(brand1).start_campaign(
                4, // Campaign type 4 - coupon codes - not supported
                new TextEncoder().encode(hash_of_campaigns[2]["Hash"]) //reuse details hash
            )
        ).to.be.revertedWith("CampNotSupported");

        // Expect total supported campaign types to be 3
        const totalCampaignsSupported =
            await consoleContract.total_supported_campaigns();
        expect(Number(totalCampaignsSupported)).to.equal(3);

        // Get deployed campaign 1 here, and perform ops
        // const rewardpoints_address =
        //     await consoleContract._campaign_type_to_list_of_deployed(1, 0); // get first contract in the list for now, it's the first campaign of reward points

        // let rewardpoints_contractfactory = await ethers.getContractFactory(
        //     "CampaignBase"
        // );
        // const rewardpoints_contract =
        //     rewardpoints_contractfactory.attach(rewardpoints_address);

        // // Cust 1 gets registered on loyaltyconsole
        // let cust1_register_tx = await consoleContract
        //     .connect(brand1)
        //     .subscribe_to_loyalty_system(await cust1.getAddress());

        // await cust1_register_tx.wait(1);

        // // Give this customer 10000 reward points as welcome bonus
        // // Customer is registered on loyalty console, but not on rewards system, observe
        // let cust1_address = await cust1.getAddress();
        // let give_reward_bonus = await consoleContract
        //     .connect(brand1)
        //     .interact_rewardpoints(
        //         cust1_address, // give rewards points to this customer
        //         10000, // amount of reward points
        //         1, // what campaign type is this
        //         1 // is allocation? Entity -> Customer
        //     );
        // await give_reward_bonus.wait(1);
        // // validate customer has this balance 10000 in reward points
        // let rpFactory = await ethers.getContractFactory("RewardPoints");
        // let rpContract = rpFactory.attach(rewardpoints_address);
        // await expect(
        //     await rpContract.connect(cust1).get_self_points(cust1_address)
        // ).to.be.equal(10000); // Customer balance is updated

        /// Validates that each campaign is a different type by calling
        /// base contract function overridden in all with their custom
        /// values, if need to see it uncomment fact1, fact2, fact3 logging

        // const val = await consoleContract._campaign_type_to_list_of_deployed(
        //     1,
        //     0
        // );
        // const val2 = await consoleContract._campaign_type_to_list_of_deployed(
        //     2,
        //     0
        // );
        // const val3 = await consoleContract._campaign_type_to_list_of_deployed(
        //     3,
        //     0
        // );
        // let fact1 = await ethers.getContractFactory("CampaignBase");
        // const fact1con = fact1.attach(val);
        // console.log(await fact1con.get_campaign_type_and_details());
        // console.log(val);

        // let fact2 = await ethers.getContractFactory("CampaignBase");
        // const fact2con = fact2.attach(val2);
        // console.log(await fact2con.get_campaign_type_and_details());
        // console.log(val2);

        // let fact3 = await ethers.getContractFactory("CampaignBase");
        // const fact3con = fact3.attach(val3);
        // console.log(await fact3con.get_campaign_type_and_details());
        // console.log(val3);

        /**
        {
            // Checkup
            // factory address
            const factroyaddress = await consoleContract._factory();
            console.log(`Factory address: ${factroyaddress}`);
            console.log(`BadgeFactory address: ${await badgefactory.getAddress()}`);
            //_campaign_type_to_implementation
            const rewards_impl_at =
                await consoleContract._campaign_type_to_implementation(1);
            const badges_impl_at =
                await consoleContract._campaign_type_to_implementation(2);
            const tickets_impl_at =
                await consoleContract._campaign_type_to_implementation(3);
            const codes_impl_at =
                await consoleContract._campaign_type_to_implementation(4); // is unset becuase not supported

            console.log(`--- impl deployed at
                Rewards(Impl): ${rewards_impl_at}
                Badges(Impl): ${badges_impl_at}
                Tickets(Impl): ${tickets_impl_at}
                Codes(Impl): ${codes_impl_at}`);

            console.log(`--- Passed in (validation)
                Rewards(on factory): ${await rewardpoints_campImpl.getAddress()},
                Badges (factory): ${await badges_campImpl.getAddress()},
                Tickets (factory): ${await tickets_campImpl.getAddress()},
                Codes (factory): ${await codes_campImpl.getAddress()}
            `);
            // _campaign_type_to_list_of_deployed
            // rewards' first
            const reward1_camp_at =
                await consoleContract._campaign_type_to_list_of_deployed(1, 0);

            console.log(`--- cloned campaigns
            Reward1 Campaign at: ${reward1_camp_at}`);
        }
        */
    });
    // Next tests
    // interact_rewardpoints - subscribe a customer to a campaign
    // interact_rewardpoints - Reward customer with points
    it("Should allow Entity to deploy reward points campaign, Entity can subscribe customers for their loyalty system, Customer gain reward points", async function () {
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

        // Get loyalty console contract
        let loyaltyConsoleFactory = await ethers.getContractFactory(
            "LoyaltyConsole"
        );
        const loyaltyConsoleContract = loyaltyConsoleFactory.attach(
            loyaltyConsoleAddress
        );

        // Brand1 Deploys their Loyalty Console ------------------------------
        // Deploy reward points
        let deploy_rp_tx = await loyaltyConsoleContract
            .connect(brand1)
            .start_campaign(1, new TextEncoder().encode(0)); // Sending details as 0, nothing for now, just to test
        await deploy_rp_tx.wait(1);

        // If campaign starts, get the campaign address from loyalty console
        let rp_contract_address =
            await loyaltyConsoleContract._campaign_type_to_list_of_deployed(
                1,
                0
            ); // Deployed type 1 - reward points, deployed position first (we deployed that above in start_campaign())
        //console.log(`RewardPointsAddress: ${rp_contract_address}`);

        let rewardpoints_contractfactory = await ethers.getContractFactory(
            "RewardPoints"
        );
        const rewardpoints_contract =
            rewardpoints_contractfactory.attach(rp_contract_address);

        // Cust 1 gets registered on loyaltyconsole
        let cust1_register_tx = await loyaltyConsoleContract
            .connect(brand1)
            .subscribe_to_loyalty_system(await cust1.getAddress());

        await cust1_register_tx.wait(1);

        let cust1_address = await cust1.getAddress();
        // validate customer has 0 points before moving forward
        // validate customer has this balance 10000 in reward points
        await expect(
            await rewardpoints_contract
                .connect(cust1)
                .get_self_points(cust1_address)
        ).to.be.equal(0); // Customer balance is updated
        // Give this customer 10000 reward points as welcome bonus
        // Customer is registered on loyalty console, but not on rewards system, observe
        let give_reward_bonus = await loyaltyConsoleContract
            .connect(brand1)
            .interact_rewardpoints(
                cust1_address, // give rewards points to this customer
                10000, // amount of reward points
                1, // what campaign type is this
                1 // is allocation? Entity -> Customer
            );
        await give_reward_bonus.wait(1);
        // validate customer has this balance 10000 in reward points
        await expect(
            await rewardpoints_contract
                .connect(cust1)
                .get_self_points(cust1_address)
        ).to.be.equal(10000); // Customer balance is updated
    });
    //      customer_details - [phone number, email, qrcode(todo), address]

    // interact_rewardpoints - Customer redeems their points for a purchase (init at brand/business front)
    it("Should allow Entity to redeem customer's reward points upon their interaction (i.e. purchase, interaction, visit, anything deemed reward worthy)", async function () {
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

        // Steps
        // register customer to loyalty console
        //// get loyalty console contract - owner brand1
        let console_factory = await ethers.getContractFactory("LoyaltyConsole");
        const consoleContract = console_factory.attach(loyaltyConsoleAddress);

        let cust1_address = await cust1.getAddress();
        let cust1_sub_tx = await consoleContract
            .connect(brand1)
            .subscribe_to_loyalty_system(cust1_address);
        await cust1_sub_tx.wait(1);

        // Deploy reward points
        // No info hash, just reward points reward/redeem functionality check
        let camp_dep_tx = await consoleContract
            .connect(brand1)
            .start_campaign(1, new TextEncoder().encode(0));
        await camp_dep_tx.wait(1);

        /// Get campaign address
        let camp_address =
            await consoleContract._campaign_type_to_list_of_deployed(1, 0);

        // distribute points
        //// Make sure cust has 0 points
        let rewardpoints_factory = await ethers.getContractFactory(
            "RewardPoints"
        );
        const rewardpoints_contract = rewardpoints_factory.attach(camp_address);
        //// cust has 0 points
        await expect(
            await rewardpoints_contract
                .connect(cust1)
                .get_self_points(cust1_address)
        ).to.be.equal(0);
        //// Entity distributes reward points

        let rp_dist_tx = await consoleContract
            .connect(brand1)
            .interact_rewardpoints(cust1_address, 10000, 1, 1);
        await rp_dist_tx.wait(1);

        //// Validate customer received 10000 points
        await expect(
            await rewardpoints_contract
                .connect(cust1)
                .get_self_points(cust1_address)
        ).to.be.equal(10000);
        // customer redeems some points
        // entity redeems 150 points on behalf of custoemr for the interaction

        let rp_redeem_tx = await consoleContract
            .connect(brand1)
            .interact_rewardpoints(cust1_address, 150, 1, 0);
        await rp_redeem_tx.wait(1);

        // customer now has 10000 - 150 = 9850
        await expect(
            await rewardpoints_contract
                .connect(cust1)
                .get_self_points(cust1_address)
        ).to.be.equal(9850);
    });
});
