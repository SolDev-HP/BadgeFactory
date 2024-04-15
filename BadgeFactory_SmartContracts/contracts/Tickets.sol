// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./CampaignBase.sol";

// Tickets contract
// Everything related to conference/event tickets, custom validity set/checks
contract Tickets is CampaignBase {
    // ------------- State Vars
    // ------------- Modifier

    constructor() {
        //campaign_owner = camp_owner;
    }

    // Tickets specific - for testing
    function get_campaign_type_and_details()
        public
        view
        override
        returns (bytes memory camp_details_hash, bytes memory campaign_type)
    {
        // campaign_details_hash is set at construction time
        camp_details_hash = campaign_details_hash;
        campaign_type = "Event/Conference Tickets";
    }

    // Tester function to check deployment
    function check_ticket() external view onlyConsole returns (uint) {
        return 3;
    }
}
