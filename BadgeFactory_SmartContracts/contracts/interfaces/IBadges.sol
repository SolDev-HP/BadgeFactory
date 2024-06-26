// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IBadges {
    // Customer subscription
    function subscribe_customer(address) external;

    // function get owner
    function campaign_owner() external returns (address);

    // Badges specific functions
    // set multiple badges details hashes
    // These are implemented as consoleOnly() callable functions
    function set_total_badges_types(uint256) external;

    function set_all_badges_details_hashes(bytes[] memory) external;

    function get_badge_type_details_hash(
        uint256
    ) external view returns (bytes memory);

    // Badges interactions, award customer a badge, check if customer -
    // has given badge, check total customer held badges
    function award_badge(address, uint256) external;

    function check_customer_badge(
        uint256,
        address
    ) external view returns (bool);

    function total_customer_held_badges(
        address
    ) external view returns (uint256);
}
