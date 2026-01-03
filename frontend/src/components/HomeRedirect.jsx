import React from "react";
import { Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function HomeRedirect() {
    const { user, loading, token } = useStateContext();

    if (!token) return <Navigate to="/auth/login" replace />;
    if (loading) return <p>Učitavanje...</p>;
    if (!user) return <Navigate to="/auth/login" replace />;

    switch (user.role_id) {
        case 1:
            return <Navigate to="/admin" replace />;
        case 2:
            return <Navigate to="/operator" replace />;
        case 3:
            return <Navigate to="/user" replace />;
        default:
            return <Navigate to="/auth/login" replace />;
    }
}