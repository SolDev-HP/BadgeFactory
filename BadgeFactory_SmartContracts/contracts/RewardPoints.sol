// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// RewardPoints contract
// Responsible for everything related to reward points - distribution/claims
/// @title RewardPoints smart contract
/// @author SolDev-HP
/// @notice This contract is responsible for handling reward points redeem/claim and user subscription
/// @dev This is a campaign, it will be deployed by campaigndeployer and
/// the owner will be assigned to msg.sender
contract RewardPoints {
    // ------------- State Vars
    address public campaign_owner_console;
    uint256 private _total_points;
    uint256 private _total_customers_counter;

    mapping(uint256 => address) private _cust_id_to_cust_address;
    mapping(address => bool) private _is_cust_subscribed;
    mapping(address => uint256) private _points_of_customer;

    // Probably need events if we need these data for analytics
    event RewardPointsRedeemed(address _customer, uint256 _points);
    event RewardPointsGained(address _customer, uint256 _points);

    // ------------- Modifier
    modifier onlyConsole() {
        require(msg.sender == campaign_owner_console, "OnlyConsole!");
        _;
    }

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
    constructor(address camp_owner) {
        campaign_owner_console = camp_owner;
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
    // function update_customer(bytes customer_details_hash) external onlyConsole {}
    // function update_profile(bytes customer_data_extended) external onlySelf {//cust only}

    function total_subscribers()
        external
        view
        onlyConsole
        returns (uint256 no_of_subs)
    {
        no_of_subs = _total_customers_counter;
    }

    function check_points(
        address customer
    ) external view onlyConsole returns (uint256 total_points) {
        return _points_of_customer[customer];
    }

    function check_my_points(
        address customer
    ) external view onlySelf(customer) returns (uint256 total_points) {
        return _points_of_customer[customer];
    }

    function check_owner() external view returns (address) {
        return campaign_owner_console;
    }

    function reward_points(
        address customer,
        uint256 _additional_points
    ) external onlyConsole returns (uint256 customer_new_total) {
        // Is this customer subscribed?
        require(_is_cust_subscribed[customer], "NotSubbed");
        // Reward customer with points
        // Customer identifier required
        unchecked {
            _points_of_customer[customer] += _additional_points;
            // Increase total circulating points count
            _total_points += _additional_points;
            // Returns customer's new points total
            customer_new_total = _points_of_customer[customer];
        }
        emit RewardPointsGained(customer, _additional_points);
    }

    function redeem_points(
        address customer,
        uint256 _redeemed_points
    ) external onlyConsole returns (uint256 customer_new_total) {
        // Customer subscribed?
        require(_is_cust_subscribed[customer], "NotSubbed");
        // Customer redeems the points
        require(
            _points_of_customer[customer] >= _redeemed_points,
            "NotEnoughPoints"
        );
        require(_total_points >= _redeemed_points, "CantHappen");
        unchecked {
            _points_of_customer[customer] -= _redeemed_points; // reduce customer's points, it can become 0
            customer_new_total = _points_of_customer[customer]; // return new total balance
        }
        emit RewardPointsRedeemed(customer, _redeemed_points);
    }
}
