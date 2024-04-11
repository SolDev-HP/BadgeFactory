// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Tickets contract
// Everything related to conference/event tickets, custom validity set/checks
contract Tickets {
    // ------------- State Vars
    address public campaign_owner;

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyConsole!");
        _;
    }

    constructor(address camp_owner) {
        campaign_owner = camp_owner;
    }

    // Tester function to check deployment
    function check_ticket() external view onlyConsole returns (uint) {
        return 3;
    }
}
