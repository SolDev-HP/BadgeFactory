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
![Will be updated periodically throughout](https://github.com/SolDev-HP/BadgeFactory/raw/main/assets/imgs/BadgeFactory-uml-flow.png)

---

IF want to run local IPFS daemon:
/BadgeFactory_Tools/Local_IPFS_Node/kubo_local and then run `sudo bash install.sh`
