//// For hydration time,
//// walletconnect refreshes multiple times due to useAccount hook
export default function Loading() {
    return (
        <w3m-connect-button loadingLabel="Checking..." />
    )
}