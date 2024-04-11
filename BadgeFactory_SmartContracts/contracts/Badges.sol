// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// LoyaltyBadges contract -> renamed to Badges, avoids confusion with LoyaltyConsole
// Everything related to loyalty badges - owner, exchange, review
contract Badges {
    // ------------- State Vars
    address public campaign_owner;

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyConsole!");
        _;
    }

    // Badges can be
    // - Lifetype validity, no expiry, can be used anytime
    // - limited time validity, expires
    // - limited accessibility - no transfers

    // Owner of this campaign can
    // distribute badges to customers
    // change and customize badge and its features/utility

    // Customers can
    // Claim their badges
    // transfer badges to friends, family
    constructor() {
        campaign_owner = msg.sender;
    }

    function check_badges() external view onlyConsole returns (uint) {
        return 2;
    }
}
