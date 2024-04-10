// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title Campaign deployer that assists in deploying
/// multiple, different campaigns tailored to deployer's need
/// @author SolDev-HP
/// @notice We have four supported campaign types
/// 1. Reward points - RewardPoints.sol
/// 2. Loyalty Badges - LoyaltyBadges.sol
/// 3. Tickets - Tickets.sol - Time dependent entry pass
/// 4. Discount/Coupon code - Codes.sol
/// @dev Given campaign name, and the msg sender,
/// create a campaign and assigns the owner of the campaign as tx.origin
contract CampaignDeployer {
    // ------------- State variables
    address private _deployer; // Campaign Deployer - BadgeFactory

    // ------------- Modifiers
    // we need owner modifier, easy check nothing fancy so no lib use for now
    modifier onlyDeployer() {
        require(msg.sender == _deployer, "UnAuth!");
        _;
    }

    // ------------- Constructor
    constructor() {
        // Set deployer to be msg.sender - not tx.origin
        // It means, the deployerbadgefactory contract
        _deployer = msg.sender;
    }

    // ------------- Receive Function
    // ------------- Fallback Function

    // ------------- External Function

    /// @notice Create a campaign, return address where campaign is active at
    /// @dev extcodesize comments from docs present
    /// @param _campaign_data bytes param with campaign code to deploy
    /// @return campAddr returns address the campaign is active at
    function deployCampaign(
        bytes memory _campaign_data
    ) external onlyDeployer returns (address campAddr) {
        assembly {
            // Create a campaign, return address where campaign is active at
            campAddr := create(
                0,
                add(_campaign_data, 0x20),
                mload(_campaign_data)
            )
            // MorphL2 docs: https://docs.morphl2.io/docs/build-on-morph/build-on-morph/difference-between-morph-and-ethereum/
            // Storage proof extcodesize opcode verification
            // Instead, we store the contract size in storage at contract creation.
            if iszero(extcodesize(campAddr)) {
                revert(0, 0)
            }
        }
    }

    // ------------- Public Functions
    // ------------- Internal Functions
    // ------------- Private Function
}
