// First successful inition on sepolia testnet with following scenario
// Deploy BadgeFactory, RewardPoints, Badges, Tickets, Codes
// Register 2 Entities - subscribe
// Register 2 Customers - subscribe
// Entity1 deploys RewardPoints campaign - distribute to 2 customers
// Entity2 deploys Badges campaign - distribute to 2 customers
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BadgeFactory", (mbuilder) => {
    // Deploy campaigns first
    const rpcontract = mbuilder.contract("RewardPoints");
    const badgescontract = mbuilder.contract("Badges");
    const ticketscontract = mbuilder.contract("Tickets");
    const codescontract = mbuilder.contract("Codes");
    // Deploy BadgeFactory
    const bfactorycontract = mbuilder.contract("BadgeFactory");
    // Setup all campaign implementation address in BadgeFactory
    // Campaign_Types = {1: RewardPoints, 2: Badges, 3: Tickets, 4: Codes}
    mbuilder.call(bfactorycontract, "set_campaign_implementation", [
        1,
        rpcontract,
    ]);
    mbuilder.call(bfactorycontract, "set_campaign_implementation", [
        2,
        badgescontract,
    ]);
    mbuilder.call(bfactorycontract, "set_campaign_implementation", [
        3,
        ticketscontract,
    ]);
    mbuilder.call(bfactorycontract, "set_campaign_implementation", [
        4,
        codescontract,
    ]);

    return { bfactorycontract };
});
