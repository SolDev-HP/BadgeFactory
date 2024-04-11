// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IDeployer {
    // It has only one work, deploy any given deploycode data and return address
    function deploy_campaign(bytes memory) external returns (address);

    // factoryonly function
    function change_accessor(address, bool) external returns (bool);
}
