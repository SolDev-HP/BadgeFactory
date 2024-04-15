// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Campaign should have some basic functionalities
// set_campaign_details_hash(bytes hash) -> none - possibly to update campaign details data with new hash
// get_campaign_details_hash() -> bytes hash - for UI, simple hash can be translated into CampaignDetails struct with value
// subscribe_customer(bytes cust_data_hash) -> none - subscribe customer with given customer data
// get_number_of_subscribers() -> int - total number of subscribers in the campaign
// function set_campaign_owner(address) external; - as we are using currently

// update: 14/04
// branch: feature_campaign_struct
// Changes in ICampaignBased (named from ICampaign) as I will now consider this a base contract
// Base campaign should be able to do following things
//  Create a new campaign   (so it tracks total_campaign, )
//  set campaign status (active, inactive, paused, discontinued, and more)
//  Emit some basic events
// Contains total_campaigns_count
// Contains _console_that_owns_this_campaign address
// Contains campaign_details_hash - and related functions
// So naturally related modifiers will switch to here instead of child campaigns

interface ICampaignBase {
    function set_campaign_owner(address) external;

    function set_campaign_details(bytes memory) external;
}
