// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// LoyaltyBadges contract -> renamed to Badges, avoids confusion with LoyaltyConsole
// Everything related to loyalty badges - owner, exchange, review
contract Badges {
    // ------------- State Vars
    address public campaign_owner;
    bytes public campaign_details_hash;

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
    constructor(address camp_owner, bytes memory camp_details_hash) {
        campaign_owner = camp_owner;
        campaign_details_hash = camp_details_hash;
    }

    // basic getter for campaign details hash
    function get_campaign_details()
        public
        view
        returns (bytes memory camp_details_hash)
    {
        camp_details_hash = campaign_details_hash;
    }

    function check_badges() external view onlyConsole returns (uint) {
        return 2;
    }
}
