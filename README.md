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
            // how do you earn
            // how do you redeem
            // is expirable?
            // is transferable?
        },
        _badges_campaign: {
            // Badge criteria - what it's given for, ex. ["Top User of the Day/Week/Month/Year" or something :D]
            // Badge itself - the UI and look and feel of badge (image or gif or svg -> ipfs)
            // Badge Visibility (publicly visible to everyone or limited visibility)
            // is Badge expirable
            // is Badge Transferrable?
        },
        _tickets_campaign: {
            // What are they for
            // Expiry
            // is Transferable?
            // any other restrictions...
        },
        _codes_campaign: {
            // What is it? Coupon code or discount code
            // If coupon, how much discount does it apply
            // If discount code, what discount that code relates to
            // expiry,
            // is Transferable?
            // any other restrictions...
        },
    }
    _campaign_active: true,                         // Is campaign currently active
};
```
