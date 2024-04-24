# BadgeFactory

BadgeFactory - A MorphL2 Sparkloom hackathon POC for the product

Structure:

1. [BadgeFactory_SmartContracts](/BadgeFactory_SmartContracts/README.md) - Smart contracts for MorphL2, Hardhat
2. [badgefactory_frontend](/badgefactory_frontend/README.md) - Deployment control panel for system users, Nextjs
3. [BadgeFactory_Mobile](/BadgeFactory_Mobile/README.md) - Mobile app for customers to store their rewards/tickets/coupons and generate qr code to scan/verify to redeem/claim loyalty offers
4. [BadgeFactory_Tools](/BadgeFactory_Tools/README.md) - BadgeFactory dev tools, expect to use if you're going to run all available unittests in /BadgeFactory_SmartContracts/

This hackathon submission goal would be finished SmartContracts and some part of dashboard for easy access and visibility into whole vision of BadgeFactory.
More will be added here as I progress on creating BadgeFactory for this hackathon (MorphL2 Sparkloom)

---

#### Update 22/04

##### Frontend Deployments

- Prod: https://badgefactory.dotzerolabs.com
- Staging: [Staging Env](badgefactory-frontend.vercel.app)
- Note: SIWE signin works for both prod and staging, but signing has some issues so I am working on those in staging so base is prod and further commits on frontend_functional branch, staging allows signing but wont authenticate due to strict origin for SiweMessage signature and walletconnect projectid doesnt allow any other domain than prod. more updates to come.

#### Update: 18/04

All deployed smart contracts on morphl2 sepolia are now verified. Use remix as controlpanel or interact directly on morphl2 sepolia testnet explorer.

#### Update: 17/04

BadgeFactory and LoyaltyConsole deployment on MorphL2 sepolia testnet
Here are the details

```
MorphL2 Testnet Deployments (Verified on MorphL2 Sepolia Testnet)
https://explorer-testnet.morphl2.io/

FactoryOwner: 0xBcE03a4B33337E4776d845909C041CAAD4799790

Campaign Implementations at:
RewardPoints: 0x735cF22eb57eFC975aF3772163050490C393eeC0
Badges: 0x6c3554b637a47f7F440ca657b55E9866555d1F53
Tickets: 0xe4beb3b8e7D4AAa98d089BBa6926DfB8C3D92d44
Codes: 0x3B4F23346dB55c6B6f1e5100555696B2e80e2e25

BadgeFactory: 0x1Fbe77718B3730249c14530417c69e607cC5a925

Entity: 0x02588fB0A8B5D5a887138Cf8152d96d60E753702

Test only registered can access badgefactory, yea, even owner needs to register as either customer or entity :D
0xa573291fd5a14341e43a1c3014eeb5919f0ffc391b285403e735de950cceb575 - failed tx

Demonstrating that Entity can deploy console(s) from badgefactory
LoyaltyConsole: 0x457dA0FC9B3B7D8b7f91D6bC66Ba347Cd32142c2

Deployed first campaign, reward points with 0x00 details hash
Campaign1-RewardPoints: 0xf7e5253dA78D0d87f30a6AEd78CB16284c8E7538

Entity1 LoyaltyConsole:
0x47E6350a44B4D7F4B1d0cFaD4407190dbb06DDC1

Customer1: 0x828E4F32a490e1cfF03FEACD4F3F22DB62D969E0

LoyaltyConsole[1]->RewardPoints->Award to Customer1 - 29905
Tx: 0x8af6ad54fab6acbf218e7e2af181a8e7274a4c50fd804f85160de523ca51c788
```

#### Update: 13/04

Legends are renamed correctly, many functions are already implemented in smart contracts, check hardhat config for morphl2 config and rpc, use hardhat_morphl2_fork in --network option to fork morphl2 chain current state locally and perform tests of BadgeFactory, LoyaltyConsole, RewardPoints unittests on it.
![Will be updated periodically throughout](https://github.com/SolDev-HP/BadgeFactory/raw/main/assets/imgs/BadgeFactory-uml-flow.png)

#### Update: 11/04

This is how I see these projects will interact, this will keep updating as we implement the basic idea of loyalty management system console for any Entity (Business/Brand/Project)

---

IF want to run local IPFS daemon:
/BadgeFactory_Tools/Local_IPFS_Node/kubo_local and then run `sudo bash install.sh`

---

##### How to run, hardhat tests, and what you need for each

1. clone this repo locally,
2. If you want to use local ipfs daemon without external connection,<br/>
   2a. Go to /BadgeFactory_Tools/Local_IPFS_Node/kubo_local/kubo<br/>
   2b. OR download kubo from: [IPFS Kubo](https://docs.ipfs.tech/install/command-line/)<br/>

   ```bash
   # OR follow guide at https://docs.ipfs.tech/install/command-line/
   $> sudo ./install.sh
   # once it has been installed
   $> ipfs daemon --offline
   # If need to run with debug logs of internal tx at kubo node
   # during storing campaigndata struct, and reading for different campaing types
   $> IPFS_LOGGING=debug ipfs daemon --offline
   # run offline daemon - it will start following things
   # ...
   # Swarm not listening, running in offline mode.
   # RPC API server listening on /ip4/127.0.0.1/tcp/5001
   # WebUI: http://127.0.0.1:5001/webui
   # Gateway server listening on /ip4/127.0.0.1/tcp/8080
   # .... let it run, open new terminal for next steps
   ```

   2c: Setup IPFS link in environment file, you'll need to setup .env file by copying .env-example<br/>

   ```bash
   $> cp .env-example .env
   $> vim .env
   # Edit following details
   # IPFS_RPC="" -> IPFS_RPC="http://127.0.0.1:8080/ipfs/"
   ```

3. If you want test use of MorphL2 fork on hardhat node<br/>
   3a. make sure hardhat.config file includes hardhat_morphl2_fork and respective details<br/>
   3b. you'll need to setup .env file by copying .env-example (if you haven't already)<br/>

   ```bash
   $> cp .env-example .env
   $> vim .env
   # Verify following details is present
   # MORPHL2_TESTNET_RPC="https://rpc-testnet.morphl2.io"
   ```

   3c. Run hardhat node and keep it running<br/>

   ```bash
   $> yarn hardhat node
   # ----- OR
   $> npm hardhat node
   # ...
   # Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
   ```

   <br/>

4. hardhat folder is /BadgeFactory_SmartContracts, go in there 2. Install all depedencies using `npm` or `yarn` (I'm using yarn)

```bash
$../BadgeFactory_SmartContracts/>yarn install
# ---- OR
$../BadgeFactory_SmartContracts/>npm install --dev
```

5. following are build commands I've place in `package.json`, and I'm using `yarn` but `npm` ones are listed as well, choose whichever. Perform tests, no ignition modules for now

```bash
# 1. Clean and compile all contracts
$> yarn clean
$> yarn compile
#   ----- OR
$> npm hardhat clean
$> npm hardhat compile --force

# 2. Test contracts with default network as hardhat (No hardhat node needed)
$> yarn test
#   ----- OR
$> npm hardhat test

# 3. Test contracts on local morphL2 fork on hardhat node (hardhat node running)
$> yarn testl2
# -------- OR
$> npm hardhat test --network hardhat_morphl2_fork

# 4. Report gas
$> yarn testwithgas
$> yarn testl2withgas
# ----------OR
$> REPORT_GAS=true npm hardhat test
$> REPORT_GAS=true npm hardhat test --network hardhat_morphl2_fork

# 5. Report contract sizes
$> yarn sizes
# ---------- OR
$> npm hardhat size-contracts
```

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
