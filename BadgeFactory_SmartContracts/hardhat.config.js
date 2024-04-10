require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Default we take internal hardhat node
  // defaultNetwork: hardhat,
  sourcify: {
    enabled: false,
  },
  // Available network
  // hardhat - default network
  // hardhat_mainnet_fork - eth mainnet fork on local hardhat node
  // hardhat_morphl2_fork - eth mainnet fork on local hardhat node
  // hardhat_morphl2_testnet - live morphL2 testnet network!!
  networks: {
    hardhat_eth_fork: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      forking: {
        url: process.env.INFURA_ETH_RPC,
        enabled: true,
      },
    },
    // For MorphL2_Fork - Use testnet RPC from docs
    hardhat_morphl2_fork: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      forking: {
        url: "https://rpc-testnet.morphl2.io",
        enabled: true,
      },
    },
    hardhat_morphl2_testnet: {
      url: "", //process.env.MORPHL2_RPC,
      chainId: 2710,
      currency: "ETH",
      // Add MorphL2 testnet details like chainid and stuff here
      // accounts: [`0x${process.env.OWNER}`],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
    overrides: {},
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  mocha: {
    timeout: 100000000, // This is for tests only, real tx shouldn't take long
  },
  etherscan: {
    // Setup for MorphL2 only
    // This will be needed further in Verify
    // https://docs.morphl2.io/docs/build-on-morph/build-on-morph/verify-your-smart-contracts/
    // @todo fix before submission
    apiKey: {
      morphTestnet: "TO-DO",
    },
    customChains: [
      {
        network: "morphTestnet",
        chainId: 2710,
        urls: {
          apiURL: "https://explorer-api-testnet.morphl2.io/api ",
          browserURL: "https://explorer-testnet.morphl2.io/",
        },
      },
    ],
  },
};
