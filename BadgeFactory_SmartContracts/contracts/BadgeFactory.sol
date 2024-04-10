// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BadgeFactory Deployer smart contract
/// @author SolDev-HP
/// @notice This is a deployer that is responsible for deploying loyalty management campaigns
/// such as rewards points, loyalty badges, event tickets, discount codes etc.
/// @dev Main deployer of BadgeFactory - Manager of sub deployments
/// Allows deployment of
/// 1. Reward Points
/// 2. Loyalty Badges (Custom image uploaded to ipfs)
/// 3. Ticket (With expiry time, validity)
/// 4. Discount/Coupon codes
/// Ability for brand/business to deploy their chosen campaign
contract BadgeFactory {
    // ------------- State Vars

    // BadgeFactory Owner
    address private _owner;
    // BadgeFactory Users
    struct Campaigns {
        uint256 _campaign_id;
        address _campaign_deployed_at;
        // A way to identify campaign type (points, badges, tickets etc)
    }
    mapping(address => Campaigns[]) public campaign_deployers;
    // Length of Campaigns returned from the mapping can be used to check total
    // ------------- Modifiers
    modifier onlyOwner() {
        require(msg.sender == _owner, "OwnerOnly!");
        _;
    }

    // ------------- Constructor
    constructor() {
        _owner = msg.sender;
    }

    // ------------- Receive Function
    receive() external payable {
        // if anything we need here
    }

    // ------------- Fallback Function
    fallback() external payable {
        // if anything we need here
    }

    // ------------- External Function
    // We may allow external contracts to deploy campaigns later,
    // for now this is to be used by EOAs only

    // ------------- Public Functions
    // ------------- Internal Functions
    // ------------- Private Function
}
