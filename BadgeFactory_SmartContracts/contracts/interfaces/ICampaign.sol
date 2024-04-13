// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// Campaign should have some basic functionalities
// set_campaign_details_hash(bytes hash) -> none - possibly to update campaign details data with new hash
// get_campaign_details_hash() -> bytes hash - for UI, simple hash can be translated into CampaignDetails struct with value
// subscribe_customer(bytes cust_data_hash) -> none - subscribe customer with given customer data 
// get_number_of_subscribers() -> int - total number of subscribers in the campaign 

interface ICampaign {}
