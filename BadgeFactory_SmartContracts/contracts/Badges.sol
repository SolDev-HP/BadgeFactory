// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./CampaignBase.sol";

// LoyaltyBadges contract -> renamed to Badges, avoids confusion with LoyaltyConsole
// Everything related to loyalty badges - owner, exchange, review
// What is the basic functionality of Loyalty Badges
// Let's assume that a business wants to distribute loyalty badges to their loyalest customers,
// who can use this badge to gain X% discount on the purchase - validity is limited by start time and -
// end time of the badge_validity_period. These can be super rare like a lifetime 5% off badge, or may -
// be businesses/brands can assign this badge as honor among their customers, or there are other use cases -
// some known and some are yet to be tested.

contract Badges is CampaignBase {
    // ------------- State Vars
    // ------------- Modifier

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

    // Loyalty Badges specific - for testing
    function get_campaign_type_and_details()
        public
        view
        override
        returns (bytes memory camp_details_hash, bytes memory campaign_type)
    {
        // campaign_details_hash is set at construction time
        camp_details_hash = campaign_details_hash;
        campaign_type = "Loyalty Badges";
    }

    function check_badges() external view onlyConsole returns (uint) {
        return 2;
    }
}
