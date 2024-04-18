// Codes doesn't have any features for now
// it's like an empty campaign
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CodesModule = buildModule("Codes", (mbuilder) => {
    const codescontract = mbuilder.contract("Codes");
    return { codescontract };
});

module.exports = CodesModule;
