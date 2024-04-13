// These tests are responsible for testing our move to customer data on local(internal) ipfs

// Why?
// Customer identification can happen with a hash
// No onchain customer data except a hash that can be either internal ipfs or internal database
/*
struct CustomerData {
    customer_name: string,
    customer_phone: string,
    customer_email: string, (bytes32 cant work, we need more here)
    customer_wallet_address: address,
    customer_qr_code: qr_code_data
}
*/
