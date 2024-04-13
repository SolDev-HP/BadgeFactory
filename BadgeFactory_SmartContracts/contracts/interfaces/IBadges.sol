// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IBadges {
    // Customer subscription
    function subscribe_customer(address) external;

    // Set campaign details - temporary - this should move to ICampaign
    function set_campaign_details(bytes memory) external;

    function set_campaign_owner(address) external;
}
