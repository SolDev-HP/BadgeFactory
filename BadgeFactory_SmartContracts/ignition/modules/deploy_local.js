// Local deployment script
// Ignition with multiple contracts deployed in same script-
// means getting contract address is kind of difficult, but I want to
// keep it there to come back to this script and take pointers to make it work within BadgeFactory.js
const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    // Keep track of all deployed campaigns
    let deployedCampaigns = {};

    // check if we have stored those addresses locally
    if (fs.existsSync("campaigns.json")) {
        // Read file and get addresses
        const campaigns = fs.readFileSync("campaigns.json");
        deployedCampaigns = JSON.parse(campaigns);
    } else {
        let rpAddress, badgesAddress, ticketsAddress, codesAddress;
        // Deploy them all and print them in campaigns.json file
        const RewardsFactory = await ethers.getContractFactory("RewardPoints");
        const rpContract = await RewardsFactory.deploy();
        rpAddress = await rpContract.getAddress();
        // Badges
        const BadgesFactory = await ethers.getContractFactory("Badges");
        const badgesContract = await BadgesFactory.deploy();
        badgesAddress = await badgesContract.getAddress();
        // Tickets
        const TicketsFactory = await ethers.getContractFactory("Tickets");
        const ticketsContract = await TicketsFactory.deploy();
        ticketsAddress = await ticketsContract.getAddress();
        // Codes
        const CodesFactory = await ethers.getContractFactory("Codes");
        const codesContract = await CodesFactory.deploy();
        codesAddress = await codesContract.getAddress();
        // All Deployed campaigns
        deployedCampaigns = {
            RewardPoints: rpAddress,
            Badges: badgesAddress,
            Tickets: ticketsAddress,
            Codes: codesAddress,
        };

        // Write for later use
        fs.writeFileSync("campaigns.json", JSON.stringify(deployedCampaigns));
    }

    // Deploy badgefactory, at this point all campaign implementations are deployed
    const badgeFactory = await ethers.getContractFactory("BadgeFactory");
    const factoryContract = await badgeFactory.deploy();
    await factoryContract.waitForDeployment(1);

    const set_camp1_tx = await factoryContract.set_campaign_implementation(
        1,
        deployedCampaigns.RewardPoints
    );
    const set_camp2_tx = await factoryContract.set_campaign_implementation(
        2,
        deployedCampaigns.Badges
    );
    const set_camp3_tx = await factoryContract.set_campaign_implementation(
        3,
        deployedCampaigns.Tickets
    );
    const set_camp4_tx = await factoryContract.set_campaign_implementation(
        4,
        deployedCampaigns.Codes
    );

    // Console logging deployed addresses
    console.log(`RewardPoints (Impl): ${deployedCampaigns.RewardPoints}`);
    console.log(`Badges (Impl): ${deployedCampaigns.Badges}`);
    console.log(`Tickets (Impl): ${deployedCampaigns.Tickets}`);
    console.log(`Codes (Impl): ${deployedCampaigns.Codes}`);
    // BadgeFactory deployed at
    console.log(`BadgeFactory (Impl): ${await factoryContract.getAddress()}`);
}

// execute main and print any errors in proper way, Source(Patrik's videos)
main()
    .then(() => process.exit(0)) // Exit successfully return code 0
    .catch((error) => {
        // incase any errors, print and exit with return code 1
        console.log(error);
        process.exit(1);
    });
