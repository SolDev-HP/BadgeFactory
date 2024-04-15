// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./CampaignBase.sol";

// RewardPoints contract
// Responsible for everything related to reward points - distribution/claims
/// @title RewardPoints smart contract
/// @author SolDev-HP
/// @notice This contract is responsible for handling reward points redeem/claim and user subscription
/// @dev This is a campaign, it will be deployed by campaigndeployer and
/// the owner will be assigned to msg.sender

/// This is going to get more customized, once I implement the base Campaign contract,
///    - There are some basic functionality shared by all Campaigns (ICampaign.sol interface)
///    - Some common state variables like owner_Console, campaign_details_hash
///    -- change in campaign_details_hash will move to another var,
/// _cust_id_to_cust_address is internal custid related to this campaign only,
/// _is_cust_subscribed - will move to parent contract, it's crucial component for any campaign to make sure -
///    customer is subscribed because there are certain functions that can be done by customers and for that -
///    we need to have this modifier for basic check
contract RewardPoints is CampaignBase {
    // ------------- State Vars
    uint256 private _total_points;
    uint256 private _total_customers_counter;

    mapping(uint256 => address) private _cust_id_to_cust_address;
    mapping(address => bool) private _is_cust_subscribed;
    mapping(address => uint256) private _points_of_customer;

    // Probably need events if we need these data for analytics
    event RewardPointsRedeemed(address _customer, uint256 _points);
    event RewardPointsGained(address _customer, uint256 _points);

    // ------------- Modifier

    // Testing only
    modifier onlySelf(address customer) {
        require(_is_cust_subscribed[customer], "UnSubbed");
        require(msg.sender == customer, "OnlyYours!");
        _;
    }

    // Reward points can be
    // - Lifetype validity, no expiry, can be used anytime
    // - limited time validity, expires
    // - limited accessibility - no transfers

    // Owner of this campaign can
    //      (for future, this can may be use signed permit)
    // distribute reward points
    // change reward points type
    // deploy mini campaigns involving reward points main campaign

    // Customers can
    // redeem reward points
    // transfer reward points to friends, family
    constructor() {
        //campaign_owner_console = camp_owner;
        // This will be cloned onto loyaltyConsole whenever required
        // Deploy once but cloned as many times as required
    }

    // A simple public function to get details (metadata) of this campaign
    function get_campaign_details()
        public
        view
        returns (bytes memory details_hash)
    {
        details_hash = campaign_details_hash;
    }

    // Something to override for basic checks
    function get_campaign_type_and_details()
        public
        view
        override
        returns (bytes memory campaign_hash, bytes memory campaign_type)
    {
        campaign_hash = campaign_details_hash;
        campaign_type = "Reward Points / (maybe) Air Miles";
    }

    // This can be done by customer themselves, but for now we keep
    // access control with console so everything can be done from
    // console --
    // @todo - customer can be wallet address or phone number or email address or a QR code (wallet mixed with coupon/badge)
    // Instead of storing customer details on here, store it on local ipfs node
    // This hash can be used as a customer identifier.
    // This is hash similar to Campaign struct hash, but the difference is that it's not public
    // This can be handled by business/brands on their own or can use default provided by badgefactory backend
    // For CampaignDetails struct, (future: Badges images/gifs(media), tickets media, Codes media) can be -
    // on public ipfs, they are for UI and doesn't contain actual operational data
    function subscribe_customer(address customer) external onlyConsole {
        require(!_is_cust_subscribed[customer], "AlreadySubbed!");
        // Assign custid->address
        _cust_id_to_cust_address[_total_customers_counter] = customer;
        // Increase total number
        _total_customers_counter += 1;
        // Customer has subscribed
        _is_cust_subscribed[customer] = true;
    }

    // Need these two for later customizations for customer data,
    // currently we only use wallet address for POC.
    // data hash for customer data can only work if we store that data securely, not on ipfs.
    // So internal ipfs here will be considered ipfs controlled by loyaltyconsole deployer entities.
    // but campaign data can be actively available, so public writtable ipfs node can work.

    // function subscribe_customer(bytes customer_data_hash) external onlyConsole {}
    // function unsubscribe_customer(bytes customer_data_hash) external onlyConsole {}
    // function update_customer(bytes customer_data_hash) external onlyConsole {}
    // function update_profile(bytes customer_data_extended) external onlySelf {//cust only}

    function total_subscribers()
        external
        view
        onlyConsole
        returns (uint256 no_of_subs)
    {
        no_of_subs = _total_customers_counter;
    }

    // OnlyEntity can access any subscriber's points
    function check_subscriber_points(
        address customer
    ) external view onlyConsole returns (uint256 total_points) {
        return _points_of_customer[customer];
    }

    // Subscriber can only see their own points
    function get_self_points(
        address customer
    ) external view onlySelf(customer) returns (uint256 total_points) {
        return _points_of_customer[customer];
    }

    // Tester, remove in prod
    function check_owner() external view returns (address) {
        return campaign_owner;
    }

    function reward_points(
        address customer,
        uint256 _additional_points
    ) external onlyConsole {
        // Is this customer subscribed?
        require(_is_cust_subscribed[customer], "NotSubbed");
        // Reward customer with points
        // Customer identifier required
        unchecked {
            _points_of_customer[customer] += _additional_points;
            // Increase total circulating points count
            _total_points += _additional_points;
        }
        emit RewardPointsGained(customer, _additional_points);
    }

    function redeem_points(
        address customer,
        uint256 _redeemed_points
    ) external onlyConsole {
        // Customer subscribed?
        require(_is_cust_subscribed[customer], "NotSubbed");
        // Customer redeems the points
        require(
            _points_of_customer[customer] >= _redeemed_points,
            "NotEnoughPoints"
        );
        require(_total_points >= _redeemed_points, "CantHappen");
        unchecked {
            // reduce customer's points, it can become 0
            _points_of_customer[customer] -= _redeemed_points;
            // reduce total as well, bugfix
            _total_points -= _redeemed_points;
        }
        emit RewardPointsRedeemed(customer, _redeemed_points);
    }
}
