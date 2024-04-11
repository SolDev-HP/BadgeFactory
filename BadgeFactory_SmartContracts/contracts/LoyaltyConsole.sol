// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./interfaces/IDeployer.sol";
// for type(campaign).creationCode
import "./RewardPoints.sol";
import "./Badges.sol";
import "./Tickets.sol";
import "./Codes.sol";

contract LoyaltyConsole {
    // Home Address
    address private _factory;
    address private _campaigns_deployer;
    // LoyaltyConsole:
    // Entity: deploy new campaigns, register new users, modify campaigns, remove campaigns
    // Customer: participate or register with entity

    // Campaign type and details
    struct Campaign {
        uint256 _campaign_id;
        address _campaign_deployed_at;
        bool _campaign_active;
    }
    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) private _is_address_Entity;
    mapping(address => bool) private _is_address_Customer;
    mapping(uint => address[]) private _campaign_id_to_list_of_deployed;

    // ------------- Constructor
    constructor(address factory_address) {
        // Whoever originated the tx, not the creation happened by badgefactory
        // because msg.sender will be badgefactory always
        _factory = factory_address;
        assert(_factory == msg.sender); // Interesting check, need to see if it works
        _is_address_Entity[tx.origin] = true;
    }

    // ------------- Modifiers
    modifier roleEntity() {
        require(_is_address_Entity[msg.sender], "EntityOnly");
        _;
    }
    modifier roleCustomer() {
        require(_is_address_Customer[msg.sender], "CustOnly");
        _;
    }
    modifier roleFactory() {
        require(_factory == msg.sender, "FactoryOnly!");
        _;
    }

    // -------------- External functions
    function set_campaign_deployer(
        address _deployer_addr
    ) external roleFactory {
        _campaigns_deployer = _deployer_addr;
    }

    // Deploying campaigns through console
    function start_campaign(
        uint _campaign_id
    ) public roleEntity returns (address _campaign_addr) {
        // Assumed
        require((0 < _campaign_id) && (_campaign_id < 5), "1to4Only!");
        require(address(_campaigns_deployer) != address(0), "DeployerNeeded!");
        // _campaign_id for RewardPoints(1), Badges(2), Tickets(3), Codes(4)
        // Probably needs more data along with each type, changes as we go
        if (_campaign_id == 1) {
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                type(RewardPoints).creationCode
            );
        } else if (_campaign_id == 2) {
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                type(Badges).creationCode
            );
        } else if (_campaign_id == 3) {
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                type(Tickets).creationCode
            );
        } else if (_campaign_id == 4) {
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                type(Codes).creationCode
            );
        }

        // Validate campaign deployment
        assert(address(_campaign_addr) != address(0));
        // Add to list of deployed
        _campaign_id_to_list_of_deployed[_campaign_id].push(
            address(_campaign_addr)
        );
    }

    // Coming from BadgeFactory.sol - keep if needed
    // Length of Campaigns returned from the mapping can be used to check total
    // BadgeFactory Users
    // struct Campaigns {
    //     uint256 _campaign_id;
    //     address _campaign_deployed_at;
    //     // A way to identify campaign type (points, badges, tickets etc)
    // }
    // mapping(address => Campaigns[]) public campaign_deployers;
}
