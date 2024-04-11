// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title BadgeFactory Deployer smart contract
/// @author SolDev-HP
/// @notice This is the main BadgeFactory contract, that will be connected to frontend, -
/// it is responsible for registering new users with their role "Customer" or "Entity,
/// and can also LoyaltyConsole constract (For Entities) -
/// Customer (EOA address): A customer is anyone who is interested in using someone's loyalty management system
/// Entity (EOA address): A brand, business, project, or anyone that wants to deploy their own loyalty management system
/// LoyaltyConsole (contract): Your(Entity) own loyalty management system console contract that can be used by you or your Customers
/// For example:
/// LoyaltyConsole access can grant campaign_deploy rights to Entity,
/// LoyaltyConsole access can grant registration, redeem, claim, transfer loyalty campaigns rights to Customer
/// 	registration: register_for_given_entitys_loyalty_system (System name?)
/// 	redeem - depends on campaign contract (RewardPoints, LoyaltyBadges, Tickets, Codes) : CampaignContext
/// 	claim - depends on campaign contract
/// 	transfer - depends on campaign contract
/// @dev Main deployer of BadgeFactory - Manager of sub deployments
/// Allows deployment of
/// 1. LoyaltyConsole
/// Ability for brand/business to deploy their chosen campaign
contract BadgeFactory {
    // ------------- State Vars
    // BadgeFactory Owner
    address private _owner;

    // This will go into LoyaltyConsole.sol
    // BadgeFactory Users
    // struct Campaigns {
    //     uint256 _campaign_id;
    //     address _campaign_deployed_at;
    //     // A way to identify campaign type (points, badges, tickets etc)
    // }
    // mapping(address => Campaigns[]) public campaign_deployers;

    // Badgefactory registery, role assignment
    mapping(address => bool) private _has_registered;
    mapping(address => uint8) private _user_role;
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
