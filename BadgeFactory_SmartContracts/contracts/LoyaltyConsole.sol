// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract LoyaltyConsole {
    // Home Address
    address private _factory;
    // LoyaltyConsole:
    // Entity: deploy new campaigns, register new users, modify campaigns, remove campaigns
    // Customer: participate or register with entity

    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) private _is_address_Entity;
    mapping(address => bool) private _is_address_Customer;

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
