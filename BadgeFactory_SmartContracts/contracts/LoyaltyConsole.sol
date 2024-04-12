// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./interfaces/IDeployer.sol";
import "./interfaces/IRewardPoints.sol";
// for type(campaign).creationCode
import "./RewardPoints.sol";
import "./Badges.sol";
import "./Tickets.sol";
import "./Codes.sol";

contract LoyaltyConsole {
    // Home Address
    address private _factory;
    address private _campaigns_deployer;
    // Total campaigns deployed vs total running
    uint private _total_campaigns;
    uint private _total_points_campaigns;
    uint private _total_badges_campaigns;
    uint private _total_tickets_campaigns;
    uint private _total_codes_campaigns;
    // LoyaltyConsole:
    // Entity: deploy new campaigns, register new users, modify campaigns, remove campaigns
    // Customer: participate or register with entity

    // Campaign type and details
    struct Campaign {
        uint256 _campaign_id;
        uint256 _campaign_type;
        string _campaign_name;
        string _campaign_details;
        address _campaign_deployed_at;
        bool _campaign_active;
    }
    mapping(address => Campaign) public _address_to_campaign_details;

    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) private _is_address_Entity;
    mapping(address => bool) private _is_address_Customer;
    mapping(uint256 => address[]) private _campaign_type_to_list_of_deployed;

    // ------------- Constructor
    constructor(address factory_address) {
        // Whoever originated the tx, not the creation happened by badgefactory
        // because msg.sender will be badgefactory always
        _factory = factory_address;
        assert(_factory == msg.sender); // Interesting check, need to see if it works
        _is_address_Entity[tx.origin] = true;
    }

    // ------------- Modifiers
    // Initiators should be these roles
    modifier roleEntity() {
        require(_is_address_Entity[tx.origin], "EntityOnly");
        _;
    }
    modifier roleCustomer() {
        require(_is_address_Customer[tx.origin], "CustOnly");
        _;
    }

    // Updater should be this role
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
        uint _campaign_type,
        string memory camp_name,
        string memory camp_details
    ) public roleEntity returns (address _campaign_addr) {
        // Assumed
        require((0 < _campaign_type) && (_campaign_type < 5), "1to4Only!");
        require(address(_campaigns_deployer) != address(0), "DeployerNeeded!");
        // This is where campaign bytecode will reside
        bytes memory campaign_code;

        // _campaign_id for RewardPoints(1), Badges(2), Tickets(3), Codes(4)
        // Probably needs more data along with each type, changes as we go
        if (_campaign_type == 1) {
            campaign_code = abi.encodePacked(
                type(RewardPoints).creationCode,
                abi.encode(address(this))
            );
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                campaign_code
            );
            // Reward points campaigns increased
            _total_points_campaigns += 1;
        } else if (_campaign_type == 2) {
            campaign_code = abi.encodePacked(
                type(Badges).creationCode,
                abi.encode(address(this))
            );
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                campaign_code
            );
            // Badges campaigns increased
            _total_badges_campaigns += 1;
        } else if (_campaign_type == 3) {
            campaign_code = abi.encodePacked(
                type(Tickets).creationCode,
                abi.encode(address(this))
            );
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                campaign_code
            );
            // Total tickets
            _total_tickets_campaigns += 1;
        } else if (_campaign_type == 4) {
            campaign_code = abi.encodePacked(
                type(Codes).creationCode,
                abi.encode(address(this))
            );
            _campaign_addr = IDeployer(_campaigns_deployer).deploy_campaign(
                campaign_code
            );
            // Total codes
            _total_codes_campaigns += 1;
        }

        // Validate campaign deployment
        require(address(_campaign_addr) != address(0), "FailedCampDeploy!");
        // Increase total
        _total_campaigns += 1;
        // Add to list of deployed
        _campaign_type_to_list_of_deployed[_campaign_type].push(
            address(_campaign_addr)
        );
        // Insert into deployed campaign details
        _address_to_campaign_details[address(_campaign_addr)] = Campaign({
            _campaign_id: _total_campaigns - 1,
            _campaign_type: _campaign_type,
            _campaign_name: camp_name,
            _campaign_details: camp_details,
            _campaign_deployed_at: address(_campaign_addr),
            _campaign_active: true
        });
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

    function interact_rewardpoints(
        address customer,
        uint points,
        uint campaign_type,
        bool _is_allocation
    ) public roleEntity returns (uint total) {
        // Fidn last deployed reward points campaign
        address campAddr = _campaign_type_to_list_of_deployed[campaign_type][
            _total_points_campaigns - 1
        ];
        // If no points interaction, subscribe
        if (points == 0) {
            IRewardPoints(campAddr).subscribe_customer(customer);
            return 0;
        }
        // If it's an allocation - reward_points
        if (_is_allocation) {
            total = IRewardPoints(campAddr).reward_points(customer, points);
        } else {
            total = IRewardPoints(campAddr).redeem_points(customer, points);
        }
    }

    function interact_badges() public roleEntity returns (bool) {}

    function interact_tickets() public roleEntity returns (bool) {}

    function interact_codes() public roleEntity returns (bool) {}
}
