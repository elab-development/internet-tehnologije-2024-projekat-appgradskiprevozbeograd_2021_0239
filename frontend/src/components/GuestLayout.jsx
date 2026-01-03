import {useStateContext} from "../context/ContextProvider.jsx";
import {Navigate} from "react-router-dom";

export default function GuestLayout() {
    const {user,token}=useStateContext();
    if(token){
        return <Navigate to="/"/>
    }

    return (
        <div>
            Guest
        </div>
    );
}


