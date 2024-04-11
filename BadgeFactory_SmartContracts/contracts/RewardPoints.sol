// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// RewardPoints contract
// Responsible for everything related to reward points - distribution/claims
/// @title RewardPoints smart contract
/// @author SolDev-HP
/// @notice This contract is responsible for handling reward points redeem/claim and user subscription
/// @dev This is a campaign, it will be deployed by campaigndeployer and
/// the owner will be assigned to msg.sender
contract RewardPoints {
    // ------------- State Vars
    address public campaign_owner;

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner, "OnlyConsole!");
        _;
    }

    // Reward points can be
    // - Lifetype validity, no expiry, can be used anytime
    // - limited time validity, expires
    // - limited accessibility - no transfers

    // Owner of this campaign can
    //      (for future, this can may be use signed permit)
    // distribute reward points
    // change reward points type
    // deploy mini campaigns involving reward points main campaign

    // Customers can
    // redeem reward points
    // transfer reward points to friends, family
    constructor() {
        campaign_owner = msg.sender;
    }

    function check_points() external view onlyConsole returns (uint) {
        return 1;
    }
}
