// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ICodes {
    // Customer subscription
    // This will move to base soon
    // There we can deploy this for existing customers and register new ones
    // or may be loyaltyConsole itself, as we need customer reg/sub there too
    function subscribe_customer(address) external;
}
