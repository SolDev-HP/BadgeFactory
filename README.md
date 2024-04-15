# BadgeFactory

BadgeFactory - A MorphL2 Sparkloom hackathon POC for the product

Structure:

1. [BadgeFactory_SmartContracts](/BadgeFactory_SmartContracts/README.md) - Smart contracts for MorphL2, Hardhat
2. [BadgeFactory_Dashboard](/BadgeFactory_Dashboard/README.md) - Deployment control panel for system users, Nextjs
3. [BadgeFactory_Mobile](/BadgeFactory_Mobile/README.md) - Mobile app for customers to store their rewards/tickets/coupons and generate qr code to scan/verify to redeem/claim loyalty offers
4. [BadgeFactory_Tools](/BadgeFactory_Tools/README.md) - BadgeFactory dev tools, expect to use if you're going to run all available unittests in /BadgeFactory_SmartContracts/

This hackathon submission goal would be finished SmartContracts and some part of dashboard for easy access and visibility into whole vision of BadgeFactory.
More will be added here as I progress on creating BadgeFactory for this hackathon (MorphL2 Sparkloom)

---

Update: 11/04
This is how I see these projects will interact, this will keep updating as we implement the basic idea of loyalty management system console for any Entity (Business/Brand/Project)

Update: 13/04
Legends are renamed correctly, many functions are already implemented in smart contracts, check hardhat config for morphl2 config and rpc, use hardhat_morphl2_fork in --network option to fork morphl2 chain current state locally and perform tests of BadgeFactory, LoyaltyConsole, RewardPoints unittests on it.
![Will be updated periodically throughout](https://github.com/SolDev-HP/BadgeFactory/raw/main/assets/imgs/BadgeFactory-uml-flow.png)

---

IF want to run local IPFS daemon:
/BadgeFactory_Tools/Local_IPFS_Node/kubo_local and then run `sudo bash install.sh`

---

On branch: feature_campaign_struct
Reason: We need a generalized campaign details structure for reward points, loyalty badges, tickets, and coupon/discount codes. As I have following structure in place, I'll expand upon it and modify unittest data accordingly.

All of this complexity will hide under a simple UI/UX of BadgeFactory that allows seamless deployment of any campaign in minutes. Just select the available and supported types, add details, deploy, and start using those campaigns.

```javascript
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
