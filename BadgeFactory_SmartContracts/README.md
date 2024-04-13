BadgeFactory - Smart Contracts

This is smart contracts folder for BadgeFactory product.
This will include all MorphL2 smart contracts for following things:

- Reward Points (ERC20 + Extended for badgefactory)
- Loyalty Badges (ERC721 + Extended)
- Event Tickets (ERC721 + Extended)
- Discount/Coupon Codes

This will use following things:

- Hardhat as testing and development framework
- MarphL2 smart contracts
- Tests and local deployments

Note: LiquidityConsoleTests.js can only run if you have set IPFS_RPC
It can be public (has to be a ["Writeable Gateway"](https://discuss.ipfs.tech/t/writeable-http-gateways/210)) or local private node (running throuogh `ipfs daemon --offline`). I am using kubo ipfs node from /BadgeFactory_Tools/Local_IPFS_Node. Use that folder and follow the README file.
Following operations will happen on IPFS

- Add file /api/v0/add // [On RPC Server ]
- Retrieve file /ipfs/<CID> // [Get on Gateway]

-- @todo task list

- Move role management to OpenZeppelin accesscontrol lib
- Change custom factory pattern to officially available ones
- Change start_campaign to utilize Clones minimal proxy, use preexisting implementation of campaigns | This requires initialize() function that changes campaign as desired

dev notes:

File - LoyaltyConsole.sol on what Campaign struct contains right now and what is can contain in further developments

```solidity
// We store this on ipfs so we don't have this on contracts
// struct Campaign {
//     uint256 _campaign_id;                // ID [TotalCampaignsDeployed+1] don't have this?
//     bytes32 _campaign_name;              // 32 lettes name (becuase bytes32, extended can be bytes if needed)
//     bytes32 _campaign_details;           // 32 letters details (Can change later)
//     uint256 _campaign_type;              // campaign_type [1, 2, 3, 4]
//     bool _campaign_active;               // Set later?
// }
// What this structure can be
// Campaign type and details
// Campaign can also have campaignCreationTimestamp -
// campaign expiry in campaignExpiryTimestamp/campaignEndTimestamp
```

File - RewardPoints.sol on how customer subscription to a campaign should work, and with what kind of customer details (For later versions)

```solidity
// @todo - customer can be wallet address or phone number or email address or a QR code (wallet mixed with coupon/badge)
// Instead of storing customer details on here, store it on local ipfs node
// This hash can be used as a customer identifier.
// This is hash similar to Campaign struct hash, but the difference is that it's not public
// This can be handled by business/brands on their own or can use default provided by badgefactory backend
// For CampaignDetails struct, (future: Badges images/gifs(media), tickets media, Codes media) can be -
// on public ipfs, they are for UI and doesn't contain actual operational data
```

further on Campaign struct

```solidity

```

about using ipfs:

- for demonstration purposes, I can setup a local IPFS Kubo client that's not connected to the IPFS netwerk
  references from ipfs docs
  https://docs.ipfs.tech/install/command-line/#local-daemon
  If you would like to use that for testing, go to /BadgeFactory_Tools/Local_IPFS_Node/
  - install ipfs
  - init ipfs repository
  - run `ipfs daemon --offline`
  - update ipfs node rpc in .env file
