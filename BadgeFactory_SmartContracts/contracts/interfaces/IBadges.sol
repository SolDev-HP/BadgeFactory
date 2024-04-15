// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IBadges {
    // Customer subscription
    function subscribe_customer(address) external;

    // Badges specific functions
    // set multiple badges details hashes
    // These are implemented as consoleOnly() callable functions
    function set_total_badges_types(uint256) external;

    function set_badges_details_hashes(bytes[] memory) external;

    function get_badge_type_details_hash(
        uint256
    ) external view returns (bytes memory);
}
