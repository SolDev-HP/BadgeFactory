// Deploy tickets campaign contract
// currently empty, does nothing
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TicketsModule = buildModule("Tickets", (mbuilder) => {
    const ticketscontract = mbuilder.contract("Tickets");
    return { ticketscontract };
});

module.exports = TicketsModule;
