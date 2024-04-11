// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IDeployer.sol";

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
/// 	redeem - depends on campaign contract (RewardPoints, Badges, Tickets, Codes) : CampaignContext
/// 	claim - depends on campaign contract
/// 	transfer - depends on campaign contract
/// @dev Main deployer of BadgeFactory - Manager of sub deployments
/// Allows deployment of
/// 1. LoyaltyConsole
/// Ability for brand/business to deploy their chosen campaign
contract BadgeFactory {
    // ------------- State Vars
    // BadgeFactory Owner - SolDev-HP
    address private _factory_owner;
    address private _console_deployer;
    // List of all available LoyaltyConsoles addresses
    // with their deployer? @todo: check
    // Register: Entity or Customer
    mapping(address => address[])
        private _address_deployed_loyaltyConsoles_list;
    // Badgefactory registery, role assignment
    // _has_registered can be checked easily with assigned role,
    // role inquiry will happen anyway when we execute modifiers
    mapping(address => bool) private _address_is_Entity;
    mapping(address => bool) private _address_is_Customer;
    //mapping(address => uint8) private _user_role;

    // ------------- Modifiers
    modifier onlyFactoryOwner() {
        require(msg.sender == _factory_owner, "HPOnly!");
        _;
    }

    // Registered users only modifier
    modifier registeredUsersOnly() {
        require(
            _address_is_Entity[msg.sender] || _address_is_Customer[msg.sender],
            "RegisteredOnly!"
        );
        _;
    }

    // ------------- Constructor
    constructor() {
        _factory_owner = msg.sender;
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
    // ------------- Public Functions

    // Owner only functionality
    function Setup_Deployer(address _deployer_address) public onlyFactoryOwner {
        _console_deployer = _deployer_address;
    }

    function register(bool _as_entity) public {
        // Register the person, assign role
        // Role assign from frontend, expect role to be entity if _as_entity is set
        if (_as_entity) {
            // Register them as entity
            // BadgeFactory can check msg.value to charge
            // for the deployment of loyaltyconsole for themselves
            // If badgefactory offers enough, this will be revisited
            _address_is_Entity[msg.sender] = true;
        } else {
            _address_is_Customer[msg.sender] = true;
        }
    }

    // Deploy a Loyalty Management system
    function deploy_console(
        bytes memory console_data
    ) public registeredUsersOnly returns (address _console_addr) {
        // Deploy Console
        _console_addr = IDeployer(_console_deployer).deploy(console_data);
        // Assert console address though, we need console to be deployed
        assert(_console_addr != address(0));
        // Update total consoles list for the sender
        _address_deployed_loyaltyConsoles_list[msg.sender].push(_console_addr);
    }
    // ------------- Internal Functions
    // ------------- Private Function
}
