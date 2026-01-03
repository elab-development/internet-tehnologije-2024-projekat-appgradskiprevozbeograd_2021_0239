import {createBrowserRouter, Navigate} from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.jsx";
import HomeAdmin from "./views/HomeAdmin.jsx";
import HomeOperator from "./views/HomeOperator.jsx";
import HomeUser from "./views/HomeUser.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import {Login} from "./views/Auth/Login.jsx";
import Register from "./views/Auth/Register.jsx";
const router=createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout/>,
        children:[
            {
                path:"/admin",
                children:[
                    {
                        path:"home",
                        element: <HomeAdmin/>
                    }
                ]
            },
            {
                path:"/operator",
                children:[
                    {
                        path:"home",
                        element: <HomeOperator/>
                    }
                ]
            }
            ,
            {
                path:"/user",
                children:[
                    {
                        path:"home",
                        element: <HomeUser/>
                    }
                ]
            }
        ]
    },
    {
        path:"/",
        element: <GuestLayout/>,
        children:[
            {
                path:"/login",
                element: <Login/>
            },
            {
                path:"/register",
                element: <Register/>
            }
        ]
    }
])
export default router;