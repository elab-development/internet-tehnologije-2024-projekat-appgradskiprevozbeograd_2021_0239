
import {Link, Navigate, Outlet} from "react-router-dom";
import {useState} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";


export default function DefaultLayout() {

    const {user,token,setUser,setToken} = useStateContext();
    console.log(user)
    console.log(token)
    if (!token){
        return <Navigate to="/login"></Navigate>
    }

    return (
        <div>
            Default
        </div>
    );
}



