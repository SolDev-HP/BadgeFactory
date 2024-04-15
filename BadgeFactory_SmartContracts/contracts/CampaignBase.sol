// SPDX-License-Identifier: SolDev-HP
pragma solidity 0.8.20;
import "./interfaces/ICampaignBase.sol";

// Other validations can be added such as _Campaign_details check before add
// Address check before add - parameter in set_campaign_owner
// Created at has no use for now, but I have plans.

contract CampaignBase is ICampaignBase {
    // ------- State vars
    // We need an owner and details-hash - common for all
    address public campaign_owner;
    bytes public campaign_details_hash;
    uint public campaign_create_at;

    constructor() {
        // Not too serious use for now, if so, change block.timestamp to something else
        campaign_create_at = block.timestamp;
    }

    // ------- Modifiers
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyOwnerConsole");
        _;
    }

    function set_campaign_details(
        bytes memory _campaign_details
    ) external onlyConsole {
        // Make sure only console can call - explain why @todo
        campaign_details_hash = _campaign_details;
    }

    function set_campaign_owner(address _campaign_owner) external {
        // I'll move to rolebased systems that are already established -
        // like openzeppelin, once I make sure all campaign child contract -
        // and their deployment sizes are within bounds after adding all -
        // required functionalities to them. So till then, -
        // we use a function that can - only once
        require(campaign_owner == address(0x0), "ShouldBeEmpty");
        campaign_owner = _campaign_owner;
    }

    // Gets overridden by child campaign,
    // that sets their own campaign_type return
    function get_campaign_type_and_details()
        public
        view
        virtual
        returns (bytes memory campaign_hash, bytes memory campaign_type)
    {
        campaign_hash = campaign_details_hash;
        campaign_type = "Home";
    }
}
