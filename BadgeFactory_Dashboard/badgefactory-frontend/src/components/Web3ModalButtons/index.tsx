// All buttons, connect/account, network, siweOnRamp

export default function Web3ModalButtons() {
    return (
        <>
            <div className="w-full flex flex-row justify-between align-middle content-center items-center">
                <w3m-button /> &nbps;&nbps;&nbps;&nbps;
                <w3m-network-button /> &nbps;&nbps;&nbps;&nbps;
                <w3m-onramp-widget />
            </div>
        </>
    )
}