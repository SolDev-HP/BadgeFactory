// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract LoyaltyConsole {
    // LoyaltyConsole:
    // Entity: deploy new campaigns, register new users, modify campaigns, remove campaigns
    // Customer: participate or register with entity

    // Role mapper
    // @todo: verify msg.sender vs tx.origin
    mapping(address => bool) private _isEntity;
    mapping(address => bool) private _isCustomer;
    modifier roleEntity() {
        require(_isEntity[msg.sender], "EntityOnly");
        _;
    }
    modifier roleCustomer() {
        require(_isCustomer[msg.sender], "CustOnly");
        _;
    }
}
