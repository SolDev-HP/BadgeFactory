// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./CampaignBase.sol";

// Codes contract
// Everything related to discount/coupon codes
contract Codes is CampaignBase {
    // ------------- State Vars
    // ------------- Modifier
    constructor() {
        // campaign_owner = camp_code;
    }

    // Codes specific - for testing
    function get_campaign_type_and_details()
        public
        view
        override
        returns (bytes memory camp_details_hash, bytes memory campaign_type)
    {
        // campaign_details_hash is set at construction time
        camp_details_hash = campaign_details_hash;
        campaign_type = "Discount/Coupon Codes";
    }

    // Tester function to check deployment
    function check_code() external view onlyConsole returns (uint) {
        return 4;
    }
}
