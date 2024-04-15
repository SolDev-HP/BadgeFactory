// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// LoyaltyBadges contract -> renamed to Badges, avoids confusion with LoyaltyConsole
// Everything related to loyalty badges - owner, exchange, review
// What is the basic functionality of Loyalty Badges
// Let's assume that a business wants to distribute loyalty badges to their loyalest customers,
// who can use this badge to gain X% discount on the purchase - validity is limited by start time and -
// end time of the badge_validity_period. These can be super rare like a lifetime 5% off badge, or may -
// be businesses/brands can assign this badge as honor among their customers, or there are other use cases -
// some known and some are yet to be tested.

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
        // happens only once
        require(campaign_owner == address(0x0), "ShouldBeEmpty");
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
