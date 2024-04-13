// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IDeployer.sol";
import "./interfaces/ICampaign.sol";
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

    // Campaign type and details
    // Campaign can also have campaignCreationTimestamp -
    // campaign expiry in campaignExpiryTimestamp/campaignEndTimestamp
    // Can we move this storage to ipfs? that way we only use one variable (bytes) of ipfs datahash
    // struct Campaign {
    //     uint256 _campaign_id;
    //     uint256 _campaign_type;
    //     bytes32 _campaign_name; // 32 lettes name
    //     bytes32 _campaign_details; // 32 letters details (Can change later)
    //     address _campaign_deployed_at;
    //     bool _campaign_active;
    // }
    // Using one var instead
    // mapping(address => bytes) public _address_to_campaign_details_hash;

    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) private _is_address_Entity;
    mapping(address => bool) private _is_address_Customer;
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
        uint p_campaign_type,
        bytes memory p_campaign_details_hash
    ) public roleEntity returns (address _campaign_addr) {
        // Assumed
        require((0 < p_campaign_type) && (p_campaign_type < 5), "1to4Only!");
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
        ICampaign(_campaign_addr).set_campaign_owner(address(this));
        // _campaign_id for RewardPoints(1), Badges(2), Tickets(3), Codes(4)
        // Probably needs more data along with each type, changes as we go
        if (p_campaign_type == 1) {
            IRewardPoints(_campaign_addr).set_campaign_details(
                p_campaign_details_hash
            );
            // Reward points campaigns increased
            _total_points_campaigns += 1;
        } else if (p_campaign_type == 2) {
            IBadges(_campaign_addr).set_campaign_details(
                p_campaign_details_hash
            );
            // Badges campaigns increased
            _total_badges_campaigns += 1;
        } else if (p_campaign_type == 3) {
            ITickets(_campaign_addr).set_campaign_details(
                p_campaign_details_hash
            );
            // Total tickets
            _total_tickets_campaigns += 1;
        } else if (p_campaign_type == 4) {
            ICodes(_campaign_addr).set_campaign_details(
                p_campaign_details_hash
            );
            // Total codes
            _total_codes_campaigns += 1;
        }

        // Validate campaign deployment
        require(address(_campaign_addr) != address(0), "FailedCampDeploy!");
        // Increase total
        _total_campaigns += 1;
        // Add to list of deployed
        _campaign_type_to_list_of_deployed[p_campaign_type].push(
            address(_campaign_addr)
        );
        // Insert into deployed campaign details
        // It now stores hash of ipfs where we store Campaign structure
        // now we don't need it actually
        // _address_to_campaign_details_hash[
        //     address(_campaign_addr)
        // ] = p_campaign_details_hash;
        // _address_to_campaign_details_hash[address(_campaign_addr)] = Campaign({
        //     _campaign_id: _total_campaigns - 1,
        //     _campaign_type: _campaign_type,
        //     _campaign_name: camp_name,
        //     _campaign_details: camp_details,
        //     _campaign_deployed_at: address(_campaign_addr),
        //     _campaign_active: true
        // });
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
