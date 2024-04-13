// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardPoints {
    // Customer subscription
    function subscribe_customer(address) external;

    // Reward Points Interactions
    function reward_points(address, uint256) external returns (uint256);

    function redeem_points(address, uint256) external returns (uint256);

    // Set campaign details - temporary - this should move to ICampaign
    function set_campaign_owner(address) external;

    function set_campaign_details(bytes memory) external;
}
