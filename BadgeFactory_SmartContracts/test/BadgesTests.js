// Enter badges test
// Now badges details structure has following format - using new common CampaignDetails data
// const campaignDetails = {
//     _campaign_id: Number(totalCampaigns) + 1,    // Some identifier, for now we keep it total+1
//     _campaign_type: [1...4],                     // type of campaign (selectable range [1, 4])
//     _campaign_name: "Campaign Name",             // bytes32, only 32 letters ascii
//     _campaign_details: "Campaign Details",       // bytes32, only 32 letters ascii
//     _campaign_start_date: "block.timestamp?",    // Starting datetime of Campaign
//     _campaign_end_date: "block.timestamp?",      // Campaign ending datetime
//     _campaign_owner: address,                    // Which console deployed it
//     _campaign_specific_data: {
//         _badges_campaign: {
//             // Badge criteria - what it's given for, ex. ["Top User of the Day/Week/Month/Year" or something :D]
//             _types_of_badges: 10,               // Number of different types of badges (in view and their utility decided by Entity)
//             _badges_details: [
//                 // This will repeat for all types of badges
//                 {
//                     _badge_for: "string",
//                     _badge_details: "",
//                     // Badge itself - the UI and look and feel of badge (image or gif or svg -> ipfs)
//                     _badge_view: img | svg | gif,
//                     _can_expire: true/false,
//                     _expiry: timestamp,
//                     _can_transfer: true/false,
//                 },
//             ],
//             // Badge Visibility (publicly visible to everyone or limited visibility)
//             _badge_visibility: "string",
//         },
//     _campaign_active: true,                         // Is campaign currently active
// };
const fs = require("fs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { hardhatArguments } = require("hardhat");
const axios = require("axios");
const {
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Badges-Tests", function () {
    // Fixture of LoyaltyConsole
    async function deployLoyaltyConsoleFixture() {
        // Get all default addresses
        // 1 Factory owner - Deploys BadgeFactory and Campaign Implementations
        // (rewardpoints, badges, tickets, codes)
        // 2 entities (business/brand/project/customer who wants to deploy their own loyalty management system)
        // 2 customer who interact with Loyalty management system deployed by any entity

        const [factoryOwner, entity1, entity2, cust1, cust2] =
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
        const badgefactory_contract = await ethers.deployContract(
            "BadgeFactory"
        );
        await badgefactory_contract.waitForDeployment();

        // Four tx of setting campaign implementations for badgefactory
        // could've set constructor so that it accepts all this data, but I'll keep that for refactor @todo
        await badgefactory_contract.set_campaign_implementation(
            1,
            await rewardpoints_campImpl.getAddress()
        );
        await badgefactory_contract.set_campaign_implementation(
            2,
            await badges_campImpl.getAddress()
        );
        await badgefactory_contract.set_campaign_implementation(
            3,
            await tickets_campImpl.getAddress()
        );
        await badgefactory_contract.set_campaign_implementation(
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
        await badgefactory_contract.connect(entity1).register(1);

        // Deploy a loyaltyconsole
        // const loyaltyconsole = await ethers.getContractFactory(
        //     "LoyaltyConsole"
        // );
        const loyaltyconsole_tx = await badgefactory_contract
            .connect(entity1)
            .deploy_console([1, 2, 3, 4]); // all types supported
        await loyaltyconsole_tx.wait(1); // Let it deploy then we have the address of that campaign
        const entity1_address = await entity1.getAddress();
        const loyaltyConsoleAddress =
            await badgefactory_contract._address_deployed_loyaltyConsoles_list(
                entity1_address,
                0 // Address, uint as it's a mapping to a list, we need to provide what's max
            );
        // Deployed first LoyaltyConsole(id: 0) by Entity1 (registered on BadgeFactory)
        let loyaltyconsole_factory = await ethers.getContractFactory(
            "LoyaltyConsole"
        );
        const loyaltyconsole_contract = loyaltyconsole_factory.attach(
            loyaltyConsoleAddress
        );

        return {
            badgefactory_contract,
            loyaltyconsole_contract,
            factoryOwner,
            entity1,
            entity2,
            cust1,
            cust2,
        };
        // Check IPFS active
    }

    it("LoyaltyConsole is deployed by an Entity(brand/business/project), no campaigns exist yet", async function () {
        // Load fixture here
        //-----------------
        const {
            badgefactory_contract,
            loyaltyconsole_contract,
            factoryOwner,
            entity1,
            entity2,
            cust1,
            cust2,
        } = await loadFixture(deployLoyaltyConsoleFixture);
        //console.log(await badgeFactory_contract.getAddress());
        // No. of deployed campaign should be 0 at this time
        const totalCampaigns = await loyaltyconsole_contract.total_campaigns();
        expect(totalCampaigns).to.equal(0);
    });

    // Check if loyaltyconsole allows entity1 to deploy badges campaign
    it("Should allow an Entity to deploy Badges campaign, verify total types of badges, their data, and campaigndetails hash data", async function () {
        // Load fixture here
        //-----------------
        const {
            badgefactory_contract,
            loyaltyconsole_contract,
            factoryOwner,
            entity1,
            entity2,
            cust1,
            cust2,
        } = await loadFixture(deployLoyaltyConsoleFixture);
        //console.log(await badgeFactory_contract.getAddress());
        // No. of deployed campaign should be 0 at this time
        const totalCampaigns = await loyaltyconsole_contract.total_campaigns();
        expect(totalCampaigns).to.equal(0);
        // Entity1 deploys badges campaign
        // campaign_id = 2
        // campaign_details_hash = [all_supported_badge_types_details_hashes]

        // For this test, supported types of badges 3
        // 3 images included on campaign_data_hash

        const img1_cust_badge = "../assets/badges/customer_badge.png";
        const img2_entity_badge = "../assets/badges/entity_badge.png";
        const img3_subscribed_badge = "../assets/badges/subscribed_badge.png";

        // Upload these three images to ipfs local, and use hash in preparing campaignDetails structure

        // May be apply data chunking here and send chunks and stream back response from ipfs? @todo
        // Takes way too long, but gets the point across, uploading png files as badges to ipfs -
        // grab hashes to store in campaignData on campaign contract and loyaltyconsole
        const inmem_imgfile1 = new File(
            [fs.readFileSync(img1_cust_badge, { encoding: "base64" })],
            "cust_badge_1.png",
            {
                type: "image/png",
            }
        );

        //console.log(`File size of cust_badge: ${inmem_imgfile1.size}`);
        const inmem_imgfile2 = new File(
            [fs.readFileSync(img2_entity_badge, { encoding: "base64" })],
            "entity_badge_1.png",
            {
                type: "image/png",
            }
        );
        //console.log(`File size of entity_badge: ${inmem_imgfile2.size}`);
        const inmem_imgfile3 = new File(
            [fs.readFileSync(img3_subscribed_badge, { encoding: "base64" })],
            "newsletter_subscribed_badge_1.png",
            {
                type: "image/png",
            }
        );
        //console.log(`File size of subbed_badge: ${inmem_imgfile3.size}`);
        ///// Put these three images on ipfs running locally on kubo node
        // Put this to ipfs and get hash
        const ipfs_link = process.env.IPFS_RPC;
        // Request
        const form_data = new FormData();

        form_data.append("file", inmem_imgfile1); // Pass created inmem file
        form_data.append("file", inmem_imgfile2);
        form_data.append("file", inmem_imgfile3);
        const hashes_of_badges_data = await axios
            .post(
                "http://127.0.0.1:5001/api/v0/add?chunker=buzhash",
                form_data,
                {
                    headers: {
                        "Content-Disposition": "form-data",
                        "Content-Type": "application/octet-stream",
                    },
                }
            )
            .then((resp) => {
                // returned hash are in this formate
                // {name,hash,size}{name,hash,size}
                // to covert this into json, we need a comma between } and {
                // this regex replacer does that and returns data in json format
                const regex = /(?<=})[^\w]*{/g;
                let data = resp["data"].replace(regex, ",{");
                return JSON.parse("[" + data + "]");
            });

        // console.log(`Cust Badge At: ${hashes_of_badges_data[0]["Hash"]}`);
        // console.log(`Entity Badge At: ${hashes_of_badges_data[1]["Hash"]}`);
        // console.log(`Subscribed Badge At: ${hashes_of_badges_data[2]["Hash"]}`);

        // Get any file back from ipfs to validate uploaded data/image/media
        const random_file = await axios
            .post(
                "http://127.0.0.1:5001/api/v0/cat?arg=" +
                    hashes_of_badges_data[0]["Hash"]
                //"&output=some_badge.png"
            )
            .then((resp) => resp.data);

        const rnd_cust_badge = "../assets/badges/some_badge.png";

        // Recovery is done
        fs.writeFileSync(rnd_cust_badge, Buffer.from(random_file, "base64"));
        // Badge retrieval validated

        // Set the main campaign details into campaignbase
        // Set other campaign badge
        const campaignDetails = {
            _campaign_id: Number(totalCampaigns), // Some identifier, for now we keep it total
            _campaign_type: 2, // type of campaign - badges
            _campaign_name: "BadgeFactory Badges", // bytes32, only 32 letters ascii
            _campaign_details: "to access services", // bytes32, only 32 letters ascii
            _campaign_owner: await loyaltyconsole_contract.getAddress(), // Which console deployed it
            _campaign_specific_data: {
                _badges_campaign: {
                    // Badge criteria - what it's given for, ex. ["Top User of the Day/Week/Month/Year" or something :D]
                    _types_of_badges: 3, // Number of different types of badges (in view and their utility decided by Entity)
                    _badges_details: [
                        // This will repeat for all types of badges
                        // First badge - newsletter subscription
                        {
                            _badge_for: "NewsletterSub",
                            _badge_details: "receive newsletters",
                            // Badge itself - the UI and look and feel of badge (image or gif or svg -> ipfs)
                            _badge_view: "png", //img | svg | gif,
                            _badge_media_ipfs_hash:
                                hashes_of_badges_data[2]["Hash"],
                            _can_expire: false,
                            _can_transfer: false,
                        },
                        // Second badge - register as Entity
                        {
                            _badge_for: "Entity",
                            _badge_details: "subscribed to BadgeFactory",
                            // Badge itself - the UI and look and feel of badge (image or gif or svg -> ipfs)
                            _badge_view: "png", //img | svg | gif,
                            _badge_media_ipfs_hash:
                                hashes_of_badges_data[1]["Hash"],
                            _can_expire: false,
                            _can_transfer: false,
                        },
                        // Third badge - register as Custoemr
                        {
                            _badge_for: "Customer",
                            _badge_details: "subscribed to BadgeFactory",
                            // Badge itself - the UI and look and feel of badge (image or gif or svg -> ipfs)
                            _badge_view: "png", //img | svg | gif,
                            _badge_media_ipfs_hash:
                                hashes_of_badges_data[0]["Hash"],
                            _can_expire: false,
                            _can_transfer: false,
                        },
                    ],
                    // Badge Visibility (publicly visible to everyone or limited visibility)
                    _is_public_visible: true,
                },
            },
            _campaign_active: true, // Is campaign currently active
        };

        ///// CampaignDetailds/CampaignData hash is always parent
        ///// Remaining comes in the list afterwards
        let json_campaign_details = JSON.stringify(campaignDetails);
        const file_of_json = new Blob([json_campaign_details], {
            type: "application/json",
        });
        const in_mem_file_of_json = new File(
            [file_of_json],
            "campaign_details.json"
        );

        // Request
        const badges_campaign_details_form_data = new FormData();

        badges_campaign_details_form_data.append("file", in_mem_file_of_json); // Pass created inmem file
        // push campaign details onto ipfs and place that hash
        // at the top of the list hashes_of_badges_data
        const hash_of_campaignDetails = await axios
            .post(
                "http://127.0.0.1:5001/api/v0/add",
                badges_campaign_details_form_data,
                {
                    headers: {
                        "Content-Disposition": "form-data",
                        "Content-Type": "application/octet-stream",
                    },
                }
            )
            .then((resp) => {
                return resp["data"]["Hash"];
            });
        //console.log(`Hash OF CampaignDetails: ${hash_of_campaignDetails}`);
        // Start campaign = Badges
        // 3 badges with their hashes [1, 2, 3]
        // campaignData structure ready
        let start_campaign_tx = await loyaltyconsole_contract
            .connect(entity1)
            .start_campaign(2, [
                new TextEncoder().encode(hash_of_campaignDetails),
                new TextEncoder().encode(hashes_of_badges_data[0]["Hash"]),
                new TextEncoder().encode(hashes_of_badges_data[1]["Hash"]),
                new TextEncoder().encode(hashes_of_badges_data[2]["Hash"]),
            ]);

        start_campaign_tx.wait(1);
        // Campaign count should increase
        let total_campaigns_now =
            await loyaltyconsole_contract.total_campaigns();
        expect(total_campaigns_now).to.equal(1);
        // verify that there are 3 types of badges for currently deployed campaign
        // Get campaign deployed address
        // CampaignType: 2, among list of badge campaigns deployed which contract: first one, at index zero
        let badges_camp_address =
            await loyaltyconsole_contract._campaign_type_to_list_of_deployed(
                2,
                0
            );
        let badges_camp_factory = await ethers.getContractFactory("Badges");
        let badges_camp_contract =
            badges_camp_factory.attach(badges_camp_address);

        let total_badges_now =
            await badges_camp_contract.total_types_of_badges();
        console.log(`Total Types of Badges: ${total_badges_now}`);

        let details_hash_badge1 =
            await badges_camp_contract.get_badge_type_details_hash(1);
        let details_hash_badge2 =
            await badges_camp_contract.get_badge_type_details_hash(2);
        let details_hash_badge3 =
            await badges_camp_contract.get_badge_type_details_hash(3);

        // BadgeType=>BadgeDetailsHash, Hash is sent as TextEncoded(),
        // received should be decoded to get original back, once we get original, verify that with hashes that we received
        // from ipfs while uploading == hashes_of_badges_data
        const fromHexString = (hexString) =>
            Uint8Array.from(
                hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
            );
        //console.log(fromHexString(details_hash_badge1));

        let decoder = new TextDecoder();
        // why substring(2)? to remove 0x from hash that we received from contract
        expect(
            decoder.decode(fromHexString(details_hash_badge1.substring(2)))
        ).to.equal(hashes_of_badges_data[0]["Hash"]);
        expect(
            decoder.decode(fromHexString(details_hash_badge2.substring(2)))
        ).to.equal(hashes_of_badges_data[1]["Hash"]);
        expect(
            decoder.decode(fromHexString(details_hash_badge3.substring(2)))
        ).to.equal(hashes_of_badges_data[2]["Hash"]);
        // Badges Campaign started now with 3 badges types

        // validate whole campaigndata hash
        let campaign_datahash_bytes =
            await badges_camp_contract.campaign_details_hash();
        //console.log(campaign_datahash_bytes);
        let campaign_datahash_ipfs = decoder.decode(
            fromHexString(campaign_datahash_bytes.substring(2))
        );

        const campaign_from_ipfs = await axios.get(
            ipfs_link + campaign_datahash_ipfs
        );

        //console.log(JSON.stringify(campaign_from_ipfs.data));
        expect(JSON.stringify(campaign_from_ipfs.data)).to.equal(
            JSON.stringify(campaignDetails)
        );
        // Validate everything and fix distribute/redeem/use/etc functionality
    });
});
