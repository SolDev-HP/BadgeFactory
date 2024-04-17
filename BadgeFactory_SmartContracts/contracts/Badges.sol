// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./CampaignBase.sol";
import "./interfaces/ILoyaltyConsole.sol";

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
    uint256 public total_types_of_badges;
    uint256 public total_badges_circulating;
    uint256 private _total_customer_count;

    // Customer if specifically subscribed for this campaign only
    mapping(address => bool) private _cust_address_to_isSubscribed;

    // Badges details, how many customer holds, which badges customer holds
    mapping(address => uint256) private _cust_address_to_total_held_badges;
    mapping(address => uint256[]) private _cust_add_to_held_badges_list;
    mapping(uint256 => bytes) private _badge_type_to_badge_details_hash;

    // Badgetype -> visibility (for all customers) - So by default visibility is public
    // badgetype starts at 1
    // 0 is for campaign_details_hash in parent
    mapping(uint256 => bool) private _badge_type_to_is_privately_visible_only;

    // ------------- Modifier
    // we already have onlyConsole() available,
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

    //// Set total types of badges, this can be updated by onlyConsole
    //// may emit an event for badges_types_updates or something
    function set_total_badges_types(uint256 _total_types) external onlyConsole {
        // This should happen once at the beggning when campaign deploy
        // happens
        total_types_of_badges = _total_types;
    }

    //// Console initiated Badges with N types, allow them to set hashes for all
    //// Has to supply hash_list of length of total supported badge types
    function set_all_badges_details_hashes(
        bytes[] memory _p_all_hashes_list // list has to be atleast 1,
    ) public onlyConsole {
        // Has to make sure, total_badges_types == length of p_hashes_list
        require(total_types_of_badges > 0, "0BadgeTypesSet");
        require(
            _p_all_hashes_list.length - 1 == total_types_of_badges, // We're sending hashes[1...onwards]
            "MoreHashesThanSupported"
        );
        // If title BadgeDetails hasn't been set in super()
        // This will be

        if (campaign_details_hash.length == 0) {
            campaign_details_hash = _p_all_hashes_list[0];
        }
        // Set all badges hashes details
        // _badge_type_to_badge_details_hash(uint -> bytes)
        // Supports type 1,2,3 and has set hash details for only 1 -
        // 2 and 3 can be empty (set 0x0 in list) and that's okay,
        // they can recall this to update hash with the new one
        for (uint i = 1; i <= total_types_of_badges; ++i) {
            // Don;t clean up, update the necessary one only
            if (_p_all_hashes_list[i].length == 0) {
                continue;
                // Don't update currently set detail hash -
                // if zero keep, if nonzero - don't update
            }
            // Non zero hash, update current hash associated with hashtype
            // hashtype is p_all_hashes_list indirect index
            // badgetype starts at 1 - 0 is always parent campaignHash
            // 1 type is second badge and so on...
            _badge_type_to_badge_details_hash[i] = _p_all_hashes_list[i];
        }
    }

    function get_badge_type_details_hash(
        uint256 _p_badge_type
    ) public view returns (bytes memory badge_details_hash) {
        // Do we have that badge?
        require(
            _badge_type_to_badge_details_hash[_p_badge_type].length > 0,
            "DonthaveDetails"
        );
        badge_details_hash = _badge_type_to_badge_details_hash[_p_badge_type];
    }

    //// Give badge to customer, check if customer has specific badge
    //// how many badges does customer hold,

    function check_customer_badge(
        uint256 _p_badge_type_to_check,
        address customer
    ) public view onlyConsole returns (bool _does_customer_have_badge) {
        // Make sure customer is subscribed for this
        require(
            ILoyaltyConsole(campaign_owner).is_customer(customer),
            "NotSubbedForBadges"
        );

        // Check if customer has this badge
        uint256 total_held = _cust_address_to_total_held_badges[customer];
        for (uint256 i = 0; i < total_held; ++i) {
            // Remember: badge_type starts at 1
            if (
                _cust_add_to_held_badges_list[customer][i] ==
                _p_badge_type_to_check
            ) {
                _does_customer_have_badge = true;
            }
        }
    }

    function award_badge(
        address customer,
        uint256 _p_badge_type
    ) public onlyConsole {
        // Is customer subscribed?
        require(
            ILoyaltyConsole(campaign_owner).is_customer(customer),
            "NotSubbedForBadges"
        );
        // Does customer already have this badge?
        require(!check_customer_badge(_p_badge_type, customer), "AlreadyHasIt");
        // award badge to customer
        _cust_add_to_held_badges_list[customer].push(_p_badge_type);
        _cust_address_to_total_held_badges[customer] += 1;
        // total circulating badges increased
        total_badges_circulating += 1;
    }

    function total_customer_held_badges(
        address customer
    ) public view onlyConsole returns (uint256 _p_total_held) {
        // Make sure customer is subscribed for this
        require(
            ILoyaltyConsole(campaign_owner).is_customer(customer),
            "NotSubbedForBadges"
        );
        // Get total badges held by given customer
        _p_total_held = _cust_address_to_total_held_badges[customer];
    }
}
