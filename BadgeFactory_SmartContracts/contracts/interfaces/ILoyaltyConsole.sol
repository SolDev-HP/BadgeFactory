// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// For BadgeFactory to use
interface ILoyaltyConsole {
    function set_campaign_deployer(address) external;

    function is_customer(address customer) external view returns (bool);
}
