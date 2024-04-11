// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Codes contract
// Everything related to discount/coupon codes
contract Codes {
    // ------------- State Vars
    address public campaign_owner;

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyConsole!");
        _;
    }

    constructor() {
        campaign_owner = msg.sender;
    }

    // Tester function to check deployment
    function check_code() external view onlyConsole returns (uint) {
        return 4;
    }
}
