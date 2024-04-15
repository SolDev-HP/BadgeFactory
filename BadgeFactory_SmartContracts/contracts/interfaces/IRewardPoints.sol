// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IRewardPoints {
    // Customer subscription
    function subscribe_customer(address) external;

    // Reward Points Interactions
    function reward_points(address, uint256) external;

    function redeem_points(address, uint256) external;
}
