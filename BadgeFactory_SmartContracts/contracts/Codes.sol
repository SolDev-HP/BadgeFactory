// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Codes contract
// Everything related to discount/coupon codes
contract Codes {
    // ------------- State Vars
    address public campaign_owner;
    bytes public campaign_details_hash;

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyConsole!");
        _;
    }

    constructor(address camp_code, bytes memory camp_details_hash) {
        campaign_owner = camp_code;
        campaign_details_hash = camp_details_hash;
    }

    // Basic interaction for campaign details - anyone can see it (CampaignDetails only)
    function get_campaign_hash()
        public
        view
        returns (bytes memory camp_details_hash)
    {
        camp_details_hash = campaign_details_hash;
    }

    // Tester function to check deployment
    function check_code() external view onlyConsole returns (uint) {
        return 4;
    }
}
