import React from "react";
import {createBrowserRouter} from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomeAdmin from "./views/HomeAdmin.jsx";
import HomeOperator from "./views/HomeOperator.jsx";
import HomeUser from "./views/HomeUser.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import {Login} from "./views/Auth/Login.jsx";
import Register from "./views/Auth/Register.jsx";
import Unauthorized from "./views/Unauthorized.jsx";
import {Home} from "lucide-react";
import HomeRedirect from "./components/HomeRedirect.jsx";
import LineList from "./components/admin/LineList.jsx";
import StationsList from "./components/admin/StationList.jsx";
import TripsList from "./components/admin/TripList.jsx";
import VehiclesList from "./components/admin/VehicleList.jsx";


const router=createBrowserRouter([
    {
        path: "/auth",
        element: <GuestLayout />,
        children: [
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { index: true, element: <Login /> },
        ],
    },
    {
        path: "/",
        element: <DefaultLayout />,
        children:[
            {
                element: <ProtectedRoute allowedRoles={[]} />,
                children: [
                    { index: true, element: <HomeRedirect/> },
                ],
            },
            {
                path: "admin",
                element: <ProtectedRoute allowedRoles={["1"]} />,
                children: [
                    {
                        element: <HomeAdmin />,
                        children: [

                            { index: true, element: <LineList /> },
                            {path:"lines", element: <LineList /> },
                            { path: "stations", element: <StationsList /> },
                            { path: "trips", element: <TripsList /> },
                            { path: "vehicles", element: <VehiclesList /> },
                        ]
                    },

                ],
            },
            {
                path: "operator",
                element: <ProtectedRoute allowedRoles={["2"]} />,
                children: [
                    { index: true, element: <HomeOperator /> },
                    { path: "home", element: <HomeOperator /> },
                ],
            },
            {
                path: "user",
                element: <ProtectedRoute allowedRoles={["3"]} />,
                children: [
                    { index: true, element: <HomeUser /> },
                    { path: "home", element: <HomeUser /> },
                ],
            },
            {
                path: "unauthorized",
                element: <Unauthorized />,
            },
        ],
    },

    {
        path: "*",
        element: <Login />,
    },
]);

export default router;