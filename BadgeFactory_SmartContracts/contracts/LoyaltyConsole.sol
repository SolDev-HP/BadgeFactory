// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IDeployer.sol";
import "./interfaces/ICampaignBase.sol";
import "./interfaces/IRewardPoints.sol";

import "./interfaces/IBadges.sol";

// import "./interfaces/ITickets.sol";
// import "./interfaces/ICodes.sol";

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
    uint256 public total_campaigns;
    // Only total, @todo add way to check support for given campaign type
    uint256 public total_supported_campaigns;
    // Home Address
    address private _factory;
    address private _campaigns_deployer;
    uint256 private _total_customers;

    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) public _is_address_Entity;
    // This would change once we add Customer_data_hash, for now it'll work
    mapping(address => bool) public _is_address_Customer;
    // Supported campaigns - and where their clones are (Address)
    mapping(address => bool) public is_address_Campaign;
    enum Campaign_Types {
        UNDEFINED, //0
        REWARD_POINTS, //1
        BADGES, //2
        TICKETS, //3
        CODES //4
    }
    Campaign_Types camp_type_choice;
    mapping(uint256 => uint256) public campaign_type_to_deploy_count;
    mapping(uint256 => address) private _campaign_type_to_implementation;

    // LoyaltyConsole:
    // Entity: deploy new campaigns, register new users, modify campaigns, remove campaigns
    // Customer: participate or register with entity

    // Entity can deploy same campaign multiple times
    // record all deployments to keep track within this console
    mapping(uint256 => address[]) public _campaign_type_to_list_of_deployed;

    // Add customer subscription here, campaign interactions happen from
    // console (for now) anyway
    // This will later change to id => cust_data_hash
    mapping(uint256 => address) private _cust_id_to_cust_address;

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
            _campaign_type_to_implementation[
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
    // And campaign backcalling to validate customer?
    // One place I can think of is where we call onlySelf() with custoemr-
    // address. So we callback to validate that address, and only child-
    // campaigns can do that
    modifier roleCampaign() {
        require(is_address_Campaign[msg.sender], "CampaignOnly!");
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
        // cust_id is what total_customer is right now, so first cust starts at 0
        _cust_id_to_cust_address[_total_customers] = customer_data;
        // total customers have increased
        _total_customers += 1;
        // customer is now subscribed to use the loyalty system
        _is_address_Customer[customer_data] = true;
    }

    // And later unsubscribe_from_loyalty_system()

    // Check from campaign if current customer
    function is_customer(
        address customer
    ) external view roleCampaign returns (bool) {
        return _is_address_Customer[customer];
    }

    // Deploying campaigns through console
    // I know it wont return anything, but currently declared
    // return var is reused within the function, so I'm keeping it until next Refactor comes @todo

    // pCampaign_details_hash[0] is always CampaignData struct
    // pCampaign_details_hash[1...N] are badges/tickets/coupons depending on campaign type
    function start_campaign(
        uint256 p_campaign_type,
        bytes[] memory p_campaign_details_hash
    ) public roleEntity returns (address _campaign_addr) {
        // Verify that we have atleast 1 hash with details
        // dont matter if it's 0x0 but there has to be atleast one
        require(p_campaign_details_hash.length > 0, "Atleast1Hash");
        // Assumed
        require((0 < p_campaign_type) && (p_campaign_type < 5), "1to4Only!");
        // Deployer is needed but deployer doesn't do anything for now. if you run into this,
        // unittests are failing
        require(address(_campaigns_deployer) != address(0), "DeployerNeeded!");

        // Do we have requested campaign implementation available?
        require(
            _campaign_type_to_implementation[p_campaign_type] != address(0x0),
            "CampNotSupported"
        );

        // Clone required campaign type
        _campaign_addr = Clones.clone(
            _campaign_type_to_implementation[p_campaign_type]
        );
        // Validate campaign deployment
        require(address(_campaign_addr) != address(0), "FailedCampDeploy!");
        // Set self as campaign owner, campaign control is on console
        ICampaignBase(_campaign_addr).set_campaign_owner(address(this));
        //// one hash sets by default, this sets Campaignbase details_hash
        ICampaignBase(_campaign_addr).set_campaign_details(
            p_campaign_details_hash[0]
        );
        if (p_campaign_details_hash.length > 1) {
            // we verified that hashs array contain atleast one element
            // Set total_badges_types first
            // Not checking campaign_type for now as the only other type is badges
            // tickets and codes are still in skeleton stage, so this will change when
            // those are implemented like rewardpoints and badges campaigns contract : @todo
            IBadges(_campaign_addr).set_total_badges_types(
                p_campaign_details_hash.length - 1 // As first hash is parent hash - CampaignData
                // Second onwards are badges/or any other that require multiple file hashes
            );
            // Then setup all badges types with their corresponding details_hash in the list
            IBadges(_campaign_addr).set_all_badges_details_hashes(
                p_campaign_details_hash
            );
        }
        // _campaign_id for RewardPoints(1), Badges(2), Tickets(3), Codes(4)
        // Probably needs more data along with each type, changes as we go
        // Set campaign details hash, update related campaign counter
        campaign_type_to_deploy_count[p_campaign_type] += 1;
        // Increase total
        total_campaigns += 1;
        // Add to list of deployed
        _campaign_type_to_list_of_deployed[p_campaign_type].push(
            address(_campaign_addr)
        );
        // the address is now a campaign
        is_address_Campaign[_campaign_addr] = true;
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
        uint256 campaign_type,
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
            campaign_type_to_deploy_count[campaign_type] - 1
        ];
        // If no points interaction (points are 0), subscribe
        if (points == 0) {
            // If we add a custoemr into reward points, add into loyaltyconsole
            // Subscribe to loyalty system as well, if not already
            if (!_is_address_Customer[customer]) {
                subscribe_to_loyalty_system(customer);
                // This will change in later versions
                _is_address_Customer[customer] = true;
            }
            // This way, we allow customer to choose if they'd want to
            // participate in any given loyalty campaign. By default, they
            // are included, but they can interct with campaign and unsubscribe
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

    // Now we have following functionality in badges

    function interact_badges(
        address customer,
        uint256 _p_action,
        uint256 _p_awarded_badge_type, // can be 0 for other actions
        bytes[] memory _badges_hashes // along with updated campaigndetails struct too at 0 index
    ) public roleEntity {
        // So for badges, we can have following interactions:
        // Subscribe(1): customer subscribe to deployed badges campaign
        // Set_Total_types_of_Badges(2): set total types of badges(uint256 x)
        // set_all_badges_details(3):
        // award_badge_to_customer(4):
        // Entity creates badges campaign
        // Is customer registered
        if (_p_action == 1) {
            subscribe_to_loyalty_system(customer);
            return;
        }
        // Make sure we have the campaign deployed
        // uint256 campaign_type = uint(Campaign_Types.BADGES);
        require(
            _campaign_type_to_list_of_deployed[2][
                campaign_type_to_deploy_count[2] - 1
            ] != address(0x0),
            "NoCampaign"
        );

        // Get the campaign deployment address
        // Get the latest deployed rewardpoints campaign
        address campAddr = _campaign_type_to_list_of_deployed[2][
            // make sure to grab the latest badges deployed
            campaign_type_to_deploy_count[2] - 1
        ];

        if (_p_action == 3) {
            IBadges(campAddr).set_all_badges_details_hashes(_badges_hashes);
            return;
        }

        if (_p_action == 4) {
            require(_p_awarded_badge_type != 0, "TypeStartsAt1");
            IBadges(campAddr).award_badge(customer, _p_awarded_badge_type);
            return;
        }
    }

    // Badges view related functionalities can be grouped here
    // For now we have total_held_by_customer
    function view_badges(
        address customer
    ) public view roleEntity returns (uint256) {
        // need to make sure campaign(badges) is deployed
        uint256 campaign_type = uint(Campaign_Types.BADGES);
        require(
            _campaign_type_to_list_of_deployed[campaign_type][0] !=
                address(0x0),
            "NoCampaign"
        );

        // Get campaign address
        address campAddr = _campaign_type_to_list_of_deployed[campaign_type][
            // make sure to grab the latest badges deployed
            campaign_type_to_deploy_count[campaign_type] - 1
        ];

        // This will change later, right now I'm concerned with total held
        return IBadges(campAddr).total_customer_held_badges(customer);
    }

    function interact_tickets() public roleEntity {}

    function interact_codes() public roleEntity {}
}
