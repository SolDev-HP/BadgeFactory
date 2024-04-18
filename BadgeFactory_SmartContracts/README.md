## BadgeFactory - Smart Contracts

This is smart contracts folder for BadgeFactory product.
Supports deploying campaigns such as RewardPoints, Badges, Tickets, Codes, and more to be added as I go.
These campaigns are smart contracts with base of ICampaign (@todo yet to migrate to this one but on the way) and other extention addition based on user selection (like erc20, erc721, erc1155, and more).
(For example, if we wanted to deploy reward points as erc20 with customizations such as expiry and bonus at certain milestones, many such customizations as CampaignDetails struct)

This will include all MorphL2 smart contracts for following things:

- Basic Reward Points // I am almost done with this. :D
- Basic Badges (ERC721 soulbound)
- Basic Tickets (ERC721 soulbound/transferable/expirable)
- Basic Codes (ERC721 soulbound/transferable/expirable)
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

- [ ] Move role management to OpenZeppelin accesscontrol lib
- [ ] Change custom factory pattern improvement
- [x] Change start_campaign to utilize Clones minimal proxy, use preexisting implementation of campaigns | This requires initialize() function that changes campaign as desired (I am now using OpenZeppelin EIP 1167 clones)

#### dev notes:

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
Stored onchain - \_campaign_id, \_campaign_type, \_campaign_owner
Everything else if stored within this struct of campaignDetails, and then this is stored on ipfs
Campaign only contains this details hash.

Same as root main README file, internal changes will be updated in this struct

```solidity
const campaignDetails = {
    _campaign_id: Number(totalCampaigns) + 1,    // Some identifier, for now we keep it total+1
    _campaign_type: [1...4],                     // type of campaign (selectable range [1, 4])
    _campaign_name: "Campaign Name",             // bytes32, only 32 letters ascii
    _campaign_details: "Campaign Details",       // bytes32, only 32 letters ascii
    _campaign_start_date: "block.timestamp?",    // Starting datetime of Campaign
    _campaign_end_date: "block.timestamp?",      // Campaign ending datetime
    _campaign_owner: address,                    // Which console deployed it
    _campaign_specific_data: {
    // Campaign specific data, only one of them will be active for any given campaign and its details
    // This base structure will expand as new campaign types are added
    //
        _reward_points_campaign: {
            // how do you earn? purchase, interaction, distribution
            _earning_rules: {
                // At present we allow redeem/reward or x amount of points
                // assumption is 1:1, Entity decides how many points to assign for
                // any given interaction or purchase or visit or anything reward worthy
                _default_rate: 1,       // We may add customization to change this
                _changers_updaters: {}, // Incase of custom reward points redeem/reward rule need
            },
            _welcome_bonus: 10000,       // If Entity would like to give them welcome bonus as soon as they(customers) subscribe or register themselves
            _earning_ceiling: 5000000,   // any max amount customers can obtain before hiting ceiling
            // how do you redeem
            _max_redeemable_at_once: 5000,  // Max in one interaction. can be 0 for any amount allowed
            _redemption_option: {}, // Not need for now, may be prefix points->product kind of thing
            // is expirable?
            _is_expirable: false,
            _expiry: timestamp,
            // is transferable?
        },
        _badges_campaign: {
            // Badge criteria - what it's given for, ex. ["Top User of the Day/Week/Month/Year" or something :D]
            _types_of_badges: 10,               // Number of different types of badges (in view and their utility decided by Entity)
            _badges_details: [
                // This will repeat for all types of badges
                {
                    _badge_for: "string",
                    _badge_details: "",
                    // Badge itself - the UI and look and feel of badge (image or gif or svg -> ipfs)
                    _badge_view: img | svg | gif,
                    _can_expire: true/false,
                    _expiry: timestamp,
                    _can_transfer: true/false,
                    _img_ipfs_hash: bytes,
                    // can add more functional details but these are mainly for UI/UX
                    // smartcontracts are only handling the hash of that ipfs data
                    // This can change based on which details are important enough to be
                    // kept in the contract itself, for example - timestamps seem they belong on
                    // contract as they can be used for verification. And more..
                },
            ],
            // Badge Visibility (publicly visible to everyone or limited visibility)
            _badge_visibility: "string",
        },
        _tickets_campaign: {
            // What are they for
            // Expiry
            // is Transferable?
            // any other restrictions...
            // Not considering for this hackathon, but will add once it's done
        },
        _codes_campaign: {
            // What is it? Coupon code or discount code
            // If coupon, how much discount does it apply
            // If discount code, what discount that code relates to
            // expiry,
            // is Transferable?
            // any other restrictions..
            // Not considering for this hackathon, but will add once it's done.
        },
    },
    _campaign_active: true,                         // Is campaign currently active
};
```

#### about using ipfs:

- for demonstration purposes, I can setup a local IPFS Kubo client that's not connected to the IPFS netwerk
  references from ipfs docs
  https://docs.ipfs.tech/install/command-line/#local-daemon
  If you would like to use that for testing, go to /BadgeFactory_Tools/Local_IPFS_Node/
  - install ipfs
  - init ipfs repository
  - run `ipfs daemon --offline`
  - update ipfs node rpc in .env file
