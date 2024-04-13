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
    constructor() {
        // campaign_owner = camp_owner;
        // We do this separately after construction happens
    }

    function set_campaign_owner(address camp_owner) external {
        // setup console as the owner so interactions can happen for that deployed campaign
        campaign_owner = camp_owner;
    }

    // Allow setting campaign details
    function set_campaign_details(
        bytes memory camp_details
    ) external onlyConsole {
        campaign_details_hash = camp_details;
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
