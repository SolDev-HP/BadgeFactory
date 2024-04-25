// connect and signin/signup buttons will live through this component
// used by Navbar and NavbarMobile (in some way I havent added yet - @todo)

// Button accepting button_name will change in later versions
// this is to make sure I only use this for specific buttons 
export default function Button({ button_name } : { button_name: string}) {
    if(button_name == "connect") {
        return (
            <w3m-button />
        )
    } else if (button_name == "signin") {
        return (<></>);
    } else if (button_name == "signup") {
        return (<></>);
    }
}