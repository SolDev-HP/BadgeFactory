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

```javascript
const campaignDetails = {
    campaign_id: Number(totalCampaigns) + 1, // Some identifier, for now we keep it total+1
    campaign_type: [1...4], // type of campaign (selectable range [1, 4])
    campaign_name: "Campaign Name", // bytes32, only 32 letters ascii
    campaign_details: "Campaign Details", // bytes32, only 32 letters ascii
    campaign_start_date: "block.timestamp?", // Starting datetime of Campaign
    campaign_end_date: "block.timestamp?", // Campaign ending datetime
    campaign_owner: address, // Which console deployed it
    campaign_specific_data: {
        reward_points_campaign: { },
        _badges_campaign: { },
        _tickets_campaign: { },
        _codes_campaign: { },
    }
    _campaign_active: true,                         // Is campaign currently active
};
```
