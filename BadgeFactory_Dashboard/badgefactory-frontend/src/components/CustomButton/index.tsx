// Custom button will be responsible for 
// either be a connect button or sign-message button 

export default function CustomButton({ user_address, onCustSignin, onEntitySignin }: { user_address: string, onCustSignin: () => void, onEntitySignin: () => void }) {
    // console.log(`LoggedIn Address: ${user_address}`);
    // When we have loggen in address available, this view will be available on ui
    return (
        <div className="flex flex-col w-[30%] justify-between items-center align-middle gap-5">
            <w3m-network-button />
            <div className="flex flex-row w-full justify-between items-center align-middle">
                <button onClick={onEntitySignin} className="border-x border-y rounded-full bg-sky-700 p-2 opacity-70 hover:bg-sky-900 hover:opacity-100">
                    <span>Entity Signin to BadgeFactory</span>
                </button> &nbsp;&nbsp;&nbsp;&nbsp;
                <button onClick={onCustSignin} className="w-fit border-x border-y rounded-full bg-sky-700 p-2 opacity-70 hover:bg-sky-900 hover:opacity-100">
                    <span>Customer Signin to BadgeFactory</span>
                </button>
            </div>
        </div>
    );
}