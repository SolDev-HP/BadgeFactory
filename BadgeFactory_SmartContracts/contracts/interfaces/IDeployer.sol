// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IDeployer {
    // It has only one work, deploy any given deploycode data and return address
    function deploy(bytes memory) external returns (address);
}
