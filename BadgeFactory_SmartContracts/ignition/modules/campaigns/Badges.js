// Campaigns are deployed beforehand,
// I just want to make sure even empty campaign can be deployed
// and cloned like reward points and badges
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const BadgesModule = buildModule("Badges", (mbuilder) => {
    const badgescontract = mbuilder.contract("Badges");
    return { badgescontract };
});

module.exports = BadgesModule;
