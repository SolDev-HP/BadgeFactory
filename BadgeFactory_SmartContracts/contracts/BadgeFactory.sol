// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "./interfaces/IDeployer.sol";
import "./LoyaltyConsole.sol";
import "./interfaces/IDeployer.sol";
import "./interfaces/ILoyaltyConsole.sol";
import "./Deployer.sol";

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
    address private _deployer_address;
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

    // Using events for mapping flow, may or may not use in prod
    event ConsoleCreated(address _consoleAddr);
    event DeployerAt(address _campDeployer);
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
        // Setup deployer
        address campdep = setup_deployer();
        emit DeployerAt(campdep);
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

    // Public functionality
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

    function check_user_role(address _user) public view returns (uint8 _role) {
        _role = 0;
        if (_address_is_Entity[_user]) {
            _role = 1;
        }
        if (_address_is_Customer[_user]) {
            _role = 2;
        }
    }

    // Registered Users Only functionality
    // Deploy a Loyalty Management system
    // Deploys LoyaltyConsole.sol contract and returns the added it's deployed at
    function deploy_console()
        public
        registeredUsersOnly
        returns (LoyaltyConsole _console_addr)
    {
        // Deploy Console
        _console_addr = new LoyaltyConsole(address(this));
        // Assert console address though, we need console to be deployed
        assert(address(_console_addr) != address(0));
        emit ConsoleCreated(address(_console_addr));
        // Setup deployer in loyaltyConsole
        ILoyaltyConsole(address(_console_addr)).set_campaign_deployer(
            _deployer_address
        );
        // Setup deployer to accept this console as accessor
        IDeployer(_deployer_address).change_accessor(
            address(_console_addr),
            true
        );

        // Update total consoles list for the sender
        _address_deployed_loyaltyConsoles_list[msg.sender].push(
            address(_console_addr)
        );
    }

    // Check deployer address, only for owner
    function get_deployer()
        public
        view
        onlyFactoryOwner
        returns (address deployer)
    {
        deployer = _deployer_address;
    }

    // ------------- Internal Functions
    // Only factory owner related functions
    // mainly to setup the deployer, deployer is a contract that takes bytecode and deploy it
    function setup_deployer() internal returns (address deployerAddr) {
        deployerAddr = address(new Deployer());
        // Assert we placed our deployer onchain
        assert(deployerAddr != address(0));
        // Setup our deployer
        _deployer_address = deployerAddr;
    }
    // ------------- Private Function
}
