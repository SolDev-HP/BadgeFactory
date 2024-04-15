// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IDeployer.sol";
import "./interfaces/ICampaignBase.sol";
import "./interfaces/IRewardPoints.sol";
// for type(campaign).creationCode
import "./interfaces/IBadges.sol";
import "./interfaces/ITickets.sol";
import "./interfaces/ICodes.sol";

// Campaign types are:
// 1 - Reward Points
// 2 - Badges
// 3 - Tickets
// 4 - Codes
contract LoyaltyConsole {
    // Total campaigns deployed vs total running
    // Useful for UI interactions
    // Keeping them all public can be useful in UI/UX
    // These can be moved to private or offchain, we can keep track of each with event emitted
    // @todo check if it actually saves gas and storage space
    uint256 public _total_campaigns;
    uint256 public total_supported_campaigns;
    uint256 public _total_points_campaigns;
    uint256 public _total_badges_campaigns;
    uint256 public _total_tickets_campaigns;
    uint256 public _total_codes_campaigns;
    // Home Address
    address private _factory;
    address private _campaigns_deployer;

    // Supported campaigns - and where their clones are (Address)
    enum Campaign_Types {
        REWARD_POINTS,
        BADGES,
        TICKETS,
        CODES
    }
    Campaign_Types camp_type_choice;
    mapping(uint256 => address) private campaign_type_to_implementation;

    // LoyaltyConsole:
    // Entity: deploy new campaigns, register new users, modify campaigns, remove campaigns
    // Customer: participate or register with entity

    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) private _is_address_Entity;
    // This would change once we add Customer_data_hash, for now it'll work
    mapping(address => bool) private _is_address_Customer;

    // Entity can deploy same campaign multiple times
    // record all deployments to keep track within this console
    mapping(uint256 => address[]) private _campaign_type_to_list_of_deployed;

    // ------------- Constructor
    // Deploy with list of deployable + supported campaigns for this console
    // i.e. customizable console
    constructor(
        address factory_address,
        uint256[] memory supported_types,
        address[] memory types_implementations
    ) {
        // Whoever originated the tx, not the creation happened by badgefactory
        // because msg.sender will be badgefactory always
        _factory = factory_address;
        require(_factory == msg.sender, "OnlyFactory!"); // Interesting check, need to see if it works
        // Msg.sender here will always be factory
        // tx.origin should be business/brand that is interacting with BadgeFactory.sol
        _is_address_Entity[tx.origin] = true;
        for (uint256 i = 0; i < supported_types.length; i++) {
            campaign_type_to_implementation[
                supported_types[i]
            ] = types_implementations[i];
            total_supported_campaigns += 1;
        }
    }

    // ------------- Modifiers
    // Next refactor: move to openzeppelin role management maybe?
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

    // Subscribe customer for loyalty campaigns, this could easily
    // allow console to deploy new campaigns considering existing subscribers
    // and not subscribe everyone for every campaign deployed
    // For now Entity manually subscribes customer with their customer_data (wallet address for now)
    function subscribe_to_loyalty_system(
        address customer_data
    ) public roleEntity {
        require(!_is_address_Customer[customer_data], "AlreadySubbed");
        _is_address_Customer[customer_data] = true;
    }

    // And later unsubscribe_from_loyalty_system()

    // Deploying campaigns through console
    // I know it wont return anything, but currently declared
    // return var is reused within the function, so I'm keeping it until next Refactor comes @todo
    function start_campaign(
        uint p_campaign_type,
        bytes memory p_campaign_details_hash
    ) public roleEntity returns (address _campaign_addr) {
        // Assumed
        require((0 < p_campaign_type) && (p_campaign_type < 5), "1to4Only!");
        // Deployer is needed but deployer doesn't do anything for now. if you run into this,
        // unittests are failing
        require(address(_campaigns_deployer) != address(0), "DeployerNeeded!");

        // Do we have requested campaign implementation available?
        require(
            campaign_type_to_implementation[p_campaign_type] != address(0x0),
            "CampNotSupported"
        );

        // Clone required campaign type
        _campaign_addr = Clones.clone(
            campaign_type_to_implementation[p_campaign_type]
        );
        // Validate campaign deployment
        require(address(_campaign_addr) != address(0), "FailedCampDeploy!");
        // Set self as campaign owner, campaign control is on console
        ICampaignBase(_campaign_addr).set_campaign_owner(address(this));
        ICampaignBase(_campaign_addr).set_campaign_details(
            p_campaign_details_hash
        );
        // _campaign_id for RewardPoints(1), Badges(2), Tickets(3), Codes(4)
        // Probably needs more data along with each type, changes as we go
        // Set campaign details hash, update related campaign counter
        if (p_campaign_type == 1) {
            // Reward points campaigns increased
            _total_points_campaigns += 1;
        } else if (p_campaign_type == 2) {
            // Badges campaigns increased
            _total_badges_campaigns += 1;
        } else if (p_campaign_type == 3) {
            // Total tickets
            _total_tickets_campaigns += 1;
        } else if (p_campaign_type == 4) {
            // Total codes
            _total_codes_campaigns += 1;
        }

        // Increase total
        _total_campaigns += 1;
        // Add to list of deployed
        _campaign_type_to_list_of_deployed[p_campaign_type].push(
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

    // Manually end any running campaign
    // Implement function end_campaign(campaign_id) - set active false
    // Implement auto end_campaign() - based on timestamp end_campaign - should update to active false (how?)

    function interact_rewardpoints(
        address customer,
        uint points,
        uint campaign_type,
        bool _is_allocation
    ) public roleEntity {
        // Fidn last deployed reward points campaign
        // Make sure we have atleast 1 reward points campaign deployed
        require(
            _campaign_type_to_list_of_deployed[campaign_type][0] !=
                address(0x0),
            "NoCampaign"
        );
        // Get the latest deployed rewardpoints campaign
        address campAddr = _campaign_type_to_list_of_deployed[campaign_type][
            _total_points_campaigns - 1
        ];
        // If no points interaction (points are 0), subscribe
        if (points == 0) {
            _is_address_Customer[customer] = true;
            IRewardPoints(campAddr).subscribe_customer(customer);
        } else {
            // if points are nonzero, it's an reward/redeem - reward_points
            if (_is_allocation) {
                IRewardPoints(campAddr).reward_points(customer, points);
            } else {
                IRewardPoints(campAddr).redeem_points(customer, points);
            }
        }
    }

    function interact_badges() public roleEntity {}

    function interact_tickets() public roleEntity {}

    function interact_codes() public roleEntity {}
}
