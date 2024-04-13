// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Tickets contract
// Everything related to conference/event tickets, custom validity set/checks
contract Tickets {
    // ------------- State Vars
    address public campaign_owner;
    bytes public campaign_details_hash;

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyConsole!");
        _;
    }

    constructor(address camp_owner, bytes memory camp_details_hash) {
        campaign_owner = camp_owner;
        campaign_details_hash = camp_details_hash;
    }

    // Get campaign details read
    function get_campaign_details()
        public
        view
        returns (bytes memory camp_details_hash)
    {
        // campaign_details_hash is set at construction time
        camp_details_hash = campaign_details_hash;
    }

    // Tester function to check deployment
    function check_ticket() external view onlyConsole returns (uint) {
        return 3;
    }
}
