// Custom button will be responsible for 
// either be a connect button or sign-message button 

export default function CustomButton({ user_address }) {
    console.log(`LoggedIn Address: ${user_address}`);
    return (<w3m-network-button />);
}