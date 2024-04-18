// Rewardpoints campaign
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const RewardPointsModule = buildModule("RewardPoints", (mbuilder) => {
    const rpcontract = mbuilder.contract("RewardPoints");
    return { rpcontract };
});

module.exports = RewardPointsModule;
